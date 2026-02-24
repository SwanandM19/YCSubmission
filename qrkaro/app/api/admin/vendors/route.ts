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

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Vendor from '@/lib/models/Vendor';

// export async function GET() {
//   try {
//     await connectDB();

//     const vendors = await Vendor.find().sort({ createdAt: -1 });

//     // Dynamic stats
//     const active = vendors.filter((v) => v.status === 'active').length;
//     const onTrial = vendors.filter((v) => v.status === 'trial').length;

//     return NextResponse.json({
//       vendors,
//       active,
//       onTrial,
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

