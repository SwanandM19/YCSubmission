// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useVendorAuthStore } from '@/lib/vendorAuthStore';

// interface InventoryItem {
//   _id: string;
//   name: string;
//   price: number;
//   category: string;
//   unit: string;
//   stock: number | null;
//   lowStockThreshold: number;
//   available: boolean;
//   isLowStock: boolean;
//   isOutOfStock: boolean;
// }

// export default function InventoryPage() {
//   const router = useRouter();
//   const { vendorId, isAuthenticated } = useVendorAuthStore();
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editStock, setEditStock] = useState('');
//   const [editThreshold, setEditThreshold] = useState('');
//   const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated) { router.push('/vendor/login'); return; }
//     fetchInventory();
//   }, [isAuthenticated]);

//   const fetchInventory = async () => {
//     try {
//       const res = await fetch(`/api/inventory?vendorId=${vendorId}`);
//       const data = await res.json();
//       setInventory(data.inventory || []);
//     } finally { setLoading(false); }
//   };

//   const handleSaveStock = async (itemId: string) => {
//     await fetch('/api/inventory', {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         vendorId,
//         itemId,
//         stock: editStock === '' ? null : Number(editStock),
//         lowStockThreshold: Number(editThreshold),
//       }),
//     });
//     setEditingId(null);
//     fetchInventory();
//   };

//   const handleToggleAvailable = async (item: InventoryItem) => {
//     await fetch('/api/inventory', {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ vendorId, itemId: item._id, available: !item.available }),
//     });
//     fetchInventory();
//   };

//   const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('vendorId', vendorId!);
//     try {
//       const res = await fetch('/api/inventory/bulk-upload', { method: 'POST', body: formData });
//       const data = await res.json();
//       if (res.ok) { alert(`✅ ${data.count} items uploaded!`); fetchInventory(); }
//       else alert(data.error || 'Upload failed');
//     } finally { setUploading(false); }
//   };

//   const filtered = inventory.filter(item => {
//     if (filter === 'low') return item.isLowStock && !item.isOutOfStock;
//     if (filter === 'out') return item.isOutOfStock;
//     return true;
//   });

//   const lowCount = inventory.filter(i => i.isLowStock && !i.isOutOfStock).length;
//   const outCount = inventory.filter(i => i.isOutOfStock).length;

//   if (loading) return (
//     // <div className="min-h-screen flex items-center justify-center">
//     <div className="flex items-center justify-center py-20">
//       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
//     </div>
//   );

//   return (
//     // <div className="min-h-screen bg-gray-50 pb-24">
//     <div className="pb-6">
//       {/* Header */}
//       {/* <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 pt-12 pb-6">
//         <div className="flex items-center gap-3 mb-1">
//           <button onClick={() => router.back()}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <h1 className="text-2xl font-bold">Inventory</h1>
//         </div>
//         <p className="text-orange-100 text-sm">Track and manage stock levels</p>
//       </div> */}
//       <div className="py-4 mb-2">
//     <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
//     <p className="text-sm text-gray-500">Track and manage stock levels</p>
//     </div>

//       {/* Alert Summary */}
//       {(lowCount > 0 || outCount > 0) && (
//         <div className="mx-4 mt-4 space-y-2">
//           {outCount > 0 && (
//             <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
//               <span className="text-red-500 text-lg">🚨</span>
//               <p className="text-red-700 text-sm font-semibold">{outCount} item{outCount > 1 ? 's' : ''} out of stock</p>
//             </div>
//           )}
//           {lowCount > 0 && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2">
//               <span className="text-yellow-500 text-lg">⚠️</span>
//               <p className="text-yellow-700 text-sm font-semibold">{lowCount} item{lowCount > 1 ? 's' : ''} running low</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Excel Upload */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
//         <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bulk Update via Excel</p>
//         <label className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:bg-orange-50 transition ${uploading ? 'opacity-50' : ''}`}>
//           <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//           </svg>
//           <span className="text-sm font-semibold text-orange-600">{uploading ? 'Uploading...' : 'Upload Excel to update stock'}</span>
//           <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} disabled={uploading} />
//         </label>
//         <p className="text-xs text-gray-400 mt-2 text-center">Columns: Name, Price, Category, Stock, Unit, SKU, Low Stock Alert</p>
//       </div>

//       {/* Filter Tabs */}
//       <div className="mx-4 mt-4 flex gap-2">
//         {(['all','low','out'] as const).map(f => (
//           <button key={f} onClick={() => setFilter(f)}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === f ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
//             {f === 'all' ? `All (${inventory.length})` : f === 'low' ? `⚠️ Low (${lowCount})` : `🚨 Out (${outCount})`}
//           </button>
//         ))}
//       </div>

//       {/* Inventory List */}
//       <div className="mx-4 mt-4 space-y-3">
//         {filtered.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">
//             <p className="text-4xl mb-2">📦</p>
//             <p className="font-medium">No items in this filter</p>
//           </div>
//         ) : filtered.map(item => (
//           <div key={item._id} className={`bg-white rounded-2xl p-4 border shadow-sm ${item.isOutOfStock ? 'border-red-200' : item.isLowStock ? 'border-yellow-200' : 'border-gray-100'}`}>
//             <div className="flex items-start justify-between mb-3">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
//                   {item.isOutOfStock && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">OUT</span>}
//                   {item.isLowStock && !item.isOutOfStock && <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-bold">LOW</span>}
//                 </div>
//                 <p className="text-xs text-gray-400 mt-0.5">{item.category} {item.unit ? `· ${item.unit}` : ''}</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-bold text-orange-500">₹{item.price}</span>
//                 <button onClick={() => handleToggleAvailable(item)}
//                   className={`w-10 h-5 rounded-full transition-colors relative ${item.available ? 'bg-orange-500' : 'bg-gray-300'}`}>
//                   <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${item.available ? 'left-5' : 'left-0.5'}`} />
//                 </button>
//               </div>
//             </div>

//             {editingId === item._id ? (
//               <div className="space-y-2">
//                 <div className="flex gap-2">
//                   <div className="flex-1">
//                     <label className="text-xs text-gray-500 mb-1 block">Stock Qty</label>
//                     <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
//                       placeholder="Leave empty = unlimited"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-xs text-gray-500 mb-1 block">Alert when ≤</label>
//                     <input type="number" value={editThreshold} onChange={e => setEditThreshold(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button onClick={() => handleSaveStock(item._id)}
//                     className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition">Save</button>
//                   <button onClick={() => setEditingId(null)}
//                     className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold">Cancel</button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
//                 <div>
//                   <p className="text-xs text-gray-500">Stock</p>
//                   <p className={`text-sm font-bold ${item.isOutOfStock ? 'text-red-500' : item.isLowStock ? 'text-yellow-600' : 'text-gray-900'}`}>
//                     {item.stock === null ? '∞ Unlimited' : `${item.stock} ${item.unit || 'units'}`}
//                   </p>
//                 </div>
//                 <button onClick={() => { setEditingId(item._id); setEditStock(item.stock?.toString() ?? ''); setEditThreshold(item.lowStockThreshold?.toString() ?? '5'); }}
//                   className="text-orange-500 text-sm font-semibold hover:text-orange-600">Edit</button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
  stock: number | null;
  lowStockThreshold: number;
  available: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export default function InventoryPage() {
  const router = useRouter();
  const { vendorId, isAuthenticated } = useVendorAuthStore();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // ✅ NEW

  useEffect(() => {
    if (!isAuthenticated) { router.push('/vendor/login'); return; }
    fetchInventory();
  }, [isAuthenticated]);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`/api/inventory?vendorId=${vendorId}`);
      const data = await res.json();
      setInventory(data.inventory || []);
    } finally { setLoading(false); }
  };

  const handleSaveStock = async (itemId: string) => {
    await fetch('/api/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorId,
        itemId,
        stock: editStock === '' ? null : Number(editStock),
        lowStockThreshold: Number(editThreshold),
      }),
    });
    setEditingId(null);
    fetchInventory();
  };

  const handleToggleAvailable = async (item: InventoryItem) => {
    await fetch('/api/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId, itemId: item._id, available: !item.available }),
    });
    fetchInventory();
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendorId', vendorId!);
    try {
      const res = await fetch('/api/inventory/bulk-upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) { alert(`✅ ${data.count} items uploaded!`); fetchInventory(); }
      else alert(data.error || 'Upload failed');
    } finally { setUploading(false); }
  };

  const lowCount = inventory.filter(i => i.isLowStock && !i.isOutOfStock).length;
  const outCount = inventory.filter(i => i.isOutOfStock).length;

  // ✅ Filter by tab first, then by search query
  const filtered = inventory
    .filter(item => {
      if (filter === 'low') return item.isLowStock && !item.isOutOfStock;
      if (filter === 'out') return item.isOutOfStock;
      return true;
    })
    .filter(item => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.unit?.toLowerCase().includes(q)
      );
    });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
    </div>
  );

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="py-4 mb-2 px-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-sm text-gray-500">Track and manage stock levels</p>
      </div>

      {/* Alert Summary */}
      {(lowCount > 0 || outCount > 0) && (
        <div className="mx-4 mt-2 space-y-2">
          {outCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-red-500 text-lg">🚨</span>
              <p className="text-red-700 text-sm font-semibold">{outCount} item{outCount > 1 ? 's' : ''} out of stock</p>
            </div>
          )}
          {lowCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-yellow-500 text-lg">⚠️</span>
              <p className="text-yellow-700 text-sm font-semibold">{lowCount} item{lowCount > 1 ? 's' : ''} running low</p>
            </div>
          )}
        </div>
      )}

      {/* Excel Upload */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bulk Update via Excel</p>
        <label className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-orange-300 rounded-xl cursor-pointer hover:bg-orange-50 transition ${uploading ? 'opacity-50' : ''}`}>
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm font-semibold text-orange-600">{uploading ? 'Uploading...' : 'Upload Excel to update stock'}</span>
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} disabled={uploading} />
        </label>
        <p className="text-xs text-gray-400 mt-2 text-center">Columns: Name, Price, Category, Stock, Unit, SKU, Low Stock Alert</p>
      </div>

      {/* ✅ Search Bar */}
      <div className="mx-4 mt-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, category or unit..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mx-4 mt-3 flex gap-2">
        {(['all', 'low', 'out'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === f ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>
            {f === 'all' ? `All (${inventory.length})` : f === 'low' ? `⚠️ Low (${lowCount})` : `🚨 Out (${outCount})`}
          </button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="mx-4 mt-4 space-y-3">
        {/* ✅ No search results state */}
        {filtered.length === 0 && searchQuery ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-1">No results for "{searchQuery}"</h3>
            <p className="text-xs text-gray-400 mb-3">Try a different name, category or unit</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition"
            >
              Clear search
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="font-medium">No items in this filter</p>
          </div>
        ) : filtered.map(item => (
          <div key={item._id} className={`bg-white rounded-2xl p-4 border shadow-sm ${item.isOutOfStock ? 'border-red-200' : item.isLowStock ? 'border-yellow-200' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  {/* ✅ Highlight matching text */}
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  {item.isOutOfStock && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">OUT</span>}
                  {item.isLowStock && !item.isOutOfStock && <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-bold">LOW</span>}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.category} {item.unit ? `· ${item.unit}` : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-orange-500">₹{item.price}</span>
                <button onClick={() => handleToggleAvailable(item)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${item.available ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${item.available ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {editingId === item._id ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Stock Qty</label>
                    <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                      placeholder="Leave empty = unlimited"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Alert when ≤</label>
                    <input type="number" value={editThreshold} onChange={e => setEditThreshold(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveStock(item._id)}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition">Save</button>
                  <button onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                <div>
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className={`text-sm font-bold ${item.isOutOfStock ? 'text-red-500' : item.isLowStock ? 'text-yellow-600' : 'text-gray-900'}`}>
                    {item.stock === null ? '∞ Unlimited' : `${item.stock} ${item.unit || 'units'}`}
                  </p>
                </div>
                <button onClick={() => { setEditingId(item._id); setEditStock(item.stock?.toString() ?? ''); setEditThreshold(item.lowStockThreshold?.toString() ?? '5'); }}
                  className="text-orange-500 text-sm font-semibold hover:text-orange-600">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}