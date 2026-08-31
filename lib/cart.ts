import { create } from "zustand";

export interface CartItem {
  key: string;
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  itemCount: () => number;
}

function makeKey(item: { id: string; size?: string; color?: string }) {
  return `${item.id}__${item.size || ""}__${item.color || ""}`;
}

export const useCart = create<CartState>()((set, get) => ({
  items: [],
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addItem: (item) =>
    set((state) => {
      const key = makeKey(item);
      const existing = state.items.find((i) => i.key === key);
      const qty = item.quantity || 1;

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.min(i.stock || 99, i.quantity + qty) }
              : i
          ),
          isOpen: true,
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            key,
            quantity: Math.min(item.stock || 99, qty),
          },
        ],
        isOpen: true,
      };
    }),

  removeItem: (key) =>
    set((state) => ({
      items: state.items.filter((i) => i.key !== key),
    })),

  updateQuantity: (key, quantity) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.key === key
            ? { ...i, quantity: Math.max(1, Math.min(i.stock || 99, quantity)) }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  clear: () => set({ items: [] }),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
