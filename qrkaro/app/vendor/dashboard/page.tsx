'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendorAuthStore';

interface Order {
  orderId: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function VendorDashboardPage() {
  const router = useRouter();
  const { vendorId, shopName, isAuthenticated, logout } = useVendorAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'inprogress' | 'completed'>('pending');
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [earningsGrowth, setEarningsGrowth] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !vendorId) {
      router.push('/vendor/login');
      return;
    }
    fetchOrders();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, vendorId]);

  const fetchOrders = async () => {
    if (!vendorId) return;

    try {
      const response = await fetch(`/api/orders?vendorId=${vendorId}`);
      const data = await response.json();
      setOrders(data);
      calculateEarnings(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEarnings = (orders: Order[]) => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (order) => new Date(order.createdAt).toDateString() === today && order.status !== 'cancelled'
    );
    const earnings = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    setTodayEarnings(earnings);
    setEarningsGrowth(12);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleDeclineOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === 'pending') return order.status === 'pending';
    if (selectedTab === 'inprogress') return order.status === 'preparing';
    if (selectedTab === 'completed') return order.status === 'completed';
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const inProgressCount = orders.filter((o) => o.status === 'preparing').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{shopName || 'Your Shop'}</h1>
            </div>
            <button onClick={() => router.push('/vendor/dashboard/settings')}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Earnings Card */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-2">Today's Total Earnings</p>
              <h2 className="text-4xl font-bold text-gray-900">₹{todayEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            </div>
            <span className="px-3 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
              LIVE
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`pb-3 px-6 font-semibold transition relative ${
              selectedTab === 'pending'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedTab('inprogress')}
            className={`pb-3 px-6 font-semibold transition relative ${
              selectedTab === 'inprogress'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`pb-3 px-6 font-semibold transition relative ${
              selectedTab === 'completed'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Orders Section Header */}
        {selectedTab === 'inprogress' && inProgressCount > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-orange-600 uppercase tracking-wide">
              In Preparation
            </h3>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500">New orders will appear here</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onAccept={handleAcceptOrder}
                onDecline={handleDeclineOrder}
                onMarkReady={handleMarkReady}
                currentTab={selectedTab}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-orange-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="text-xs font-semibold">Orders</span>
            </button>
            
            <button 
              onClick={() => router.push('/vendor/dashboard/menu')}
              className="flex flex-col items-center gap-1 text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-medium">Menu</span>
            </button>
            
            <button 
              onClick={() => router.push('/vendor/dashboard/insights')}
              className="flex flex-col items-center gap-1 text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">Sales</span>
            </button>
            
            <button 
              onClick={() => router.push('/vendor/dashboard/settings')}
              className="flex flex-col items-center gap-1 text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium">Setup</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Order Card Component
function OrderCard({
  order,
  onAccept,
  onDecline,
  onMarkReady,
  currentTab,
}: {
  order: Order;
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onMarkReady?: (orderId: string) => void;
  currentTab: string;
}) {
  const getTimeAgo = (date: string) => {
    const now = new Date().getTime();
    const orderTime = new Date(date).getTime();
    const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-orange-600 text-sm font-bold uppercase mb-1">
            {currentTab === 'inprogress' ? 'In Preparation' : currentTab === 'completed' ? 'Completed' : 'New Order'}
          </p>
          <h3 className="text-xl font-bold text-gray-900">Order #{order.orderId.slice(-4)}</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-bold">PAID</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-900 font-medium text-base">
          {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
        </p>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{getTimeAgo(order.createdAt)}</span>
        </div>
      </div>

      {/* Action Button */}
      {currentTab === 'pending' && onAccept && onDecline && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onAccept(order.orderId)}
            className="py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition"
          >
            Accept
          </button>
          <button
            onClick={() => onDecline(order.orderId)}
            className="py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition"
          >
            Decline
          </button>
        </div>
      )}

      {currentTab === 'inprogress' && onMarkReady && (
        <button
          onClick={() => onMarkReady(order.orderId)}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition text-lg"
        >
          Ready
        </button>
      )}

      {currentTab === 'completed' && (
        <div className="text-center py-2 text-sm text-gray-500 font-medium">
          Completed {getTimeAgo(order.createdAt)}
        </div>
      )}
    </div>
  );
}
