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
      city,
      state,
      category,
    } = body;

    console.log('📝 Update shop request:', { vendorId, shopName, category });

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    if (!shopName || !phone || !category) {
      return NextResponse.json({ 
        error: 'Shop name, phone number, and category are required' 
      }, { status: 400 });
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return NextResponse.json({ 
        error: 'Phone number must be exactly 10 digits' 
      }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Update vendor details
    vendor.shopName = shopName.trim();
    vendor.phone = phone.trim();
    vendor.city = city?.trim() || '';
    vendor.state = state?.trim() || '';
    vendor.category = category;

    await vendor.save();

    console.log('✅ Shop details updated successfully:', vendorId);

    return NextResponse.json({
      success: true,
      message: 'Shop details updated successfully',
      vendor: {
        shopName: vendor.shopName,
        category: vendor.category,
        phone: vendor.phone,
        city: vendor.city,
        state: vendor.state,
      }
    });

  } catch (error: any) {
    console.error('❌ Error updating shop details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update shop details' },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { vendorId, upiId } = await req.json();

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    if (!upiId || !upiId.trim()) {
      return NextResponse.json({ error: 'UPI ID is required' }, { status: 400 });
    }

    // Basic UPI format validation: something@something
    const upiRegex = /^[\w.\-]{2,}@[\w]{2,}$/;
    if (!upiRegex.test(upiId.trim())) {
      return NextResponse.json({ error: 'Invalid UPI ID format (e.g. name@upi)' }, { status: 400 });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { vendorId },
      { $set: { upiId: upiId.trim() } },
      { new: true }
    );

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    console.log('✅ UPI ID updated for:', vendorId);

    return NextResponse.json({ success: true, upiId: vendor.upiId });

  } catch (error: any) {
    console.error('❌ Error updating UPI ID:', error);
    return NextResponse.json({ error: error.message || 'Failed to update UPI ID' }, { status: 500 });
  }
}
