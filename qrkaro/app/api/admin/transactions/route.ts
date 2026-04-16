// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Order from '@/lib/models/Order';

// export async function GET() {
//   try {
//     await connectDB();
//     const orders = await Order.find({ paymentStatus: 'paid' })
//       .populate('vendorId')
//       .sort({ createdAt: -1 })
//       .limit(100);

//     const transactions = orders.map((order: any) => ({
//       id: order.orderId,
//       type: 'payment',
//       vendorName: order.vendorId?.shopName || 'Unknown',
//       vendorId: order.vendorId?.vendorId || 'N/A',
//       amount: order.totalAmount,
//       createdAt: order.createdAt,
//     }));

//     return NextResponse.json(transactions);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Order from '@/lib/models/Order';
// import Vendor from '@/lib/models/Vendor';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const filter = searchParams.get('filter') || 'all';
//     const range = searchParams.get('range') || 'today';
//     const search = searchParams.get('search') || '';
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');

//     // ── Date Range ────────────────────────────────────────────────────────
//     const now = new Date();
//     let dateFilter: any = {};
//     if (range === 'today') {
//       const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       dateFilter = { createdAt: { $gte: start } };
//     } else if (range === 'week') {
//       const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       dateFilter = { createdAt: { $gte: start } };
//     } else if (range === 'month') {
//       const start = new Date(now.getFullYear(), now.getMonth(), 1);
//       dateFilter = { createdAt: { $gte: start } };
//     }

//     // ── Base query — only paid orders ─────────────────────────────────────
//     const baseQuery: any = { paymentStatus: 'paid', ...dateFilter };

//     // ── Search ────────────────────────────────────────────────────────────
//     if (search) {
//       baseQuery.$or = [
//         { orderId: { $regex: search, $options: 'i' } },
//         { vendorId: { $regex: search, $options: 'i' } },
//         { paymentId: { $regex: search, $options: 'i' } },
//         { customerName: { $regex: search, $options: 'i' } },
//         { customerPhone: { $regex: search, $options: 'i' } },
//       ];
//     }

//     // ── Fetch all matching orders ─────────────────────────────────────────
//     const allOrders = await Order.find(baseQuery)
//       .sort({ createdAt: -1 })
//       .lean();

//     // ── Fetch vendor names map ────────────────────────────────────────────
//     const vendorIds = [...new Set(allOrders.map((o: any) => o.vendorId))];
//     const vendors = await Vendor.find({ vendorId: { $in: vendorIds } })
//       .select('vendorId shopName phone city shopType')
//       .lean();
//     const vendorMap: Record<string, any> = {};
//     vendors.forEach((v: any) => { vendorMap[v.vendorId] = v; });

//     // ── Build transactions list (payments + payouts) ───────────────────────
//     type TxnRow = {
//       id: string;
//       type: 'payment' | 'payout';
//       orderId: string;
//       vendorId: string;
//       vendorName: string;
//       vendorPhone: string;
//       vendorCity: string;
//       customerName: string;
//       customerPhone: string;
//       amount: number;
//       platformFee: number;
//       vendorAmount: number;
//       status: string;
//       payoutStatus: string;
//       paymentId: string;
//       payoutId: string;
//       items: any[];
//       createdAt: string;
//     };

//     let transactions: TxnRow[] = [];

//     for (const order of allOrders as any[]) {
//       const vendor = vendorMap[order.vendorId] || {};
//       const platformFee = Math.round(order.totalAmount * 0.05);
//       const vendorAmount = order.totalAmount - platformFee;

//       // ── Payment row ──────────────────────────────────────────────────
//       if (filter === 'all' || filter === 'payments') {
//         transactions.push({
//           id: order.paymentId || order.orderId,
//           type: 'payment',
//           orderId: order.orderId,
//           vendorId: order.vendorId,
//           vendorName: vendor.shopName || 'Unknown',
//           vendorPhone: vendor.phone || '',
//           vendorCity: vendor.city || '',
//           customerName: order.customerName || 'N/A',
//           customerPhone: order.customerPhone || '',
//           amount: order.totalAmount,
//           platformFee,
//           vendorAmount,
//           status: order.paymentStatus,
//           payoutStatus: order.payoutStatus || 'pending',
//           paymentId: order.paymentId || '',
//           payoutId: order.payoutId || '',
//           items: order.items || [],
//           createdAt: order.createdAt,
//         });
//       }

//       // ── Payout row (only if payout was processed) ─────────────────────
//       if (
//         (filter === 'all' || filter === 'payouts') &&
//         order.payoutId
//       ) {
//         transactions.push({
//           id: order.payoutId,
//           type: 'payout',
//           orderId: order.orderId,
//           vendorId: order.vendorId,
//           vendorName: vendor.shopName || 'Unknown',
//           vendorPhone: vendor.phone || '',
//           vendorCity: vendor.city || '',
//           customerName: order.customerName || 'N/A',
//           customerPhone: order.customerPhone || '',
//           amount: vendorAmount,
//           platformFee,
//           vendorAmount,
//           status: order.payoutStatus || 'processing',
//           payoutStatus: order.payoutStatus || 'processing',
//           paymentId: order.paymentId || '',
//           payoutId: order.payoutId || '',
//           items: order.items || [],
//           createdAt: order.createdAt,
//         });
//       }
//     }

//     // Sort all rows newest first
//     transactions.sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );

//     // ── Summary stats (always from full paid orders in range) ─────────────
//     const totalCollected = allOrders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);
//     const totalPlatformFee = Math.round(totalCollected * 0.05);
//     const totalPaidToVendors = totalCollected - totalPlatformFee;
//     const totalPayouts = allOrders.filter((o: any) => o.payoutId).length;
//     const pendingPayouts = allOrders.filter(
//       (o: any) => !o.payoutId && o.paymentStatus === 'paid'
//     ).length;

//     // ── Paginate ──────────────────────────────────────────────────────────
//     const totalCount = transactions.length;
//     const paginated = transactions.slice((page - 1) * limit, page * limit);

//     return NextResponse.json({
//       transactions: paginated,
//       pagination: {
//         total: totalCount,
//         page,
//         limit,
//         totalPages: Math.ceil(totalCount / limit),
//       },
//       stats: {
//         totalCollected,
//         totalPlatformFee,
//         totalPaidToVendors,
//         totalTransactions: allOrders.length,
//         totalPayouts,
//         pendingPayouts,
//       },
//     });

//   } catch (error: any) {
//     console.error('❌ Transactions error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor';
import PrintJob from '@/lib/models/PrintJob';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    const range = searchParams.get('range') || 'today';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const now = new Date();
    let dateFilter: any = {};
    if (range === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { createdAt: { $gte: start } };
    } else if (range === 'week') {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: start } };
    } else if (range === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { createdAt: { $gte: start } };
    }

    const baseQuery: any = { paymentStatus: 'paid', ...dateFilter };

    if (search) {
      baseQuery.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { vendorId: { $regex: search, $options: 'i' } },
        { paymentId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const allOrders = await Order.find(baseQuery)
      .sort({ createdAt: -1 })
      .lean();

    const printJobQuery: any = { paymentStatus: 'paid', ...dateFilter };

    if (search) {
      printJobQuery.$or = [
        { vendorId: { $regex: search, $options: 'i' } },
        { razorpayPaymentId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
      ];
    }

    const allPrintJobs = await PrintJob.find(printJobQuery)
      .sort({ createdAt: -1 })
      .lean();

    const vendorIds = [
      ...new Set([
        ...allOrders.map((o: any) => o.vendorId),
        ...allPrintJobs.map((j: any) => j.vendorId),
      ]),
    ];

    const vendors = await Vendor.find({ vendorId: { $in: vendorIds } })
      .select('vendorId shopName phone city shopType')
      .lean();

    const vendorMap: Record<string, any> = {};
    vendors.forEach((v: any) => {
      vendorMap[v.vendorId] = v;
    });

    type TxnRow = {
      id: string;
      type: 'payment' | 'payout';
      orderId: string;
      vendorId: string;
      vendorName: string;
      vendorPhone: string;
      vendorCity: string;
      customerName: string;
      customerPhone: string;
      amount: number;
      platformFee: number;
      vendorAmount: number;
      status: string;
      payoutStatus: string;
      paymentId: string;
      payoutId: string;
      items: any[];
      createdAt: string;
    };

    let transactions: TxnRow[] = [];

    for (const order of allOrders as any[]) {
      const vendor = vendorMap[order.vendorId] || {};
      const platformFee = Math.round(order.totalAmount * 0.05);
      const vendorAmount = order.totalAmount - platformFee;

      if (filter === 'all' || filter === 'payments') {
        transactions.push({
          id: order.paymentId || order.orderId,
          type: 'payment',
          orderId: order.orderId,
          vendorId: order.vendorId,
          vendorName: vendor.shopName || 'Unknown',
          vendorPhone: vendor.phone || '',
          vendorCity: vendor.city || '',
          customerName: order.customerName || 'N/A',
          customerPhone: order.customerPhone || '',
          amount: order.totalAmount,
          platformFee,
          vendorAmount,
          status: order.paymentStatus,
          payoutStatus: order.payoutStatus || 'pending',
          paymentId: order.paymentId || '',
          payoutId: order.payoutId || '',
          items: order.items || [],
          createdAt: order.createdAt,
        });
      }

      if ((filter === 'all' || filter === 'payouts') && order.payoutId) {
        transactions.push({
          id: order.payoutId,
          type: 'payout',
          orderId: order.orderId,
          vendorId: order.vendorId,
          vendorName: vendor.shopName || 'Unknown',
          vendorPhone: vendor.phone || '',
          vendorCity: vendor.city || '',
          customerName: order.customerName || 'N/A',
          customerPhone: order.customerPhone || '',
          amount: vendorAmount,
          platformFee,
          vendorAmount,
          status: order.payoutStatus || 'processing',
          payoutStatus: order.payoutStatus || 'processing',
          paymentId: order.paymentId || '',
          payoutId: order.payoutId || '',
          items: order.items || [],
          createdAt: order.createdAt,
        });
      }
    }

    for (const job of allPrintJobs as any[]) {
      const vendor = vendorMap[job.vendorId] || {};
      const platformFee = Math.round(job.totalAmount * 0.05);
      const vendorAmount = job.totalAmount - platformFee;

      if (filter === 'all' || filter === 'payments') {
        transactions.push({
          id: job.razorpayPaymentId || job._id.toString(),
          type: 'payment',
          orderId: `PRINT-${job._id.toString().slice(-8).toUpperCase()}`,
          vendorId: job.vendorId,
          vendorName: vendor.shopName || 'Unknown',
          vendorPhone: vendor.phone || '',
          vendorCity: vendor.city || '',
          customerName: job.customerName || 'Walk-in Customer',
          customerPhone: job.customerPhone || '',
          amount: job.totalAmount,
          platformFee,
          vendorAmount,
          status: job.paymentStatus,
          payoutStatus: 'pending',
          paymentId: job.razorpayPaymentId || '',
          payoutId: '',
          items: [
            {
              name: `${job.fileName} (${job.printType}, ${job.copies} copies)`,
              price: job.totalAmount,
              quantity: 1,
            },
          ],
          createdAt: job.createdAt,
        });
      }
    }

    transactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const orderCollected = allOrders.reduce(
      (s: number, o: any) => s + (o.totalAmount || 0),
      0
    );
    const printCollected = allPrintJobs.reduce(
      (s: number, j: any) => s + (j.totalAmount || 0),
      0
    );
    const totalCollected = orderCollected + printCollected;

    const totalPlatformFee = Math.round(totalCollected * 0.05);
    const totalPaidToVendors = totalCollected - totalPlatformFee;
    const totalPayouts = allOrders.filter((o: any) => o.payoutId).length;
    const pendingPayouts =
      allOrders.filter((o: any) => !o.payoutId && o.paymentStatus === 'paid').length +
      allPrintJobs.length;

    const totalCount = transactions.length;
    const paginated = transactions.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      transactions: paginated,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalCollected,
        totalPlatformFee,
        totalPaidToVendors,
        totalTransactions: allOrders.length + allPrintJobs.length,
        totalPayouts,
        pendingPayouts,
      },
    });
  } catch (error: any) {
    console.error('❌ Transactions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}