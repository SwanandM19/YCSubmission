// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useCartStore } from "@/lib/cartStore";
// import Link from "next/link";

// interface MenuItem {
//   name: string;
//   price: number;
//   category?: string;
//   desc?: string;
// }

// interface VendorData {
//   shopName: string;
//   shopType: string;
//   city: string;
//   menuItems: MenuItem[];
// }

// const demoVendor = {
//   shopName: "Nosher Demo Cafe",
//   shopType: "Cafe",
//   city: "Pune",
//   menuItems: [
//     { name: "Kung Pao Chicken", price: 20 },
//     { name: "Laksa Shirataki", price: 20 },
//     { name: "Miso Butter Roast Chicken", price: 20 },
//     { name: "Indonesian Nasi Goreng", price: 20 },
//     { name: "Korean Bibimbab", price: 20 },
//     { name: "Indian Curry", price: 20 },
//     { name: "Chicago Deep-Dish Pizza", price: 20 },
//     { name: "Double beef hamburger", price: 20 },
//     { name: "Barbecue Ribs", price: 20 },
//     { name: "Buffalo Wings", price: 20 },
//     { name: "Meatloaf", price: 20 },
//     { name: "Roasted Chicken", price: 20 },
//   ],
// };

// export default function CustomerMenuPage() {
//   const params = useParams();
//   const vendorId = params.vendorId as string;

//   const [vendor, setVendor] = useState<VendorData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");

//   const { items, addItem, updateQuantity, getTotal, getItemCount } =
//     useCartStore();

//   useEffect(() => {
//     fetchVendorData();
//   }, [vendorId]);

//   // const fetchVendorData = async () => {
//   //   try {
//   //     const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
//   //     const data = await response.json();
//   //     setVendor(data);
//   //   } catch (error) {
//   //     console.error("Error fetching vendor:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchVendorData = async () => {
//     try {
//       // 👉 If demo QR is opened, skip API and use demo data
//       if (vendorId === "demo") {
//         setVendor(demoVendor);
//         return;
//       }

//       const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
//       const data = await response.json();

//       // 👉 fallback to demo if vendor not found
//       setVendor(data || demoVendor);
//     } catch (error) {
//       console.error("Error fetching vendor:", error);

//       // 👉 even if API fails, show demo so QR never breaks
//       setVendor(demoVendor);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const categories = ["All", "Veg", "Snacks", "Drinks", "Desserts", "Mains"];

//   const getItemQuantity = (itemName: string) => {
//     const cartItem = items.find((i) => i.name === itemName);
//     return cartItem?.quantity || 0;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
//       </div>
//     );
//   }

//   if (!vendor) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">
//             Restaurant Not Found
//           </h1>
//           <p className="text-gray-600">This QR code is invalid or expired.</p>
//         </div>
//       </div>
//     );
//   }

//   const cartTotal = getTotal();
//   const cartCount = getItemCount();

//   return (
//     <div className="min-h-screen bg-gray-50 pb-32">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-10">
//         <div className="max-w-2xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">Q</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900">NOSHER</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <button className="text-gray-600 hover:text-gray-900 text-sm">
//                 Menu
//               </button>
//               {/* <button className="text-gray-600 hover:text-gray-900 text-sm">Orders</button> */}
//               <button className="text-gray-600 hover:text-gray-900 text-sm">
//                 Support
//               </button>
//               <div className="w-10 h-10 bg-orange-100 rounded-full"></div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Restaurant Info */}
//       <div className="bg-white border-b">
//         <div className="max-w-2xl mx-auto px-4 py-6">
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {vendor.shopName}
//               </h1>
//               <div className="flex items-center gap-2 mt-2 text-gray-600">
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span>{vendor.city}</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//               <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//               OPEN
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Categories */}
//       <div className="bg-white border-b">
//         <div className="max-w-2xl mx-auto px-4">
//           <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`whitespace-nowrap pb-2 font-medium transition ${
//                   selectedCategory === category
//                     ? "text-orange-600 border-b-2 border-orange-600"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white border-b">
//         <div className="max-w-2xl mx-auto px-4 py-3">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search for dishes..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//             />
//             <svg
//               className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <div className="max-w-2xl mx-auto px-4 py-6">
//         <h2 className="text-lg font-semibold text-gray-400 mb-4">
//           POPULAR ITEMS
//         </h2>
//         <div className="space-y-5">
//           {(vendor?.menuItems || [])
//             .filter((item) => {
//               const matchesSearch =
//                 item.name.toLowerCase().includes(searchQuery.toLowerCase());

//               const matchesCategory =
//                 selectedCategory === "All" ||
//                 !item.category ||               // ← IMPORTANT: allow old hardcoded items
//                 item.category === selectedCategory;

//               return matchesSearch && matchesCategory;
//             })
//             .map((item, index) => {
//               const quantity = getItemQuantity(item.name);

//               return (
//                 <div
//                   key={index}
//                   className="group relative bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between"
//                 >
//                   {/* LEFT CONTENT */}
//                   <div className="flex-1">
//                     <h3 className="text-lg font-bold text-neutral-800 leading-tight">
//                       {item.name}
//                     </h3>

//                     <p className="text-sm text-neutral-500 mt-1">
//                       Delicious and freshly prepared
//                     </p>

//                     <p className="text-xl font-extrabold text-orange-600 mt-2">
//                       ₹{item.price}
//                     </p>
//                   </div>

//                   {/* RIGHT ACTION */}
//                   {quantity === 0 ? (
//                     <button
//                       onClick={() => addItem(item)}
//                       className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 active:scale-95 transition"
//                     >
//                       + Add
//                     </button>
//                   ) : (
//                     <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl shadow-md">
//                       <button
//                         onClick={() => updateQuantity(item.name, quantity - 1)}
//                         className="text-lg font-bold hover:opacity-80"
//                       >
//                         −
//                       </button>

//                       <span className="font-bold text-base w-5 text-center">
//                         {quantity}
//                       </span>

//                       <button
//                         onClick={() => updateQuantity(item.name, quantity + 1)}
//                         className="text-lg font-bold hover:opacity-80"
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//         </div>

//         <div className="text-center mt-8 text-sm text-gray-400">
//           POWERED BY NOSHER
//         </div>
//       </div>

//       {/* Floating Cart Button */}
//       {cartCount > 0 && (
//         <div className="fixed bottom-6 left-0 right-0 px-4 max-w-2xl mx-auto">
//           <Link
//             href={`/v/${vendorId}/cart`}
//             className="flex items-center justify-between w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl px-6 py-4 shadow-2xl shadow-orange-500/30 transition"
//           >
//             <div className="flex items-center gap-3">
//               <div className="bg-white text-orange-600 font-bold px-2 py-1 rounded text-sm">
//                 {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"} ADDED
//               </div>
//               <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="font-semibold">View Cart</span>
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//               </svg>
//             </div>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import {
  Search,
  MapPin,
  Plus,
  Minus,
  Clock,
  Star,
  Info,
  ShoppingCart,
  SearchIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  price: number;
  category?: string;
  desc?: string;
  isVeg?: boolean;
}

interface VendorData {
  shopName: string;
  shopType: string;
  city: string;
  rating?: string;
  prepTime?: string;
  menuItems: MenuItem[];
}

const demoVendor: VendorData = {
  shopName: "Nosher Premium Cafe",
  shopType: "Gourmet Cafe & Bistro",
  city: "Pune, Maharashtra",
  rating: "4.8",
  prepTime: "20-25 min",
  menuItems: [
    {
      name: "Kung Pao Chicken",
      price: 120,
      category: "Mains",
      isVeg: false,
      desc: "Szechuan classic with peanuts, chili peppers and house-made sauce.",
    },
    {
      name: "Avocado Burrata Toast",
      price: 340,
      category: "Mains",
      isVeg: true,
      desc: "Creamy burrata cheese on sourdough with smashed avocado and balsamic glaze.",
    },
    {
      name: "Truffle Mushroom Pasta",
      price: 480,
      category: "Mains",
      isVeg: true,
      desc: "Al dente linguine tossed in white truffle oil and wild porcini mushrooms.",
    },
    {
      name: "Laksa Shirataki",
      price: 200,
      category: "Mains",
      isVeg: false,
      desc: "Delicious and freshly prepared spicy noodle soup.",
    },
    {
      name: "Miso Butter Roast Chicken",
      price: 210,
      category: "Mains",
      isVeg: false,
      desc: "Succulent chicken roasted with miso-infused butter.",
    },
    {
      name: "Mango Smoothie",
      price: 150,
      category: "Drinks",
      isVeg: true,
      desc: "Fresh seasonal mangoes blended to perfection.",
    },
    {
      name: "Iced Americano",
      price: 120,
      category: "Drinks",
      isVeg: true,
      desc: "Double shot of premium Arabica beans.",
    },
  ],
};

export default function CustomerMenuPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { items, addItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    fetchVendorData();
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      if (vendorId === "demo") {
        setVendor(demoVendor);
        return;
      }
      const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await response.json();
      setVendor(data || demoVendor);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      setVendor(demoVendor);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Mains", "Snacks", "Drinks", "Desserts"];

  const getItemQuantity = (itemName: string) => {
    const cartItem = items.find((i) => i.name === itemName);
    return cartItem?.quantity || 0;
  };

  const filteredItems = useMemo(() => {
    return (vendor?.menuItems || []).filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || !item.category || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [vendor, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">This QR code is invalid or expired.</p>
        </div>
      </div>
    );
  }

  const cartTotal = getTotal();
  const cartCount = getItemCount();

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-40 font-sans selection:bg-orange-100 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-neutral-100">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5A00] rounded-lg flex items-center justify-center shadow-lg shadow-orange-200">
              <span className="text-white font-black text-sm italic">N</span>
            </div>
            <span className="text-lg font-black tracking-tight text-[#1A202C]">NOSHER</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#F3F4F6] rounded-full text-[#4A5568] transition-colors hover:bg-gray-200">
              <Info size={18} />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#E2E8F0] rounded-full text-[#718096] text-[10px] sm:text-xs font-bold">
              ME
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <section className="bg-white border-b border-neutral-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-[32px] font-bold text-[#1A202C] leading-tight mb-1">
                {vendor.shopName}
              </h1>
              <p className="text-[#718096] italic text-sm font-medium">{vendor.shopType}</p>
            </div>

            <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E6FFFA] text-[#2D3748] rounded-full text-[10px] font-bold tracking-wider uppercase border border-[#B2F5EA]">
                <span className="w-1.5 h-1.5 bg-[#38B2AC] rounded-full"></span>
                Open Now
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#FED7D7] rounded-lg shadow-sm">
                <Star size={12} className="fill-[#FF5A00] text-[#FF5A00]" />
                <span className="text-xs font-bold text-[#FF5A00]">{vendor.rating || "4.5"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-[#718096]">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
              <MapPin size={14} className="text-[#FF5A00]" />
              <span className="text-xs font-medium">{vendor.city}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
              <Clock size={14} className="text-[#FF5A00]" />
              <span className="text-xs font-medium">{vendor.prepTime || "15-20 min"}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto py-6 no-scrollbar snap-x touch-pan-x">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap border snap-start ${
                  selectedCategory === cat
                    ? "bg-[#FF5A00] text-white border-[#FF5A00] shadow-md shadow-orange-100"
                    : "bg-white text-[#718096] border-[#E2E8F0] hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative group">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#FF5A00] transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 sm:py-4 bg-white border border-[#E2E8F0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-[#FF5A00] transition-all text-sm font-medium shadow-sm"
            />
          </div>
        </div>

        {/* Menu Items */}
        <main className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-[0.2em]">
              Recommendations
            </h2>
            <span className="text-[10px] font-bold text-[#CBD5E0] uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
              {filteredItems.length} Items
            </span>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {filteredItems.map((item, index) => {
              const quantity = getItemQuantity(item.name);
              return (
                <div
                  key={index}
                  className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-sm border border-[#F1F3F5] transition-all hover:shadow-lg active:scale-[0.99] sm:active:scale-100"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#2D3748] leading-tight">
                          {item.name}
                        </h3>
                        {item.isVeg !== undefined && (
                          <div
                            className={`flex-shrink-0 w-3.5 h-3.5 border ${
                              item.isVeg ? "border-[#48BB78]" : "border-[#E53E3E]"
                            } flex items-center justify-center rounded-[2px] mt-1`}
                          >
                            <div
                              className={`w-1.5 h-1.5 ${
                                item.isVeg ? "bg-[#48BB78]" : "bg-[#E53E3E]"
                              } rounded-full`}
                            ></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#718096] line-clamp-2 sm:line-clamp-none mb-4 font-medium opacity-80">
                        {item.desc || "Delicious and freshly prepared by our chefs."}
                      </p>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-[#CBD5E0] uppercase tracking-widest mb-0.5">
                          Price
                        </span>
                        <span className="text-xl font-black text-[#FF5A00]">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-end sm:items-center justify-end sm:mt-0">
                      {quantity === 0 ? (
                        <button
                          onClick={() => addItem(item)}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#FF5A00] text-white font-bold py-3 px-8 sm:px-7 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-100 transition-all hover:bg-orange-600 active:scale-95 text-sm"
                        >
                          <Plus size={16} strokeWidth={3} /> Add
                        </button>
                      ) : (
                        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-6 bg-[#FF5A00] text-white py-2 px-3 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-100">
                          <button
                            onClick={() => updateQuantity(item.name, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition active:scale-90"
                          >
                            <Minus size={14} strokeWidth={4} />
                          </button>
                          <span className="text-sm font-black w-4 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.name, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition active:scale-90"
                          >
                            <Plus size={14} strokeWidth={4} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <Search className="mx-auto mb-4 opacity-20" size={48} />
              <p className="text-sm font-medium">No dishes match your search.</p>
            </div>
          )}
        </main>

        <footer className="py-12 flex flex-col items-center border-t border-gray-100">
          <div className="flex items-center gap-2 opacity-20 grayscale mb-2">
            <div className="w-5 h-5 bg-neutral-900 rounded-md flex items-center justify-center">
              <span className="text-white text-[8px] font-black">N</span>
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">NOSHER</span>
          </div>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.3em]">
            Menu Digitalized
          </p>
        </footer>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-6 z-[100] animate-in slide-in-from-bottom-8 duration-500 ease-out">
          <div className="max-w-2xl mx-auto">
            <Link
              href={`/v/${vendorId}/cart`}
              className="bg-[#FF5A00] rounded-2xl sm:rounded-[22px] p-2.5 sm:p-3 flex items-center justify-between shadow-2xl shadow-orange-600/30 border border-white/10"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-white px-2.5 sm:px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="text-[10px] sm:text-[11px] font-black text-[#FF5A00] tracking-tight uppercase whitespace-nowrap">
                    {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
                  </span>
                </div>
                <span className="text-white font-black text-base sm:text-lg">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm px-2 py-1 group">
                View Cart
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg group-active:scale-90 transition-transform">
                  <ShoppingCart size={16} className="text-white" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Global CSS for no-scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}