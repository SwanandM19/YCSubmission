import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import PrintJob from '@/lib/models/PrintJob';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      vendorId, customerName, customerPhone,
      fileUrl, fileName, pageCount,
      printType, copies, doubleSided,
      totalAmount,
    } = await req.json();

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    await connectDB();

    const job = await PrintJob.create({
      vendorId, customerName, customerPhone,
      fileUrl, fileName, pageCount,
      printType, copies, doubleSided,
      totalAmount,
      paymentStatus: 'paid',
      printStatus: 'queued',
      razorpayOrderId, razorpayPaymentId,
    });

    return NextResponse.json({ success: true, jobId: job._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}