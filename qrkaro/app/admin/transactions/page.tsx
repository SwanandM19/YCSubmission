// 'use client';

// import { useEffect, useState } from 'react';

// export default function TransactionsPage() {
//   const [transactions, setTransactions] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [dateRange, setDateRange] = useState('today');

//   useEffect(() => {
//     fetchTransactions();
//   }, [filter, dateRange]);

//   const fetchTransactions = async () => {
//     try {
//       const res = await fetch(`/api/admin/transactions?filter=${filter}&range=${dateRange}`);
//       const data = await res.json();
//       setTransactions(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
//         <p className="text-gray-600 mt-1">Monitor all payments and payouts across the platform</p>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-green-100 rounded-xl">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-900">₹45,230</p>
//           <p className="text-sm text-gray-600 mt-1">Total Collected</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-900">₹42,968</p>
//           <p className="text-sm text-gray-600 mt-1">Paid to Vendors</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-orange-100 rounded-xl">
//               <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-900">₹2,262</p>
//           <p className="text-sm text-gray-600 mt-1">Platform Earnings</p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-purple-100 rounded-xl">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//           </div>
//           <p className="text-2xl font-bold text-gray-900">342</p>
//           <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700">Filter:</span>
//             <button
//               onClick={() => setFilter('all')}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                 filter === 'all'
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilter('payments')}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                 filter === 'payments'
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               Payments
//             </button>
//             <button
//               onClick={() => setFilter('payouts')}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//                 filter === 'payouts'
//                   ? 'bg-orange-500 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               Payouts
//             </button>
//           </div>

//           <div className="flex items-center gap-2 ml-auto">
//             <span className="text-sm font-medium text-gray-700">Date:</span>
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//             >
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="all">All Time</option>
//             </select>
//           </div>

//           <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
//             📥 Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Transactions Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Transaction ID
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Type
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Vendor
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Amount
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
//                 Date & Time
//               </th>
//               <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {transactions.map((txn: any) => (
//               <tr key={txn.id} className="hover:bg-gray-50 transition">
//                 <td className="px-6 py-4">
//                   <span className="font-mono text-sm text-gray-900">{txn.id}</span>
//                 </td>
//                 <td className="px-6 py-4">
//                   {txn.type === 'payment' ? (
//                     <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//                       ↓ Payment
//                     </span>
//                   ) : (
//                     <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                       ↑ Payout
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div>
//                     <p className="font-medium text-gray-900">{txn.vendorName}</p>
//                     <p className="text-xs text-gray-500">{txn.vendorId}</p>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className="font-semibold text-gray-900">₹{txn.amount.toLocaleString()}</span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//                     ✓ Success
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-600">
//                   {new Date(txn.createdAt).toLocaleString()}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="View Details">
//                     <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface Transaction {
  id: string;
  type: 'payment' | 'payout';
  orderId: string;
  vendorId: string;
  vendorName: string;
  vendorPhone: string;
  vendorCity: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  platformFee: number;
  vendorAmount: number;
  status: string;
  payoutStatus: string;
  paymentId: string;
  payoutId: string;
  items: { name: string; price: number; quantity: number }[];
  createdAt: string;
}

interface Stats {
  totalCollected: number;
  totalPlatformFee: number;
  totalPaidToVendors: number;
  totalTransactions: number;
  totalPayouts: number;
  pendingPayouts: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function TxnDetailModal({ txn, onClose }: { txn: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className={`p-5 rounded-t-2xl ${txn.type === 'payment' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">{txn.type === 'payment' ? '↓ Incoming Payment' : '↑ Vendor Payout'}</p>
              <p className="text-2xl font-bold mt-1">₹{txn.amount.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition">
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* IDs */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <Row label="Transaction ID" value={txn.id} mono />
            <Row label="Order ID" value={txn.orderId} mono />
            {txn.paymentId && <Row label="Payment ID" value={txn.paymentId} mono />}
            {txn.payoutId && <Row label="Payout ID" value={txn.payoutId} mono />}
          </div>

          {/* Vendor */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vendor</p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-1.5">
              <Row label="Shop Name" value={txn.vendorName} />
              <Row label="Vendor ID" value={txn.vendorId} mono />
              <Row label="Phone" value={txn.vendorPhone || 'N/A'} />
              <Row label="City" value={txn.vendorCity || 'N/A'} />
            </div>
          </div>

          {/* Customer */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1.5">
              <Row label="Name" value={txn.customerName || 'N/A'} />
              <Row label="Phone" value={txn.customerPhone || 'N/A'} />
            </div>
          </div>

          {/* Money Split */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Money Split</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Collected</span>
                <span className="font-bold text-gray-900">₹{(txn.type === 'payment' ? txn.amount : txn.amount + txn.platformFee).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-600">→ Vendor (95%)</span>
                <span className="font-semibold text-green-700">₹{txn.vendorAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-orange-600">→ Platform (5%)</span>
                <span className="font-semibold text-orange-600">₹{txn.platformFee.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          {txn.items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Order Items ({txn.items.length})
              </p>
              <div className="space-y-1.5">
                {txn.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status & Time */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Status</span>
              <StatusBadge status={txn.status} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payout Status</span>
              <PayoutBadge status={txn.payoutStatus} />
            </div>
            <Row label="Date & Time" value={new Date(txn.createdAt).toLocaleString('en-IN')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-xs font-medium text-gray-900 text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>
      {status === 'paid' ? '✓ ' : ''}{status}
    </span>
  );
}

function PayoutBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    processing: 'bg-blue-100 text-blue-800',
    processed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || 'bg-gray-100 text-gray-700'}`}>
      {status || 'pending'}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Filters
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const searchRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchTransactions = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        filter,
        range: dateRange,
        search,
        page: String(p),
        limit: '20',
      });
      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, dateRange, search]);

  useEffect(() => {
    setPage(1);
    fetchTransactions(1);
  }, [filter, dateRange]);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(1);
      fetchTransactions(1);
    }, 400);
  }, [search]);

  // ✅ Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchTransactions(page), 15000);
    return () => clearInterval(interval);
  }, [fetchTransactions, page]);

  // ── Export CSV ───────────────────────────────────────────────────────────
  const exportCSV = async () => {
    try {
      // Fetch all (no pagination limit)
      const params = new URLSearchParams({ filter, range: dateRange, search, page: '1', limit: '9999' });
      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      const rows: Transaction[] = data.transactions || [];

      const headers = [
        'Transaction ID', 'Type', 'Order ID', 'Vendor Name', 'Vendor ID',
        'Vendor City', 'Customer Name', 'Customer Phone',
        'Amount (₹)', 'Platform Fee (₹)', 'Vendor Amount (₹)',
        'Payment Status', 'Payout Status', 'Payment ID', 'Payout ID', 'Date & Time',
      ];

      const csvRows = rows.map((t) => [
        t.id,
        t.type,
        t.orderId,
        `"${t.vendorName}"`,
        t.vendorId,
        t.vendorCity,
        `"${t.customerName}"`,
        t.customerPhone,
        t.amount,
        t.platformFee,
        t.vendorAmount,
        t.status,
        t.payoutStatus,
        t.paymentId,
        t.payoutId,
        new Date(t.createdAt).toLocaleString('en-IN'),
      ]);

      const csv = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nosher-transactions-${dateRange}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            Live — refreshes every 15s
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
            <span className="text-xs text-gray-400">
              Last: {lastRefresh.toLocaleTimeString('en-IN')}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fetchTransactions(page)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            🔄 Refresh
          </button>
          <button onClick={exportCSV}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition shadow-sm">
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* ── Real Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {stats && [
          { label: 'Total Collected', value: `₹${stats.totalCollected.toLocaleString('en-IN')}`, icon: '💰', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: 'Paid to Vendors (95%)', value: `₹${stats.totalPaidToVendors.toLocaleString('en-IN')}`, icon: '🏪', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Platform Earnings (5%)', value: `₹${stats.totalPlatformFee.toLocaleString('en-IN')}`, icon: '🏦', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
          { label: 'Total Orders', value: String(stats.totalTransactions), icon: '📦', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
          { label: 'Payouts Sent', value: String(stats.totalPayouts), icon: '✅', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
          { label: 'Pending Payouts', value: String(stats.pendingPayouts), icon: '⏳', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.bg}`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.icon} {s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">

        {/* Type filter */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {['all', 'payments', 'payouts'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
                filter === f ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {f === 'all' ? '⚡ All' : f === 'payments' ? '↓ Payments' : '↑ Payouts'}
            </button>
          ))}
        </div>

        {/* Date range */}
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none bg-white">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, vendor, customer..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>

        {pagination && (
          <span className="text-xs text-gray-500 ml-auto">
            {pagination.total} results
          </span>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />
            <p className="text-gray-500 text-sm mt-3">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-gray-500">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">Try changing the date range or filter</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Transaction ID', 'Type', 'Vendor', 'Customer', 'Amount', 'Split', 'Status', 'Date', 'Action'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((txn) => (
                    <tr key={`${txn.id}-${txn.type}`} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-700">{txn.id.slice(0, 14)}...</span>
                      </td>
                      <td className="px-4 py-3">
                        {txn.type === 'payment' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">↓ Payment</span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">↑ Payout</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{txn.vendorName}</p>
                        <p className="text-xs text-gray-400 font-mono">{txn.vendorId.slice(0, 16)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{txn.customerName}</p>
                        <p className="text-xs text-gray-400">{txn.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900">₹{txn.amount.toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-green-600">Vendor: ₹{txn.vendorAmount}</p>
                        <p className="text-xs text-orange-500">Platform: ₹{txn.platformFee}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={txn.status} />
                        <div className="mt-1">
                          <PayoutBadge status={txn.payoutStatus} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString('en-IN')}
                        <br />
                        {new Date(txn.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedTxn(txn)}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium rounded-lg transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {transactions.map((txn) => (
                <div key={`${txn.id}-${txn.type}`} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {txn.type === 'payment' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">↓ Payment</span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">↑ Payout</span>
                      )}
                      <span className="font-bold text-gray-900">₹{txn.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => setSelectedTxn(txn)}
                      className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg">
                      View
                    </button>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{txn.vendorName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {txn.customerName} · {new Date(txn.createdAt).toLocaleString('en-IN')}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={txn.status} />
                    <PayoutBadge status={txn.payoutStatus} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => { setPage(page - 1); fetchTransactions(page - 1); }}
            disabled={page === 1}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition">
            ← Prev
          </button>
          <span className="text-sm text-gray-600 px-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button onClick={() => { setPage(page + 1); fetchTransactions(page + 1); }}
            disabled={page === pagination.totalPages}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition">
            Next →
          </button>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      {selectedTxn && (
        <TxnDetailModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}
    </div>
  );
}
