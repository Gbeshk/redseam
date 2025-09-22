import React from "react";

interface ProductPageLoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

export const ProductPageLoadingSpinner: React.FC<ProductPageLoadingSpinnerProps> = ({
  size = "large",
}) => {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div
          className={`${sizes[size]} rounded-full border-4 border-gray-200`}
        ></div>
        <div
          className={`${sizes[size]} rounded-full border-4 border-[#FF4000] border-t-transparent animate-spin absolute top-0 left-0`}
        ></div>
      </div>
    </div>
  );
};