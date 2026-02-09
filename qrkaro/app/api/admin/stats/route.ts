import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/lib/models/Vendor';
import Order from '@/lib/models/Order';

export async function GET() {
  try {
    await connectDB();

    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ status: 'active' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const orders = await Order.find({ paymentStatus: 'paid' });
    const monthlyRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const platformEarnings = orders.reduce((sum, order) => sum + (order.totalAmount * 0.05), 0);
    const totalPayouts = orders.reduce((sum, order) => sum + (order.totalAmount * 0.95), 0);

    return NextResponse.json({
      totalVendors,
      activeVendors,
      todayOrders,
      monthlyRevenue,
      platformEarnings,
      totalPayouts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
