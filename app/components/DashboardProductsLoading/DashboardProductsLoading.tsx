import React from "react";
import { DashboardProductSkeleton } from "../DashboardProductSkeleton/DashboardProductSkeleton";

export const DashboardProductsLoading: React.FC = () => {
  return (
    <div className="w-[1720px] mx-auto mt-[52px]">
      <div className="flex items-center justify-between mb-8">
        <div className="h-[42px] w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex gap-[32px] items-center">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="bg-[#E1DFE1] h-[14px] w-[1px]"></div>
          <div className="flex items-center gap-[8px]">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-3 gap-[24px] mt-[32px]">
        {Array.from({ length: 12 }).map((_, index) => (
          <DashboardProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
