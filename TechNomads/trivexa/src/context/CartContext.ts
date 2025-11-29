import { createContext } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  total: number;
};

export const CartContext = createContext<CartContextType | null>(null);
