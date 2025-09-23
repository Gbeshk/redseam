import React from "react";
import { Spinner } from "../Spinner/Spinner";
import { DashboardProductCard } from "../DashboardProductCard/DashboardProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  cover_image: string;
}

interface DashboardProductsGridProps {
  products: Product[];
  isPaginationLoading: boolean;
}

export const DashboardProductsGrid: React.FC<DashboardProductsGridProps> = ({
  products,
  isPaginationLoading,
}) => {
  return (
    <div className="relative">
      {isPaginationLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-[10px]">
          <Spinner />
        </div>
      )}
      <div
        className={`grid grid-cols-4 gap-x-[24px] gap-y-[48px] mt-[32px] ${
          isPaginationLoading ? "opacity-50" : ""
        }`}
      >
        {products.length === 0 ? (
          <div className="col-span-4 text-center text-[#10151F] text-[18px] font-poppins font-normal leading-[100%] tracking-[0%]">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <DashboardProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};
