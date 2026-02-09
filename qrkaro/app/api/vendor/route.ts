// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Vendor from '@/lib/models/Vendor';
// import QRCode from 'qrcode';
// import { nanoid } from 'nanoid';

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const {
//       shopName,
//       phone,
//       city,
//       shopType,
//       menuItems,
//       accountHolderName,
//       accountNumber,
//       ifscCode,
//       panNumber,
//     } = body;

//     // Validate required fields
//     if (!shopName || !phone || !city || !shopType || !menuItems || menuItems.length === 0) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Generate unique vendor ID
//     const vendorId = nanoid(10);

//     // Generate customer page URL
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//     const customerPageUrl = `${baseUrl}/v/${vendorId}`;

//     // Generate QR Code
//     let qrCodeUrl = '';
//     try {
//       qrCodeUrl = await QRCode.toDataURL(customerPageUrl, {
//         width: 400,
//         margin: 2,
//         color: {
//           dark: '#000000',
//           light: '#FFFFFF',
//         },
//       });
//     } catch (qrError) {
//       console.error('QR Code generation error:', qrError);
//       // Continue without QR code - can be generated later
//     }

//     // Create vendor in database
//     const vendor = await Vendor.create({
//       vendorId,
//       shopName,
//       phone,
//       city,
//       shopType,
//       menuItems,
//       accountHolderName,
//       accountNumber,
//       ifscCode,
//       panNumber,
//       qrCodeUrl,
//       customerPageUrl,
//       status: 'active',
//     });

//     return NextResponse.json({
//       success: true,
//       vendorId: vendor.vendorId,
//       customerPageUrl: vendor.customerPageUrl,
//       qrCodeUrl: vendor.qrCodeUrl,
//     });
//   } catch (error: any) {
//     console.error('Vendor creation error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
// // Add this function to the existing file

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     const vendor = await Vendor.findOne({ vendorId });

//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       vendorId: vendor.vendorId,
//       shopName: vendor.shopName,
//       shopType: vendor.shopType,
//       customerPageUrl: vendor.customerPageUrl,
//       qrCodeUrl: vendor.qrCodeUrl,
//       menuItems: vendor.menuItems,
//     });
//   } catch (error: any) {
//     console.error('Vendor fetch error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/lib/models/Vendor';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log what we received
    console.log('📥 Received data:', body);

    const { 
      shopName, 
      phone, 
      city, 
      state,        // ADD THIS
      shopType, 
      menuItems,
      upiId,        // ADD THIS
      accountHolderName,  // ADD THIS
      bankAccount,  // ADD THIS (optional)
      ifscCode      // ADD THIS (optional)
    } = body;

    // Validate required fields
    if (!shopName || !phone || !city || !state || !shopType) {
      return NextResponse.json(
        { error: 'Missing required shop details' },
        { status: 400 }
      );
    }

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one menu item is required' },
        { status: 400 }
      );
    }

    if (!upiId || !accountHolderName) {
      return NextResponse.json(
        { error: 'UPI ID and Account Holder Name are required' },
        { status: 400 }
      );
    }

    // Generate unique vendor ID
    const vendorId = nanoid();

    // Connect to database
    await connectDB();

    // Create vendor in database
    const vendor = await Vendor.create({
      vendorId,
      shopName,
      phone,
      city,
      state,              // ADD THIS
      shopType,
      menuItems,
      upiId,              // ADD THIS
      accountHolderName,  // ADD THIS
      bankAccount,        // ADD THIS (optional)
      ifscCode,           // ADD THIS (optional)
    });

    console.log('✅ Vendor created:', vendorId);

    return NextResponse.json({
      success: true,
      vendorId: vendor.vendorId,
      message: 'Vendor created successfully',
    });
  } catch (error: any) {
    console.error('❌ Vendor creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create vendor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    await connectDB();
    const vendor = await Vendor.findOne({ vendorId });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error: any) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}
