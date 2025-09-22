import React from "react";

const COLOR_MAP: Record<string, string> = {
  Black: "#000000",
  White: "#FFFFFF",
  "Off White": "#F8F8F8",
  Grey: "#808080",
  Red: "#FF0000",
  Green: "#008000",
  Blue: "#0000FF",
  "Navy Blue": "#000080",
  Yellow: "#FFFF00",
  Pink: "#FFC0CB",
  Peach: "#FFDAB9",
  Purple: "#800080",
  Orange: "#FFA500",
  Brown: "#A52A2A",
  Cream: "#FFFDD0",
  Olive: "#808000",
  Beige: "#F5F5DC",
  Maroon: "#800000",
  Mauve: "#E0B0FF",
  Multi: "#CCCCCC",
};

const LIGHT_COLORS = ["White", "Off White", "Cream", "Beige", "Yellow"];

interface ProductPageColorSwatchProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export const ProductPageColorSwatch: React.FC<ProductPageColorSwatchProps> = ({
  color,
  isSelected,
  onClick,
}) => {
  const needsBorder = LIGHT_COLORS.includes(color);

  return (
    <div
      className={`relative w-[48px] h-[48px] flex items-center justify-center transition-all duration-200 ${
        isSelected
          ? "border-2 border-[#E1DFE1] rounded-full shadow-md"
          : "hover:scale-105"
      }`}
      onClick={onClick}
    >
      <div
        className={`w-[38px] h-[38px] rounded-full cursor-pointer transition-all duration-200 ${
          needsBorder ? "border border-gray-300" : ""
        } ${isSelected ? "shadow-inner" : "hover:shadow-md"}`}
        style={{ backgroundColor: COLOR_MAP[color] || "#CCCCCC" }}
      />
    </div>
  );
};
