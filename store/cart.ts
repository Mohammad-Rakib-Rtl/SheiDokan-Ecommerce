import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: number;
  slug: string;
  title: string;
  image: string;
  price: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  wishlist: number[];
  add: (id: number) => void;
  addItem: (item: CartItem) => void;
  increaseQuantity: (item: CartItem) => void;
  decreaseQuantity: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
  wish: (id: number) => void;
};

const isSameVariant = (a: CartItem, b: CartItem) =>
  a.productId === b.productId && a.selectedColor === b.selectedColor && a.selectedSize === b.selectedSize;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      add: (id) =>
        set((state) => ({
          items: [
            ...state.items,
            { productId: id, slug: String(id), title: `Product ${id}`, image: '', price: 0, selectedColor: '', selectedSize: '', quantity: 1 },
          ],
        })),
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((cartItem) => isSameVariant(cartItem, item));

          if (!existingItem) return { items: [...state.items, { ...item, quantity: Math.max(1, item.quantity) }] };

          return {
            items: state.items.map((cartItem) =>
              isSameVariant(cartItem, item) ? { ...cartItem, quantity: cartItem.quantity + Math.max(1, item.quantity) } : cartItem,
            ),
          };
        }),
      increaseQuantity: (item) =>
        set((state) => ({
          items: state.items.map((cartItem) => (isSameVariant(cartItem, item) ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
        })),
      decreaseQuantity: (item) =>
        set((state) => ({
          items: state.items
            .map((cartItem) => (isSameVariant(cartItem, item) ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem))
            .filter((cartItem) => cartItem.quantity > 0),
        })),
      removeItem: (item) => set((state) => ({ items: state.items.filter((cartItem) => !isSameVariant(cartItem, item)) })),
      clearCart: () => set({ items: [] }),
      wish: (id) => set((state) => ({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id] })),
    }),
    { name: 'sheidokan-cart' },
  ),
);
