// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Vendor from '@/lib/models/Vendor';
// import Order from '@/lib/models/Order';

// export async function GET() {
//   try {
//     await connectDB();

//     const totalVendors = await Vendor.countDocuments();
//     const activeVendors = await Vendor.countDocuments({ status: 'active' });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayOrders = await Order.countDocuments({
//       createdAt: { $gte: today },
//     });

//     const orders = await Order.find({ paymentStatus: 'paid' });
//     const monthlyRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
//     const platformEarnings = orders.reduce((sum, order) => sum + (order.totalAmount * 0.05), 0);
//     const totalPayouts = orders.reduce((sum, order) => sum + (order.totalAmount * 0.95), 0);

//     return NextResponse.json({
//       totalVendors,
//       activeVendors,
//       todayOrders,
//       monthlyRevenue,
//       platformEarnings,
//       totalPayouts,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // ── Vendor Stats ──────────────────────────────────────────────────────
    const [totalVendors, activeVendors, newVendorsThisMonth, newVendorsLastMonth] =
      await Promise.all([
        Vendor.countDocuments(),
        Vendor.countDocuments({ isActive: true, subscriptionPaid: true }),
        Vendor.countDocuments({ createdAt: { $gte: thisMonthStart } }),
        Vendor.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      ]);

    // ── Order Stats ───────────────────────────────────────────────────────
    const [
      todayOrders,
      monthOrders,
      lastMonthOrders,
      totalOrders,
      pendingOrders,
      completedOrders,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart }, paymentStatus: 'paid' }),
      Order.countDocuments({ createdAt: { $gte: thisMonthStart }, paymentStatus: 'paid' }),
      Order.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }, paymentStatus: 'paid' }),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.countDocuments({ status: 'pending', paymentStatus: 'paid' }),
      Order.countDocuments({ status: 'completed' }),
    ]);

    // ── Revenue Stats ─────────────────────────────────────────────────────
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const monthRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thisMonthStart } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const lastMonthRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const todayRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const monthlyRevenue = monthRevenueAgg[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const todayRevenue = todayRevenueAgg[0]?.total || 0;
    const platformEarnings = Math.round(totalRevenue * 0.05);
    const monthlyPlatformEarnings = Math.round(monthlyRevenue * 0.05);
    const totalPayouts = Math.round(totalRevenue * 0.95);

    // ── Subscription Revenue ──────────────────────────────────────────────
    const subscriptionRevenue = await Vendor.countDocuments({ subscriptionPaid: true }) * 200;

    // ── Orders last 7 days (for line chart) ───────────────────────────────
    const ordersLast7Days = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      const found = ordersLast7Days.find((x) => x._id === key);
      last7DaysData.push({
        date: label,
        orders: found?.orders || 0,
        revenue: found?.revenue || 0,
      });
    }

    // ── Orders last 30 days (for area chart) ──────────────────────────────
    const ordersLast30Days = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const last30DaysData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const found = ordersLast30Days.find((x) => x._id === key);
      last30DaysData.push({
        date: label,
        orders: found?.orders || 0,
        revenue: found?.revenue || 0,
      });
    }

    // ── Top 5 vendors by revenue ──────────────────────────────────────────
    const topVendors = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$vendorId', revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: 'vendorId',
          as: 'vendorInfo',
        },
      },
      {
        $project: {
          vendorId: '$_id',
          revenue: 1,
          orders: 1,
          shopName: { $arrayElemAt: ['$vendorInfo.shopName', 0] },
          shopType: { $arrayElemAt: ['$vendorInfo.shopType', 0] },
        },
      },
    ]);

    // ── Order status breakdown (for donut chart) ──────────────────────────
    const orderStatusBreakdown = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // ── Vendor shop type distribution ─────────────────────────────────────
    const shopTypeBreakdown = await Vendor.aggregate([
      { $group: { _id: '$shopType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // ── Avg order value ───────────────────────────────────────────────────
    const avgOrderAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, avg: { $avg: '$totalAmount' } } },
    ]);
    const avgOrderValue = Math.round(avgOrderAgg[0]?.avg || 0);

    // ── MoM growth ────────────────────────────────────────────────────────
    const revenueGrowth = lastMonthRevenue > 0
      ? (((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : '0';
    const orderGrowth = lastMonthOrders > 0
      ? (((monthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
      : '0';
    const vendorGrowth = newVendorsLastMonth > 0
      ? (((newVendorsThisMonth - newVendorsLastMonth) / newVendorsLastMonth) * 100).toFixed(1)
      : '0';

    return NextResponse.json({
      // KPI Cards
      totalVendors,
      activeVendors,
      todayOrders,
      totalOrders,
      pendingOrders,
      completedOrders,
      todayRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      totalRevenue,
      platformEarnings,
      monthlyPlatformEarnings,
      totalPayouts,
      subscriptionRevenue,
      avgOrderValue,
      newVendorsThisMonth,

      // Growth %
      revenueGrowth: parseFloat(revenueGrowth as string),
      orderGrowth: parseFloat(orderGrowth as string),
      vendorGrowth: parseFloat(vendorGrowth as string),

      // Chart Data
      last7DaysData,
      last30DaysData,
      topVendors,
      orderStatusBreakdown,
      shopTypeBreakdown,
    });

  } catch (error: any) {
    console.error('❌ Admin stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
