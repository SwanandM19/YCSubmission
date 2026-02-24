import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userType, userId, token } = await req.json();

    console.log('📝 Registering FCM token:', { userType, userId, token: token.substring(0, 20) + '...' });

    // Validate input
    if (!userType || !userId || !token) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only vendors can register tokens here
    // Customers' tokens are saved with their orders
    if (userType !== 'vendor') {
      return NextResponse.json(
        { success: false, error: 'Invalid user type. Only vendors can register tokens here.' },
        { status: 400 }
      );
    }

    // Find vendor by vendorId
    const vendor = await Vendor.findOne({ vendorId: userId });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Add token if not already exists (avoid duplicates)
    if (!vendor.fcmTokens) {
      vendor.fcmTokens = [];
    }

    if (!vendor.fcmTokens.includes(token)) {
      vendor.fcmTokens.push(token);
      await vendor.save();
      console.log('✅ Vendor FCM token saved');
    } else {
      console.log('ℹ️ Token already exists for vendor');
    }

    return NextResponse.json({
      success: true,
      message: 'Notification token registered successfully',
    });

  } catch (error: any) {
    console.error('❌ Error registering FCM token:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register token' },
      { status: 500 }
    );
  }
}

// Optional: DELETE endpoint to remove token (when vendor logs out)
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { userType, userId, token } = await req.json();

    console.log('🗑️ Removing FCM token:', { userType, userId });

    if (!userType || !userId || !token) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (userType === 'vendor') {
      const vendor = await Vendor.findOne({ vendorId: userId });
      if (vendor && vendor.fcmTokens) {
        vendor.fcmTokens = vendor.fcmTokens.filter((t: string) => t !== token);
        await vendor.save();
        console.log('✅ Vendor FCM token removed');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Token removed successfully',
    });

  } catch (error: any) {
    console.error('❌ Error removing FCM token:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
