"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ShoppingCart from "../../../public/images/shopping-cart.svg";
import ArrowDown from "../../../public/images/arrow-down.svg";
import defaultProfile from "../../../public/images/default-profile.svg";
import { User } from "@/app/types/sign-up-types/sign-up-types";
import { useCart } from "../contexts/CartContext";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

interface HeaderProfileProps {
  onArrowClick: () => void;
}

export default function HeaderProfile({ onArrowClick }: HeaderProfileProps) {
  const [profileUrl, setProfileUrl] = useState<string>(defaultProfile.src);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use cart context instead of local state
  const {
    cartItems,
    cartCount,
    isLoading,
    error,
    fetchCart,
    updateCartItem,
    removeCartItem,
  } = useCart();

  useEffect(() => {
    try {
      const userCookie = getCookie("user");
      if (!userCookie) return;

      const user: User = JSON.parse(decodeURIComponent(userCookie));
      if (user.avatar) {
        setProfileUrl(user.avatar);
      }
    } catch (error) {
      console.error("Failed to parse user from cookie:", error);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };

    if (isAnimating) {
      document.addEventListener("keydown", handleEscape);
      if (isCartOpen) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isAnimating, isCartOpen]);

  const openCart = () => {
    setIsAnimating(true);
    setTimeout(() => setIsCartOpen(true), 10);
    fetchCart(); // Fetch full cart data when opening
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    try {
      await updateCartItem(id, newQuantity);
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await removeCartItem(id);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="relative">
          <Image
            src={ShoppingCart}
            alt="shoppingCart"
            width={24}
            height={24}
            className="w-[24px] h-[24px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={openCart}
          />
          {cartCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-[#FF4000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {cartCount}
            </div>
          )}
        </div>
        <Image
          src={profileUrl}
          alt="profile"
          width={40}
          height={40}
          className="w-[40px] h-[40px] ml-[20px] rounded-full object-cover"
        />
        <Image
          src={ArrowDown}
          alt="arrowDown"
          width={20}
          height={20}
          className="w-[20px] h-[20px] ml-[4px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onArrowClick}
        />
      </div>

      {isAnimating && (
        <div className="fixed inset-0 z-50">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              isCartOpen ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: "rgba(16, 21, 31, 0.3)" }}
            onClick={closeCart}
          />

          <div
            className={`fixed top-0 right-0 h-full w-[540px] bg-white shadow-2xl transform transition-transform duration-500 ease-out ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-[24px] font-semibold text-[#10151F]">
                  Shopping Cart: ({cartItems.length})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4000] mb-4"></div>
                    <p className="text-gray-500">Loading cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Image
                        src={ShoppingCart}
                        alt="Empty cart"
                        width={24}
                        height={24}
                        className="opacity-50"
                      />
                    </div>
                    <h3 className="text-[18px] font-medium text-[#10151F] mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Add some products to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">Image</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-[#10151F] truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Color: {item.color} | Size: {item.size}
                          </p>
                          <p className="text-[16px] font-semibold text-[#10151F] mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <span className="min-w-[2rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[18px] font-medium text-[#10151F]">
                      Total:
                    </span>
                    <span className="text-[24px] font-semibold text-[#10151F]">
                      ${getTotalPrice()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full h-[50px] bg-[#FF4000] text-white rounded-lg font-medium hover:bg-[#e63600] transition-colors">
                      Checkout
                    </button>
                    <button
                      className="w-full h-[50px] border border-gray-300 text-[#10151F] rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
