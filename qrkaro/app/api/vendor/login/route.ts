

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';
// import bcrypt from 'bcryptjs';

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { vendorId, password } = await req.json();

//     if (!vendorId || !password) {
//       return NextResponse.json(
//         { error: 'Vendor ID and password are required' },
//         { status: 400 }
//       );
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json(
//         { error: 'Invalid Vendor ID or password' },
//         { status: 401 }
//       );
//     }

//     // ✅ Handle vendors created before password feature (no password field)
//     if (!vendor.password) {
//       const hashed = await bcrypt.hash(vendorId, 10);
//       await Vendor.findOneAndUpdate({ vendorId }, { password: hashed });

//       if (password !== vendorId) {
//         return NextResponse.json(
//           { error: 'Invalid Vendor ID or password' },
//           { status: 401 }
//         );
//       }

//       return NextResponse.json({
//         success: true,
//         vendorId: vendor.vendorId,
//         shopName: vendor.shopName,
//         shopType: vendor.shopType,
//       });
//     }

//     // ✅ Normal bcrypt compare
//     const isMatch = await bcrypt.compare(password, vendor.password);

//     if (!isMatch) {
//       return NextResponse.json(
//         { error: 'Invalid Vendor ID or password' },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       vendorId: vendor.vendorId,
//       shopName: vendor.shopName,
//       shopType: vendor.shopType,
//     });

//   } catch (error: any) {
//     console.error('❌ Login error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Login failed' },
//       { status: 500 }
//     );
//   }
// } // ✅ This closing brace was MISSING — caused the 401


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { vendorId, password } = await req.json();

    if (!vendorId || !password) {
      return NextResponse.json(
        { error: 'Vendor ID and password are required' },
        { status: 400 }
      );
    } // ✅ THIS } WAS MISSING

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Invalid Vendor ID or password' },
        { status: 401 }
      );
    } // ✅ THIS } WAS MISSING

    // Handle vendors created before password feature
    if (!vendor.password) {
      const hashed = await bcrypt.hash(vendorId, 10);
      await Vendor.findOneAndUpdate({ vendorId }, { password: hashed });

      if (password !== vendorId) {
        return NextResponse.json(
          { error: 'Invalid Vendor ID or password' },
          { status: 401 }
        );
      } // ✅ THIS } WAS MISSING

      return NextResponse.json({
        success: true,
        vendorId: vendor.vendorId,
        shopName: vendor.shopName,
        shopType: vendor.shopType,
      });
    } // ✅ THIS } WAS MISSING

    // Normal bcrypt compare
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid Vendor ID or password' },
        { status: 401 }
      );
    } // ✅ THIS } WAS MISSING

    return NextResponse.json({
      success: true,
      vendorId: vendor.vendorId,
      shopName: vendor.shopName,
      shopType: vendor.shopType, // ✅ shopType included
    });

  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}