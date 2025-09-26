"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  cover_image: string;
  color: string;
  size: string;
  quantity: number;
}

interface AddToCartRequest {
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  refreshCartCount: () => Promise<void>;
  updateCartItem: (uniqueId: string, quantity: number) => Promise<void>;
  removeCartItem: (uniqueId: string) => Promise<void>;
  addToCart: (
    productId: number,
    quantity: number,
    color?: string,
    size?: string
  ) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

const parseUniqueId = (uniqueId: string) => {
  const parts = uniqueId.split('-');
  const productId = parseInt(parts[0]);
  const color = parts[1] === 'no-color' ? undefined : parts[1];
  const size = parts[2] === 'no-size' ? undefined : parts[2];
  return { productId, color, size };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getCookie("token");
      if (!token) {
        setCartItems([]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data: { items?: CartItem[] } | CartItem[] = await response.json();
      setCartItems(Array.isArray(data) ? data : data.items ?? []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err instanceof Error ? err.message : "Failed to load cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCartCount = useCallback(async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        setCartItems([]);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: { items?: CartItem[] } | CartItem[] = await response.json();
        setCartItems(Array.isArray(data) ? data : data.items ?? []);
      }
    } catch (err) {
      console.error("Error refreshing cart count:", err);
    }
  }, []);

  const updateCartItem = useCallback(async (uniqueId: string, quantity: number) => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("Authentication token not found");

      const { productId, color, size } = parseUniqueId(uniqueId);
      const targetItem = cartItems.find(item => 
        item.id === productId && 
        item.color === (color || '') && 
        item.size === (size || '')
      );

      if (!targetItem) throw new Error("Cart item not found");

      if (quantity === 0) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ color, size }),
          }
        );

        if (!response.ok) throw new Error("Failed to remove item from cart");
        setCartItems((prev) => prev.filter((item) => {
          const itemUniqueId = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
          return itemUniqueId !== uniqueId;
        }));
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/products/${productId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity, color, size }),
          }
        );

        if (!response.ok) throw new Error("Failed to update cart item");
        setCartItems((prev) =>
          prev.map((item) => {
            const itemUniqueId = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
            return itemUniqueId === uniqueId ? { ...item, quantity } : item;
          })
        );
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      throw err;
    }
  }, [cartItems]);

  const removeCartItem = useCallback(async (uniqueId: string) => {
    try {
      const token = getCookie("token");
      if (!token) throw new Error("Authentication token not found");

      const { productId, color, size } = parseUniqueId(uniqueId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ color, size }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove item from cart");
      setCartItems((prev) => prev.filter((item) => {
        const itemUniqueId = `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
        return itemUniqueId !== uniqueId;
      }));
    } catch (err) {
      console.error("Error removing item:", err);
      throw err;
    }
  }, []);

  const addToCart = useCallback(
    async (productId: number, quantity: number, color?: string, size?: string) => {
      try {
        const token = getCookie("token");
        if (!token) throw new Error("Authentication token not found");

        const requestBody: AddToCartRequest = { quantity };
        if (color) requestBody.color = color;
        if (size) requestBody.size = size;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/products/${productId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) throw new Error("Failed to add to cart");

        await refreshCartCount();
      } catch (err) {
        console.error("Error adding to cart:", err);
        throw err;
      }
    },
    [refreshCartCount]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const cartCount = cartItems.length;

  const value: CartContextType = {
    cartItems,
    cartCount,
    isLoading,
    error,
    fetchCart,
    refreshCartCount,
    updateCartItem,
    removeCartItem,
    addToCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}