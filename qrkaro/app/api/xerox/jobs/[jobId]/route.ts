// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import PrintJob from '@/lib/models/PrintJob';

// // export async function PATCH(req: NextRequest, { params }: { params: { jobId: string } }) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();
// //     const job = await PrintJob.findByIdAndUpdate(params.jobId, body, { new: true });
// //     if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
// //     return NextResponse.json(job);
// //   } catch (error: any) {
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }
// // ✅ Fix for Next.js 15 — params is a Promise now
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ jobId: string }> }  // ← Promise type
// ) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { jobId } = await params;  // ← await params first

//     const job = await PrintJob.findByIdAndUpdate(jobId, body, { new: true });
//     if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
//     return NextResponse.json(job);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PrintJob from '@/lib/models/PrintJob';

// ✅ ADD THIS NEW FUNCTION
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectDB();
    const { jobId } = await params;

    const job = await PrintJob.findById(jobId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Your existing PATCH — unchanged
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { jobId } = await params;

    const job = await PrintJob.findByIdAndUpdate(jobId, body, { new: true });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}