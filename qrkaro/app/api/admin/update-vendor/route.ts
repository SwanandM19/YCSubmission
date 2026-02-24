import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      vendorId,
      shopName,
      phone,
      shopType,
      city,
      state,
      menuItems,
      razorpayKeyId,
      razorpayKeySecret,
    } = body;

    console.log('📝 Admin updating vendor:', vendorId);

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Update all fields
    if (shopName) vendor.shopName = shopName;
    if (phone) vendor.phone = phone;
    if (shopType) vendor.shopType = shopType;
    if (city) vendor.city = city;
    if (state) vendor.state = state;
    if (menuItems) vendor.menuItems = menuItems;
    if (razorpayKeyId) vendor.razorpayKeyId = razorpayKeyId;
    if (razorpayKeySecret) vendor.razorpayKeySecret = razorpayKeySecret;

    await vendor.save();

    console.log('✅ Vendor updated successfully by admin:', vendorId);

    return NextResponse.json({
      success: true,
      message: 'Vendor updated successfully',
      vendor: {
        vendorId: vendor.vendorId,
        shopName: vendor.shopName,
        phone: vendor.phone,
        shopType: vendor.shopType,
        city: vendor.city,
        state: vendor.state,
      },
    });

  } catch (error: any) {
    console.error('❌ Error updating vendor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update vendor' },
      { status: 500 }
    );
  }
}
