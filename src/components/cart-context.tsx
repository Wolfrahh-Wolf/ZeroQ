"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

interface OutletSelection { id: string; slug: string; name: string }
interface CartContextValue {
  items: CartItem[];
  outletId: string | null;
  outletSlug: string | null;
  outletName: string | null;
  itemCount: number;
  total: number;
  isOpen: boolean;
  notice: string;
  openCart: () => void;
  closeCart: () => void;
  clearNotice: () => void;
  addItem: (item: CartItem, outlet: OutletSelection) => boolean;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
}

type CartState = Pick<CartContextValue, "items" | "outletId" | "outletSlug" | "outletName" | "isOpen" | "notice">;
type Action =
  | { type: "HYDRATE"; payload: Pick<CartState, "items" | "outletId" | "outletSlug" | "outletName"> }
  | { type: "ADD_ITEM"; item: CartItem; outlet: OutletSelection }
  | { type: "REMOVE_ITEM"; menuItemId: string }
  | { type: "UPDATE_QUANTITY"; menuItemId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "CLEAR_NOTICE" };

const initialState: CartState = { items: [], outletId: null, outletSlug: null, outletName: null, isOpen: false, notice: "" };
const STORAGE_KEY = "zeroq-cart-v1";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE": return { ...state, ...action.payload };
    case "ADD_ITEM": {
      if (state.outletId && state.outletId !== action.outlet.id) {
        return { ...state, notice: `Your cart contains items from ${state.outletName}. Clear it before ordering from ${action.outlet.name}.` };
      }
      const existing = state.items.find((item) => item.menuItemId === action.item.menuItemId);
      const items = existing
        ? state.items.map((item) => item.menuItemId === action.item.menuItemId ? { ...item, quantity: item.quantity + action.item.quantity } : item)
        : [...state.items, action.item];
      return { ...state, items, outletId: action.outlet.id, outletSlug: action.outlet.slug, outletName: action.outlet.name, notice: "" };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((item) => item.menuItemId !== action.menuItemId);
      return { ...state, items, ...(items.length ? {} : { outletId: null, outletSlug: null, outletName: null }) };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const items = state.items.filter((item) => item.menuItemId !== action.menuItemId);
        return { ...state, items, ...(items.length ? {} : { outletId: null, outletSlug: null, outletName: null }) };
      }
      return { ...state, items: state.items.map((item) => item.menuItemId === action.menuItemId ? { ...item, quantity: action.quantity } : item) };
    }
    case "CLEAR_CART": return { ...state, items: [], outletId: null, outletSlug: null, outletName: null, notice: "" };
    case "OPEN": return { ...state, isOpen: true };
    case "CLOSE": return { ...state, isOpen: false };
    case "CLEAR_NOTICE": return { ...state, notice: "" };
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isPersistedCart(parsed)) dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled by the browser. */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, outletId: state.outletId, outletSlug: state.outletSlug, outletName: state.outletName }));
  }, [hydrated, state.items, state.outletId, state.outletSlug, state.outletName]);

  const value = useMemo<CartContextValue>(() => ({
    ...state,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    total: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    openCart: () => dispatch({ type: "OPEN" }),
    closeCart: () => dispatch({ type: "CLOSE" }),
    clearNotice: () => dispatch({ type: "CLEAR_NOTICE" }),
    addItem: (item, outlet) => {
      if (state.outletId && state.outletId !== outlet.id) {
        dispatch({ type: "ADD_ITEM", item, outlet });
        return false;
      }
      dispatch({ type: "ADD_ITEM", item, outlet });
      return true;
    },
    removeItem: (menuItemId) => dispatch({ type: "REMOVE_ITEM", menuItemId }),
    updateQuantity: (menuItemId, quantity) => dispatch({ type: "UPDATE_QUANTITY", menuItemId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function isPersistedCart(value: unknown): value is Pick<CartState, "items" | "outletId" | "outletSlug" | "outletName"> {
  if (!value || typeof value !== "object") return false;
  const cart = value as Record<string, unknown>;
  return Array.isArray(cart.items)
    && cart.items.every((item: unknown) => item && typeof item === "object" && typeof (item as CartItem).menuItemId === "string" && typeof (item as CartItem).name === "string" && typeof (item as CartItem).price === "number" && typeof (item as CartItem).quantity === "number")
    && (typeof cart.outletId === "string" || cart.outletId === null)
    && (typeof cart.outletSlug === "string" || cart.outletSlug === null)
    && (typeof cart.outletName === "string" || cart.outletName === null);
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
