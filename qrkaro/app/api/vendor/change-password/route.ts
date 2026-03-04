// app/api/vendor/change-password/route.ts ← CREATE THIS NEW FILE
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/lib/models/Vendor';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { vendorId, currentPassword, newPassword } = await req.json();

    if (!vendorId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, vendor.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash and save new password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    await Vendor.findOneAndUpdate(
      { vendorId },
      {
        password: hashedNew,
        passwordChangedAt: new Date(),
      }
    );

    return NextResponse.json({ success: true, message: 'Password changed successfully' });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to change password' },
      { status: 500 }
    );
  }
}
