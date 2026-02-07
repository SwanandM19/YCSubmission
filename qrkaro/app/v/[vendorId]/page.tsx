'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';

interface MenuItem {
  name: string;
  price: number;
}

interface VendorData {
  shopName: string;
  shopType: string;
  city: string;
  menuItems: MenuItem[];
}

export default function CustomerMenuPage() {
  const params = useParams();
  const vendorId = params.vendorId as string;

  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { items, addItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    fetchVendorData();
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await response.json();
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Veg', 'Snacks', 'Drinks', 'Desserts', 'Mains'];

  const getItemQuantity = (itemName: string) => {
    const cartItem = items.find((i) => i.name === itemName);
    return cartItem?.quantity || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900">QRKaro</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 text-sm">Menu</button>
              <button className="text-gray-600 hover:text-gray-900 text-sm">Orders</button>
              <button className="text-gray-600 hover:text-gray-900 text-sm">Support</button>
              <div className="w-10 h-10 bg-orange-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vendor.shopName}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{vendor.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              OPEN
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap pb-2 font-medium transition ${
                  selectedCategory === category
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-400 mb-4">POPULAR ITEMS</h2>
        <div className="space-y-4">
          {vendor.menuItems.map((item, index) => {
            const quantity = getItemQuantity(item.name);
            return (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                {/* Placeholder for item image */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 relative">
                  <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Item Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Delicious and fresh</p>
                  <p className="text-orange-600 font-semibold mt-1">₹{item.price}</p>
                </div>

                {/* Add/Quantity Controls */}
                {quantity === 0 ? (
                  <button
                    onClick={() => addItem(item)}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition"
                  >
                    + Add
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-orange-50 rounded-lg px-3 py-2">
                    <button
                      onClick={() => updateQuantity(item.name, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded"
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-900 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 text-sm text-gray-400">
          POWERED BY QRKARO
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 max-w-2xl mx-auto">
          <Link
            href={`/v/${vendorId}/cart`}
            className="flex items-center justify-between w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-4 shadow-2xl transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-orange-600 font-bold px-2 py-1 rounded text-sm">
                {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
              </div>
              <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">View Cart</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
    