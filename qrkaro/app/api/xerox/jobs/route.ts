import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PrintJob from '@/lib/models/PrintJob';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const vendorId = req.nextUrl.searchParams.get('vendorId');
    const status = req.nextUrl.searchParams.get('status');

    if (!vendorId) return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

    const query: any = { vendorId };
    if (status && status !== 'all') query.printStatus = status;

    const jobs = await PrintJob.find(query).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const job = await PrintJob.create(body);
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}