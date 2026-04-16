// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface VendorAuthState {
//   vendorId: string | null;
//   shopName: string | null;
//   isAuthenticated: boolean;
//   login: (vendorId: string, shopName: string) => void;
//   logout: () => void;
// }

// export const useVendorAuth = create<VendorAuthState>()(
//   persist(
//     (set) => ({
//       vendorId: null,
//       shopName: null,
//       isAuthenticated: false,
      
//       login: (vendorId, shopName) => {
//         set({ vendorId, shopName, isAuthenticated: true });
//       },
      
//       logout: () => {
//         set({ vendorId: null, shopName: null, isAuthenticated: false });
//       },
//     }),
//     {
//       name: 'vendor-auth',
//     }
//   )
// );


// lib/vendorAuthStore.ts  — full file replacement
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// interface VendorAuth {
//   vendorId: string | null;
//   shopName: string | null;
//   isAuthenticated: boolean;
//   setVendor: (vendor: { vendorId: string; shopName: string }) => void;
//   clearVendor: () => void;
// }

// export const useVendorAuthStore = create<VendorAuth>()(
//   persist(
//     (set) => ({
//       vendorId: null,
//       shopName: null,
//       isAuthenticated: false,

//       setVendor: ({ vendorId, shopName }) =>
//         set({ vendorId, shopName, isAuthenticated: true }),

//       clearVendor: () =>
//         set({ vendorId: null, shopName: null, isAuthenticated: false }),
//     }),
//     {
//       name: 'vendor-auth',
//       storage: createJSONStorage(() => {
//         // ✅ Safe SSR: only access localStorage on client
//         if (typeof window !== 'undefined') return localStorage;
//         return {
//           getItem: () => null,
//           setItem: () => {},
//           removeItem: () => {},
//         };
//       }),
//     }
//   )
// );
// export const useVendorAuth = useVendorAuthStore; // ✅ backward compat alias

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface VendorState {
//   vendorId: string | null;
//   shopName: string | null;
//   isAuthenticated: boolean;
//   _hasHydrated: boolean;                          // ✅ NEW
//   setVendor: (data: { vendorId: string; shopName: string }) => void;
//   logout: () => void;
//   setHasHydrated: (val: boolean) => void;         // ✅ NEW
// }

// export const useVendorAuthStore = create<VendorState>()(
//   persist(
//     (set) => ({
//       vendorId: null,
//       shopName: null,
//       isAuthenticated: false,
//       _hasHydrated: false,

//       setVendor: ({ vendorId, shopName }) =>
//         set({ vendorId, shopName, isAuthenticated: true }),

//       logout: () =>
//         set({ vendorId: null, shopName: null, isAuthenticated: false }),

//       setHasHydrated: (val) => set({ _hasHydrated: val }),
//     }),
//     {
//       name: 'vendor-auth',
//       // ✅ Called once localStorage data is loaded into the store
//       onRehydrateStorage: () => (state) => {
//         state?.setHasHydrated(true);
//       },
//     }
//   )
// );
// export const useVendorAuth = useVendorAuthStore;


// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface VendorState {
//   vendorId: string | null;
//   shopName: string | null;
//   isAuthenticated: boolean;
//   _hasHydrated: boolean;
//   setVendor: (data: { vendorId: string; shopName: string }) => void;
//   login: (vendorId: string, shopName: string) => void; // ✅ keep backward compat
//   logout: () => void;
//   setHasHydrated: (val: boolean) => void;
// }

// export const useVendorAuthStore = create<VendorState>()(
//   persist(
//     (set) => ({
//       vendorId: null,
//       shopName: null,
//       isAuthenticated: false,
//       _hasHydrated: false,

//       setVendor: ({ vendorId, shopName }) =>
//         set({ vendorId, shopName, isAuthenticated: true }),

//       // ✅ backward compat for login page
//       login: (vendorId, shopName) =>
//         set({ vendorId, shopName, isAuthenticated: true }),

//       logout: () => {
//         // ✅ Nuke the persisted key from localStorage directly
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('vendor-auth');
//           localStorage.removeItem('vendorId'); // manual key from dashboard
//         }
//         set({ vendorId: null, shopName: null, isAuthenticated: false });
//       },

//       setHasHydrated: (val) => set({ _hasHydrated: val }),
//     }),
//     {
//       name: 'vendor-auth',
//       onRehydrateStorage: () => (state) => {
//         state?.setHasHydrated(true);
//       },
//     }
//   )
// );

// export const useVendorAuth = useVendorAuthStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VendorState {
  vendorId: string | null;
  shopName: string | null;
  shopType: string | null; // ✅ ADDED
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setVendor: (data: { vendorId: string; shopName: string; shopType?: string }) => void;
  login: (vendorId: string, shopName: string, shopType?: string) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useVendorAuthStore = create<VendorState>()(
  persist(
    (set) => ({
      vendorId: null,
      shopName: null,
      shopType: null, // ✅ ADDED
      isAuthenticated: false,
      _hasHydrated: false,

      setVendor: ({ vendorId, shopName, shopType }) =>
        set({ vendorId, shopName, shopType: shopType || null, isAuthenticated: true }),

      login: (vendorId, shopName, shopType) =>
        set({ vendorId, shopName, shopType: shopType || null, isAuthenticated: true }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('vendor-auth');
          localStorage.removeItem('vendorId');
        }
        set({ vendorId: null, shopName: null, shopType: null, isAuthenticated: false });
      },

      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'vendor-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useVendorAuth = useVendorAuthStore;