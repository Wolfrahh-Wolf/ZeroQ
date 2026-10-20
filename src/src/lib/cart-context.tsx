"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  outletId: number | null;
  outletName: string;
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; itemId: number }
  | { type: "INCREMENT"; itemId: number }
  | { type: "DECREMENT"; itemId: number }
  | { type: "CLEAR" }
  | { type: "SET_OUTLET"; outletId: number; outletName: string };

const initial: CartState = { items: [], outletId: null, outletName: "" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_OUTLET":
      return { ...state, outletId: action.outletId, outletName: action.outletName, items: [] };
    case "ADD": {
      const exists = state.items.find((i) => i.item_id === action.item.item_id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.item_id === action.item.item_id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.item_id !== action.itemId) };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.item_id === action.itemId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.item_id === action.itemId && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
      };
    case "CLEAR":
      return initial;
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = state.items.reduce((s, i) => s + i.quantity * i.price, 0);
  return (
    <CartContext.Provider value={{ state, dispatch, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
