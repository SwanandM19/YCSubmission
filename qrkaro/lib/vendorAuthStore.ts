import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VendorAuthState {
  vendorId: string | null;
  shopName: string | null;
  isAuthenticated: boolean;
  login: (vendorId: string, shopName: string) => void;
  logout: () => void;
}

export const useVendorAuth = create<VendorAuthState>()(
  persist(
    (set) => ({
      vendorId: null,
      shopName: null,
      isAuthenticated: false,
      
      login: (vendorId, shopName) => {
        set({ vendorId, shopName, isAuthenticated: true });
      },
      
      logout: () => {
        set({ vendorId: null, shopName: null, isAuthenticated: false });
      },
    }),
    {
      name: 'vendor-auth',
    }
  )
);
