import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import arrowDown from "../../../public/images/arrow-down.svg";
import { Spinner } from "../Spinner/Spinner";

interface DashboardProductsSortProps {
  sortBy: string;
  isSorting: boolean;
  onSortChange: (sort: string) => void;
}

export const DashboardProductsSort: React.FC<DashboardProductsSortProps> = ({
  sortBy,
  isSorting,
  onSortChange,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const getSortDisplayText = (sortParam: string): string => {
    switch (sortParam) {
      case "-created_at":
        return "New products first";
      case "price":
        return "Price, low to high";
      case "-price":
        return "Price, high to low";
      default:
        return "Sort by";
    }
  };

  const sortDisplayText = getSortDisplayText(sortBy);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortToggle = () => {
    setIsSortOpen((prev) => !prev);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSortSelect = (sortOption: string) => {
    onSortChange(sortOption);
    setIsSortOpen(false);
  };

  return (
    <div
      className="ml-[10px] flex items-center gap-[4px] cursor-pointer relative"
      ref={sortRef}
      onClick={handleSortToggle}
    >
      <p className="text-[#10151F] text-[16px]">{sortDisplayText}</p>
      <Image src={arrowDown} alt="arrowDown" width={20} height={20} />
      {isSorting && (
        <div className="absolute top-1/2 -translate-y-1/2 right-[-40px]">
          <Spinner />
        </div>
      )}
      {isSortOpen && (
        <div
          className="absolute top-full mt-2 left-[-56px] bg-white w-[223px] border border-[#E1DFE1] h-[184px] p-[16px] rounded-[10px] shadow-lg z-20"
          onClick={handleModalClick}
        >
          <div className="flex flex-col">
            <p className="text-[#10151F] font-semibold text-[16px]">Sort by</p>
            <button
              className="text-[#10151F] cursor-pointer h-[40px] mt-[8px] text-[16px] font-poppins font-normal text-left hover:text-[#FF4000]"
              onClick={() => handleSortSelect("-created_at")}
            >
              New products first
            </button>
            <button
              className="text-[#10151F] cursor-pointer text-[16px] h-[40px] font-poppins font-normal text-left hover:text-[#FF4000]"
              onClick={() => handleSortSelect("price")}
            >
              Price, low to high
            </button>
            <button
              className="text-[#10151F] cursor-pointer text-[16px] h-[40px] font-poppins font-normal text-left hover:text-[#FF4000]"
              onClick={() => handleSortSelect("-price")}
            >
              Price, high to low
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
