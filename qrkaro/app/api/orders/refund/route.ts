// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Order from '@/lib/models/Order';
// import Razorpay from 'razorpay';

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { orderId } = await req.json();

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     // ✅ Use paymentId (already exists in your schema)
//     if (!order.paymentId) {
//       return NextResponse.json({ error: 'No payment found for this order' }, { status: 400 });
//     }

//     if (order.status === 'cancelled') {
//       return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
//     }

//     // ✅ Cast to any — fixes TypeScript error (reverse_all not in Razorpay types)
//     // const refund = await (razorpay.payments as any).refund(
//     //   order.paymentId as string,
//     //   {
//     //     amount: Math.round(order.totalAmount * 100), // paise
//     //     speed: 'optimum',
//     //     notes: {
//     //       reason: 'Order declined by vendor',
//     //       orderId: orderId,
//     //     },
//     //     reverse_all: 1, // pulls back from vendor linked account
//     //   }
//     // );

//     const paymentId = order.paymentId;
// const credentials = Buffer.from(
//   `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
// ).toString('base64');

// const refundRes = await fetch(
//   `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
//   {
//     method: 'POST',
//     headers: {
//       'Authorization': `Basic ${credentials}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       amount: Math.round(order.totalAmount * 100),
//       speed: 'optimum',
//       notes: { reason: 'Order declined by vendor', orderId },
//       reverse_all: 1,
//     }),
//   }
// );

// const refund = await refundRes.json();

// if (!refundRes.ok) {
//   throw new Error(refund.error?.description || 'Refund failed');
// }

//     // ✅ Update order — refundId/refundStatus already added to your schema
//     await Order.findOneAndUpdate(
//       { orderId },
//       {
//         status: 'cancelled',
//         refundId: refund.id,
//         refundStatus: refund.status,
//         refundedAt: new Date(),
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       refundId: refund.id,
//       status: refund.status,
//       amount: order.totalAmount,
//     });

//   } catch (error: any) {
//     console.error('❌ Refund error:', error);
//     return NextResponse.json(
//       { error: error.error?.description || error.message || 'Refund failed' },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Order from '@/lib/models/Order';

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { orderId } = await req.json();

//     const order = await Order.findOne({ orderId });

//     if (!order) {
//       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//     }

//     if (!order.paymentId) {
//       return NextResponse.json({ error: 'No payment found for this order' }, { status: 400 });
//     }

//     if (order.status === 'cancelled') {
//       return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
//     }

//     const credentials = Buffer.from(
//       `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
//     ).toString('base64');

//     const refundRes = await fetch(
//       `https://api.razorpay.com/v1/payments/${order.paymentId}/refund`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Basic ${credentials}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: Math.round(order.totalAmount * 100),
//           speed: 'optimum',
//           notes: { reason: 'Order declined by vendor', orderId },
//           reverse_all: 1,
//         }),
//       }
//     );

//     const refund = await refundRes.json();

//     if (!refundRes.ok) {
//       throw new Error(refund.error?.description || 'Refund failed');
//     }

//     await Order.findOneAndUpdate(
//       { orderId },
//       {
//         status: 'cancelled',
//         refundId: refund.id,
//         refundStatus: refund.status,
//         refundedAt: new Date(),
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       refundId: refund.id,
//       status: refund.status,
//       amount: order.totalAmount,
//     });

//   } catch (error: any) {
//     console.error('❌ Refund error:', error);
//     return NextResponse.json(
//       { error: error.error?.description || error.message || 'Refund failed' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor'; // ← ADD THIS IMPORT

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.paymentId) {
      return NextResponse.json({ error: 'No payment found for this order' }, { status: 400 });
    }

    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
    }

    const credentials = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64');

    const refundRes = await fetch(
      `https://api.razorpay.com/v1/payments/${order.paymentId}/refund`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(order.totalAmount * 100),
          speed: 'optimum',
          notes: { reason: 'Order declined by vendor', orderId },
          reverse_all: 1,
        }),
      }
    );

    const refund = await refundRes.json();

    if (!refundRes.ok) {
      throw new Error(refund.error?.description || 'Refund failed');
    }

    await Order.findOneAndUpdate(
      { orderId },
      {
        status: 'cancelled',
        refundId: refund.id,
        refundStatus: refund.status,
        refundedAt: new Date(),
      }
    );

    // ✅ ADD THIS BLOCK — restore stock on decline
    try {
      const vendor = await Vendor.findOne({ vendorId: order.vendorId });
      if (vendor) {
        order.items.forEach((orderedItem: any) => {
          const menuItem = vendor.menuItems.find(
            (m: any) => m.name === orderedItem.name
          );
          if (menuItem && menuItem.stock !== null && menuItem.stock !== undefined) {
            menuItem.stock += orderedItem.quantity;
            if (menuItem.stock > 0) menuItem.available = true;
          }
        });
        await vendor.save();
        console.log('✅ Stock restored for declined order:', orderId);
      }
    } catch (stockError) {
      console.error('⚠️ Stock restore failed (non-blocking):', stockError);
    }
    // ✅ END OF ADDED BLOCK

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: order.totalAmount,
    });

  } catch (error: any) {
    console.error('❌ Refund error:', error);
    return NextResponse.json(
      { error: error.error?.description || error.message || 'Refund failed' },
      { status: 500 }
    );
  }
}