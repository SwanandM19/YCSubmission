import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({ paymentStatus: 'paid' }).populate('vendorId');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 7);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
    const weekOrders = orders.filter((o) => new Date(o.createdAt) >= thisWeekStart);
    const monthOrders = orders.filter((o) => new Date(o.createdAt) >= thisMonthStart);

    const summary = {
      today: todayOrders.reduce((sum, o) => sum + o.totalAmount * 0.05, 0),
      thisWeek: weekOrders.reduce((sum, o) => sum + o.totalAmount * 0.05, 0),
      thisMonth: monthOrders.reduce((sum, o) => sum + o.totalAmount * 0.05, 0),
      total: orders.reduce((sum, o) => sum + o.totalAmount * 0.05, 0),
      avgCommission: 5,
    };

    const recent = orders.slice(0, 10).map((order: any) => ({
      id: order.orderId,
      vendorName: order.vendorId?.shopName || 'Unknown',
      orderId: order.orderId,
      commission: order.totalAmount * 0.05,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({ summary, recent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
