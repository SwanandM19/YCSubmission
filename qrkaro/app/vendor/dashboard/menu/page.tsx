// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface MenuItem {
//   name: string;
//   price: number;
//   _id?: string;
// }

// const ITEMS_PER_PAGE = 10;

// export default function MenuManagementPage() {
//   const router = useRouter();
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [vendorId, setVendorId] = useState<string>('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
//   const [editingIndex, setEditingIndex] = useState<number>(-1);
//   const [currentPage, setCurrentPage] = useState(1);
  
//   // Form states
//   const [itemName, setItemName] = useState('');
//   const [itemPrice, setItemPrice] = useState('');
//   const [saving, setSaving] = useState(false);

//   // Pagination calculations
//   const totalPages = Math.ceil(menuItems.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const currentItems = menuItems.slice(startIndex, endIndex);

//   useEffect(() => {
//     const storedVendorId = localStorage.getItem('vendorId');
//     if (!storedVendorId) {
//       alert('Please login first');
//       router.push('/vendor/dashboard');
//       return;
//     }
//     setVendorId(storedVendorId);
//     fetchMenu(storedVendorId);
//   }, []);

//   // Reset to page 1 when menu items change
//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     }
//   }, [menuItems.length]);

//   const fetchMenu = async (vid: string) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/vendor/menu?vendorId=${vid}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to fetch menu');
//       }

//       setMenuItems(data.menuItems || []);
//     } catch (error: any) {
//       console.error('Error fetching menu:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddItem = async () => {
//     if (!itemName.trim() || !itemPrice.trim()) {
//       alert('Please enter both item name and price');
//       return;
//     }

//     const price = parseFloat(itemPrice);
//     if (isNaN(price) || price <= 0) {
//       alert('Please enter a valid price');
//       return;
//     }

//     try {
//       setSaving(true);
//       const response = await fetch('/api/vendor/menu', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           vendorId,
//           action: 'add',
//           item: { name: itemName.trim(), price },
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to add item');
//       }

//       setMenuItems(data.menuItems);
//       setShowAddModal(false);
//       setItemName('');
//       setItemPrice('');
//       alert('Item added successfully!');
      
//       // Go to last page to see new item
//       const newTotalPages = Math.ceil(data.menuItems.length / ITEMS_PER_PAGE);
//       setCurrentPage(newTotalPages);
//     } catch (error: any) {
//       console.error('Error adding item:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEditItem = async () => {
//     if (!itemName.trim() || !itemPrice.trim()) {
//       alert('Please enter both item name and price');
//       return;
//     }

//     const price = parseFloat(itemPrice);
//     if (isNaN(price) || price <= 0) {
//       alert('Please enter a valid price');
//       return;
//     }

//     try {
//       setSaving(true);
//       const response = await fetch('/api/vendor/menu', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           vendorId,
//           action: 'edit',
//           index: editingIndex,
//           item: { name: itemName.trim(), price },
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update item');
//       }

//       setMenuItems(data.menuItems);
//       setShowEditModal(false);
//       setEditingItem(null);
//       setEditingIndex(-1);
//       setItemName('');
//       setItemPrice('');
//       alert('Item updated successfully!');
//     } catch (error: any) {
//       console.error('Error updating item:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDeleteItem = async (index: number) => {
//     if (!confirm('Are you sure you want to delete this item?')) {
//       return;
//     }

//     try {
//       const response = await fetch('/api/vendor/menu', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           vendorId,
//           action: 'delete',
//           index,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete item');
//       }

//       setMenuItems(data.menuItems);
//       alert('Item deleted successfully!');
//     } catch (error: any) {
//       console.error('Error deleting item:', error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   const openAddModal = () => {
//     setItemName('');
//     setItemPrice('');
//     setShowAddModal(true);
//   };

//   const openEditModal = (item: MenuItem, index: number) => {
//     setItemName(item.name);
//     setItemPrice(item.price.toString());
//     setEditingItem(item);
//     setEditingIndex(index);
//     setShowEditModal(true);
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading menu...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shadow-lg">
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => router.back()}
//             className="p-2 hover:bg-white/20 rounded-lg transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <h1 className="text-2xl font-bold">Menu Management</h1>
//           <button
//             onClick={openAddModal}
//             className="p-2 hover:bg-white/20 rounded-lg transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//           </button>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-white/90 text-sm">{menuItems.length} items in your menu</p>
//           {totalPages > 1 && (
//             <p className="text-white/90 text-sm">Page {currentPage} of {totalPages}</p>
//           )}
//         </div>
//       </div>

//       {/* Menu Items List */}
//       <div className="p-4 space-y-3">
//         {menuItems.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No menu items yet</h3>
//             <p className="text-gray-500 mb-4">Add your first item to get started</p>
//             <button
//               onClick={openAddModal}
//               className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
//             >
//               Add First Item
//             </button>
//           </div>
//         ) : (
//           <>
//             {currentItems.map((item, displayIndex) => {
//               const actualIndex = startIndex + displayIndex;
//               return (
//                 <div
//                   key={actualIndex}
//                   className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
//                 >
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-xs font-bold text-gray-400">#{actualIndex + 1}</span>
//                       <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
//                     </div>
//                     <p className="text-orange-600 font-bold text-xl">₹{item.price.toFixed(2)}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => openEditModal(item, actualIndex)}
//                       className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => handleDeleteItem(actualIndex)}
//                       className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 pt-4 pb-2">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//                 >
//                   <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>

//                 <div className="flex gap-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
//                     // Show first page, last page, current page, and pages around current
//                     const showPage = 
//                       page === 1 || 
//                       page === totalPages || 
//                       (page >= currentPage - 1 && page <= currentPage + 1);

//                     const showEllipsis = 
//                       (page === 2 && currentPage > 3) || 
//                       (page === totalPages - 1 && currentPage < totalPages - 2);

//                     if (!showPage && !showEllipsis) return null;

//                     if (showEllipsis) {
//                       return (
//                         <span key={page} className="px-3 py-2 text-gray-500">
//                           ...
//                         </span>
//                       );
//                     }

//                     return (
//                       <button
//                         key={page}
//                         onClick={() => goToPage(page)}
//                         className={`min-w-[40px] h-10 rounded-lg font-semibold transition ${
//                           currentPage === page
//                             ? 'bg-orange-500 text-white'
//                             : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//                 >
//                   <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Floating Add Button */}
//       {menuItems.length > 0 && (
//         <button
//           onClick={openAddModal}
//           className="fixed bottom-24 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition z-40"
//         >
//           <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//         </button>
//       )}

//       {/* Add Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Item</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
//                 <input
//                   type="text"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                   placeholder="e.g., Cappuccino"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={itemPrice}
//                   onChange={(e) => setItemPrice(e.target.value)}
//                   placeholder="e.g., 99.99"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 disabled={saving}
//                 className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddItem}
//                 disabled={saving}
//                 className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
//               >
//                 {saving ? 'Adding...' : 'Add Item'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Item</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
//                 <input
//                   type="text"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                   placeholder="e.g., Cappuccino"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={itemPrice}
//                   onChange={(e) => setItemPrice(e.target.value)}
//                   placeholder="e.g., 99.99"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditingItem(null);
//                   setEditingIndex(-1);
//                 }}
//                 disabled={saving}
//                 className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditItem}
//                 disabled={saving}
//                 className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
//               >
//                 {saving ? 'Updating...' : 'Update Item'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { useRouter } from 'next/navigation';

interface MenuItem {
  _id?: string;
  name: string;
  price: number;
  available: boolean;
  category: string;
}

const FOOD_CATEGORIES = [
  'Starters',
  'Main Course',
  'Breads',
  'Rice & Biryani',
  'Beverages',
  'Desserts',
  'Snacks',
  'Combos',
  'Soups',
  'Salads',
  'Other',
];

const CATEGORY_ICONS: Record<string, string> = {
  'Starters': '🥗',
  'Main Course': '🍛',
  'Breads': '🫓',
  'Rice & Biryani': '🍚',
  'Beverages': '🥤',
  'Desserts': '🍮',
  'Snacks': '🍿',
  'Combos': '🍱',
  'Soups': '🍜',
  'Salads': '🥙',
  'Other': '🍽️',
};

export default function MenuManagementPage() {
  const router = useRouter();
  const { vendorId, _hasHydrated } = useVendorAuthStore();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<MenuItem>({
    name: '',
    price: 0,
    available: true,
    category: 'Other',
  });

  // ✅ Wait for Zustand hydration before checking auth
  useEffect(() => {
    if (!_hasHydrated) return;

    if (!vendorId) {
      router.replace('/vendor/login');
      return;
    }

    fetchMenu();
  }, [_hasHydrated, vendorId]);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await res.json();
      const items = (data.menuItems || []).map((item: any) => ({
        ...item,
        available: item.available ?? true,
        category: item.category || 'Other',
      }));
      setMenuItems(items);
    } catch (err) {
      setErrorMsg('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  // ── Save all items ────────────────────────────────────────────────────────
  const saveMenu = async (items: MenuItem[]) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/vendor/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, menuItems: items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMenuItems(data.menuItems || items);
      setSuccessMsg('✅ Menu saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save menu');
    } finally {
      setSaving(false);
    }
  };

  // ── Add new item ──────────────────────────────────────────────────────────
  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      setErrorMsg('Item name is required');
      return;
    }
    if (newItem.price < 0) {
      setErrorMsg('Price cannot be negative');
      return;
    }
    const updated = [...menuItems, { ...newItem, name: newItem.name.trim() }];
    setMenuItems(updated);
    setNewItem({ name: '', price: 0, available: true, category: 'Other' });
    setShowAddForm(false);
    setErrorMsg('');
    saveMenu(updated);
  };

  // ── Update single field ───────────────────────────────────────────────────
  const updateItem = (index: number, field: keyof MenuItem, value: any) => {
    const updated = menuItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMenuItems(updated);
  };

  // ── Toggle availability ───────────────────────────────────────────────────
  const toggleAvailability = (index: number) => {
    const updated = menuItems.map((item, i) =>
      i === index ? { ...item, available: !item.available } : item
    );
    setMenuItems(updated);
    saveMenu(updated);
  };

  // ── Delete item ───────────────────────────────────────────────────────────
  const deleteItem = (index: number) => {
    if (!confirm('Delete this item?')) return;
    const updated = menuItems.filter((_, i) => i !== index);
    setMenuItems(updated);
    saveMenu(updated);
  };

  // ── AI Image Upload ───────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/extract-menu', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');

      const extracted: MenuItem[] = (data.menuItems || []).map((item: any) => ({
        name: item.name,
        price: item.price,
        available: true,
        category: item.category || 'Other',
      }));

      const merged = [...menuItems, ...extracted];
      setMenuItems(merged);
      await saveMenu(merged);
      setSuccessMsg(`🤖 AI extracted ${extracted.length} items with categories!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract menu from image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // ── Derived / filtered ────────────────────────────────────────────────────
  const uniqueCategories = [
    'All',
    ...Array.from(new Set(menuItems.map((i) => i.category || 'Other'))),
  ];

  const filteredItems = menuItems
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      const matchCat =
        filterCategory === 'All' || (item.category || 'Other') === filterCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

  const stats = {
    total: menuItems.length,
    available: menuItems.filter((i) => i.available).length,
    unavailable: menuItems.filter((i) => !i.available).length,
    categories: new Set(menuItems.map((i) => i.category || 'Other')).size,
  };

  // ── Hydration guard ───────────────────────────────────────────────────────
  if (!_hasHydrated || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your items, prices, and categories
          </p>
        </div>
        <div className="flex flex-wrap gap-2">

          {/* AI Scan */}
          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition ${
            uploadingImage
              ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm'
          }`}>
            {uploadingImage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400" />
                Extracting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                AI Scan Menu
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>

          {/* Add Item */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>

          {/* Save All */}
          <button
            onClick={() => saveMenu(menuItems)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Items', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Available', value: stats.available, color: 'bg-green-50 text-green-700' },
          { label: 'Unavailable', value: stats.unavailable, color: 'bg-red-50 text-red-700' },
          { label: 'Categories', value: stats.categories, color: 'bg-orange-50 text-orange-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl px-4 py-3 text-center`}>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Alerts ── */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm mb-4">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* ── Add Item Form ── */}
      {showAddForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">➕</span> Add New Item
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Item Name *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Paneer Tikka"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₹) *</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white"
              >
                {FOOD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_ICONS[cat]} {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Toggle */}
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setNewItem({ ...newItem, available: !newItem.available })}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    newItem.available ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    newItem.available ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {newItem.available ? 'Available' : 'Unavailable'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddItem}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition"
            >
              Add to Menu
            </button>
            <button
              onClick={() => { setShowAddForm(false); setErrorMsg(''); }}
              className="px-6 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Search + Category Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                filterCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {cat !== 'All' && <span>{CATEGORY_ICONS[cat] || '🍴'}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu Items List ── */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-gray-500 font-medium">No items found</p>
          <p className="text-gray-400 text-sm mt-1">
            {menuItems.length === 0
              ? 'Add your first item manually or use AI Scan'
              : 'Try a different search or category filter'}
          </p>
          {menuItems.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition"
            >
              + Add First Item
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map(({ item, originalIndex }) => (
            <div
              key={item._id || originalIndex}
              className={`bg-white rounded-2xl border p-4 transition ${
                item.available
                  ? 'border-gray-100 hover:border-orange-200'
                  : 'border-dashed border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">

                {/* Availability dot */}
                <button
                  onClick={() => toggleAvailability(originalIndex)}
                  title={item.available ? 'Mark unavailable' : 'Mark available'}
                  className={`flex-shrink-0 mt-2 w-3 h-3 rounded-full transition hover:scale-125 ${
                    item.available ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />

                {/* Editable fields */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2">

                  {/* Name */}
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(originalIndex, 'name', e.target.value)}
                    onBlur={() => saveMenu(menuItems)}
                    className="font-semibold text-gray-900 text-sm bg-transparent border-b border-transparent hover:border-gray-200 focus:border-orange-400 outline-none px-1 py-0.5 transition w-full"
                  />

                  {/* Price */}
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(originalIndex, 'price', parseFloat(e.target.value) || 0)
                      }
                      onBlur={() => saveMenu(menuItems)}
                      min={0}
                      className="text-orange-600 font-bold text-sm bg-transparent border-b border-transparent hover:border-gray-200 focus:border-orange-400 outline-none px-1 py-0.5 transition w-full"
                    />
                  </div>

                  {/* Category */}
                  <select
                    value={item.category || 'Other'}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const updated = menuItems.map((m, i) =>
                        i === originalIndex ? { ...m, category: newCat } : m
                      );
                      setMenuItems(updated);
                      saveMenu(updated);
                    }}
                    className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none transition hover:border-orange-300 cursor-pointer"
                  >
                    {FOOD_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_ICONS[cat]} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleAvailability(originalIndex)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                      item.available
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item.available ? 'On' : 'Off'}
                  </button>

                  <button
                    onClick={() => deleteItem(originalIndex)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom Save ── */}
      {menuItems.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => saveMenu(menuItems)}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-xl transition shadow-sm"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {saving ? 'Saving...' : `Save All ${menuItems.length} Items`}
          </button>
        </div>
      )}
    </div>
  );
}
