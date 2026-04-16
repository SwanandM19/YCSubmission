// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useVendorAuth } from '@/lib/vendorAuthStore';
// import NotificationPermission from '@/components/NotificationPermission'; // ✅ ADDED

// interface Order {
//   orderId: string;
//   items: { name: string; price: number; quantity: number }[];
//   totalAmount: number;
//   status: string;
//   paymentStatus: string;
//   createdAt: string;
// }

// export default function VendorDashboardPage() {
//   const router = useRouter();
//   const { vendorId, shopName, isAuthenticated, logout } = useVendorAuth();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTab, setSelectedTab] = useState<'pending' | 'inprogress' | 'completed'>('pending');
//   const [todayEarnings, setTodayEarnings] = useState(0);
//   const [earningsGrowth, setEarningsGrowth] = useState(0);

//   // Store vendorId in localStorage when dashboard loads
//   useEffect(() => {
//     if (vendorId) {
//       localStorage.setItem('vendorId', vendorId);
//       console.log('✅ Stored vendorId in localStorage:', vendorId);
//     }
//   }, [vendorId]);

//   useEffect(() => {
//     if (!isAuthenticated || !vendorId) {
//       router.push('/vendor/login');
//       return;
//     }
//     fetchOrders();
//     // Auto-refresh every 5 seconds
//     const interval = setInterval(fetchOrders, 5000);
//     return () => clearInterval(interval);
//   }, [isAuthenticated, vendorId]);

//   const fetchOrders = async () => {
//     if (!vendorId) return;

//     try {
//       const response = await fetch(`/api/orders?vendorId=${vendorId}`);
//       const data = await response.json();
//       setOrders(data);
//       calculateEarnings(data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateEarnings = (orders: Order[]) => {
//     const today = new Date().toDateString();
//     const todayOrders = orders.filter(
//       (order) => new Date(order.createdAt).toDateString() === today && order.status !== 'cancelled'
//     );
//     const earnings = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
//     setTodayEarnings(earnings);
//     setEarningsGrowth(12);
//   };

//   const updateOrderStatus = async (orderId: string, newStatus: string) => {
//     try {
//       const response = await fetch('/api/orders/update', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ orderId, status: newStatus }),
//       });

//       if (response.ok) {
//         fetchOrders();
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   };

//   const handleAcceptOrder = (orderId: string) => {
//     updateOrderStatus(orderId, 'preparing');
//   };

//   // const handleDeclineOrder = (orderId: string) => {
//   //   updateOrderStatus(orderId, 'cancelled');
//   // };

//   const handleDeclineOrder = async (orderId: string) => {
//   try {
//     // Step 1: Initiate refund (pulls back from vendor, refunds customer)
//     const res = await fetch('/api/orders/refund', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ orderId }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       alert('Refund failed: ' + data.error);
//       return;
//     }

//     // Step 2: Update order status to cancelled
//     await updateOrderStatus(orderId, 'cancelled');

//     alert(`✅ Order declined. Refund of ₹${data.amount} initiated to customer.`);
//     fetchOrders();

//   } catch (err) {
//     alert('Something went wrong while declining the order.');
//     console.error('Decline error:', err);
//   }
// };

//   const handleMarkReady = (orderId: string) => {
//     updateOrderStatus(orderId, 'completed');
//   };

//   const filteredOrders = orders.filter((order) => {
//     if (selectedTab === 'pending') return order.status === 'pending';
//     if (selectedTab === 'inprogress') return order.status === 'preparing';
//     if (selectedTab === 'completed') return order.status === 'completed';
//     return true;
//   });

//   const pendingCount = orders.filter((o) => o.status === 'pending').length;
//   const inProgressCount = orders.filter((o) => o.status === 'preparing').length;
//   const completedCount = orders.filter((o) => o.status === 'completed').length;

//   if (loading) {
//     return (
//       // <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="flex items-center justify-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
//       </div>
//     );
//   }

//   return (
//     // <div className="min-h-screen bg-gray-50 pb-20">
//     <div className="py-4">
//       {/* ✅ ADDED: Notification Permission Component */}
//       {vendorId && (
//         <NotificationPermission 
//           userType="vendor" 
//           userId={vendorId}
//           onTokenReceived={(token) => {
//             console.log('✅ Vendor FCM token received:', token);
//           }}
//         />
//       )}

//       {/* Header */}
//       <header className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
//                 <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
//                 </svg>
//               </div>
//               <h1 className="text-xl font-bold text-gray-900">{shopName || 'Your Shop'}</h1>
//             </div>
//             <button onClick={() => router.push('/vendor/dashboard/settings')}>
//               <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Earnings Card */}
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-gray-500 text-sm font-medium mb-2">Today's Total Earnings</p>
//               <h2 className="text-4xl font-bold text-gray-900">₹{todayEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
//             </div>
//             <span className="px-3 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
//               LIVE
//             </span>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-0 mb-6 border-b">
//           <button
//             onClick={() => setSelectedTab('pending')}
//             className={`pb-3 px-6 font-semibold transition relative ${
//               selectedTab === 'pending'
//                 ? 'text-orange-600 border-b-2 border-orange-600'
//                 : 'text-gray-500'
//             }`}
//           >
//             Pending
//           </button>
//           <button
//             onClick={() => setSelectedTab('inprogress')}
//             className={`pb-3 px-6 font-semibold transition relative ${
//               selectedTab === 'inprogress'
//                 ? 'text-orange-600 border-b-2 border-orange-600'
//                 : 'text-gray-500'
//             }`}
//           >
//             In Progress
//           </button>
//           <button
//             onClick={() => setSelectedTab('completed')}
//             className={`pb-3 px-6 font-semibold transition relative ${
//               selectedTab === 'completed'
//                 ? 'text-orange-600 border-b-2 border-orange-600'
//                 : 'text-gray-500'
//             }`}
//           >
//             Completed
//           </button>
//         </div>

//         {/* Orders Section Header */}
//         {selectedTab === 'inprogress' && inProgressCount > 0 && (
//           <div className="mb-4">
//             <h3 className="text-lg font-bold text-orange-600 uppercase tracking-wide">
//               In Preparation
//             </h3>
//           </div>
//         )}

//         {/* Orders List */}
//         <div className="space-y-4">
//           {filteredOrders.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
//               <p className="text-gray-500">New orders will appear here</p>
//             </div>
//           ) : (
//             filteredOrders.map((order) => (
//               <OrderCard
//                 key={order.orderId}
//                 order={order}
//                 onAccept={handleAcceptOrder}
//                 onDecline={handleDeclineOrder}
//                 onMarkReady={handleMarkReady}
//                 currentTab={selectedTab}
//               />
//             ))
//           )}
//         </div>
//       </div>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-around py-3">
//             <button className="flex flex-col items-center gap-1 text-orange-600">
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
//               </svg>
//               <span className="text-xs font-semibold">Orders</span>
//             </button>
            
//             <button 
//               onClick={() => router.push('/vendor/dashboard/menu')}
//               className="flex flex-col items-center gap-1 text-gray-500"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//               <span className="text-xs font-medium">Menu</span>
//             </button>

            
//             <button
//               onClick={() => router.push('/vendor/dashboard/inventory')}
//               className="flex flex-col items-center gap-1 text-gray-500"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//               <span className="text-xs font-medium">Stock</span>
//             </button>
            
//             <button 
//               onClick={() => router.push('/vendor/dashboard/insights')}
//               className="flex flex-col items-center gap-1 text-gray-500"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-xs font-medium">Sales</span>
//             </button>
            
//             <button 
//               onClick={() => router.push('/vendor/dashboard/settings')}
//               className="flex flex-col items-center gap-1 text-gray-500"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span className="text-xs font-medium">Setup</span>
//             </button>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// // Order Card Component
// function OrderCard({
//   order,
//   onAccept,
//   onDecline,
//   onMarkReady,
//   currentTab,
// }: {
//   order: Order;
//   onAccept?: (orderId: string) => void;
//   onDecline?: (orderId: string) => void;
//   onMarkReady?: (orderId: string) => void;
//   currentTab: string;
// }) {
//   const getTimeAgo = (date: string) => {
//     const now = new Date().getTime();
//     const orderTime = new Date(date).getTime();
//     const diffMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
//     if (diffMinutes < 1) return 'Just now';
//     if (diffMinutes < 60) return `${diffMinutes} mins ago`;
//     const diffHours = Math.floor(diffMinutes / 60);
//     if (diffHours < 24) return `${diffHours} hours ago`;
//     return `${Math.floor(diffHours / 24)} days ago`;
//   };

//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <p className="text-orange-600 text-sm font-bold uppercase mb-1">
//             {currentTab === 'inprogress' ? 'In Preparation' : currentTab === 'completed' ? 'Completed' : 'New Order'}
//           </p>
//           <h3 className="text-xl font-bold text-gray-900">Order #{order.orderId.slice(-4)}</h3>
//         </div>
//         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           <span className="text-xs font-bold">PAID</span>
//         </div>
//       </div>

//       <div className="space-y-2 mb-4">
//         <p className="text-gray-900 font-medium text-base">
//           {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
//         </p>
//         <div className="flex items-center gap-2 text-gray-500 text-sm">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//           </svg>
//           <span>{getTimeAgo(order.createdAt)}</span>
//         </div>
//       </div>

//       {/* Action Button */}
//       {currentTab === 'pending' && onAccept && onDecline && (
//         <div className="grid grid-cols-2 gap-3">
//           <button
//             onClick={() => onAccept(order.orderId)}
//             className="py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition"
//           >
//             Accept
//           </button>
//           <button
//             onClick={() => onDecline(order.orderId)}
//             className="py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition"
//           >
//             Decline
//           </button>
//         </div>
//       )}

//       {currentTab === 'inprogress' && onMarkReady && (
//         <button
//           onClick={() => onMarkReady(order.orderId)}
//           className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition text-lg"
//         >
//           Ready
//         </button>
//       )}

//       {currentTab === 'completed' && (
//         <div className="text-center py-2 text-sm text-gray-500 font-medium">
//           Completed {getTimeAgo(order.createdAt)}
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useVendorAuth } from '@/lib/vendorAuthStore';
// import NotificationPermission from '@/components/NotificationPermission';

// interface Order {
//   orderId: string;
//   items: { name: string; price: number; quantity: number }[];
//   totalAmount: number;
//   status: string;
//   paymentStatus: string;
//   createdAt: string;
// }

// type Tab = 'pending' | 'inprogress' | 'completed';

// export default function VendorDashboardPage() {
//   const router = useRouter();
//   const { vendorId, shopName, isAuthenticated, logout } = useVendorAuth();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTab, setSelectedTab] = useState<Tab>('pending');
//   const [todayEarnings, setTodayEarnings] = useState(0);
//   const [decliningId, setDecliningId] = useState<string | null>(null);
//   const [acceptingId, setAcceptingId] = useState<string | null>(null);

//   useEffect(() => {
//     if (vendorId) localStorage.setItem('vendorId', vendorId);
//   }, [vendorId]);

//   useEffect(() => {
//     if (!isAuthenticated || !vendorId) { router.push('/vendor/login'); return; }
//     fetchOrders();
//     const interval = setInterval(fetchOrders, 5000);
//     return () => clearInterval(interval);
//   }, [isAuthenticated, vendorId]);

//   const fetchOrders = async () => {
//     if (!vendorId) return;
//     try {
//       const response = await fetch(`/api/orders?vendorId=${vendorId}`);
//       const data = await response.json();
//       setOrders(data);
//       calculateEarnings(data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateEarnings = (orders: Order[]) => {
//     const today = new Date().toDateString();
//     const todayOrders = orders.filter(
//       (o) => new Date(o.createdAt).toDateString() === today && o.status !== 'cancelled'
//     );
//     setTodayEarnings(todayOrders.reduce((sum, o) => sum + o.totalAmount, 0));
//   };

//   const updateOrderStatus = async (orderId: string, newStatus: string) => {
//     try {
//       const response = await fetch('/api/orders/update', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ orderId, status: newStatus }),
//       });
//       if (response.ok) fetchOrders();
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   };

//   const handleAcceptOrder = async (orderId: string) => {
//     setAcceptingId(orderId);
//     await updateOrderStatus(orderId, 'preparing');
//     setAcceptingId(null);
//   };

//   const handleDeclineOrder = async (orderId: string) => {
//     setDecliningId(orderId);
//     try {
//       const res = await fetch('/api/orders/refund', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ orderId }),
//       });
//       const data = await res.json();
//       if (!res.ok) { alert('Refund failed: ' + data.error); return; }
//       await updateOrderStatus(orderId, 'cancelled');
//       alert(`✅ Order declined. Refund of ₹${data.amount} initiated to customer.`);
//       fetchOrders();
//     } catch (err) {
//       alert('Something went wrong while declining the order.');
//       console.error('Decline error:', err);
//     } finally {
//       setDecliningId(null);
//     }
//   };

//   const handleMarkReady = (orderId: string) => updateOrderStatus(orderId, 'completed');

//   const pendingCount    = orders.filter((o) => o.status === 'pending').length;
//   const inProgressCount = orders.filter((o) => o.status === 'preparing').length;
//   const completedCount  = orders.filter((o) => o.status === 'completed').length;

//   const filteredOrders = orders.filter((o) => {
//     if (selectedTab === 'pending')    return o.status === 'pending';
//     if (selectedTab === 'inprogress') return o.status === 'preparing';
//     if (selectedTab === 'completed')  return o.status === 'completed';
//     return true;
//   });

//   const tabs: { key: Tab; label: string; count: number; color: string }[] = [
//     { key: 'pending',    label: 'Pending',     count: pendingCount,    color: 'text-orange-600 bg-orange-100' },
//     { key: 'inprogress', label: 'In Progress', count: inProgressCount, color: 'text-blue-600 bg-blue-100' },
//     { key: 'completed',  label: 'Completed',   count: completedCount,  color: 'text-green-600 bg-green-100' },
//   ];

//   if (loading) {
//     return (
//       <div className="flex flex-col gap-4 p-4 lg:p-6 animate-pulse">
//         <div className="bg-gray-200 rounded-2xl h-32 w-full" />
//         <div className="flex gap-2">
//           {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-200 rounded-xl flex-1" />)}
//         </div>
//         {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-40 w-full" />)}
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 lg:p-6 space-y-5">

//       {vendorId && (
//         <NotificationPermission
//           userType="vendor"
//           userId={vendorId}
//           onTokenReceived={(token) => console.log('✅ Vendor FCM token received:', token)}
//         />
//       )}

//       {/* ── Earnings Card ─────────────────────────────────────── */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg shadow-orange-200">
//         <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
//         <div className="absolute -bottom-8 -right-2 w-24 h-24 bg-white/10 rounded-full" />
//         <div className="relative">
//           <div className="flex items-start justify-between mb-3">
//             <div>
//               <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">Today's Earnings</p>
//               <h2 className="text-3xl font-black text-white tracking-tight">
//                 ₹{todayEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </h2>
//             </div>
//             <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
//               <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
//               <span className="text-white text-xs font-bold">LIVE</span>
//             </div>
//           </div>
//           <div className="flex gap-3 mt-4">
//             {[
//               { label: 'Pending',   value: pendingCount },
//               { label: 'Preparing', value: inProgressCount },
//               { label: 'Done',      value: completedCount },
//             ].map((s) => (
//               <div key={s.label} className="flex-1 bg-white/20 backdrop-blur rounded-xl px-3 py-2 text-center">
//                 <p className="text-white font-black text-lg leading-tight">{s.value}</p>
//                 <p className="text-orange-100 text-xs font-medium">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Tabs ──────────────────────────────────────────────── */}
//       <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setSelectedTab(tab.key)}
//             className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
//               selectedTab === tab.key
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             <span>{tab.label}</span>
//             {tab.count > 0 && (
//               <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
//                 selectedTab === tab.key ? tab.color : 'bg-gray-200 text-gray-600'
//               }`}>
//                 {tab.count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── Orders ────────────────────────────────────────────── */}
//       <div className="space-y-3">
//         {filteredOrders.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16 text-center">
//             <div className="w-16 h-16 bg-orange-50 border-2 border-orange-100 rounded-2xl flex items-center justify-center mb-4">
//               <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//                   d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//             </div>
//             <h3 className="text-base font-bold text-gray-800 mb-1">
//               {selectedTab === 'pending' ? 'No new orders' :
//                selectedTab === 'inprogress' ? 'Nothing in progress' : 'No completed orders'}
//             </h3>
//             <p className="text-sm text-gray-400 max-w-[200px]">
//               {selectedTab === 'pending' ? 'New orders will appear here automatically' :
//                selectedTab === 'inprogress' ? 'Accept orders to see them here' : 'Completed orders will show here'}
//             </p>
//           </div>
//         ) : (
//           filteredOrders.map((order) => (
//             <OrderCard
//               key={order.orderId}
//               order={order}
//               currentTab={selectedTab}
//               onAccept={handleAcceptOrder}
//               onDecline={handleDeclineOrder}
//               onMarkReady={handleMarkReady}
//               isAccepting={acceptingId === order.orderId}
//               isDeclining={decliningId === order.orderId}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// function OrderCard({
//   order, currentTab, onAccept, onDecline, onMarkReady, isAccepting, isDeclining,
// }: {
//   order: Order; currentTab: Tab;
//   onAccept: (id: string) => void;
//   onDecline: (id: string) => void;
//   onMarkReady: (id: string) => void;
//   isAccepting: boolean; isDeclining: boolean;
// }) {
//   const getTimeAgo = (date: string) => {
//     const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
//     if (diff < 1)  return 'Just now';
//     if (diff < 60) return `${diff}m ago`;
//     const h = Math.floor(diff / 60);
//     if (h < 24)    return `${h}h ago`;
//     return `${Math.floor(h / 24)}d ago`;
//   };

//   const isUrgent = currentTab === 'pending' &&
//     (Date.now() - new Date(order.createdAt).getTime()) > 5 * 60 * 1000;

//   return (
//     <div className={`bg-white rounded-2xl shadow-sm border transition-all ${
//       isUrgent ? 'border-orange-200 shadow-orange-100' : 'border-gray-100'
//     }`}>
//       {/* Header */}
//       <div className={`flex items-center justify-between px-4 pt-4 pb-3 border-b ${
//         isUrgent ? 'border-orange-100 bg-orange-50/50 rounded-t-2xl' : 'border-gray-100'
//       }`}>
//         <div className="flex items-center gap-2.5">
//           <div className={`w-2 h-2 rounded-full ${
//             currentTab === 'pending'    ? 'bg-orange-500 animate-pulse' :
//             currentTab === 'inprogress' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
//           }`} />
//           <div>
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
//               {currentTab === 'inprogress' ? 'Preparing' :
//                currentTab === 'completed'  ? 'Completed' : 'New Order'}
//             </p>
//             <h3 className="text-base font-black text-gray-900">#{order.orderId.slice(-6).toUpperCase()}</h3>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {isUrgent && (
//             <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full animate-pulse">
//               Waiting!
//             </span>
//           )}
//           <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
//             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             Paid
//           </span>
//         </div>
//       </div>

//       {/* Items */}
//       <div className="px-4 py-3 space-y-1.5">
//         {order.items.map((item, i) => (
//           <div key={i} className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="w-5 h-5 bg-orange-100 text-orange-600 text-xs font-bold rounded-md flex items-center justify-center flex-shrink-0">
//                 {item.quantity}
//               </span>
//               <span className="text-sm font-medium text-gray-800">{item.name}</span>
//             </div>
//             <span className="text-sm text-gray-500">₹{(item.price * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
//         <div className="flex items-center gap-1.5 text-xs text-gray-400">
//           <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//           </svg>
//           {getTimeAgo(order.createdAt)}
//         </div>
//         <div className="flex items-baseline gap-1">
//           <span className="text-xs text-gray-400">Total</span>
//           <span className="text-base font-black text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Actions */}
//       {currentTab === 'pending' && (
//         <div className="grid grid-cols-2 gap-2.5 p-3">
//           <button
//             onClick={() => onDecline(order.orderId)}
//             disabled={isDeclining || isAccepting}
//             className="py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 text-gray-600 font-bold rounded-xl transition text-sm disabled:opacity-50"
//           >
//             {isDeclining ? (
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//                 Declining...
//               </span>
//             ) : 'Decline'}
//           </button>
//           <button
//             onClick={() => onAccept(order.orderId)}
//             disabled={isAccepting || isDeclining}
//             className="py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition text-sm shadow-sm shadow-orange-200 disabled:opacity-50"
//           >
//             {isAccepting ? (
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
//                 Accepting...
//               </span>
//             ) : 'Accept ✓'}
//           </button>
//         </div>
//       )}

//       {currentTab === 'inprogress' && (
//         <div className="p-3">
//           <button
//             onClick={() => onMarkReady(order.orderId)}
//             className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
//             </svg>
//             Mark as Ready
//           </button>
//         </div>
//       )}

//       {currentTab === 'completed' && (
//         <div className="px-4 py-3 flex items-center justify-center gap-2 text-xs text-green-600 font-semibold">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//           Order completed · {getTimeAgo(order.createdAt)}
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendorAuthStore';
import NotificationPermission from '@/components/NotificationPermission';

interface Order {
  orderId: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

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

  useEffect(() => {
    if (vendorId) localStorage.setItem('vendorId', vendorId);
  }, [vendorId]);

  useEffect(() => {
    if (!isAuthenticated || !vendorId) { router.push('/vendor/login'); return; }
    // ✅ Redirect Xerox vendors away from food orders dashboard
    if (shopType === 'Xerox Shop') { router.replace('/vendor/dashboard/print-jobs'); return; }
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, vendorId, shopType]); // ✅ shopType in deps

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

  const pendingCount    = orders.filter((o) => o.status === 'pending').length;
  const inProgressCount = orders.filter((o) => o.status === 'preparing').length;
  const completedCount  = orders.filter((o) => o.status === 'completed').length;

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

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6 animate-pulse">
        <div className="bg-gray-200 rounded-2xl h-32 w-full" />
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-200 rounded-xl flex-1" />)}
        </div>
        {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-40 w-full" />)}
      </div>
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