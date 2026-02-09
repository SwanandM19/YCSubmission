import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/lib/models/Vendor';

export async function GET() {
  try {
    await connectDB();
    const vendors = await Vendor.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(vendors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
