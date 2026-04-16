// 'use client';

// import { useEffect, useState } from 'react';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalVendors: 0,
//     activeVendors: 0,
//     todayOrders: 0,
//     monthlyRevenue: 0,
//     platformEarnings: 0,
//     totalPayouts: 0,
//   });

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('/api/admin/stats');
//       const data = await res.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600 mt-1">Overview of your platform performance</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Total Vendors */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//               </svg>
//             </div>
//             <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">+12%</span>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
//           <p className="text-sm text-gray-600 mt-1">Total Vendors</p>
//         </div>

//         {/* Active Vendors */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-green-100 rounded-xl">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">-5%</span>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{stats.activeVendors}</p>
//           <p className="text-sm text-gray-600 mt-1">Active Vendors</p>
//         </div>

//         {/* Today's Orders */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-purple-100 rounded-xl">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//               </svg>
//             </div>
//             <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">+8%</span>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
//           <p className="text-sm text-gray-600 mt-1">Today's Orders</p>
//         </div>

//         {/* Monthly Revenue */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-orange-100 rounded-xl">
//               <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">+15%</span>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
//           <p className="text-sm text-gray-600 mt-1">Monthly Revenue</p>
//         </div>
//       </div>

//       {/* Platform Earnings & Payouts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-orange-100 text-sm font-medium mb-2">Platform Earnings (5%)</p>
//               <p className="text-4xl font-bold">₹{stats.platformEarnings.toLocaleString()}</p>
//             </div>
//             <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
//               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-orange-100 text-sm">Your commission from all orders</p>
//         </div>

//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-blue-100 text-sm font-medium mb-2">Total Payouts (95%)</p>
//               <p className="text-4xl font-bold">₹{stats.totalPayouts.toLocaleString()}</p>
//             </div>
//             <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
//               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-blue-100 text-sm">Sent to vendors successfully</p>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
//           <button className="text-orange-600 text-sm font-medium hover:text-orange-700">View All →</button>
//         </div>
//         <div className="space-y-4">
//           <ActivityItem
//             icon="🆕"
//             title="New vendor onboarded: Cafe Mocha"
//             time="2 minutes ago"
//             color="green"
//           />
//           <ActivityItem
//             icon="💸"
//             title="Payout completed: ₹5,240 to Raj Food Plaza"
//             time="15 minutes ago"
//             color="blue"
//           />
//           <ActivityItem
//             icon="📦"
//             title="45 new orders received"
//             time="1 hour ago"
//             color="purple"
//           />
//           <ActivityItem
//             icon="⚠️"
//             title="Vendor Tech World suspended"
//             time="3 hours ago"
//             color="red"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActivityItem({ 
//   icon, 
//   title, 
//   time, 
//   color 
// }: { 
//   icon: React.ReactNode; 
//   title: string; 
//   time: string; 
//   color: 'green' | 'blue' | 'purple' | 'red' 
// }) {
//   const colors = {
//     green: 'bg-green-100 text-green-800',
//     blue: 'bg-blue-100 text-blue-800',
//     purple: 'bg-purple-100 text-purple-800',
//     red: 'bg-red-100 text-red-800',
//   };

//   return (
//     <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition">
//       <div className={`p-3 ${colors[color]} rounded-xl text-2xl`}>{icon}</div>
//       <div className="flex-1">
//         <p className="text-sm font-medium text-gray-900">{title}</p>
//         <p className="text-xs text-gray-500 mt-1">{time}</p>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useCallback } from 'react';

interface DashboardStats {
  totalVendors: number;
  activeVendors: number;
  todayOrders: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  lastMonthRevenue: number;
  totalRevenue: number;
  platformEarnings: number;
  monthlyPlatformEarnings: number;
  totalPayouts: number;
  subscriptionRevenue: number;
  avgOrderValue: number;
  newVendorsThisMonth: number;
  revenueGrowth: number;
  orderGrowth: number;
  vendorGrowth: number;
  last7DaysData: { date: string; orders: number; revenue: number }[];
  last30DaysData: { date: string; orders: number; revenue: number }[];
  topVendors: { vendorId: string; shopName: string; shopType: string; revenue: number; orders: number }[];
  orderStatusBreakdown: { _id: string; count: number }[];
  shopTypeBreakdown: { _id: string; count: number }[];
}

// ── Pure CSS Mini Bar Chart ───────────────────────────────────────────────────
function BarChart({ data, valueKey, labelKey, color = 'bg-orange-500' }: {
  data: any[];
  valueKey: string;
  labelKey: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-1 h-32 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
          <div
            className={`w-full rounded-t-sm ${color} opacity-80 hover:opacity-100 transition-all`}
            style={{ height: `${Math.max((d[valueKey] / max) * 100, 4)}%` }}
            title={`${d[labelKey]}: ${d[valueKey]}`}
          />
          {data.length <= 10 && (
            <span className="text-[9px] text-gray-400 truncate w-full text-center">
              {d[labelKey]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Pure CSS Donut Chart ──────────────────────────────────────────────────────
function DonutChart({ data, colors }: {
  data: { label: string; value: number }[];
  colors: string[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-gray-400 text-sm text-center py-8">No data</p>;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = (d.value / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, color: colors[i % colors.length] };
  });

  // Build conic-gradient
  const gradient = segments
    .map((s) => `${s.color} ${s.start.toFixed(1)}% ${(s.start + s.pct).toFixed(1)}%`)
    .join(', ');

  return (
    <div className="flex items-center gap-6">
      {/* <div
        className="w-28 h-28 rounded-full flex-shrink-0"
        style={{ background: `conic-gradient(${gradient})` }}
      > */}
      <div
        className="w-28 h-28 rounded-full flex-shrink-0 relative"  // ← add relative
        style={{ background: `conic-gradient(${gradient})` }}
      >
        {/* <div className="w-full h-full rounded-full flex items-center justify-center"
          style={{ margin: '14px', width: 'calc(100% - 28px)', height: 'calc(100% - 28px)', background: 'white' }}> */}
        <div className="absolute inset-[14px] rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-xs text-gray-600 capitalize">{s.label}</span>
            </div>
            <span className="text-xs font-semibold text-gray-800">{s.value} ({s.pct.toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Growth Badge ──────────────────────────────────────────────────────────────
function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
      isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
    }`}>
      {isPositive ? '↑' : '↓'} {Math.abs(value)}%
    </span>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, icon, color, growth }: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color: string;
  growth?: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-lg`}>
          {icon}
        </div>
        {growth !== undefined && <GrowthBadge value={growth} />}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [chartView, setChartView] = useState<'7d' | '30d'>('7d');
  const [revenueOrOrders, setRevenueOrOrders] = useState<'revenue' | 'orders'>('revenue');

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // ✅ Auto-refresh every 30 seconds for real-time feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-56" />
          ))}
        </div>
      </div>
    );
  }

  const chartData = chartView === '7d' ? stats.last7DaysData : stats.last30DaysData;

  const orderStatusColors: Record<string, string> = {
    pending: '#f97316',
    completed: '#22c55e',
    cancelled: '#ef4444',
    preparing: '#3b82f6',
    ready: '#8b5cf6',
  };

  const donutStatusData = stats.orderStatusBreakdown.map((s) => ({
    label: s._id,
    value: s.count,
  }));
  const donutStatusColors = stats.orderStatusBreakdown.map(
    (s) => orderStatusColors[s._id] || '#94a3b8'
  );

  const shopTypeColors = ['#f97316', '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];
  const donutShopData = stats.shopTypeBreakdown.map((s) => ({
    label: s._id,
    value: s.count,
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nosher Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Last updated: {lastRefresh.toLocaleTimeString('en-IN')}
            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── KPI Cards Row 1 — Revenue ───────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">💰 Revenue</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`}
            icon="📅"
            color="bg-blue-100"
          />
          <KPICard
            label="Monthly Revenue"
            value={`₹${(stats.monthlyRevenue / 1000).toFixed(1)}K`}
            sub={`Last month: ₹${(stats.lastMonthRevenue / 1000).toFixed(1)}K`}
            icon="📈"
            color="bg-green-100"
            growth={stats.revenueGrowth}
          />
          <KPICard
            label="Platform Earnings (5%)"
            value={`₹${stats.monthlyPlatformEarnings.toLocaleString('en-IN')}`}
            sub={`All time: ₹${stats.platformEarnings.toLocaleString('en-IN')}`}
            icon="🏦"
            color="bg-orange-100"
          />
          <KPICard
            label="Subscription Revenue"
            value={`₹${stats.subscriptionRevenue.toLocaleString('en-IN')}`}
            sub={`${stats.activeVendors} paid vendors × ₹200`}
            icon="💳"
            color="bg-purple-100"
          />
        </div>
      </div>

      {/* ── KPI Cards Row 2 — Orders & Vendors ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Today's Orders"
          value={String(stats.todayOrders)}
          icon="🛒"
          color="bg-yellow-100"
        />
        <KPICard
          label="Monthly Orders"
          value={String(stats.totalOrders)}
          sub={`↑ ${stats.orderGrowth}% vs last month`}
          icon="📦"
          color="bg-pink-100"
          growth={stats.orderGrowth}
        />
        <KPICard
          label="Avg Order Value"
          value={`₹${stats.avgOrderValue}`}
          icon="🎯"
          color="bg-teal-100"
        />
        <KPICard
          label="Pending Orders"
          value={String(stats.pendingOrders)}
          sub={`${stats.completedOrders} completed`}
          icon="⏳"
          color="bg-red-100"
        />
      </div>

      {/* ── KPI Cards Row 3 — Vendors ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Vendors"
          value={String(stats.totalVendors)}
          icon="🏪"
          color="bg-indigo-100"
          growth={stats.vendorGrowth}
        />
        <KPICard
          label="Active Vendors"
          value={String(stats.activeVendors)}
          sub={`${stats.totalVendors - stats.activeVendors} inactive`}
          icon="✅"
          color="bg-green-100"
        />
        <KPICard
          label="New This Month"
          value={String(stats.newVendorsThisMonth)}
          icon="🆕"
          color="bg-cyan-100"
          growth={stats.vendorGrowth}
        />
        <KPICard
          label="Total Payouts"
          value={`₹${(stats.totalPayouts / 1000).toFixed(1)}K`}
          sub="95% to vendors"
          icon="💸"
          color="bg-lime-100"
        />
      </div>

      {/* ── Revenue / Orders Trend Chart ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-gray-900">Trend Analysis</h3>
            <p className="text-xs text-gray-500 mt-0.5">Daily performance over time</p>
          </div>
          <div className="flex gap-2">
            {/* Revenue / Orders Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setRevenueOrOrders('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  revenueOrOrders === 'revenue'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setRevenueOrOrders('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  revenueOrOrders === 'orders'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Orders
              </button>
            </div>
            {/* 7d / 30d Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setChartView('7d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  chartView === '7d'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartView('30d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  chartView === '30d'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            {
              label: 'Total',
              value: revenueOrOrders === 'revenue'
                ? `₹${chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString('en-IN')}`
                : chartData.reduce((s, d) => s + d.orders, 0),
            },
            {
              label: 'Daily Avg',
              value: revenueOrOrders === 'revenue'
                ? `₹${Math.round(chartData.reduce((s, d) => s + d.revenue, 0) / chartData.length).toLocaleString('en-IN')}`
                : Math.round(chartData.reduce((s, d) => s + d.orders, 0) / chartData.length),
            },
            {
              label: 'Peak Day',
              value: revenueOrOrders === 'revenue'
                ? `₹${Math.max(...chartData.map((d) => d.revenue)).toLocaleString('en-IN')}`
                : Math.max(...chartData.map((d) => d.orders)),
            },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-900 text-sm">{s.value}</p>
            </div>
          ))}
        </div>

        <BarChart
          data={chartData}
          valueKey={revenueOrOrders}
          labelKey="date"
          color={revenueOrOrders === 'revenue' ? 'bg-orange-500' : 'bg-blue-500'}
        />
      </div>

      {/* ── Bottom Charts Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Order Status Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1">Order Status</h3>
          <p className="text-xs text-gray-500 mb-4">Breakdown of all orders</p>
          <DonutChart data={donutStatusData} colors={donutStatusColors} />
        </div>

        {/* Shop Type Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1">Vendor Types</h3>
          <p className="text-xs text-gray-500 mb-4">Distribution by shop category</p>
          <DonutChart data={donutShopData} colors={shopTypeColors} />
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1">Platform Health</h3>
          <p className="text-xs text-gray-500 mb-4">Key ratios at a glance</p>
          <div className="space-y-4">
            {[
              {
                label: 'Vendor Activation Rate',
                value: stats.totalVendors > 0
                  ? Math.round((stats.activeVendors / stats.totalVendors) * 100)
                  : 0,
                color: 'bg-green-500',
              },
              {
                label: 'Order Completion Rate',
                value: stats.totalOrders > 0
                  ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                  : 0,
                color: 'bg-blue-500',
              },
              {
                label: 'Revenue vs Target (₹1L)',
                value: Math.min(Math.round((stats.monthlyRevenue / 100000) * 100), 100),
                color: 'bg-orange-500',
              },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{metric.label}</span>
                  <span className="font-semibold text-gray-900">{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${metric.color} transition-all duration-700`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Vendors Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">Top Performing Vendors</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ranked by total revenue</p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-700 font-medium px-2 py-1 rounded-full">
            Top 5
          </span>
        </div>

        {stats.topVendors.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {stats.topVendors.map((v, i) => {
              const maxRevenue = stats.topVendors[0]?.revenue || 1;
              const pct = Math.round((v.revenue / maxRevenue) * 100);
              return (
                <div key={v.vendorId} className="flex items-center gap-4">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-400 text-yellow-900'
                    : i === 1 ? 'bg-gray-300 text-gray-700'
                    : i === 2 ? 'bg-orange-300 text-orange-800'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {v.shopName || v.vendorId}
                      </p>
                      <span className="text-sm font-bold text-orange-600 ml-2 flex-shrink-0">
                        ₹{v.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-orange-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {v.orders} orders
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
