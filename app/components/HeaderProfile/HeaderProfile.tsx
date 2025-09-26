"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ShoppingCart from "../../../public/images/shopping-cart.svg";
import ArrowDown from "../../../public/images/arrow-down.svg";
import defaultProfile from "../../../public/images/default-profile.svg";
import { User } from "@/app/types/sign-up-types/sign-up-types";
import { useCart } from "../contexts/CartContext";
import CartOverlay from "../CartOverlay/CartOverlay";
import Cart from "../Cart/Cart";

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

  const openCart = () => {
    setIsAnimating(true);
    setTimeout(() => setIsCartOpen(true), 10);
    fetchCart();
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const updateQuantity = async (uniqueId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(uniqueId, newQuantity);
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const removeItem = async (uniqueId: string) => {
    try {
      await removeCartItem(uniqueId);
    } catch (err) {
      console.error("Error removing item:", err);
    }
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
        <CartOverlay isOpen={isCartOpen} onClose={closeCart}>
          <Cart
            isOpen={isCartOpen}
            cartItems={cartItems}
            isLoading={isLoading}
            error={error}
            onClose={closeCart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </CartOverlay>
      )}
    </>
  );
}