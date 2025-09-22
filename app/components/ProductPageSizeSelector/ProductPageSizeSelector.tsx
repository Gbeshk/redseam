import React from "react";

interface ProductPageSizeSelectorProps {
  size: string;
  isSelected: boolean;
  onClick: () => void;
}

export const ProductPageSizeSelector: React.FC<ProductPageSizeSelectorProps> = ({
  size,
  isSelected,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`w-[70px] h-[42px] flex items-center justify-center rounded-[10px] cursor-pointer text-[16px] leading-[16px] tracking-[0%] transition-all duration-200 ${
      isSelected
        ? "bg-[#F8F6F7] border border-[#10151F] text-[#10151F] shadow-md"
        : "border border-[#E1DFE1] text-[#10151F] hover:bg-[#F8F6F7] hover:border-gray-400"
    }`}
  >
    {size}
  </div>
);
