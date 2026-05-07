import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem, Order, OrderStatus } from "./data";
import { sampleOrders } from "./data";

type CartItem = MenuItem & { qty: number };

type CartState = {
  items: CartItem[];
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set((s) => {
        const existing = s.items.find((i) => i.id === item.id);
        if (existing) return { items: s.items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) };
        return { items: [...s.items, { ...item, qty: 1 }] };
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) => set((s) => ({
        items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => i.id === id ? { ...i, qty } : i),
      })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: "tandoor-cart" },
  ),
);

type Role = "customer" | "chef" | "admin" | null;

type AuthState = {
  role: Role;
  name: string;
  login: (role: Exclude<Role, null>, name: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      name: "",
      login: (role, name) => set({ role, name }),
      logout: () => set({ role: null, name: "" }),
    }),
    { name: "tandoor-auth" },
  ),
);

type OrdersState = {
  orders: Order[];
  add: (o: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: sampleOrders,
      add: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      updateStatus: (id, status) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? { ...o, status } : o),
      })),
    }),
    { name: "tandoor-orders" },
  ),
);
