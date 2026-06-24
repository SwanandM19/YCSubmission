import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PrintJob from '@/lib/models/PrintJob';
import Vendor from '@/lib/models/Vendor';

const AGENT_SECRET = process.env.PRINT_AGENT_SECRET || 'nosher-print-agent-secret';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const secret   = searchParams.get('secret');

    if (secret !== AGENT_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!vendorId)
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor)
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    if (!vendor.xeroxSettings?.autoPrint)
      return NextResponse.json({ autoPrint: false, jobs: [] });

    const jobs = await PrintJob.find({
      vendorId,
      paymentStatus: 'paid',
      printStatus:   'queued',
    })
      .sort({ createdAt: 1 })
      .select('_id fileName fileUrl pageCount colorMode copies doubleSided paperSize orientation printQuality specialInstructions createdAt');

    return NextResponse.json({
      autoPrint:     true,
      printerName:   vendor.xeroxSettings?.printerName   || '',
      autoPrintMode: vendor.xeroxSettings?.autoPrintMode || 'browser',
      jobs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}