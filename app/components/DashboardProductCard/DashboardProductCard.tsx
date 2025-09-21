"use client";

import React from "react";
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

  const handleClick = () => {
    router.push(`/dashboard/products/${product.id}`);
  };

  return (
    <div onClick={handleClick} className="w-[412px] h-auto cursor-pointer">
      <Image
        src={product.cover_image}
        alt={product.name}
        width={412}
        height={549}
        className="w-full h-[549px] object-cover rounded-[10px]"
      />
      <h2 className="mt-[12px] text-[#10151F] text-[18px] leading-[100%] tracking-[0%]">
        {product.name}
      </h2>
      <h2 className="mt-[12px] text-[#10151F] text-[18px] leading-[100%] tracking-[0%]">
        ${product.price}
      </h2>
    </div>
  );
};
