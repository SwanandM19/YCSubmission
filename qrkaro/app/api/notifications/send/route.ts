import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import Order from '@/lib/models/Order';
import { sendNotificationToDevice, sendNotificationToMultipleDevices } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { 
      userType, 
      userId, 
      title, 
      body, 
      data, 
      imageUrl 
    } = await req.json();

    console.log('📤 Sending notification:', { userType, userId, title });

    // Validate input
    if (!userType || !userId || !title || !body) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let fcmTokens: string[] = [];

    // Get FCM tokens based on user type
    if (userType === 'customer') {
      // For customers, userId is actually the orderId
      // Get the FCM token from the order
      const order = await Order.findOne({ orderId: userId });
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      if (order.customerFcmToken) {
        fcmTokens = [order.customerFcmToken];
      }
    } else if (userType === 'vendor') {
      const vendor = await Vendor.findOne({ vendorId: userId });
      
      if (!vendor) {
        return NextResponse.json(
          { success: false, error: 'Vendor not found' },
          { status: 404 }
        );
      }

      fcmTokens = vendor.fcmTokens || [];
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Check if user has any tokens
    if (fcmTokens.length === 0) {
      console.log('⚠️ No FCM tokens found for user');
      return NextResponse.json({
        success: false,
        error: 'No notification tokens found for this user',
      });
    }

    console.log(`📱 Found ${fcmTokens.length} device(s) to notify`);

    // Send notification to all devices
    let result;
    if (fcmTokens.length === 1) {
      // Send to single device
      result = await sendNotificationToDevice(
        fcmTokens[0],
        title,
        body,
        data,
        imageUrl
      );
    } else {
      // Send to multiple devices
      result = await sendNotificationToMultipleDevices(
        fcmTokens,
        title,
        body,
        data,
        imageUrl
      );
    }

    if (result.success) {
      console.log('✅ Notification sent successfully');
      return NextResponse.json({
        success: true,
        message: 'Notification sent successfully',
        result,
      });
    } else {
      console.error('❌ Failed to send notification:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error,
      });
    }

  } catch (error: any) {
    console.error('❌ Error sending notification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Send notification by phone number (for customers without orderId)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { 
      phone,  // Customer phone number
      title, 
      body, 
      data, 
      imageUrl 
    } = await req.json();

    console.log('📤 Sending notification to phone:', { phone, title });

    if (!phone || !title || !body) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the most recent order for this phone number
    const order = await Order.findOne({ customerPhone: phone })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!order || !order.customerFcmToken) {
      return NextResponse.json({
        success: false,
        error: 'No notification token found for this customer',
      });
    }

    console.log(`📱 Sending notification to customer`);

    // Send to customer's device
    const result = await sendNotificationToDevice(
      order.customerFcmToken,
      title,
      body,
      data,
      imageUrl
    );

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
      result,
    });

  } catch (error: any) {
    console.error('❌ Error sending notification:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
