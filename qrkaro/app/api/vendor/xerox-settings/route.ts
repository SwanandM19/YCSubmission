// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const vendorId = req.nextUrl.searchParams.get('vendorId');
//     const vendor   = await Vendor.findOne({ vendorId });
//     if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     return NextResponse.json(vendor.xeroxSettings || {});
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const {
//       vendorId,
//       bwPerPage,
//       colorPerPage,
//       autoPrint,
//       printerName,
//       autoPrintMode,
//       agentSetupComplete, // ✅ NEW
//     } = await req.json();

//     if (!vendorId)
//       return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor)
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

//     // Merge — don't overwrite fields not sent
//     vendor.xeroxSettings = {
//       bwPerPage:          bwPerPage          ?? vendor.xeroxSettings?.bwPerPage          ?? 1.5,
//       colorPerPage:       colorPerPage       ?? vendor.xeroxSettings?.colorPerPage       ?? 8,
//       autoPrint:          autoPrint          ?? vendor.xeroxSettings?.autoPrint          ?? false,
//       printerName:        printerName        ?? vendor.xeroxSettings?.printerName        ?? '',
//       autoPrintMode:      autoPrintMode      ?? vendor.xeroxSettings?.autoPrintMode      ?? 'browser',
//       agentSetupComplete: agentSetupComplete ?? vendor.xeroxSettings?.agentSetupComplete ?? false, // ✅ NEW
//     };

//     await vendor.save();
//     return NextResponse.json({ success: true, xeroxSettings: vendor.xeroxSettings });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

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
    const {
      vendorId,
      bwPerPage,
      colorPerPage,
      autoPrint,
      printerName,
      autoPrintMode,
      agentSetupComplete,
    } = await req.json();

    if (!vendorId)
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 });

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor)
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const prev = vendor.xeroxSettings || {};

    // ✅ Use explicit undefined check so false, 0, '' are preserved correctly
    vendor.xeroxSettings = {
      bwPerPage:          bwPerPage          !== undefined ? bwPerPage          : (prev.bwPerPage          ?? 1.5),
      colorPerPage:       colorPerPage       !== undefined ? colorPerPage       : (prev.colorPerPage       ?? 8),
      autoPrint:          autoPrint          !== undefined ? autoPrint          : (prev.autoPrint          ?? false),
      printerName:        printerName        !== undefined ? printerName        : (prev.printerName        ?? ''),
      autoPrintMode:      autoPrintMode      !== undefined ? autoPrintMode      : (prev.autoPrintMode      ?? 'browser'),
      agentSetupComplete: agentSetupComplete !== undefined ? agentSetupComplete : (prev.agentSetupComplete ?? false),
    };

    await vendor.save();
    return NextResponse.json({ success: true, xeroxSettings: vendor.xeroxSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}