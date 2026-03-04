// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';
// import QRCode from 'qrcode';

// // Generate unique vendor ID
// function generateVendorId() {
//   return `VND${Date.now()}${Math.floor(Math.random() * 1000)}`;
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     console.log('📥 Received vendor data:', JSON.stringify(body, null, 2));

//     const {
//       shopName,
//       phone,
//       city,
//       state,
//       shopType,
//       menuItems,
//       upiId,
//       accountHolderName,
//       bankAccount,
//       ifscCode,
//       subscriptionPaymentId,
//       subscriptionOrderId,
//       subscriptionPaid,
//     } = body;

//     // Validate required fields
//     if (!shopName || !phone || !city || !state || !shopType || !upiId || !accountHolderName) {
//       console.error('❌ Missing required fields:', {
//         shopName: !!shopName,
//         phone: !!phone,
//         city: !!city,
//         state: !!state,
//         shopType: !!shopType,
//         upiId: !!upiId,
//         accountHolderName: !!accountHolderName,
//       });
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Validate menuItems
//     if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
//       console.error('❌ Invalid or empty menu items');
//       return NextResponse.json(
//         { error: 'Menu items are required' },
//         { status: 400 }
//       );
//     }

//     // Check if phone already exists
//     const existingVendor = await Vendor.findOne({ phone });
//     if (existingVendor) {
//       console.error('❌ Phone number already exists:', phone);
//       return NextResponse.json(
//         { error: 'Phone number already registered' },
//         { status: 400 }
//       );
//     }

//     // Generate vendor ID
//     const vendorId = generateVendorId();

//     // Generate QR code for customer ordering page
//     const customerUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/${vendorId}`;
//     const qrCodeDataUrl = await QRCode.toDataURL(customerUrl, {
//       width: 500,
//       margin: 2,
//       color: {
//         dark: '#000000',
//         light: '#FFFFFF',
//       },
//     });

//     // Create vendor with exact schema match
//     const vendorData = {
//       vendorId,
//       shopName,
//       phone,
//       city,
//       state,
//       shopType,
//       menuItems,
//       upiId,
//       accountHolderName,
//       bankAccount: bankAccount || '',
//       ifscCode: ifscCode || '',
//       qrCode: qrCodeDataUrl,
//       subscriptionPaid: subscriptionPaid === true,
//       subscriptionPaymentId: subscriptionPaymentId || '',
//       subscriptionOrderId: subscriptionOrderId || '',
//       subscriptionAmount: 200,
//       subscriptionDate: subscriptionPaid === true ? new Date() : undefined,
//       isActive: true,
//     };

//     console.log('📤 Creating vendor with data:', JSON.stringify(vendorData, null, 2));

//     const vendor = await Vendor.create(vendorData);

//     console.log('✅ Vendor created successfully:', vendorId);

//     return NextResponse.json({
//       success: true,
//       vendorId: vendor.vendorId,
//       shopName: vendor.shopName,
//       qrCode: vendor.qrCode,
//       customerUrl,
//       dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/vendor/${vendorId}`,
//     }, { status: 201 });

//   } catch (error: any) {
//     console.error('❌ Error creating vendor:', error);
//     console.error('Error details:', error.message);
//     if (error.errors) {
//       console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
//     }
//     return NextResponse.json(
//       { error: error.message || 'Failed to create vendor' },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');
//     const phone = searchParams.get('phone');

//     if (vendorId) {
//       const vendor = await Vendor.findOne({ vendorId });
//       if (!vendor) {
//         return NextResponse.json(
//           { error: 'Vendor not found' },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(vendor);
//     }

//     if (phone) {
//       const vendor = await Vendor.findOne({ phone });
//       if (!vendor) {
//         return NextResponse.json(
//           { error: 'Vendor not found' },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(vendor);
//     }

//     // Get all vendors (admin use)
//     const vendors = await Vendor.find().sort({ createdAt: -1 }).limit(50);
//     return NextResponse.json(vendors);

//   } catch (error: any) {
//     console.error('❌ Error fetching vendor:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch vendor' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

// Generate unique vendor ID
function generateVendorId() {
  return `VND${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    console.log('📥 Received vendor data:', JSON.stringify(body, null, 2));

    const {
      shopName,
      phone,
      city,
      state,
      shopType,
      menuItems,
      upiId,
      accountHolderName,
      bankAccount,
      ifscCode,
      subscriptionPaymentId,
      subscriptionOrderId,
      subscriptionPaid,
    } = body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!shopName || !phone || !city || !state || !shopType || !upiId || !accountHolderName) {
      console.error('❌ Missing required fields:', {
        shopName: !!shopName,
        phone: !!phone,
        city: !!city,
        state: !!state,
        shopType: !!shopType,
        upiId: !!upiId,
        accountHolderName: !!accountHolderName,
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ── Validate menuItems ────────────────────────────────────────────────────
    if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
      console.error('❌ Invalid or empty menu items');
      return NextResponse.json(
        { error: 'Menu items are required' },
        { status: 400 }
      );
    }

    // ── Check duplicate phone ─────────────────────────────────────────────────
    const existingVendor = await Vendor.findOne({ phone });
    if (existingVendor) {
      console.error('❌ Phone number already exists:', phone);
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // ── Generate Vendor ID ────────────────────────────────────────────────────
    const vendorId = generateVendorId();

    // ── Hash default password (vendorId is the first password) ───────────────
    const hashedPassword = await bcrypt.hash(vendorId, 10);
    console.log('🔐 Default password set to vendorId (hashed)');

    // ── Generate QR Code ──────────────────────────────────────────────────────
    const customerUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/v/${vendorId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(customerUrl, {
      width: 500,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // ── Create Vendor ─────────────────────────────────────────────────────────
    const vendorData = {
      vendorId,
      shopName,
      phone,
      city,
      state,
      shopType,
      menuItems,
      upiId,
      accountHolderName,
      bankAccount: bankAccount || '',
      ifscCode: ifscCode || '',
      qrCode: qrCodeDataUrl,
      subscriptionPaid: subscriptionPaid === true,
      subscriptionPaymentId: subscriptionPaymentId || '',
      subscriptionOrderId: subscriptionOrderId || '',
      subscriptionAmount: 200,
      subscriptionDate: subscriptionPaid === true ? new Date() : undefined,
      isActive: true,
      password: hashedPassword,
    };

    console.log('📤 Creating vendor...');
    const vendor = await Vendor.create(vendorData);
    console.log('✅ Vendor created successfully:', vendorId);

    return NextResponse.json({
      success: true,
      vendorId: vendor.vendorId,
      shopName: vendor.shopName,
      qrCode: vendor.qrCode,
      customerUrl,
      dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/vendor/dashboard`,
      // ✅ Tell frontend the default password so success page can show it
      defaultPassword: vendorId,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error creating vendor:', error);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create vendor' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const phone = searchParams.get('phone');

    if (vendorId) {
      const vendor = await Vendor.findOne({ vendorId }).select('-password');
      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(vendor);
    }

    if (phone) {
      const vendor = await Vendor.findOne({ phone }).select('-password');
      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(vendor);
    }

    // Get all vendors — admin use, never expose passwords
    const vendors = await Vendor.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50);
    return NextResponse.json(vendors);

  } catch (error: any) {
    console.error('❌ Error fetching vendor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vendor' },
      { status: 500 }
    );
  }
}
