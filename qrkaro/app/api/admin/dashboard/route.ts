import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    console.log('🔍 Fetching dashboard data...');

    // Get total vendors count
    const totalVendors = await Vendor.countDocuments();
    console.log('📊 Total Vendors:', totalVendors);

    // Get all completed orders
    const completedOrders = await Order.find({ status: 'completed' });
    console.log('📦 Completed Orders:', completedOrders.length);

    // Commission rate (5%)
    const commissionRate = 5;

    // Calculate total order amount
    const totalOrderAmount = completedOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    // Calculate platform earnings (5% of total)
    const platformEarnings = (totalOrderAmount * commissionRate) / 100;

    // Calculate total payouts to vendors (95% of total)
    const totalPayouts = (totalOrderAmount * (100 - commissionRate)) / 100;

    console.log('💰 Total Order Amount:', totalOrderAmount);
    console.log('💵 Platform Earnings:', platformEarnings);
    console.log('💳 Total Payouts:', totalPayouts);

    // Get recent 20 earnings with vendor details
    const recentOrders = await Order.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    console.log('📋 Recent Orders to Process:', recentOrders.length);

    // Enrich with vendor data
    const recentEarnings = await Promise.all(
      recentOrders.map(async (order) => {
        const vendor = await Vendor.findOne({ vendorId: order.vendorId });
        
        const orderAmount = order.totalAmount || 0;
        const commission = (orderAmount * commissionRate) / 100;
        const vendorPayout = (orderAmount * (100 - commissionRate)) / 100;

        console.log(`📝 Order ${order._id}: Vendor ${order.vendorId}, Shop: ${vendor?.shopName || 'Not Found'}`);

        return {
          _id: order._id.toString(),
          vendorId: order.vendorId || 'Unknown',
          shopName: vendor?.shopName || 'Unknown Shop',
          orderAmount,
          commission,
          vendorPayout,
          createdAt: order.createdAt,
        };
      })
    );

    console.log('✅ Dashboard data fetched successfully');

    return NextResponse.json({
      success: true,
      stats: {
        totalVendors,
        commissionRate,
        platformEarnings: parseFloat(platformEarnings.toFixed(2)),
        totalPayouts: parseFloat(totalPayouts.toFixed(2)),
      },
      recentEarnings,
    });

  } catch (error: any) {
    console.error('❌ Error fetching dashboard data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch dashboard data' 
      },
      { status: 500 }
    );
  }
}
