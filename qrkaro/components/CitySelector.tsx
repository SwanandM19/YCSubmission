'use client';

import { useState, useRef, useEffect } from 'react';
import { INDIAN_CITIES } from '@/lib/cities';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

export default function CitySelector({ value, onChange, placeholder = "Type to search city (e.g. Pu...)", error }: Props) {
  const [citySearch, setCitySearch] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState(value || '');
  const cityRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (val: string) => {
    setCitySearch(val);
    setSelectedCity(''); // clear until selected
    onChange(val);       // allow custom input too
    if (val.trim().length > 0) {
      const filtered = INDIAN_CITIES.filter((c) =>
        c.toLowerCase().startsWith(val.toLowerCase())
      ).slice(0, 8);
      setFilteredCities(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setFilteredCities([]);
    }
  };

  const handleSelect = (city: string) => {
    setCitySearch(city);
    setSelectedCity(city);
    onChange(city);
    setShowDropdown(false);
  };

  return (
    <div ref={cityRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={citySearch}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (citySearch.trim().length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {/* Checkmark when selected */}
        {selectedCity && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">✓</span>
        )}
      </div>

      {/* Dropdown List */}
      {showDropdown && filteredCities.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filteredCities.map((c) => (
            <li
              key={c}
              onMouseDown={() => handleSelect(c)}
              className="px-4 py-3 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition text-sm"
            >
              {c}
            </li>
          ))}
          {/* Custom city if not in list */}
          {!INDIAN_CITIES.includes(citySearch) && citySearch.length > 1 && (
            <li
              onMouseDown={() => handleSelect(citySearch)}
              className="px-4 py-3 cursor-pointer hover:bg-orange-50 text-orange-500 font-semibold border-t border-gray-100 transition text-sm"
            >
              ➕ Use "{citySearch}"
            </li>
          )}
        </ul>
      )}

      {/* No results */}
      {showDropdown && filteredCities.length === 0 && citySearch.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
          No city found.{' '}
          <span
            className="text-orange-500 font-semibold cursor-pointer"
            onMouseDown={() => handleSelect(citySearch)}
          >
            Use "{citySearch}"
          </span>
        </div>
      )}
    </div>
  );
}