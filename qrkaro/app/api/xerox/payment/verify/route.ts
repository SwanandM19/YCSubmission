// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
// import connectDB from '@/lib/mongodb';
// import PrintJob from '@/lib/models/PrintJob';

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       razorpayOrderId, razorpayPaymentId, razorpaySignature,
//       vendorId, customerName, customerPhone,
//       fileUrl, fileName, pageCount,
//       printType, copies, doubleSided,
//       totalAmount,
//     } = await req.json();

//     // Verify signature
//     const body = razorpayOrderId + '|' + razorpayPaymentId;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//       .update(body)
//       .digest('hex');

//     if (expectedSignature !== razorpaySignature) {
//       return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
//     }

//     await connectDB();

//     const job = await PrintJob.create({
//       vendorId, customerName, customerPhone,
//       fileUrl, fileName, pageCount,
//       printType, copies, doubleSided,
//       totalAmount,
//       paymentStatus: 'paid',
//       printStatus: 'queued',
//       razorpayOrderId, razorpayPaymentId,
//     });

//     return NextResponse.json({ success: true, jobId: job._id });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import PrintJob from '@/lib/models/PrintJob';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      vendorId, customerName, customerPhone,
      fileUrl, fileName, pageCount,
      files,                          // ← NEW: array from multi-upload
      printType, copies, doubleSided,
      colorMode, paperSize, orientation, pageRange,
      printQuality, stapling, binding, specialInstructions,
      totalAmount,
    } = body;

    // ── 1. Verify Razorpay signature ──────────────────────────────
    const sigBody = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sigBody)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    await connectDB();

    // ── 2. Build files list ───────────────────────────────────────
    // If multi-upload sent a "files" array, use it.
    // Otherwise fall back to single-file fields (legacy / single upload).
    const filesList: { fileUrl: string; fileName: string; pageCount: number }[] =
      Array.isArray(files) && files.length > 0
        ? files
        : [{ fileUrl, fileName, pageCount }];

    // ── 3. Create one PrintJob per file ──────────────────────────
    const createdJobs = await Promise.all(
      filesList.map((file, index) =>
        PrintJob.create({
          vendorId,
          customerName,
          customerPhone,
          // per-file
          fileUrl:   file.fileUrl,
          fileName:  file.fileName,
          pageCount: file.pageCount,
          // shared print settings
          printType,
          copies,
          doubleSided,
          colorMode,
          paperSize,
          orientation,
          pageRange,
          printQuality,
          stapling,
          binding,
          specialInstructions,
          // split total equally across files
          totalAmount: filesList.length === 1
            ? totalAmount
            : Math.ceil(totalAmount / filesList.length),
          paymentStatus: 'paid',
          printStatus:   'queued',
          razorpayOrderId,
          razorpayPaymentId,
          // label when multiple files
          jobNote: filesList.length > 1
            ? `File ${index + 1} of ${filesList.length}`
            : '',
        })
      )
    );

    // ── 4. Return first job ID for success page redirect ─────────
    return NextResponse.json({ success: true, jobId: createdJobs[0]._id });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}