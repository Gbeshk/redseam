"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string;
}

interface DashboardProductCardProps {
  product: Product;
}

export const DashboardProductCard: React.FC<DashboardProductCardProps> = ({
  product,
}) => {
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    router.push(`/dashboard/products/${product.id}`);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <div onClick={handleClick} className="w-[412px] h-auto cursor-pointer">
      <div className="relative w-full h-[549px] rounded-[10px] overflow-hidden bg-gray-100">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Image not available</span>
          </div>
        ) : (
          <Image
            src={product.cover_image}
            alt={product.name}
            width={412}
            height={549}
            className={`w-full h-[549px] object-cover transition-opacity duration-300 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      <h2 className="mt-[12px] text-[#10151F] text-[18px] leading-[100%] tracking-[0%]">
        {product.name}
      </h2>
      <h2 className="mt-[12px] text-[#10151F] text-[18px] leading-[100%] tracking-[0%]">
        ${product.price}
      </h2>
    </div>
  );
};
