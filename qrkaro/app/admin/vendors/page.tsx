// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// interface Vendor {
//   vendorId: string;
//   shopName: string;
//   phone: string;
//   shopType: string;
//   city: string;
//   state: string;
//   menuItems: { name: string; price: number }[];
//   razorpayKeyId?: string;
//   razorpayKeySecret?: string;
//   createdAt: string;
// }

// export default function VendorsPage() {
//   const router = useRouter();
//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [filterCity, setFilterCity] = useState('all');
//   const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
//   const [saving, setSaving] = useState(false);

//   const filteredVendors = vendors.filter((vendor: any) => {
//     const matchesSearch =
//       vendor.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       vendor.vendorId?.toString().includes(searchTerm);

//     const matchesType = filterType === 'all' || vendor.shopType === filterType;
//     const matchesCity = filterCity === 'all' || vendor.city === filterCity;

//     return matchesSearch && matchesType && matchesCity;
//   });

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const fetchVendors = async () => {
//     try {
//       const res = await fetch('/api/admin/vendors');
//       const data = await res.json();
//       setVendors(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleEdit = (vendor: Vendor) => {
//     setEditingVendor({ ...vendor });
//   };

//   const handleSave = async () => {
//     if (!editingVendor) return;

//     try {
//       setSaving(true);
//       const response = await fetch('/api/admin/update-vendor', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editingVendor),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update vendor');
//       }

//       alert('Vendor updated successfully!');
//       setEditingVendor(null);
//       fetchVendors();
//     } catch (error: any) {
//       console.error('Error updating vendor:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const updateEditingVendor = (field: string, value: any) => {
//     if (!editingVendor) return;
//     setEditingVendor({ ...editingVendor, [field]: value });
//   };

//   const updateMenuItem = (index: number, field: 'name' | 'price', value: any) => {
//     if (!editingVendor) return;
//     const newMenuItems = [...editingVendor.menuItems];
//     newMenuItems[index] = { ...newMenuItems[index], [field]: value };
//     setEditingVendor({ ...editingVendor, menuItems: newMenuItems });
//   };

//   const addMenuItem = () => {
//     if (!editingVendor) return;
//     setEditingVendor({
//       ...editingVendor,
//       menuItems: [...editingVendor.menuItems, { name: '', price: 0 }],
//     });
//   };

//   const deleteMenuItem = (index: number) => {
//     if (!editingVendor) return;
//     const newMenuItems = editingVendor.menuItems.filter((_, i) => i !== index);
//     setEditingVendor({ ...editingVendor, menuItems: newMenuItems });
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
//           <p className="text-gray-600 mt-1">Manage and monitor all registered vendors</p>
//         </div>
//         <Link
//           href="/onboard"
//           className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
//         >
//           + Add New Vendor
//         </Link>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <input
//             type="text"
//             placeholder="Search by name or ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//           />
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
//           >
//             <option value="all">All Types</option>
//             <option value="Restaurant">Restaurant</option>
//             <option value="Cafe">Cafe</option>
//             <option value="Stall">Stall</option>
//             <option value="Xerox">Xerox</option>
//             <option value="Grocery">Grocery</option>
//             <option value="Retail">Retail</option>
//             <option value="Other">Other</option>
//           </select>
//           <select
//             value={filterCity}
//             onChange={(e) => setFilterCity(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
//           >
//             <option value="all">All Cities</option>
//             <option value="Mumbai">Mumbai</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Pune">Pune</option>
//             <option value="Bangalore">Bangalore</option>
//           </select>
//           <div className="px-6 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl flex items-center justify-center">
//             <span className="text-orange-800 font-bold text-lg">
//               Total: {filteredVendors.length} vendors
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Vendors Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 border-b border-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Vendor ID
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Shop Name
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Type
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 City
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Created
//               </th>
//               <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredVendors.map((vendor: any) => (
//               <tr key={vendor.vendorId} className="hover:bg-gray-50 transition">
//                 <td className="px-6 py-4">
//                   <span className="font-mono text-sm text-gray-900">#{vendor.vendorId}</span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div>
//                     <p className="font-medium text-gray-900">{vendor.shopName}</p>
//                     <p className="text-sm text-gray-500">{vendor.phone}</p>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                     {vendor.shopType}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-600">{vendor.city}</td>
//                 <td className="px-6 py-4">
//                   <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//                     ● Active
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-600">
//                   {new Date(vendor.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   <button
//                     onClick={() => handleEdit(vendor)}
//                     className="p-2 hover:bg-blue-50 rounded-lg transition"
//                     title="Edit"
//                   >
//                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     </svg>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {filteredVendors.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500">No vendors found</p>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {editingVendor && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold">Edit Vendor Details</h2>
//                 <button
//                   onClick={() => setEditingVendor(null)}
//                   className="p-2 hover:bg-white/20 rounded-lg transition"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <p className="text-white/90 text-sm mt-1">Vendor ID: {editingVendor.vendorId}</p>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Shop Details */}
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
//                   </svg>
//                   Shop Details
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
//                     <input
//                       type="text"
//                       value={editingVendor.shopName}
//                       onChange={(e) => updateEditingVendor('shopName', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                     <input
//                       type="tel"
//                       value={editingVendor.phone}
//                       onChange={(e) => updateEditingVendor('phone', e.target.value)}
//                       maxLength={10}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Shop Type</label>
//                     <select
//                       value={editingVendor.shopType}
//                       onChange={(e) => updateEditingVendor('shopType', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                     >
//                       <option value="Restaurant">Restaurant</option>
//                       <option value="Cafe">Cafe</option>
//                       <option value="Stall">Stall</option>
//                       <option value="Xerox">Xerox</option>
//                       <option value="Grocery">Grocery</option>
//                       <option value="Retail">Retail</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                     <input
//                       type="text"
//                       value={editingVendor.city}
//                       onChange={(e) => updateEditingVendor('city', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
//                     <input
//                       type="text"
//                       value={editingVendor.state}
//                       onChange={(e) => updateEditingVendor('state', e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Razorpay Details */}
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                   </svg>
//                   Razorpay Credentials
//                 </h3>
//                 <div className="grid grid-cols-1 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
//                     <input
//                       type="text"
//                       value={editingVendor.razorpayKeyId || ''}
//                       onChange={(e) => updateEditingVendor('razorpayKeyId', e.target.value)}
//                       placeholder="rzp_test_xxxxx"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
//                     <input
//                       type="password"
//                       value={editingVendor.razorpayKeySecret || ''}
//                       onChange={(e) => updateEditingVendor('razorpayKeySecret', e.target.value)}
//                       placeholder="••••••••••••"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Menu Items */}
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                     <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                     </svg>
//                     Menu Items ({editingVendor.menuItems.length})
//                   </h3>
//                   <button
//                     onClick={addMenuItem}
//                     className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition"
//                   >
//                     + Add Item
//                   </button>
//                 </div>
//                 <div className="space-y-3 max-h-60 overflow-y-auto">
//                   {editingVendor.menuItems.map((item, index) => (
//                     <div key={index} className="flex gap-2 bg-white p-3 rounded-lg">
//                       <input
//                         type="text"
//                         value={item.name}
//                         onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
//                         placeholder="Item name"
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                       />
//                       <input
//                         type="number"
//                         value={item.price}
//                         onChange={(e) => updateMenuItem(index, 'price', parseFloat(e.target.value))}
//                         placeholder="Price"
//                         className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
//                       />
//                       <button
//                         onClick={() => deleteMenuItem(index)}
//                         className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
//                       >
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => setEditingVendor(null)}
//                   disabled={saving}
//                   className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={saving}
//                   className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {saving ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';

interface Vendor {
  vendorId: string;
  shopName: string;
  phone: string;
  city: string;
  state: string;
  shopType: string;
  upiId: string;
  accountHolderName: string;
  isActive: boolean;
  subscriptionPaid: boolean;
  createdAt: string;
  menuItems: { name: string; price: number }[];
  password?: string;
  passwordChangedAt?: string;
}

const SHOP_TYPES = ['Restaurant', 'Cafe', 'Stall', 'Xerox', 'Grocery', 'Retail', 'Other'];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filtered, setFiltered] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // ── Edit Modal State ────────────────────────────────────────────────────
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<Partial<Vendor>>({});
  const [saving, setSaving] = useState(false);
  const [editMsg, setEditMsg] = useState('');
  const [editError, setEditError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'password' | 'danger'>('details');

  // ── Password State ──────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentHash, setShowCurrentHash] = useState(false);
  const [currentHashData, setCurrentHashData] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isResettingPw, setIsResettingPw] = useState(false);

  // ── Delete State ────────────────────────────────────────────────────────
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteOrders, setDeleteOrders] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchVendors(); }, []);

  useEffect(() => {
    let result = vendors;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((v) =>
        v.shopName?.toLowerCase().includes(q) ||
        v.vendorId?.toLowerCase().includes(q) ||
        v.phone?.includes(q) ||
        v.city?.toLowerCase().includes(q)
      );
    }
    if (filterStatus === 'active') result = result.filter((v) => v.isActive);
    if (filterStatus === 'inactive') result = result.filter((v) => !v.isActive);
    setFiltered(result);
  }, [search, filterStatus, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Open Edit Modal ─────────────────────────────────────────────────────
  const openEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditForm({
      shopName: vendor.shopName,
      phone: vendor.phone,
      city: vendor.city,
      state: vendor.state,
      shopType: vendor.shopType,
      upiId: vendor.upiId,
      accountHolderName: vendor.accountHolderName,
      isActive: vendor.isActive,
      subscriptionPaid: vendor.subscriptionPaid,
    });
    setActiveTab('details');
    setEditMsg('');
    setEditError('');
    setNewPassword('');
    setPasswordMsg('');
    setPasswordError('');
    setCurrentHashData(null);
    setShowCurrentHash(false);
    setDeleteConfirmText('');
    setDeleteOrders(false);
  };

  const closeEdit = () => {
    setEditingVendor(null);
    setEditForm({});
  };

  // ── Save Vendor Details ─────────────────────────────────────────────────
  const handleSaveDetails = async () => {
    if (!editingVendor) return;
    setSaving(true);
    setEditMsg('');
    setEditError('');
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId: editingVendor.vendorId, ...editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditMsg('Vendor details updated successfully!');
      // Update in local list
      setVendors((prev) => prev.map((v) =>
        v.vendorId === editingVendor.vendorId ? { ...v, ...editForm } : v
      ));
    } catch (err: any) {
      setEditError(err.message || 'Failed to update vendor');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Active Status ────────────────────────────────────────────────
  const handleToggleStatus = async (vendor: Vendor) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId: vendor.vendorId, action: 'toggleStatus' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVendors((prev) => prev.map((v) =>
        v.vendorId === vendor.vendorId ? { ...v, isActive: !v.isActive } : v
      ));
    } catch (err: any) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  // ── Fetch + Show Current Password Hash ─────────────────────────────────
  const handleRevealPasswordHash = async () => {
    if (!editingVendor) return;
    try {
      const res = await fetch(
        `/api/admin/vendors?vendorId=${editingVendor.vendorId}&includePassword=true`
      );
      const data = await res.json();
      setCurrentHashData(data.password || 'No password set');
      setShowCurrentHash(true);
    } catch {
      setCurrentHashData('Failed to fetch');
      setShowCurrentHash(true);
    }
  };

  // ── Reset Password ──────────────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!editingVendor) return;
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setIsResettingPw(true);
    setPasswordMsg('');
    setPasswordError('');
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: editingVendor.vendorId,
          action: 'resetPassword',
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPasswordMsg('Password reset successfully!');
      setNewPassword('');
      setShowCurrentHash(false);
      setCurrentHashData(null);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to reset password');
    } finally {
      setIsResettingPw(false);
    }
  };

  // ── Delete Vendor ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!editingVendor) return;
    if (deleteConfirmText !== editingVendor.vendorId) {
      alert('Vendor ID does not match. Deletion cancelled.');
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/vendors?vendorId=${editingVendor.vendorId}&deleteOrders=${deleteOrders}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVendors((prev) => prev.filter((v) => v.vendorId !== editingVendor.vendorId));
      closeEdit();
      alert(`✅ Vendor deleted. ${data.deletedOrders ? `${data.deletedOrders} orders also removed.` : ''}`);
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-500 mt-0.5">{vendors.length} total registered vendors</p>
        </div>
        <button
          onClick={fetchVendors}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, ID, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white"
          />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          {(['all', 'active', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize ${
                filterStatus === s
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total', value: vendors.length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Active', value: vendors.filter((v) => v.isActive).length, color: 'bg-green-100 text-green-700' },
          { label: 'Inactive', value: vendors.filter((v) => !v.isActive).length, color: 'bg-red-100 text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
            <p className={`text-xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Vendors Table ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-gray-500">No vendors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor) => (
            <div key={vendor.vendorId}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold text-lg flex-shrink-0">
                    {vendor.shopName?.charAt(0)?.toUpperCase() || 'V'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{vendor.shopName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        vendor.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {vendor.isActive ? '● Active' : '● Inactive'}
                      </span>
                      {vendor.subscriptionPaid && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                          ✓ Paid
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{vendor.vendorId}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      <span className="text-xs text-gray-500">📞 {vendor.phone}</span>
                      <span className="text-xs text-gray-500">📍 {vendor.city}, {vendor.state}</span>
                      <span className="text-xs text-gray-500">🏪 {vendor.shopType}</span>
                      <span className="text-xs text-gray-500">
                        🗓 {new Date(vendor.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(vendor)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(vendor)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      vendor.isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {vendor.isActive ? '⏸ Deactivate' : '▶ Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          EDIT MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {editingVendor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeEdit()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editingVendor.shopName}</h2>
                <p className="text-xs text-gray-500 font-mono">{editingVendor.vendorId}</p>
              </div>
              <button onClick={closeEdit}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100">
              {[
                { key: 'details', label: '📋 Details' },
                { key: 'password', label: '🔐 Password' },
                { key: 'danger', label: '🗑 Delete' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">

              {/* ── TAB: DETAILS ─────────────────────────────────────────── */}
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Shop Name</label>
                      <input type="text" value={editForm.shopName || ''}
                        onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Shop Type</label>
                      <select value={editForm.shopType || ''}
                        onChange={(e) => setEditForm({ ...editForm, shopType: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                        {SHOP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Phone</label>
                      <input type="text" value={editForm.phone || ''}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
                      <input type="text" value={editForm.city || ''}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">State</label>
                      <input type="text" value={editForm.state || ''}
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">UPI ID</label>
                      <input type="text" value={editForm.upiId || ''}
                        onChange={(e) => setEditForm({ ...editForm, upiId: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Account Holder Name</label>
                      <input type="text" value={editForm.accountHolderName || ''}
                        onChange={(e) => setEditForm({ ...editForm, accountHolderName: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={editForm.isActive ?? true}
                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                        className="rounded accent-orange-500 w-4 h-4" />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={editForm.subscriptionPaid ?? false}
                        onChange={(e) => setEditForm({ ...editForm, subscriptionPaid: e.target.checked })}
                        className="rounded accent-orange-500 w-4 h-4" />
                      <span className="text-sm text-gray-700">Subscription Paid</span>
                    </label>
                  </div>

                  {/* Menu Items count info */}
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                    🍽️ <strong>{editingVendor.menuItems?.length || 0}</strong> menu items
                    <span className="ml-2 text-xs text-gray-400">(edit from vendor dashboard)</span>
                  </div>

                  {editError && (
                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">❌ {editError}</p>
                  )}
                  {editMsg && (
                    <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl p-3">✅ {editMsg}</p>
                  )}

                  <button onClick={handleSaveDetails} disabled={saving}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* ── TAB: PASSWORD ─────────────────────────────────────────── */}
              {activeTab === 'password' && (
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">ℹ️ Admin Password Access</p>
                    <p>You can view the stored bcrypt hash or set a new plaintext password for this vendor.</p>
                  </div>

                  {/* View Current Hash */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Current Password Hash</p>
                    {!showCurrentHash ? (
                      <button onClick={handleRevealPasswordHash}
                        className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-600 rounded-xl text-sm font-medium transition">
                        🔍 Reveal Password Hash
                      </button>
                    ) : (
                      <div>
                        <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded-xl break-all mb-2">
                          {currentHashData}
                        </div>
                        <p className="text-xs text-gray-400">
                          This is bcrypt-hashed. You cannot reverse it — use "Set New Password" below to change it.
                        </p>
                        {editingVendor.passwordChangedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last changed: {new Date(editingVendor.passwordChangedAt).toLocaleString('en-IN')}
                          </p>
                        )}
                        <button onClick={() => { setShowCurrentHash(false); setCurrentHashData(null); }}
                          className="text-xs text-gray-400 hover:text-gray-600 mt-2 underline">
                          Hide
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Set New Password */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Set New Password</p>
                    <div className="relative mb-3">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? '🙈' : '👁'}
                      </button>
                    </div>

                    {/* Quick preset buttons */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <p className="text-xs text-gray-500 w-full">Quick presets:</p>
                      <button onClick={() => setNewPassword(editingVendor.vendorId)}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        Reset to VendorID
                      </button>
                      <button onClick={() => setNewPassword('Nosher@123')}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        Nosher@123
                      </button>
                    </div>

                    {passwordError && (
                      <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-2 mb-3">❌ {passwordError}</p>
                    )}
                    {passwordMsg && (
                      <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl p-2 mb-3">✅ {passwordMsg}</p>
                    )}

                    <button onClick={handleResetPassword} disabled={isResettingPw || !newPassword}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition text-sm">
                      {isResettingPw ? 'Resetting...' : '🔐 Set New Password'}
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB: DANGER / DELETE ──────────────────────────────────── */}
              {activeTab === 'danger' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-800 font-semibold text-sm mb-1">⚠️ Danger Zone</p>
                    <p className="text-red-700 text-sm">
                      Deleting a vendor is <strong>permanent and irreversible</strong>. All vendor data including shop info, menu, QR code will be removed.
                    </p>
                  </div>

                  {/* Vendor summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                    <p className="text-sm font-medium text-gray-900">{editingVendor.shopName}</p>
                    <p className="text-xs text-gray-500 font-mono">{editingVendor.vendorId}</p>
                    <p className="text-xs text-gray-500">📞 {editingVendor.phone} · 📍 {editingVendor.city}</p>
                    <p className="text-xs text-gray-500">🍽️ {editingVendor.menuItems?.length || 0} menu items</p>
                  </div>

                  {/* Delete orders toggle */}
                  <label className="flex items-start gap-3 cursor-pointer p-3 bg-red-50 border border-red-200 rounded-xl">
                    <input type="checkbox" checked={deleteOrders}
                      onChange={(e) => setDeleteOrders(e.target.checked)}
                      className="rounded accent-red-500 w-4 h-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Also delete all orders</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        This will permanently delete all order history for this vendor. Uncheck to keep orders.
                      </p>
                    </div>
                  </label>

                  {/* Confirm by typing vendorId */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Type the Vendor ID to confirm deletion:
                    </label>
                    <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mb-2 text-gray-700 break-all">
                      {editingVendor.vendorId}
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Paste Vendor ID here..."
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-400 outline-none text-sm font-mono"
                    />
                  </div>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting || deleteConfirmText !== editingVendor.vendorId}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:text-red-400 text-white font-bold rounded-xl transition"
                  >
                    {isDeleting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Deleting...
                      </span>
                    ) : '🗑 Permanently Delete Vendor'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
