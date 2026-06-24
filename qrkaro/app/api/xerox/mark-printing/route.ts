import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PrintJob from '@/lib/models/PrintJob';

const AGENT_SECRET = process.env.PRINT_AGENT_SECRET || 'nosher-print-agent-secret';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { jobId, secret, status } = await req.json();

    if (secret !== AGENT_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!jobId)
      return NextResponse.json({ error: 'jobId required' }, { status: 400 });

    const validStatuses = ['printing', 'done', 'cancelled'];
    if (!validStatuses.includes(status))
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const job = await PrintJob.findByIdAndUpdate(
      jobId,
      { printStatus: status },
      { new: true }
    );

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    return NextResponse.json({ success: true, printStatus: job.printStatus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}