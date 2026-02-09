import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({ paymentStatus: 'paid' })
      .populate('vendorId')
      .sort({ createdAt: -1 })
      .limit(100);

    const transactions = orders.map((order: any) => ({
      id: order.orderId,
      type: 'payment',
      vendorName: order.vendorId?.shopName || 'Unknown',
      vendorId: order.vendorId?.vendorId || 'N/A',
      amount: order.totalAmount,
      createdAt: order.createdAt,
    }));

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
