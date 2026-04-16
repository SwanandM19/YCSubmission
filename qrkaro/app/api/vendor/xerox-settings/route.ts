import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const vendorId = req.nextUrl.searchParams.get('vendorId');
    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    return NextResponse.json(vendor.xeroxSettings || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { vendorId, xeroxSettings } = await req.json();
    await Vendor.findOneAndUpdate({ vendorId }, { xeroxSettings }, { new: true });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}