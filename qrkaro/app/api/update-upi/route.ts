import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { vendorId, upiId } = await req.json();
    console.log('🔥 update-upi hit:', { vendorId, upiId });
    if (!vendorId) return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    if (!upiId?.trim()) return NextResponse.json({ error: 'UPI ID is required' }, { status: 400 });
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId },
      { $set: { upiId: upiId.trim() } },
      { new: true }
    );
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    console.log('✅ UPI updated:', vendor.upiId);
    return NextResponse.json({ success: true, upiId: vendor.upiId });
  } catch (error: any) {
    console.error('❌ UPI update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}