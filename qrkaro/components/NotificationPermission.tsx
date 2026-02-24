'use client';

import { useEffect, useState } from 'react';
import { requestNotificationPermission, isNotificationSupported, getNotificationPermission } from '@/lib/firebase';

interface NotificationPermissionProps {
  userType: 'customer' | 'vendor';
  userId: string; // customerId or vendorId
  onTokenReceived?: (token: string) => void;
}

export default function NotificationPermission({ userType, userId, onTokenReceived }: NotificationPermissionProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    if (!isNotificationSupported()) {
      return;
    }

    // Get current permission status
    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // Show banner if permission not granted
    if (currentPermission === 'default') {
      // Show banner after 3 seconds
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    }

    // If already granted, get token
    if (currentPermission === 'granted') {
      registerToken();
    }
  }, []);

  const registerToken = async () => {
    try {
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        setToken(fcmToken);
        
        // Save token to database
        const response = await fetch('/api/notifications/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userType,
            userId,
            token: fcmToken,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Token registered successfully');
          if (onTokenReceived) {
            onTokenReceived(fcmToken);
          }
        }
      }
    } catch (error) {
      console.error('Error registering token:', error);
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    
    try {
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        setPermission('granted');
        setToken(fcmToken);
        setShowBanner(false);

        // Save token to database
        const response = await fetch('/api/notifications/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userType,
            userId,
            token: fcmToken,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Notifications enabled successfully');
          if (onTokenReceived) {
            onTokenReceived(fcmToken);
          }
        }
      } else {
        setPermission('denied');
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert('Failed to enable notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember dismissal for 7 days
    localStorage.setItem('notificationBannerDismissed', Date.now().toString());
  };

  // Don't show if not supported
  if (!isNotificationSupported()) {
    return null;
  }

  // Don't show if already granted or denied
  if (permission === 'granted' || permission === 'denied') {
    return null;
  }

  // Don't show banner if dismissed recently
  const dismissed = localStorage.getItem('notificationBannerDismissed');
  if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
    return null;
  }

  // Don't show banner if not ready
  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 p-3 bg-orange-100 rounded-xl">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {userType === 'vendor' ? '🔔 Enable Order Alerts' : '📬 Get Order Updates'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {userType === 'vendor' 
                ? 'Receive instant notifications when customers place orders'
                : 'Get notified when your order is accepted, prepared, or ready'
              }
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enabling...
                  </span>
                ) : (
                  'Enable'
                )}
              </button>
              <button
                onClick={handleDismiss}
                disabled={loading}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
              >
                Later
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
