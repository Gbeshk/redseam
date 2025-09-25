import React, { useState } from "react";

interface ProductPageQuantityDropdownProps {
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const ProductPageQuantityDropdown: React.FC<
  ProductPageQuantityDropdownProps
> = ({ selectedQuantity, onQuantityChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative mt-[52px] w-[120px] text-[16px]">
      <label className="block text-[16px] font-medium text-[#10151F]">
        Quantity
      </label>
      <div
        className="border border-[#E1DFE1] rounded-[10px] mt-[16px] w-[70px] h-[42px] flex items-center justify-between px-[14px] cursor-pointer hover:border-gray-400 transition-colors duration-200"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="text-[#10151F] text-[16px]">{selectedQuantity}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {dropdownOpen && (
        <div className="absolute mt-1 w-full max-h-40 overflow-y-auto border border-[#E1DFE1] rounded-[10px] bg-white z-10 shadow-lg">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              onClick={() => {
                onQuantityChange(num);
                setDropdownOpen(false);
              }}
              className="px-3 py-2 hover:bg-[#F8F6F7] cursor-pointer text-[16px] text-[#10151F] transition-colors duration-150"
            >
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
