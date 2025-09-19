import React from "react";

export const DashboardProductSkeleton: React.FC = () => {
  return (
    <div className="w-[412px] h-auto animate-pulse">
      <div className="w-full h-[549px] bg-gray-200 rounded-[10px]"></div>
      <div className="mt-[12px] h-[18px] bg-gray-200 rounded w-3/4"></div>
      <div className="mt-[12px] h-[18px] bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};