import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendNotificationToDevice } from '@/lib/firebaseAdmin'; // ✅ ADDED

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('✅ Order status updated:', { orderId, status });

    // ✅ ADDED: Send notification to customer based on status change
    if (order.customerFcmToken) {
      let notificationTitle = '';
      let notificationBody = '';
      let emoji = '';

      switch (status) {
        case 'preparing':
          emoji = '✅';
          notificationTitle = 'Order Accepted!';
          notificationBody = `Your order #${orderId.slice(-4)} has been accepted and is being prepared.`;
          break;
        case 'ready':
          emoji = '🎉';
          notificationTitle = 'Order Ready!';
          notificationBody = `Your order #${orderId.slice(-4)} is ready for pickup!`;
          break;
        case 'completed':
          emoji = '✅';
          notificationTitle = 'Order Completed!';
          notificationBody = `Your order #${orderId.slice(-4)} has been completed. Thank you!`;
          break;
        case 'cancelled':
          emoji = '❌';
          notificationTitle = 'Order Cancelled';
          notificationBody = `Your order #${orderId.slice(-4)} has been cancelled. Contact support if you have questions.`;
          break;
        default:
          break;
      }

      // Send notification if we have a message
      if (notificationTitle && notificationBody) {
        try {
          await sendNotificationToDevice(
            order.customerFcmToken,
            `${emoji} ${notificationTitle}`,
            notificationBody,
            {
              orderId: order.orderId,
              status: status,
              link: `/v/${order.vendorId}/order-success?orderId=${order.orderId}`,
            }
          );
          console.log('✅ Customer notification sent:', { orderId, status });
        } catch (notifError: any) {
          console.error('⚠️ Failed to send customer notification:', notifError);
          // Don't fail the request if notification fails
        }
      }
    } else {
      console.log('⚠️ No FCM token found for customer, skipping notification');
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
