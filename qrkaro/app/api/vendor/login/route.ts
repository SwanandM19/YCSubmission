
// // app/api/vendor/login/route.ts
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

//     // ✅ Handle vendors created before password feature was added
//     if (!vendor.password) {
//       // Auto-migrate: set their default password = vendorId
//       const hashed = await bcrypt.hash(vendorId, 10);
//       await Vendor.findOneAndUpdate({ vendorId }, { password: hashed });

//       // Now compare
//       const isMatch = password === vendorId;
//       if (!isMatch) {
//         return NextResponse.json(
//           { error: 'Invalid Vendor ID or password' },
//           { status: 401 }
//         );
//       }

//       return NextResponse.json({
//         success: true,
//         vendorId: vendor.vendorId,
//         shopName: vendor.shopName,
//       });
//     }

//     // ✅ Normal flow: compare hashed password
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
//     });

//   } catch (error: any) {
//     console.error('❌ Login error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Login failed' },
//       { status: 500 }
//     );
//   }
// }


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
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Invalid Vendor ID or password' },
        { status: 401 }
      );
    }

    // ✅ Handle vendors created before password feature (no password field)
    if (!vendor.password) {
      const hashed = await bcrypt.hash(vendorId, 10);
      await Vendor.findOneAndUpdate({ vendorId }, { password: hashed });

      if (password !== vendorId) {
        return NextResponse.json(
          { error: 'Invalid Vendor ID or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        vendorId: vendor.vendorId,
        shopName: vendor.shopName,
      });
    }

    // ✅ Normal bcrypt compare
    const isMatch = await bcrypt.compare(password, vendor.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid Vendor ID or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      vendorId: vendor.vendorId,
      shopName: vendor.shopName,
    });

  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
} // ✅ This closing brace was MISSING — caused the 401
