import React from "react";
import Image from "next/image";
import arrowDown from "../../../public/images/arrow-down.svg";

interface DashboardProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPaginationLoading: boolean;
}

export const DashboardProductsPagination: React.FC<
  DashboardProductsPaginationProps
> = ({ currentPage, totalPages, onPageChange, isPaginationLoading }) => {
  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage === 1)
        pages.push(1, 2, "...", totalPages - 1, totalPages);
      else if (currentPage === 2) pages.push(1, 2, 3, "...", totalPages);
      else if (currentPage === totalPages)
        pages.push(1, "...", totalPages - 1, totalPages);
      else if (currentPage === totalPages - 1)
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      else
        pages.push(1, "...", currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="mt-[92px] flex justify-center">
      <div className="flex gap-[8px] cursor-pointer items-center">
        <Image
          src={arrowDown}
          alt="prev"
          width={20}
          height={20}
          className={`transform rotate-90 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-80"
          }`}
          onClick={handlePrev}
        />
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <div
              key={idx}
              className="w-[32px] h-[32px] rounded-[4px] border-[1px] border-[#F8F6F7] flex items-center justify-center"
            >
              <p className="text-[14px] leading-[20px] text-[#212B36] opacity-60">
                ...
              </p>
            </div>
          ) : (
            <div
              key={idx}
              className={`w-[32px] h-[32px] rounded-[4px] border-[2px] flex items-center justify-center cursor-pointer transition-colors ${
                currentPage === page
                  ? "border-[#FF4000]"
                  : "border-[#F8F6F7] hover:border-[#FF4000] hover:border-opacity-50"
              } ${isPaginationLoading ? "pointer-events-none opacity-50" : ""}`}
              onClick={() => handlePageClick(page)}
            >
              <p
                className={`text-[14px] leading-[20px] ${
                  currentPage === page
                    ? "text-[#FF4000]"
                    : "text-[#212B36] opacity-60"
                }`}
              >
                {page}
              </p>
            </div>
          )
        )}
        <Image
          src={arrowDown}
          alt="next"
          width={20}
          height={20}
          className={`transform -rotate-90 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-80"
          }`}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};
