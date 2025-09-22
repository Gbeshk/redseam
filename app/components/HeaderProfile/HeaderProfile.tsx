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
    if (newQuantity < 1) return; // Prevent quantity from going below 1
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

  const getSubtotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDeliveryPrice = () => {
    return 5; // Fixed $5 delivery
  };

  const getTotalPrice = () => {
    return getSubtotalPrice() + getDeliveryPrice();
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
            className={`fixed top-0 right-0 h-full w-[540px] bg-white pb-[40px] shadow-2xl transform transition-transform duration-500 ease-out ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-[40px] pt-[40px] border-gray-200">
                <h2 className="text-[24px] font-semibold text-[#10151F]">
                  Shopping cart: ({cartItems.length})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <svg
                    className="w-[32px] h-[32px] cursor-pointer"
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

              <div className="flex-1 overflow-y-auto px-[40px] mt-[56px] ">
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
                  <div className="flex flex-col gap-[36px] ">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex">
                        <div className="w-[100px] h-[134px] bg-gray-200 rounded-[10px]  border-[1px] border-[#E1DFE1] flex items-center justify-center overflow-hidden">
                          {item.cover_image ? (
                            <Image
                              src={item.cover_image}
                              alt={item.name}
                              width={100}
                              height={134}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">Image</span>
                          )}
                        </div>
                        <div className="h-[117px] my-auto ml-[16px] w-full flex flex-col justify-between">
                          <div className="flex justify-between items-center w-full">
                            <p className="font-medium text-[14px]  text-[#10151F] capitalize">
                              {item.name}
                            </p>
                            <p className="font-medium text-[18px]  text-[#10151F] capitalize">
                              $ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-[#3E424A] font-normal text-[12px]">
                            {item.color}
                          </p>
                          <p className="text-[#3E424A] font-normal text-[12px]">
                            {item.size}
                          </p>
                          <div className="h-[26px] flex justify-between items-center">
                            <div className="w-[70px] h-[26px] flex items-center justify-around rounded-[22px] border-[1px] border-[#E1DFE1]">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${
                                  item.quantity <= 1 
                                    ? 'cursor-default' 
                                    : 'cursor-pointer hover:bg-gray-100'
                                }`}
                                style={{
                                  color: item.quantity <= 1 ? '#E1DFE1' : 'inherit'
                                }}
                              >
                                -
                              </button>
                              <span className="font-normal text-[12px] text-[#3E424A]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-[24px] h-[24px] rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="text-[12px] text-[#3E424A] hover:underline cursor-pointer"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="px-[40px]">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between h-[24px]">
                      <p className="text-[#3E424A] text-[16px]">
                        Items subtotal
                      </p>
                      <p className="text-[#3E424A] text-[16px]">
                        $ {Math.round(getSubtotalPrice())}
                      </p>
                    </div>
                    <div className="flex items-center justify-between h-[24px] mt-[16px]">
                      <p className="text-[#3E424A] text-[16px]">Delivery</p>
                      <p className="text-[#3E424A] text-[16px]">
                        $ {getDeliveryPrice()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between h-[30px] mt-[16px]">
                      <p className="text-[#3E424A] text-[20px] font-medium">
                        Total
                      </p>
                      <p className="text-[#3E424A] text-[20px] font-medium">
                        $ {Math.round(getTotalPrice())}
                      </p>
                    </div>
                  </div>
                  <button className="mt-[98px] h-[59px] w-full bg-[#FF4000] text-white rounded-[10px] cursor-pointer font-medium text-[18px] hover:bg-[#E63600] transition-colors">
                    Go to checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}