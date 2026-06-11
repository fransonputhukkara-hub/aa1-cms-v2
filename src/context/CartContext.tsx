import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  toast: string | null;
  add: (product: Product, qty?: number) => void;
  changeQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((notify as unknown as { t?: number }).t);
    (notify as unknown as { t?: number }).t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const add = useCallback(
    (product: Product, qty: number = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        // Never let the bag exceed the live shared stock.
        if (existing) {
          const next = Math.min(existing.qty + qty, product.stock);
          return prev.map((i) => (i.id === product.id ? { ...i, qty: next } : i));
        }
        return [...prev, { ...product, qty: Math.min(qty, product.stock) }];
      });
      notify(`${product.name} added to your bag`);
    },
    [notify],
  );

  const changeQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + delta, i.stock) } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const value: CartContextValue = {
    items,
    isOpen,
    count,
    subtotal,
    toast,
    add,
    changeQty,
    remove,
    clearCart,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
