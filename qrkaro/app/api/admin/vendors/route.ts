// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Vendor from '@/lib/models/Vendor';

// export async function GET() {
//   try {
//     await connectDB();
//     const vendors = await Vendor.find().sort({ createdAt: -1 }).limit(50);
//     return NextResponse.json(vendors);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

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

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';
// import Order from '@/lib/models/Order';
// import bcrypt from 'bcryptjs';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');
//     const includePassword = searchParams.get('includePassword') === 'true';

//     if (vendorId) {
//       // Single vendor — optionally include password hash for admin
//       const vendor = includePassword
//         ? await Vendor.findOne({ vendorId })
//         : await Vendor.findOne({ vendorId }).select('-password');

//       if (!vendor) {
//         return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//       }
//       return NextResponse.json(vendor);
//     }

//     // All vendors list — never expose password in list view
//     const vendors = await Vendor.find()
//       .select('-password')
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ vendors });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { vendorId, action, ...fields } = body;

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // ── Action: Reset / Set Password ──────────────────────────────────────
//     if (action === 'resetPassword') {
//       const { newPassword } = fields;
//       if (!newPassword || newPassword.length < 6) {
//         return NextResponse.json(
//           { error: 'Password must be at least 6 characters' },
//           { status: 400 }
//         );
//       }
//       const hashed = await bcrypt.hash(newPassword, 10);
//       await Vendor.findOneAndUpdate(
//         { vendorId },
//         { password: hashed, passwordChangedAt: new Date() }
//       );
//       return NextResponse.json({ success: true, message: 'Password updated successfully' });
//     }

//     // ── Action: Toggle Active Status ──────────────────────────────────────
//     if (action === 'toggleStatus') {
//       const updated = await Vendor.findOneAndUpdate(
//         { vendorId },
//         { isActive: !vendor.isActive },
//         { new: true }
//       ).select('-password');
//       return NextResponse.json({ success: true, vendor: updated });
//     }

//     // ── Action: Update vendor fields ──────────────────────────────────────
//     const allowedFields = ['shopName', 'phone', 'city', 'state', 'shopType',
//       'upiId', 'accountHolderName', 'isActive', 'subscriptionPaid'];
//     const updateData: Record<string, any> = {};
//     for (const key of allowedFields) {
//       if (fields[key] !== undefined) updateData[key] = fields[key];
//     }

//     const updated = await Vendor.findOneAndUpdate(
//       { vendorId },
//       updateData,
//       { new: true }
//     ).select('-password');

//     return NextResponse.json({ success: true, vendor: updated });

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');
//     const deleteOrders = searchParams.get('deleteOrders') === 'true';

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // Optionally delete all orders for this vendor
//     let deletedOrders = 0;
//     if (deleteOrders) {
//       const result = await Order.deleteMany({ vendorId });
//       deletedOrders = result.deletedCount;
//     }

//     await Vendor.deleteOne({ vendorId });

//     return NextResponse.json({
//       success: true,
//       message: `Vendor ${vendorId} deleted successfully`,
//       deletedOrders,
//     });

//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import Order from '@/lib/models/Order';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const includePassword = searchParams.get('includePassword') === 'true';

    if (vendorId) {
      const vendor = includePassword
        ? await Vendor.findOne({ vendorId })
        : await Vendor.findOne({ vendorId }).select('-password');

      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      return NextResponse.json(vendor);
    }

    const vendors = await Vendor.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ vendors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { vendorId, action, ...fields } = body;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // ── Reset Password ────────────────────────────────────────────────────
    if (action === 'resetPassword') {
      const { newPassword } = fields;

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }

      // ✅ Always hash the plain text password before saving
      const hashed = await bcrypt.hash(newPassword, 10);

      await Vendor.findOneAndUpdate(
        { vendorId },
        {
          password: hashed,
          passwordChangedAt: new Date(),
        }
      );

      console.log(`✅ Password reset for vendor: ${vendorId}`);
      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
      });
    }

    // ── Toggle Active Status ──────────────────────────────────────────────
    if (action === 'toggleStatus') {
      const updated = await Vendor.findOneAndUpdate(
        { vendorId },
        { isActive: !vendor.isActive },
        { new: true }
      ).select('-password');
      return NextResponse.json({ success: true, vendor: updated });
    }

    // ── Update Vendor Fields ──────────────────────────────────────────────
    const allowedFields = [
      'shopName', 'phone', 'city', 'state', 'shopType',
      'upiId', 'accountHolderName', 'isActive', 'subscriptionPaid',
    ];
    const updateData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (fields[key] !== undefined) updateData[key] = fields[key];
    }

    const updated = await Vendor.findOneAndUpdate(
      { vendorId },
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json({ success: true, vendor: updated });

  } catch (error: any) {
    console.error('❌ Admin vendor PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const deleteOrders = searchParams.get('deleteOrders') === 'true';

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    let deletedOrders = 0;
    if (deleteOrders) {
      const result = await Order.deleteMany({ vendorId });
      deletedOrders = result.deletedCount;
    }

    await Vendor.deleteOne({ vendorId });

    return NextResponse.json({
      success: true,
      message: `Vendor ${vendorId} deleted`,
      deletedOrders,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
