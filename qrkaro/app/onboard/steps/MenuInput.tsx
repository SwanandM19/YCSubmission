'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';

export default function MenuInput() {
  const { menuItems, setMenuItems, setCurrentStep } = useOnboardingStore();

  const [items, setItems] = useState(menuItems.length > 0 ? menuItems : [{ name: '', price: 0 }]);
  const [errors, setErrors] = useState<string>('');

  const addItem = () => {
    setItems([...items, { name: '', price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: 'name' | 'price', value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const validateMenu = () => {
    const validItems = items.filter((item) => item.name.trim() && item.price > 0);
    
    if (validItems.length === 0) {
      setErrors('Please add at least one menu item with name and price');
      return false;
    }

    setErrors('');
    return true;
  };

  const handleNext = () => {
    if (validateMenu()) {
      const validItems = items.filter((item) => item.name.trim() && item.price > 0);
      setMenuItems(validItems);
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Add Menu Items</h2>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                placeholder="e.g. Masala Chai"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={item.price || ''}
                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            {items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Remove item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="mt-4 flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Another Item
      </button>

      {errors && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors}</p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
