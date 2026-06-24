

'use client';

import DashboardSkeleton from '@/components/loading/DashboardSkeleton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendorAuthStore';
import NotificationPermission from '@/components/NotificationPermission';
import RetryState from '@/components/loading/RetryState';

interface Order {
  orderId: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

// interface VendorNotification {
//   orderId: string;
//   type: 'new_order' | 'completed' | 'cancelled';
//   title: string;
//   body: string;
//   createdAt: string;
//   read: boolean;
// }

type Tab = 'pending' | 'inprogress' | 'completed';

export default function VendorDashboardPage() {
  const router = useRouter();
  const { vendorId, shopName, shopType, isAuthenticated, logout } = useVendorAuth(); // ✅ added shopType

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<Tab>('pending');
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // const [notifications, setNotifications] = useState<VendorNotification[]>([]);
  // const [showNotifications, setShowNotifications] = useState(false);
  // const notificationRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (vendorId) localStorage.setItem('vendorId', vendorId);
  // }, [vendorId]);

//   useEffect(() => {
//     if (!isAuthenticated || !vendorId) { router.push('/vendor/login'); return; }
//     // ✅ Redirect Xerox vendors away from food orders dashboard
//     if (shopType === 'Xerox Shop') { router.replace('/vendor/dashboard/print-jobs'); return; }
//     fetchOrders();
//     const interval = setInterval(fetchOrders, 5000);
//     return () => clearInterval(interval);
//   }, [isAuthenticated, vendorId, shopType]); // ✅ shopType in deps

//   useEffect(() => {
//   if (!isAuthenticated || !vendorId) {
//     router.push('/vendor/login');
//     return;
//   }

//   useEffect(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       notificationRef.current &&
//       !notificationRef.current.contains(event.target as Node)
//     ) {
//       setShowNotifications(false);
//     }
//   };

//   document.addEventListener('mousedown', handleClickOutside);
//   return () => document.removeEventListener('mousedown', handleClickOutside);
// }, []);

//   if (shopType === 'Xerox Shop') {
//     router.replace('/vendor/dashboard/print-jobs');
//     return;
//   }

//   fetchOrders();
//   fetchNotifications();

//   const interval = setInterval(() => {
//     fetchOrders();
//     fetchNotifications();
//   }, 5000);

//   return () => clearInterval(interval);
// }, [isAuthenticated, vendorId, shopType]);

useEffect(() => {
  if (vendorId) localStorage.setItem('vendorId', vendorId);
}, [vendorId]);

useEffect(() => {
  if (!isAuthenticated || !vendorId) {
    router.push('/vendor/login');
    return;
  }

  if (shopType === 'Xerox Shop') {
    router.replace('/vendor/dashboard/print-jobs');
    return;
  }

  // fetchOrders();
  // fetchNotifications();

  // const interval = setInterval(() => {
  //   fetchOrders();
  //   fetchNotifications();
  // }, 5000);

  fetchOrders();

const interval = setInterval(() => {
  fetchOrders();
}, 5000);

  return () => clearInterval(interval);
}, [isAuthenticated, vendorId, shopType]);

// useEffect(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     if (
//       notificationRef.current &&
//       !notificationRef.current.contains(event.target as Node)
//     ) {
//       setShowNotifications(false);
//     }
//   };

//   document.addEventListener('mousedown', handleClickOutside);
//   return () => document.removeEventListener('mousedown', handleClickOutside);
// }, []);

  // const fetchOrders = async () => {
  //   if (!vendorId) return;
  //   try {
  //     const response = await fetch(`/api/orders?vendorId=${vendorId}`);
  //     const data = await response.json();
  //     setOrders(data);
  //     calculateEarnings(data);
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchOrders = async () => {
  if (!vendorId) return;
  try {
    setFetchError(null);
    const response = await fetch(`/api/orders?vendorId=${vendorId}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    setOrders(data);
    calculateEarnings(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    setFetchError('Could not load orders right now.');
  } finally {
    setLoading(false);
  }
};

//   const fetchNotifications = async () => {
//   if (!vendorId) return;

//   try {
//     const res = await fetch(`/api/notifications/vendor?vendorId=${vendorId}`);
//     const data = await res.json();

//     if (data.success) {
//       setNotifications((prev) => {
//         const prevReadMap = new Map(
//           prev.map((n) => [`${n.orderId}-${n.createdAt}-${n.type}`, n.read])
//         );

//         return (data.notifications || []).map((n: VendorNotification) => {
//           const key = `${n.orderId}-${n.createdAt}-${n.type}`;
//           return {
//             ...n,
//             read: prevReadMap.get(key) ?? n.read,
//           };
//         });
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//   }
// };

  const calculateEarnings = (orders: Order[]) => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today && o.status !== 'cancelled'
    );
    setTodayEarnings(todayOrders.reduce((sum, o) => sum + o.totalAmount, 0));
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (response.ok) fetchOrders();
      
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    setAcceptingId(orderId);
    await updateOrderStatus(orderId, 'preparing');
    setAcceptingId(null);
  };

  const handleDeclineOrder = async (orderId: string) => {
    setDecliningId(orderId);
    try {
      const res = await fetch('/api/orders/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) { alert('Refund failed: ' + data.error); return; }
      await updateOrderStatus(orderId, 'cancelled');
      alert(`✅ Order declined. Refund of ₹${data.amount} initiated to customer.`);
      fetchOrders();
    } catch (err) {
      alert('Something went wrong while declining the order.');
      console.error('Decline error:', err);
    } finally {
      setDecliningId(null);
    }
  };

  const handleMarkReady = (orderId: string) => updateOrderStatus(orderId, 'completed');

//   const handleMarkAllRead = async () => {
//   if (!vendorId) return;

//   try {
//     const res = await fetch('/api/notifications/vendor', {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ vendorId }),
//     });

//     if (!res.ok) throw new Error('Failed to mark notifications as read');

//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     setShowNotifications(false);
//   } catch (error) {
//     console.error('Error marking notifications as read:', error);
//   }
// };

  const pendingCount    = orders.filter((o) => o.status === 'pending').length;
  const inProgressCount = orders.filter((o) => o.status === 'preparing').length;
  const completedCount  = orders.filter((o) => o.status === 'completed').length;
  // const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredOrders = orders.filter((o) => {
    if (selectedTab === 'pending')    return o.status === 'pending';
    if (selectedTab === 'inprogress') return o.status === 'preparing';
    if (selectedTab === 'completed')  return o.status === 'completed';
    return true;
  });

  const tabs: { key: Tab; label: string; count: number; color: string }[] = [
    { key: 'pending',    label: 'Pending',     count: pendingCount,    color: 'text-orange-600 bg-orange-100' },
    { key: 'inprogress', label: 'In Progress', count: inProgressCount, color: 'text-blue-600 bg-blue-100' },
    { key: 'completed',  label: 'Completed',   count: completedCount,  color: 'text-green-600 bg-green-100' },
  ];

  // ✅ Don't flash orders UI while redirecting Xerox vendors
  if (shopType === 'Xerox Shop') return null;

  // if (loading) {
  //   return (
  //     <div className="flex flex-col gap-4 p-4 lg:p-6 animate-pulse">
  //       <div className="bg-gray-200 rounded-2xl h-32 w-full" />
  //       <div className="flex gap-2">
  //         {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-200 rounded-xl flex-1" />)}
  //       </div>
  //       {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-40 w-full" />)}
  //     </div>
  //   );
  // }

  if (loading) return <DashboardSkeleton />;

if (fetchError) {
  return (
    <RetryState
      title="Could not load orders"
      subtitle="Traffic may be high right now. Please try again."
      onRetry={() => {
        setLoading(true);
        setFetchError(null);
        fetchOrders();
      }}
    />
  );
}

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {vendorId && (
        <NotificationPermission
          userType="vendor"
          userId={vendorId}
          onTokenReceived={(token) => console.log('✅ Vendor FCM token received:', token)}
        />
      )}

      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-xl font-bold text-gray-900">{shopName || 'Vendor Portal'}</h1>
    <p className="text-sm text-gray-400">Manage your live orders</p>
  </div>
</div>

      {/* ── Earnings Card ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg shadow-orange-200">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -right-2 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">Today's Earnings</p>
              <h2 className="text-3xl font-black text-white tracking-tight">
                ₹{todayEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {[
              { label: 'Pending',   value: pendingCount },
              { label: 'Preparing', value: inProgressCount },
              { label: 'Done',      value: completedCount },
            ].map((s) => (
              <div key={s.label} className="flex-1 bg-white/20 backdrop-blur rounded-xl px-3 py-2 text-center">
                <p className="text-white font-black text-lg leading-tight">{s.value}</p>
                <p className="text-orange-100 text-xs font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
              selectedTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                selectedTab === tab.key ? tab.color : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Orders ────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-orange-50 border-2 border-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">
              {selectedTab === 'pending' ? 'No new orders' :
               selectedTab === 'inprogress' ? 'Nothing in progress' : 'No completed orders'}
            </h3>
            <p className="text-sm text-gray-400 max-w-[200px]">
              {selectedTab === 'pending' ? 'New orders will appear here automatically' :
               selectedTab === 'inprogress' ? 'Accept orders to see them here' : 'Completed orders will show here'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              currentTab={selectedTab}
              onAccept={handleAcceptOrder}
              onDecline={handleDeclineOrder}
              onMarkReady={handleMarkReady}
              isAccepting={acceptingId === order.orderId}
              isDeclining={decliningId === order.orderId}
            />
          ))
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order, currentTab, onAccept, onDecline, onMarkReady, isAccepting, isDeclining,
}: {
  order: Order; currentTab: Tab;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onMarkReady: (id: string) => void;
  isAccepting: boolean; isDeclining: boolean;
}) {
  const getTimeAgo = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1)  return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const h = Math.floor(diff / 60);
    if (h < 24)    return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const isUrgent = currentTab === 'pending' &&
    (Date.now() - new Date(order.createdAt).getTime()) > 5 * 60 * 1000;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all ${
      isUrgent ? 'border-orange-200 shadow-orange-100' : 'border-gray-100'
    }`}>
      <div className={`flex items-center justify-between px-4 pt-4 pb-3 border-b ${
        isUrgent ? 'border-orange-100 bg-orange-50/50 rounded-t-2xl' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${
            currentTab === 'pending'    ? 'bg-orange-500 animate-pulse' :
            currentTab === 'inprogress' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
          }`} />
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {currentTab === 'inprogress' ? 'Preparing' :
               currentTab === 'completed'  ? 'Completed' : 'New Order'}
            </p>
            <h3 className="text-base font-black text-gray-900">#{order.orderId.slice(-6).toUpperCase()}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isUrgent && (
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full animate-pulse">
              Waiting!
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Paid
          </span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-orange-100 text-orange-600 text-xs font-bold rounded-md flex items-center justify-center flex-shrink-0">
                {item.quantity}
              </span>
              <span className="text-sm font-medium text-gray-800">{item.name}</span>
            </div>
            <span className="text-sm text-gray-500">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {getTimeAgo(order.createdAt)}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-base font-black text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {currentTab === 'pending' && (
        <div className="grid grid-cols-2 gap-2.5 p-3">
          <button
            onClick={() => onDecline(order.orderId)}
            disabled={isDeclining || isAccepting}
            className="py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 text-gray-600 font-bold rounded-xl transition text-sm disabled:opacity-50"
          >
            {isDeclining ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Declining...
              </span>
            ) : 'Decline'}
          </button>
          <button
            onClick={() => onAccept(order.orderId)}
            disabled={isAccepting || isDeclining}
            className="py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition text-sm shadow-sm shadow-orange-200 disabled:opacity-50"
          >
            {isAccepting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Accepting...
              </span>
            ) : 'Accept ✓'}
          </button>
        </div>
      )}

      {currentTab === 'inprogress' && (
        <div className="p-3">
          <button
            onClick={() => onMarkReady(order.orderId)}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Mark as Ready
          </button>
        </div>
      )}

      {currentTab === 'completed' && (
        <div className="px-4 py-3 flex items-center justify-center gap-2 text-xs text-green-600 font-semibold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Order completed · {getTimeAgo(order.createdAt)}
        </div>
      )}
    </div>
  );
}