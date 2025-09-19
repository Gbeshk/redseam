import React from "react";
import { DashboardProductsFilter } from "../DashboardProductsFilter/DashboardProductsFilter";
import { DashboardProductsSort } from "../DashboardProductsSort/DashboardProductsSort";

interface DashboardProductsHeaderProps {
  totalProducts: number;
  currentPage: number;
  perPage: number;
  appliedPriceFrom: string;
  appliedPriceTo: string;
  sortBy: string;
  isSorting: boolean;
  onFilterApply: (priceFrom: string, priceTo: string) => void;
  onFilterRemove: () => void;
  onSortChange: (sort: string) => void;
}

export const DashboardProductsHeader: React.FC<
  DashboardProductsHeaderProps
> = ({
  totalProducts,
  currentPage,
  perPage,
  appliedPriceFrom,
  appliedPriceTo,
  sortBy,
  isSorting,
  onFilterApply,
  onFilterRemove,
  onSortChange,
}) => {
  const startResult = (currentPage - 1) * perPage + 1;
  const endResult = Math.min(currentPage * perPage, totalProducts);

  return (
    <div className="flex items-center justify-between mb-8 relative">
      <h1 className="text-[#10151F] font-semibold text-[42px]">Products</h1>
      <div className="flex gap-[32px] items-center relative">
        <p className="text-[#3E424A] text-[12px]">
          Showing {startResult}–{endResult} of {totalProducts} results
        </p>
        <div className="bg-[#E1DFE1] h-[14px] w-[1px]"></div>

        <DashboardProductsFilter
          appliedPriceFrom={appliedPriceFrom}
          appliedPriceTo={appliedPriceTo}
          onFilterApply={onFilterApply}
          onFilterRemove={onFilterRemove}
        />

        <DashboardProductsSort
          sortBy={sortBy}
          isSorting={isSorting}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
};
