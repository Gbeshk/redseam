"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ProductPageLoadingSpinner } from "../ProductPageLoadingSpinner/ProductPageLoadingSpinner";
import NoShoppingCart from "../../../public/images/shopping-cart.svg";

interface ProductPageAddToCartButtonProps {
  isDisabled: boolean;
  isAddingToCart: boolean;
  onClick: () => Promise<void>;
  shoppingCartIcon: string;
}

export const ProductPageAddToCartButton: React.FC<
  ProductPageAddToCartButtonProps
> = ({ isDisabled, onClick, shoppingCartIcon }) => {
  const [animationState, setAnimationState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleClick = async () => {
    if (isDisabled || animationState !== "idle") return;

    const token = Cookies.get("token");
    if (!token) {
      // Pass current URL as query parameter to sign-in page
      const currentUrl = encodeURIComponent(window.location.href);
      router.push(`/sign-in?redirect=${currentUrl}`);
      return;
    }

    setAnimationState("loading");

    try {
      await onClick();
      setAnimationState("success");

      setTimeout(() => {
        setAnimationState("idle");
      }, 2000);
    } catch {
      setAnimationState("idle");
    }
  };

  const iconToShow = isDisabled ? NoShoppingCart : shoppingCartIcon;

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes checkmarkDraw {
          0% {
            stroke-dasharray: 0, 50;
          }
          100% {
            stroke-dasharray: 50, 0;
          }
        }

        @keyframes gentlePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .slide-up {
          animation: slideUp 0.3s ease-out;
        }

        .gentle-pulse {
          animation: gentlePulse 2s ease-in-out;
        }
      `}</style>

      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isDisabled || animationState !== "idle"}
        className={`relative w-full h-[59px] rounded-[10px] flex items-center justify-center gap-[10px] mt-[52px] transition-all duration-300 ease-out ${
          isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : animationState === "loading"
            ? "bg-[#FF4000] cursor-wait"
            : animationState === "success"
            ? "bg-green-500 gentle-pulse"
            : "bg-[#FF4000] cursor-pointer hover:bg-[#e63600] hover:shadow-md active:scale-[0.98]"
        }`}
      >
        {animationState === "loading" && (
          <div className="flex items-center gap-3 slide-up">
            <ProductPageLoadingSpinner size="small" />
            <span className="text-white font-medium">Adding...</span>
          </div>
        )}

        {animationState === "success" && (
          <div className="flex items-center gap-3 slide-up">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                style={{
                  animation: "checkmarkDraw 0.5s ease-out 0.1s both",
                }}
              />
            </svg>
            <span className="text-white font-semibold">Added to Cart</span>
          </div>
        )}

        {animationState === "idle" && (
          <div className="flex items-center gap-[10px] slide-up">
            <Image
              src={iconToShow}
              width={24}
              height={24}
              alt="Shopping Cart"
              className={`transition-opacity duration-200 ${
                isDisabled ? "opacity-50" : ""
              }`}
            />
            <span
              className={`text-[18px] leading-[100%] tracking-[0%] font-medium mt-[1.5px] transition-colors duration-200 ${
                isDisabled ? "text-gray-500" : "text-white"
              }`}
            >
              {isDisabled ? "Not Available" : "Add to cart"}
            </span>
          </div>
        )}
      </button>
    </>
  );
};