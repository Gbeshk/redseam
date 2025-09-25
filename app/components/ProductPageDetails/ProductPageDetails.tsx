import React from "react";
import { ProductPageColorSwatch } from "../ProductPageColorSwatch/ProductPageColorSwatch";
import { ProductPageSizeSelector } from "../ProductPageSizeSelector/ProductPageSizeSelector";
import { ProductPageQuantityDropdown } from "../ProductPageQuantityDropdown/ProductPageQuantityDropdown";
import { ProductPageAddToCartButton } from "../ProductPageAddToCartButton/ProductPageAddToCartButton";
import { ProductPageImage } from "../ProductPageImage/ProductPageImage";

interface Product {
  id: number;
  name: string;
  description: string;
  release_year: string;
  cover_image: string;
  images: string[];
  price: number;
  available_colors: string[];
  available_sizes: string[];
  brand: {
    id: number;
    name: string;
    image: string;
  };
}

interface ProductPageDetailsProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  selectedQuantity: number;
  isAddingToCart: boolean;
  shoppingCartIcon: string;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => Promise<void>;
}

export const ProductPageDetails: React.FC<ProductPageDetailsProps> = ({
  product,
  selectedColor,
  selectedSize,
  selectedQuantity,
  isAddingToCart,
  shoppingCartIcon,
  onColorSelect,
  onSizeSelect,
  onQuantityChange,
  onAddToCart,
}) => {
  const hasColors =
    product.available_colors && product.available_colors.length > 0;
  const hasSizes =
    product.available_sizes && product.available_sizes.length > 0;
  const hasDescription =
    product.description && product.description.trim() !== "";

  return (
    <div className=" w-[704px]">
      <h1 className="font-semibold text-[32px] leading-[100%] h-[48px] tracking-[0%] text-[#10151F] capitalize">
        {product.name}
      </h1>
      <h2 className="font-semibold text-[32px] leading-[100%] h-[48px] mt-[22px] tracking-[0%] text-[#10151F]">
        ${product.price.toFixed(2)}
      </h2>

      <div className="mt-[52px]">
        {hasColors ? (
          <>
            <p className="h-[24px] text-[16px] text-[#10151F] mb-[16px]">
              Color: {selectedColor}
            </p>
            <div className="flex gap-[16px] flex-wrap">
              {product.available_colors.map((color, index) => (
                <ProductPageColorSwatch
                  key={`color-${color}-${index}`}
                  color={color}
                  isSelected={selectedColor === color}
                  onClick={() => onColorSelect(color)}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-[16px] text-[#666666] italic">
            No color options available
          </p>
        )}
      </div>

      <div className="mt-[52px]">
        {hasSizes ? (
          <>
            <p className="h-[24px] text-[16px] text-[#10151F] mb-[16px]">
              Size: {selectedSize}
            </p>
            <div className="flex gap-[16px] flex-wrap">
              {product.available_sizes.map((size, index) => (
                <ProductPageSizeSelector
                  key={`size-${size}-${index}`}
                  size={size}
                  isSelected={selectedSize === size}
                  onClick={() => onSizeSelect(size)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-[16px] text-yellow-800 font-medium">
              ⚠️ No sizes available - This product cannot be purchased at the
              moment
            </p>
          </div>
        )}
      </div>

      <ProductPageQuantityDropdown
        selectedQuantity={selectedQuantity}
        onQuantityChange={onQuantityChange}
      />

      <ProductPageAddToCartButton
        isDisabled={!hasSizes}
        isAddingToCart={isAddingToCart}
        onClick={onAddToCart}
        shoppingCartIcon={shoppingCartIcon}
      />

      <div className="bg-[#E1DFE1] h-[1px] mt-[52px] w-full" />

      <div className="w-full h-[61px] flex items-center mt-[52px] justify-between">
        <h3 className="text-[#10151F] text-[20px] leading-[100%] tracking-[0%] font-medium">
          Details
        </h3>
        <div className="h-[61px] flex items-center">
          <ProductPageImage
            src={product.brand.image}
            alt={product.brand.name}
            width={200}
            height={70}
            className="object-contain h-full w-auto"
          />
        </div>
      </div>

      <div className="space-y-[22px]">
        <p className="font-normal text-[16px] leading-[16px] tracking-[0%] text-[#10151F]">
          Brand: {product.brand.name}
        </p>
        <p className="font-normal text-[16px] tracking-[0%] text-[#10151F]">
          Description:{" "}
          {hasDescription ? product.description : "No description available"}
        </p>
      </div>
    </div>
  );
};
