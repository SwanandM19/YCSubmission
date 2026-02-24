// Backend Firebase Admin SDK Configuration (Server-Side)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let adminApp: App;

// Initialize Firebase Admin (only once)
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    try {
      // Get credentials from environment variables
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
        console.error('❌ Missing Firebase Admin credentials in .env.local');
        throw new Error('Firebase Admin credentials not configured');
      }

      adminApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });

      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Firebase Admin:', error);
      throw error;
    }
  } else {
    adminApp = getApps()[0];
  }

  return adminApp;
};

// Get Firebase Messaging instance
export const getAdminMessaging = () => {
  const app = initializeFirebaseAdmin();
  return getMessaging(app);
};

// Send notification to a single device
export const sendNotificationToDevice = async (
  token: string,
  title: string,
  body: string,
  data?: { [key: string]: string },
  imageUrl?: string
) => {
  try {
    const messaging = getAdminMessaging();

    const message: any = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
      webpush: {
        notification: {
          icon: '/icon-192x192.png', // Your app icon
          badge: '/badge-72x72.png', // Small badge icon
          vibrate: [200, 100, 200],
          requireInteraction: false,
        },
        fcmOptions: {
          link: data?.link || '/', // URL to open when notification is clicked
        },
      },
    };

    // Add image if provided
    if (imageUrl) {
      message.notification.image = imageUrl;
    }

    const response = await messaging.send(message);
    console.log('✅ Notification sent successfully:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to multiple devices
export const sendNotificationToMultipleDevices = async (
  tokens: string[],
  title: string,
  body: string,
  data?: { [key: string]: string },
  imageUrl?: string
) => {
  try {
    const messaging = getAdminMessaging();

    const message: any = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens, // Array of FCM tokens
      webpush: {
        notification: {
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
        },
        fcmOptions: {
          link: data?.link || '/',
        },
      },
    };

    if (imageUrl) {
      message.notification.image = imageUrl;
    }

    const response = await messaging.sendEachForMulticast(message);
    console.log(`✅ Sent to ${response.successCount} devices`);
    console.log(`❌ Failed to send to ${response.failureCount} devices`);
    
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    };
  } catch (error: any) {
    console.error('❌ Error sending notifications:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to a topic (for broadcast)
export const sendNotificationToTopic = async (
  topic: string,
  title: string,
  body: string,
  data?: { [key: string]: string }
) => {
  try {
    const messaging = getAdminMessaging();

    const message = {
      topic,
      notification: {
        title,
        body,
      },
      data: data || {},
      webpush: {
        notification: {
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
        },
        fcmOptions: {
          link: data?.link || '/',
        },
      },
    };

    const response = await messaging.send(message);
    console.log('✅ Notification sent to topic:', response);
    return { success: true, response };
  } catch (error: any) {
    console.error('❌ Error sending notification to topic:', error);
    return { success: false, error: error.message };
  }
};

export default initializeFirebaseAdmin;
