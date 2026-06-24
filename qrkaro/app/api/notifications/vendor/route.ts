// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';
// import Order from '@/lib/models/Order';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const vendorId = req.nextUrl.searchParams.get('vendorId');
//     if (!vendorId) return NextResponse.json({ success: false, error: 'Missing vendorId' }, { status: 400 });

//     // Fetch last 20 orders for this vendor, sorted newest first
//     const orders = await Order.find({ vendorId })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean();

//     const notifications = orders.map((order: any) => {
//       const isCompleted = order.status === 'completed';
//       const isCancelled = order.status === 'cancelled';

//       return {
//         type: isCancelled ? 'cancelled' : isCompleted ? 'completed' : 'new_order',
//         title: isCancelled
//           ? `❌ Order #${order.orderId.slice(-6).toUpperCase()} Declined`
//           : isCompleted
//           ? `✅ Order #${order.orderId.slice(-6).toUpperCase()} Completed`
//           : `🔔 New Order #${order.orderId.slice(-6).toUpperCase()}`,
//         body: `${order.items?.length || 0} item(s) · ₹${order.totalAmount?.toFixed(2)}`,
//         createdAt: order.createdAt,
//         read: isCompleted || isCancelled,
//       };
//     });

//     return NextResponse.json({ success: true, notifications });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req: NextRequest) {
//   // Mark all read — could store read state in DB later, for now just return success
//   return NextResponse.json({ success: true });
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import Order from '@/lib/models/Order';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const vendorId = req.nextUrl.searchParams.get('vendorId');
//     if (!vendorId) {
//       return NextResponse.json(
//         { success: false, error: 'Missing vendorId' },
//         { status: 400 }
//       );
//     }

//     const [orders, vendor] = await Promise.all([
//       Order.find({ vendorId })
//         .sort({ createdAt: -1 })
//         .limit(20)
//         .lean(),
//       Vendor.findOne({ vendorId }).select('notificationsReadAt').lean(),
//     ]);

//     const readCutoff = (vendor as any)?.notificationsReadAt
//       ? new Date((vendor as any).notificationsReadAt)
//       : null;

//     const notifications = orders.map((order: any) => {
//       const isCompleted = order.status === 'completed';
//       const isCancelled = order.status === 'cancelled';

//       const isRead =
//         isCompleted ||
//         isCancelled ||
//         (readCutoff && new Date(order.createdAt) <= readCutoff);

//       return {
//         orderId: order.orderId,
//         type: isCancelled
//           ? 'cancelled'
//           : isCompleted
//           ? 'completed'
//           : 'new_order',
//         title: isCancelled
//           ? `❌ Order #${order.orderId.slice(-6).toUpperCase()} Declined`
//           : isCompleted
//           ? `✅ Order #${order.orderId.slice(-6).toUpperCase()} Completed`
//           : `🔔 New Order #${order.orderId.slice(-6).toUpperCase()}`,
//         body: `${order.items?.length || 0} item(s) · ₹${Number(order.totalAmount ?? 0).toFixed(2)}`,
//         createdAt: order.createdAt,
//         read: !!isRead,
//       };
//     });

//     return NextResponse.json({ success: true, notifications });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const vendorId = req.nextUrl.searchParams.get('vendorId');
    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Missing vendorId' },
        { status: 400 }
      );
    }

    const [orders, vendor] = await Promise.all([
      Order.find({ vendorId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Vendor.findOne({ vendorId }).select('notificationsReadAt').lean(),
    ]);

    const readCutoff = (vendor as any)?.notificationsReadAt
      ? new Date((vendor as any).notificationsReadAt)
      : null;

    const notifications = orders.map((order: any) => {
      const isCompleted = order.status === 'completed';
      const isCancelled = order.status === 'cancelled';

      const isRead = readCutoff
        ? new Date(order.createdAt) <= readCutoff
        : false;

      return {
        orderId: order.orderId,
        type: isCancelled
          ? 'cancelled'
          : isCompleted
          ? 'completed'
          : 'new_order',
        title: isCancelled
          ? `❌ Order #${order.orderId.slice(-6).toUpperCase()} Declined`
          : isCompleted
          ? `✅ Order #${order.orderId.slice(-6).toUpperCase()} Completed`
          : `🔔 New Order #${order.orderId.slice(-6).toUpperCase()}`,
        body: `${order.items?.length || 0} item(s) · ₹${Number(order.totalAmount ?? 0).toFixed(2)}`,
        createdAt: order.createdAt,
        read: isRead,
      };
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { vendorId } = await req.json();

    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'Missing vendorId' },
        { status: 400 }
      );
    }

    await Vendor.findOneAndUpdate(
      { vendorId },
      { $set: { notificationsReadAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}