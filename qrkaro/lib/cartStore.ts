import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: { name: string; price: number }) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.name === item.name);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      
      removeItem: (name) => {
        set((state) => ({
          items: state.items.filter((i) => i.name !== name),
        }));
      },
      
      updateQuantity: (name, quantity) => {
        if (quantity <= 0) {
          get().removeItem(name);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.name === name ? { ...i, quantity } : i
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
