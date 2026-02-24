import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    console.log('🔍 API: Received vendorId:', vendorId);

    if (!vendorId) {
      console.error('❌ API: No vendorId provided');
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    // Verify vendor exists
    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      console.error('❌ API: Vendor not found:', vendorId);
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    console.log('✅ API: Vendor found:', vendor.shopName);

    // Get all orders for this vendor
    const allOrders = await Order.find({ vendorId }).sort({ createdAt: -1 });
    console.log('📦 API: Found', allOrders.length, 'orders');

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Filter orders by time range
    const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= todayStart);
    const weekOrders = allOrders.filter(o => new Date(o.createdAt) >= weekStart);
    const monthOrders = allOrders.filter(o => new Date(o.createdAt) >= monthStart);

    // Calculate revenue (only for non-cancelled orders)
    const todayRevenue = todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    const weekRevenue = weekOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    const monthRevenue = monthOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Calculate average order value
    const completedOrders = allOrders.filter(o => o.status !== 'cancelled');
    const avgOrderValue = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + o.totalAmount, 0) / completedOrders.length
      : 0;

    // Top selling items
    const itemSales: { [key: string]: { quantity: number; revenue: number } } = {};
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.name]) {
          itemSales[item.name] = { quantity: 0, revenue: 0 };
        }
        itemSales[item.name].quantity += item.quantity;
        itemSales[item.name].revenue += item.quantity * item.price;
      });
    });

    const topSellingItems = Object.entries(itemSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Revenue by hour (last 24 hours)
    const revenueByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      revenue: 0,
      orders: 0,
    }));

    completedOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      revenueByHour[hour].revenue += order.totalAmount;
      revenueByHour[hour].orders += 1;
    });

    // Peak hours (top 3 hours with most revenue)
    const peakHours = revenueByHour
      .filter(h => h.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map(h => {
        if (h.hour === 0) return '12 AM';
        if (h.hour < 12) return `${h.hour} AM`;
        if (h.hour === 12) return '12 PM';
        return `${h.hour - 12} PM`;
      });

    // Completion rate
    const completedCount = allOrders.filter(o => o.status === 'completed').length;
    const completionRate = allOrders.length > 0
      ? Math.round((completedCount / allOrders.length) * 100)
      : 0;

    // Pending orders
    const pendingOrders = allOrders.filter(
      o => o.status === 'pending' || o.status === 'preparing'
    ).length;

    const insights = {
      todayRevenue,
      weekRevenue,
      monthRevenue,
      todayOrders: todayOrders.filter(o => o.status !== 'cancelled').length,
      weekOrders: weekOrders.filter(o => o.status !== 'cancelled').length,
      monthOrders: monthOrders.filter(o => o.status !== 'cancelled').length,
      avgOrderValue,
      topSellingItems,
      revenueByHour,
      peakHours,
      completionRate,
      pendingOrders,
    };

    console.log('✅ API: Insights calculated successfully');

    return NextResponse.json(insights);

  } catch (error: any) {
    console.error('❌ API: Error fetching insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
