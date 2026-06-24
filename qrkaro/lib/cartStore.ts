// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface CartItem {
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface CartState {
//   items: CartItem[];
//   addItem: (item: { name: string; price: number }) => void;
//   removeItem: (name: string) => void;
//   updateQuantity: (name: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotal: () => number;
//   getItemCount: () => number;
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       items: [],
      
//       addItem: (item) => {
//         set((state) => {
//           const existingItem = state.items.find((i) => i.name === item.name);
//           if (existingItem) {
//             return {
//               items: state.items.map((i) =>
//                 i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
//               ),
//             };
//           }
//           return { items: [...state.items, { ...item, quantity: 1 }] };
//         });
//       },
      
//       removeItem: (name) => {
//         set((state) => ({
//           items: state.items.filter((i) => i.name !== name),
//         }));
//       },
      
//       updateQuantity: (name, quantity) => {
//         if (quantity <= 0) {
//           get().removeItem(name);
//           return;
//         }
//         set((state) => ({
//           items: state.items.map((i) =>
//             i.name === name ? { ...i, quantity } : i
//           ),
//         }));
//       },
      
//       clearCart: () => set({ items: [] }),
      
//       getTotal: () => {
//         return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//       },
      
//       getItemCount: () => {
//         return get().items.reduce((sum, item) => sum + item.quantity, 0);
//       },
//     }),
//     {
//       name: 'cart-storage',
//     }
//   )
// );


// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface CartItem {
//   _id?: string;
//   itemId?: string;
//   name: string;
//   price: number;
//   quantity: number;
//   stock?: number | null;
//   unit?: string;
// }

// interface CartState {
//   items: CartItem[];
//   addItem: (item: {
//     _id?: string;
//     itemId?: string;
//     name: string;
//     price: number;
//     stock?: number | null;
//     unit?: string;
//   }) => void;
//   removeItem: (name: string) => void;
//   updateQuantity: (name: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotal: () => number;
//   getItemCount: () => number;
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       items: [],

//       // addItem: (item) => {
//       //   set((state) => {
//       //     const existingItem = state.items.find((i) => i.name === item.name);

//       //     if (existingItem) {
//       //       const maxQty =
//       //         typeof existingItem.stock === 'number'
//       //           ? existingItem.stock
//       //           : Infinity;

//       //       return {
//       //         items: state.items.map((i) =>
//       //           i.name === item.name
//       //             ? {
//       //                 ...i,
//       //                 quantity: i.quantity < maxQty ? i.quantity + 1 : i.quantity,
//       //               }
//       //             : i
//       //         ),
//       //       };
//       //     }

//       //     return {
//       //       items: [
//       //         ...state.items,
//       //         {
//       //           ...item,
//       //           quantity: 1,
//       //         },
//       //       ],
//       //     };
//       //   });
//       // },

//       addItem: (item) => {
//   set((state) => {
//     const existingItem = state.items.find((i) => i.name === item.name);
//     const incomingQty = (item as any).quantity || 1;

//     if (existingItem) {
//       const maxQty =
//         typeof existingItem.stock === 'number' && existingItem.stock > 0
//           ? existingItem.stock
//           : Infinity;

//       return {
//         items: state.items.map((i) =>
//           i.name === item.name
//             ? {
//                 ...i,
//                 quantity: Math.min(i.quantity + incomingQty, maxQty),
//               }
//             : i
//         ),
//       };
//     }

//     return {
//       items: [
//         ...state.items,
//         {
//           ...item,
//           quantity: incomingQty,
//         },
//       ],
//     };
//   });
// },

//       removeItem: (name) => {
//         set((state) => ({
//           items: state.items.filter((i) => i.name !== name),
//         }));
//       },

//       // updateQuantity: (name, quantity) => {
//       //   if (quantity <= 0) {
//       //     get().removeItem(name);
//       //     return;
//       //   }

//       //   set((state) => ({
//       //     items: state.items.map((i) => {
//       //       if (i.name !== name) return i;

//       //       const maxQty =
//       //         typeof i.stock === 'number'
//       //           ? i.stock
//       //           : Infinity;

//       //       return {
//       //         ...i,
//       //         quantity: Math.min(quantity, maxQty),
//       //       };
//       //     }),
//       //   }));
//       // },

//       updateQuantity: (name, quantity) => {
//   if (quantity <= 0) {
//     get().removeItem(name);
//     return;
//   }

//   set((state) => ({
//     items: state.items.map((i) => {
//       if (i.name !== name) return i;

//       const maxQty =
//         typeof i.stock === 'number' && i.stock > 0
//           ? i.stock
//           : Infinity;

//       return {
//         ...i,
//         quantity: Math.min(quantity, maxQty),
//       };
//     }),
//   }));
// },

//       clearCart: () => set({ items: [] }),

//       getTotal: () => {
//         return get().items.reduce(
//           (sum, item) => sum + item.price * item.quantity,
//           0
//         );
//       },

//       getItemCount: () => {
//         return get().items.reduce((sum, item) => sum + item.quantity, 0);
//       },
//     }),
//     {
//       name: 'cart-storage',
//     }
//   )
// );

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface CartItem {
//   _id?: string;
//   name: string;
//   price: number;
//   quantity: number;
//   stock?: number | null;
//   unit?: string;
// }

// // interface CartState {
// //   items: CartItem[];
// //   addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
// //   removeItem: (name: string) => void;
// //   updateQuantity: (name: string, quantity: number) => void;
// //   clearCart: () => void;
// //   getTotal: () => number;
// //   getItemCount: () => number;
// // }

// interface CartState {
//   vendorId: string | null;
//   items: CartItem[];
//   addItem: (vendorId: string, item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
//   removeItem: (name: string) => void;
//   updateQuantity: (name: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotal: () => number;
//   getItemCount: () => number;
// }

// // export const useCartStore = create<CartState>()(
// //   persist(
// //     (set, get) => ({
// //       items: [],

// //       addItem: (item) => {
// //         set((state) => {
// //           const existing = state.items.find((i) => i.name === item.name);
// //           const incomingQty = item.quantity ?? 1;

// //           if (existing) {
// //             return {
// //               items: state.items.map((i) =>
// //                 i.name === item.name
// //                   ? { ...i, quantity: i.quantity + incomingQty }
// //                   : i
// //               ),
// //             };
// //           }

// //           return {
// //             items: [...state.items, { ...item, quantity: incomingQty }],
// //           };
// //         });
// //       },

// //       removeItem: (name) =>
// //         set((state) => ({
// //           items: state.items.filter((i) => i.name !== name),
// //         })),

// //       updateQuantity: (name, quantity) => {
// //         if (quantity <= 0) {
// //           set((state) => ({
// //             items: state.items.filter((i) => i.name !== name),
// //           }));
// //           return;
// //         }
// //         set((state) => ({
// //           items: state.items.map((i) =>
// //             i.name === name ? { ...i, quantity } : i
// //           ),
// //         }));
// //       },

// //       clearCart: () => set({ items: [] }),

// //       getTotal: () =>
// //         get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

// //       getItemCount: () =>
// //         get().items.reduce((sum, item) => sum + item.quantity, 0),
// //     }),
// //     { name: 'cart-storage' }
// //   )
// // );

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       vendorId: null,
//       items: [],

//       addItem: (vendorId, item) => {
//         set((state) => {
//           const incomingQty = item.quantity ?? 1;

//           if (state.vendorId && state.vendorId !== vendorId) {
//             return {
//               vendorId,
//               items: [{ ...item, quantity: incomingQty }],
//             };
//           }

//           const existing = state.items.find((i) => i.name === item.name);

//           if (existing) {
//             return {
//               vendorId,
//               items: state.items.map((i) =>
//                 i.name === item.name
//                   ? { ...i, quantity: i.quantity + incomingQty }
//                   : i
//               ),
//             };
//           }

//           return {
//             vendorId,
//             items: [...state.items, { ...item, quantity: incomingQty }],
//           };
//         });
//       },

//       removeItem: (name) =>
//         set((state) => ({
//           items: state.items.filter((i) => i.name !== name),
//         })),

//       updateQuantity: (name, quantity) => {
//         if (quantity <= 0) {
//           set((state) => ({
//             items: state.items.filter((i) => i.name !== name),
//           }));
//           return;
//         }

//         set((state) => ({
//           items: state.items.map((i) =>
//             i.name === name ? { ...i, quantity } : i
//           ),
//         }));
//       },

//       clearCart: () => set({ items: [], vendorId: null }),

//       getTotal: () =>
//         get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

//       getItemCount: () =>
//         get().items.reduce((sum, item) => sum + item.quantity, 0),
//     }),
//     { name: 'cart-storage' }
//   )
// );


// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface CartItem {
//   _id?: string;
//   name: string;
//   price: number;
//   quantity: number;
//   stock?: number | null;
//   unit?: string;
// }

// interface CartState {
//   vendorId: string | null;
//   items: CartItem[];
//   addItem: (
//     vendorId: string,
//     item: Omit<CartItem, 'quantity'> & { quantity?: number }
//   ) => void;
//   removeItem: (name: string) => void;
//   updateQuantity: (name: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotal: () => number;
//   getItemCount: () => number;
// }

// export const useCartStore = create<CartState>()(
//   persist(
//     (set, get) => ({
//       vendorId: null,
//       items: [],

//       addItem: (vendorId, item) => {
//         set((state) => {
//           const incomingQty = item.quantity ?? 1;

//           if (state.items.length > 0 && state.vendorId && state.vendorId !== vendorId) {
//             return {
//               vendorId,
//               items: [{ ...item, quantity: incomingQty }],
//             };
//           }

//           const existing = state.items.find((i) => i.name === item.name);

//           if (existing) {
//             return {
//               vendorId,
//               items: state.items.map((i) =>
//                 i.name === item.name
//                   ? { ...i, quantity: i.quantity + incomingQty }
//                   : i
//               ),
//             };
//           }

//           return {
//             vendorId,
//             items: [...state.items, { ...item, quantity: incomingQty }],
//           };
//         });
//       },

//       removeItem: (name) =>
//         set((state) => {
//           const updatedItems = state.items.filter((i) => i.name !== name);

//           return {
//             items: updatedItems,
//             vendorId: updatedItems.length > 0 ? state.vendorId : null,
//           };
//         }),

//       updateQuantity: (name, quantity) => {
//         if (quantity <= 0) {
//           set((state) => {
//             const updatedItems = state.items.filter((i) => i.name !== name);

//             return {
//               items: updatedItems,
//               vendorId: updatedItems.length > 0 ? state.vendorId : null,
//             };
//           });
//           return;
//         }

//         set((state) => ({
//           items: state.items.map((i) =>
//             i.name === name ? { ...i, quantity } : i
//           ),
//         }));
//       },

//       clearCart: () => set({ items: [], vendorId: null }),

//       getTotal: () =>
//         get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

//       getItemCount: () =>
//         get().items.reduce((sum, item) => sum + item.quantity, 0),
//     }),
//     { name: 'cart-storage' }
//   )
// );


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number | null;
  unit?: string;
}

interface CartState {
  vendorId: string | null;
  items: CartItem[];
  addItem: (
    vendorId: string,
    item: Omit<CartItem, 'quantity'> & { quantity?: number }
  ) => boolean;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => boolean;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      vendorId: null,
      items: [],

      addItem: (vendorId, item) => {
        let added = true;

        set((state) => {
          const incomingQty = item.quantity ?? 1;

          if (state.items.length > 0 && state.vendorId && state.vendorId !== vendorId) {
            return {
              vendorId,
              items: [{ ...item, quantity: incomingQty }],
            };
          }

          const existing = state.items.find((i) => i.name === item.name);

          const shouldCheckStock =
            typeof item.stock === 'number' && item.stock >= 0;

          if (existing) {
            const nextQty = existing.quantity + incomingQty;

            if (shouldCheckStock && nextQty > item.stock!) {
              added = false;
              return state;
            }

            return {
              vendorId,
              items: state.items.map((i) =>
                i.name === item.name
                  ? { ...i, quantity: nextQty }
                  : i
              ),
            };
          }

          if (shouldCheckStock && incomingQty > item.stock!) {
            added = false;
            return state;
          }

          return {
            vendorId,
            items: [...state.items, { ...item, quantity: incomingQty }],
          };
        });

        return added;
      },

      removeItem: (name) =>
        set((state) => {
          const updatedItems = state.items.filter((i) => i.name !== name);

          return {
            items: updatedItems,
            vendorId: updatedItems.length > 0 ? state.vendorId : null,
          };
        }),

      updateQuantity: (name, quantity) => {
        let updated = true;

        if (quantity <= 0) {
          set((state) => {
            const updatedItems = state.items.filter((i) => i.name !== name);

            return {
              items: updatedItems,
              vendorId: updatedItems.length > 0 ? state.vendorId : null,
            };
          });
          return true;
        }

        set((state) => {
          const existing = state.items.find((i) => i.name === name);
          if (!existing) return state;

          const shouldCheckStock =
            typeof existing.stock === 'number' && existing.stock >= 0;

          if (shouldCheckStock && quantity > existing.stock!) {
            updated = false;
            return state;
          }

          return {
            items: state.items.map((i) =>
              i.name === name ? { ...i, quantity } : i
            ),
          };
        });

        return updated;
      },

      clearCart: () => set({ items: [], vendorId: null }),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);