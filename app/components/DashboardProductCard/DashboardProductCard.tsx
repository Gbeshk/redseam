import React from "react";
import Image from "next/image";

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
  return (
    <div className="w-[412px] h-auto cursor-pointer">
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