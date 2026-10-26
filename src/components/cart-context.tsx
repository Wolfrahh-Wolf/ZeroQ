"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

export interface OutletSelection { id: string; slug: string; name: string }

export interface OutletGroup {
  outlet: OutletSelection;
  items: CartItem[];
}

interface CartContextValue {
  groups: OutletGroup[];
  itemCount: number;
  grandTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem, outlet: OutletSelection) => void;
  removeItem: (menuItemId: string, outletId: string) => void;
  updateQuantity: (menuItemId: string, outletId: string, quantity: number) => void;
  clearOutletGroup: (outletId: string) => void;
  clearCart: () => void;
}

type CartState = {
  groups: OutletGroup[];
  isOpen: boolean;
};

type Action =
  | { type: "HYDRATE"; payload: { groups: OutletGroup[] } }
  | { type: "ADD_ITEM"; item: CartItem; outlet: OutletSelection }
  | { type: "REMOVE_ITEM"; menuItemId: string; outletId: string }
  | { type: "UPDATE_QUANTITY"; menuItemId: string; outletId: string; quantity: number }
  | { type: "CLEAR_OUTLET_GROUP"; outletId: string }
  | { type: "CLEAR_CART" }
  | { type: "OPEN" }
  | { type: "CLOSE" };

const initialState: CartState = { groups: [], isOpen: false };
// Incremented to v2 to invalidate old single-outlet cart data
const STORAGE_KEY = "zeroq-cart-v2";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE": return { ...state, groups: action.payload.groups };

    case "ADD_ITEM": {
      const groupIndex = state.groups.findIndex((g) => g.outlet.id === action.outlet.id);
      if (groupIndex === -1) {
        // Create a new outlet group
        return { ...state, groups: [...state.groups, { outlet: action.outlet, items: [action.item] }] };
      }
      const group = state.groups[groupIndex];
      const existing = group.items.find((i) => i.menuItemId === action.item.menuItemId);
      const updatedItems = existing
        ? group.items.map((i) => i.menuItemId === action.item.menuItemId ? { ...i, quantity: i.quantity + action.item.quantity } : i)
        : [...group.items, action.item];
      const updatedGroup: OutletGroup = { ...group, items: updatedItems };
      const groups = [...state.groups];
      groups[groupIndex] = updatedGroup;
      return { ...state, groups };
    }

    case "REMOVE_ITEM": {
      const groups = state.groups
        .map((g) => g.outlet.id !== action.outletId ? g : { ...g, items: g.items.filter((i) => i.menuItemId !== action.menuItemId) })
        .filter((g) => g.items.length > 0);
      return { ...state, groups };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return reducer(state, { type: "REMOVE_ITEM", menuItemId: action.menuItemId, outletId: action.outletId });
      }
      const groups = state.groups.map((g) =>
        g.outlet.id !== action.outletId ? g
          : { ...g, items: g.items.map((i) => i.menuItemId === action.menuItemId ? { ...i, quantity: action.quantity } : i) }
      );
      return { ...state, groups };
    }

    case "CLEAR_OUTLET_GROUP": {
      const groups = state.groups.filter((g) => g.outlet.id !== action.outletId);
      return { ...state, groups };
    }

    case "CLEAR_CART": return { ...state, groups: [] };
    case "OPEN": return { ...state, isOpen: true };
    case "CLOSE": return { ...state, isOpen: false };
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
        if (isPersistedCart(parsed)) dispatch({ type: "HYDRATE", payload: { groups: parsed.groups } });
      }
    } catch {
      try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ groups: state.groups }));
  }, [hydrated, state.groups]);

  const value = useMemo<CartContextValue>(() => ({
    ...state,
    itemCount: state.groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0), 0),
    grandTotal: state.groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.price * i.quantity, 0), 0),
    openCart: () => dispatch({ type: "OPEN" }),
    closeCart: () => dispatch({ type: "CLOSE" }),
    addItem: (item, outlet) => dispatch({ type: "ADD_ITEM", item, outlet }),
    removeItem: (menuItemId, outletId) => dispatch({ type: "REMOVE_ITEM", menuItemId, outletId }),
    updateQuantity: (menuItemId, outletId, quantity) => dispatch({ type: "UPDATE_QUANTITY", menuItemId, outletId, quantity }),
    clearOutletGroup: (outletId) => dispatch({ type: "CLEAR_OUTLET_GROUP", outletId }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.menuItemId === "string"
    && typeof item.name === "string"
    && typeof item.price === "number"
    && typeof item.quantity === "number"
    && typeof item.imageAsset === "string";
}

function isOutletSelection(value: unknown): value is OutletSelection {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.slug === "string" && typeof o.name === "string";
}

function isPersistedCart(value: unknown): value is { groups: OutletGroup[] } {
  if (!value || typeof value !== "object") return false;
  const cart = value as Record<string, unknown>;
  if (!Array.isArray(cart.groups)) return false;
  return cart.groups.every((g: unknown) => {
    if (!g || typeof g !== "object") return false;
    const group = g as Record<string, unknown>;
    return isOutletSelection(group.outlet) && Array.isArray(group.items) && group.items.every(isCartItem);
  });
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
