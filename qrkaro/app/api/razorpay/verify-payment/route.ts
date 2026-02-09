

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
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Payment verified:', orderId);

    // Update order
    await connectDB();
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'pending',
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 🚀 TRIGGER AUTOMATIC PAYOUT
    // console.log('🚀 Triggering payout...');
    // try {
    //   const payoutResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/razorpay/payout`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       orderId: order.orderId,
    //       vendorId: order.vendorId,
    //       amount: order.totalAmount,
    //     }),
    //   });
console.log('🚀 Triggering payout...');
try {
  const payoutResponse = await fetch('http://localhost:3000/api/razorpay/payout', {
    // or just '/api/razorpay/payout' in Next 16:
    // const payoutResponse = await fetch('http://localhost:3000/api/razorpay/payout', {
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
