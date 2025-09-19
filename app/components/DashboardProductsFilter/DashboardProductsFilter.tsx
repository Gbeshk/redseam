import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import filterIcon from "../../../public/images/filter-icon.svg";

interface DashboardProductsFilterProps {
  appliedPriceFrom: string;
  appliedPriceTo: string;
  onFilterApply: (priceFrom: string, priceTo: string) => void;
  onFilterRemove: () => void;
}

export const DashboardProductsFilter: React.FC<
  DashboardProductsFilterProps
> = ({ appliedPriceFrom, appliedPriceTo, onFilterApply, onFilterRemove }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState(appliedPriceFrom);
  const [priceTo, setPriceTo] = useState(appliedPriceTo);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPriceFrom(appliedPriceFrom);
    setPriceTo(appliedPriceTo);
  }, [appliedPriceFrom, appliedPriceTo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterToggle = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleApplyFilter = () => {
    const minPrice =
      priceFrom.trim() === "" ? "" : String(Math.max(0, Number(priceFrom)));
    const maxPrice =
      priceTo.trim() === "" ? "" : String(Math.max(0, Number(priceTo)));

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setPriceFrom(maxPrice);
      setPriceTo(minPrice);
      onFilterApply(maxPrice, minPrice);
    } else {
      onFilterApply(minPrice, maxPrice);
    }
    setIsFilterOpen(false);
  };

  const handleRemoveFilters = () => {
    setPriceFrom("");
    setPriceTo("");
    onFilterRemove();
    setIsFilterOpen(false);
  };

  const preventNegativeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e") {
      e.preventDefault();
    }
  };

  const hasActiveFilters =
    appliedPriceFrom.trim() !== "" || appliedPriceTo.trim() !== "";

  return (
    <div
      className="flex items-center gap-[8px] cursor-pointer relative"
      ref={filterRef}
      onClick={handleFilterToggle}
    >
      <Image src={filterIcon} alt="filterIcon" width={24} height={24} />
      <p className="text-[#10151F] text-[16px]">Filter</p>
      {isFilterOpen && (
        <div
          className="absolute top-full mt-2 left-[-300px] bg-white w-[392px] border border-[#E1DFE1] h-[169px] p-[16px] rounded-[10px] shadow-lg z-20"
          onClick={handleModalClick}
        >
          <div className="flex gap-4 flex-col">
            <p className="text-[#10151F] font-semibold text-[16px]">
              select price
            </p>
            <div className="flex justify-between">
              <div className="relative w-[175px]">
                <label
                  className={`absolute left-2 top-1/2 -translate-y-1/2 text-[14px] font-poppins font-normal leading-[100%] tracking-[0%] text-[#3E424A] pointer-events-none transition-opacity duration-200 ${
                    priceFrom || fromFocused ? "opacity-0" : "opacity-100"
                  }`}
                >
                  From <span className="text-[#FF4000]">*</span>
                </label>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  onFocus={() => setFromFocused(true)}
                  onBlur={() => setFromFocused(false)}
                  onKeyDown={preventNegativeInput}
                  className="appearance-none border-[#E1DFE1] border-[1px] rounded px-2 py-1 w-full h-[42px] focus:outline-none focus:border-[#FF4000] font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] text-[#3E424A]"
                  min="0"
                />
              </div>
              <div className="relative w-[175px]">
                <label
                  className={`absolute left-2 top-1/2 -translate-y-1/2 text-[14px] font-poppins font-normal leading-[100%] tracking-[0%] text-[#3E424A] pointer-events-none transition-opacity duration-200 ${
                    priceTo || toFocused ? "opacity-0" : "opacity-100"
                  }`}
                >
                  To <span className="text-[#FF4000]">*</span>
                </label>
                <input
                  type="number"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  onFocus={() => setToFocused(true)}
                  onBlur={() => setToFocused(false)}
                  onKeyDown={preventNegativeInput}
                  className="appearance-none border-[#E1DFE1] border-[1px] rounded px-2 py-1 w-full h-[42px] focus:outline-none focus:border-[#FF4000] font-poppins font-normal text-[14px] leading-[100%] tracking-[0%] text-[#3E424A]"
                  min="0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            {hasActiveFilters && (
              <button
                onClick={handleRemoveFilters}
                className="w-[124px] bg-white border border-[#FF4000] text-[14px] rounded-[10px] cursor-pointer text-[#FF4000] h-[41px] hover:bg-[#FF4000] hover:text-white transition-colors"
              >
                Remove filters
              </button>
            )}
            <button
              onClick={handleApplyFilter}
              className={`w-[124px] bg-[#FF4000] text-[14px] rounded-[10px] cursor-pointer text-white h-[41px] ${
                hasActiveFilters ? "ml-auto" : "ml-auto"
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
