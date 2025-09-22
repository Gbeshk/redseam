"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ProductPageLoadingSpinner } from "../ProductPageLoadingSpinner/ProductPageLoadingSpinner";

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

  const handleClick = async () => {
    if (isDisabled || animationState !== "idle") return;

    setAnimationState("loading");

    try {
      await onClick();

      setAnimationState("success");

      setTimeout(() => {
        setAnimationState("idle");
      }, 1200);
    } catch {
      setAnimationState("idle");
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes successPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmarkDraw {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isDisabled || animationState !== "idle"}
        className={`relative w-full h-[59px] rounded-[10px] flex items-center justify-center gap-[10px] mt-[52px] transition-all duration-300 overflow-hidden ${
          isDisabled
            ? "bg-gray-300 cursor-not-allowed"
            : animationState === "loading"
            ? "bg-[#FF4000] scale-[0.98] shadow-inner"
            : animationState === "success"
            ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-2xl scale-[1.02]"
            : "bg-[#FF4000] cursor-pointer hover:bg-[#e63600] hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        }`}
        style={{
          animation:
            animationState === "success"
              ? "successPulse 0.6s ease-in-out"
              : undefined,
        }}
      >
        {animationState === "loading" && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <ProductPageLoadingSpinner size="small" />
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
            </div>
            <span className="text-white font-medium animate-pulse">
              Adding to cart...
            </span>
          </div>
        )}

        {animationState === "success" && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="w-7 h-7 text-white drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: "50",
                    strokeDashoffset: "50",
                    animation: "checkmarkDraw 0.6s ease-out forwards",
                  }}
                />
              </svg>
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              Added to Cart!
            </span>
          </div>
        )}

        {animationState === "idle" && (
          <>
            <div className="transition-all duration-200">
              <Image
                src={shoppingCartIcon}
                width={24}
                height={24}
                alt="Shopping Cart"
                className={isDisabled ? "opacity-50" : ""}
              />
            </div>
            <span
              className={`text-[18px] leading-[100%] tracking-[0%] font-medium mt-[1.5px] transition-all duration-200 ${
                isDisabled ? "text-gray-500" : "text-white"
              }`}
            >
              {isDisabled ? "Not Available" : "Add to cart"}
            </span>
          </>
        )}
      </button>
    </>
  );
};
