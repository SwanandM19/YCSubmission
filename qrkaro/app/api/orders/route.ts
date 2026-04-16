import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    
    // ✅ FIXED: Extract customer details from body
    const { 
      vendorId, 
      items, 
      subtotal, 
      tax, 
      // platformFee, 
      totalAmount,
      customerName,      // ✅ ADDED
      customerPhone,     // ✅ ADDED
      customerFcmToken   // ✅ ADDED
    } = body;

    if (!vendorId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = `ORD${nanoid(8)}`.toUpperCase();

    // ✅ FIXED: Save customer details in order
    const order = await Order.create({
      orderId,
      vendorId,
      items,
      subtotal,
      tax,
      // platformFee,
      totalAmount,
      customerName,      // ✅ ADDED
      customerPhone,     // ✅ ADDED
      customerFcmToken,  // ✅ ADDED
      status: 'pending',
      paymentStatus: 'pending',
    });

    // ✅ ADDED: Log for debugging
    console.log('✅ Order created with customer data:', {
      orderId,
      customerName,
      customerPhone,
      hasToken: !!customerFcmToken,
      tokenPreview: customerFcmToken?.slice(0, 20) + '...'
    });

    try {
      const vendor = await Vendor.findOne({ vendorId });
      if (vendor) {
        let stockChanged = false;
        items.forEach((orderedItem: any) => {
          const menuItem = vendor.menuItems.find(
            (m: any) => m.name === orderedItem.name
          );
          // Only deduct if stock is tracked (not null = unlimited)
          if (menuItem && menuItem.stock !== null && menuItem.stock !== undefined) {
            menuItem.stock = Math.max(0, menuItem.stock - orderedItem.quantity);
            // Auto mark unavailable when hits zero
            if (menuItem.stock === 0) {
              menuItem.available = false;
            }
            stockChanged = true;
          }
        });
        if (stockChanged) await vendor.save();
        console.log('✅ Stock deducted for order:', orderId);
      }
    } catch (stockError) {
      // Never block order creation if stock update fails
      console.error('⚠️ Stock deduction failed (non-blocking):', stockError);
    }
    // ✅ END OF ADDED BLOCK

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const vendorId = searchParams.get('vendorId');

    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    if (vendorId) {
      const orders = await Order.find({
        vendorId,
        paymentStatus: 'paid', // ⭐ only paid orders visible
      }).sort({ createdAt: -1 });

      return NextResponse.json(orders);
    }

    return NextResponse.json({ error: 'Order ID or Vendor ID required' }, { status: 400 });
  } catch (error: any) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
