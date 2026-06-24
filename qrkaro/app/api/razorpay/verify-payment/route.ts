

// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
// import connectDB from '@/lib/mongodb';
// import Order from '@/lib/models/Order';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     // Verify signature
//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generatedSignature !== razorpay_signature) {
//       console.error('❌ Invalid signature');
//       return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
//     }

//     console.log('✅ Payment signature verified for order:', orderId);

//     // Update order status
//     await connectDB();
//     const order = await Order.findOneAndUpdate(
//       { orderId },
//       {
//         paymentStatus: 'paid',
//         paymentId: razorpay_payment_id,
//         status: 'pending',
//       },
//       { new: true }
//     );

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     console.log('✅ Order marked as PAID:', orderId);

//     // 🚀 TRIGGER AUTOMATIC PAYOUT
//     console.log('🚀 Triggering automatic payout to vendor...');
    
//     try {
//       const payoutResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/razorpay/payout`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           orderId: order.orderId,
//           vendorId: order.vendorId,
//           amount: order.totalAmount,
//         }),
//       });

//       const payoutData = await payoutResponse.json();

//       if (payoutResponse.ok) {
//         console.log('✅ Payout initiated successfully:', payoutData.payout_id);
//       } else {
//         console.error('❌ Payout failed:', payoutData.error);
//         // Order is still marked as paid, manual intervention might be needed
//       }
//     } catch (payoutError) {
//       console.error('❌ Payout trigger error:', payoutError);
//       // Order is still valid, payout can be retried
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Payment verified successfully',
//       order,
//     });
//   } catch (error: any) {
//     console.error('❌ Payment verification error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Payment verification failed' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    // ── Verify Razorpay Signature ──────────────────────────────────────────
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Payment verified:', orderId);

    await connectDB();

    // ── Update Order Payment Status ────────────────────────────────────────
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'pending',
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // ── Deduct Stock Only After Payment Confirmed ──────────────────────────
    try {
      const vendor = await Vendor.findOne({ vendorId: order.vendorId });

      if (vendor) {
        let stockChanged = false;

        order.items.forEach((orderedItem: any) => {
          const orderedItemId = orderedItem._id || orderedItem.itemId;

          const baseName = (orderedItem.name || '')
            .replace(
              /\s*\(\s*\d+(\.\d+)?\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)\s*$/i,
              ''
            )
            .trim();

          const menuItem = vendor.menuItems.find((m: any) => {
            if (orderedItemId && m._id?.toString() === orderedItemId.toString()) {
              return true;
            }
            return m.name?.trim().toLowerCase() === baseName.toLowerCase();
          });

          if (!menuItem || typeof menuItem.stock !== 'number') return;

          const selectionMatch = (orderedItem.name || '').match(
            /\(\s*(\d+(\.\d+)?)\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)/i
          );

          let deductAmount = Number(orderedItem.quantity) || 0;

          if (selectionMatch) {
            const selectedValue = parseFloat(selectionMatch[1]);
            const selectedUnit = selectionMatch[3].toLowerCase();
            const stockUnit = (menuItem.unit || '').toLowerCase();

            if (['kg', 'g'].includes(stockUnit)) {
              deductAmount = ['kg'].includes(selectedUnit)
                ? selectedValue * (Number(orderedItem.quantity) || 0)
                : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
            } else if (['litre', 'litres', 'ltr', 'l', 'ml'].includes(stockUnit)) {
              deductAmount = ['litre', 'litres', 'ltr', 'l'].includes(selectedUnit)
                ? selectedValue * (Number(orderedItem.quantity) || 0)
                : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
            } else {
              deductAmount = selectedValue * (Number(orderedItem.quantity) || 0);
            }
          }

          menuItem.stock = Math.max(0, menuItem.stock - deductAmount);
          menuItem.available = menuItem.stock > 0;
          stockChanged = true;
        });

        if (stockChanged) {
          await vendor.save();
          console.log('✅ Stock deducted after payment confirmed:', orderId);
        } else {
          console.log('ℹ️ No stock-tracked items updated for:', orderId);
        }
      }
    } catch (stockError) {
      console.error('⚠️ Stock deduction failed (non-blocking):', stockError);
    }

    // ── Trigger Automatic Payout ───────────────────────────────────────────
    console.log('🚀 Triggering payout...');
    try {
      const payoutResponse = await fetch('http://localhost:3000/api/razorpay/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          vendorId: order.vendorId,
          amount: order.totalAmount,
        }),
      });

      const payoutData = await payoutResponse.json();

      if (payoutResponse.ok) {
        console.log('✅ Payout successful:', payoutData.message);
      } else {
        console.error('❌ Payout failed:', payoutData.error);
      }
    } catch (payoutError) {
      console.error('❌ Payout trigger error:', payoutError);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified',
      order,
    });
  } catch (error: any) {
    console.error('❌ Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}