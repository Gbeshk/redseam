"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import ShoppingCart from "../../../../../public/images/shopping-cart-white.svg";
import { useParams } from "next/navigation";

interface Brand {
  id: number;
  name: string;
  image: string;
}

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
  brand: Brand;
}

interface ApiError {
  message: string;
  status?: number;
}

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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
      <div className="w-12 h-12 rounded-full border-4 border-[#FF4000] border-t-transparent animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
      <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

const ImageSkeleton = ({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) => (
  <div
    className={`bg-gray-200 animate-pulse rounded-md ${className}`}
    style={{ width: `${width}px`, height: `${height}px` }}
  />
);

const ProductImage = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
  isSelected = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative">
      {isLoading && (
        <ImageSkeleton width={width} height={height} className={className} />
      )}
      {hasError ? (
        <div
          className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <span className="text-xs">Image not available</span>
        </div>
      ) : (
        <Image
          width={width}
          height={height}
          alt={alt}
          src={src}
          onClick={onClick}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`${className} ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-200 ${
            isSelected
              ? "ring-2 ring-black shadow-lg"
              : "hover:ring-1 hover:ring-gray-300"
          } ${onClick ? "cursor-pointer" : ""}`}
        />
      )}
    </div>
  );
};

const ColorSwatch = ({
  color,
  isSelected,
  onClick,
}: {
  color: string;
  isSelected: boolean;
  onClick: () => void;
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

const SizeSelector = ({
  size,
  isSelected,
  onClick,
}: {
  size: string;
  isSelected: boolean;
  onClick: () => void;
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

const QuantityDropdown = ({
  selectedQuantity,
  onQuantityChange,
}: {
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}) => {
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
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
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

function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const fetchProduct = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }

      const res = await fetch(`${apiUrl}/products/${params.id}`);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch product: ${res.status} ${res.statusText}`
        );
      }

      const data: Product = await res.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid product data received");
      }

      setProduct(data);
      setSelectedImage(data.cover_image || data.images?.[0] || "");
      setSelectedColor(data.available_colors?.[0] || "");
      setSelectedSize(data.available_sizes?.[0] || "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError({ message: errorMessage });
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleImageSelect = useCallback(
    (image: string, colorIndex?: number) => {
      setSelectedImage(image);
      if (colorIndex !== undefined && product?.available_colors?.[colorIndex]) {
        setSelectedColor(product.available_colors[colorIndex]);
      }
    },
    [product]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      const colorIndex = product?.available_colors.indexOf(color);
      setSelectedColor(color);
      if (
        colorIndex !== undefined &&
        colorIndex >= 0 &&
        product?.images?.[colorIndex]
      ) {
        setSelectedImage(product.images[colorIndex]);
      }
    },
    [product]
  );

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedColor || !selectedSize) {
      alert("Please select color and size before adding to cart");
      return;
    }

    console.log("Adding to cart:", {
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity: selectedQuantity,
    });
  }, [product, selectedColor, selectedSize, selectedQuantity]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={fetchProduct} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="max-w-[1720px] w-full mx-auto mt-[52px] px-4">
      <nav className="text-[#10151F] font-light text-[14px] leading-[100%] tracking-[0%]">
        <Link href="/dashboard" className="hover:underline cursor-pointer">
          Listing
        </Link>{" "}
        / <span className="hover:underline cursor-pointer">Product</span>
      </nav>

      <div className="mt-[51px] flex justify-between gap-8 flex-wrap lg:flex-nowrap">
        <div className="flex gap-[24px]">
          <div className="flex flex-col gap-[9px]">
            {product.images.map((img, index) => (
              <ProductImage
                key={`thumb-${index}`}
                src={img}
                alt={`${product.name}-${index}`}
                width={121}
                height={161}
                className="w-[121px] h-[161px] rounded-md"
                onClick={() => handleImageSelect(img, index)}
                isSelected={false}
              />
            ))}
          </div>

          <Image
            width={703}
            height={937}
            alt={product.name}
            src={selectedImage || product.cover_image}
            className="w-[703px] h-[937px] rounded-[10px] ml-[24px] object-cover"
          />
        </div>

        <div className="w-full max-w-[704px]">
          <h1 className="font-semibold text-[32px] leading-[100%] h-[48px] tracking-[0%] text-[#10151F] capitalize">
            {product.name}
          </h1>
          <h2 className="font-semibold text-[32px] leading-[100%] h-[48px] mt-[22px] tracking-[0%] text-[#10151F]">
            ${product.price.toFixed(2)}
          </h2>

          <div className="mt-[52px]">
            <p className="h-[24px] text-[16px] text-[#10151F] mb-[16px]">
              Color: {selectedColor}
            </p>
            <div className="flex gap-[16px] flex-wrap">
              {product.available_colors.map((color, index) => (
                <ColorSwatch
                  key={`color-${color}-${index}`}
                  color={color}
                  isSelected={selectedColor === color}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>

          {product.available_sizes?.length > 0 && (
            <div className="mt-[52px]">
              <p className="h-[24px] text-[16px] text-[#10151F] mb-[16px]">
                Size: {selectedSize}
              </p>
              <div className="flex gap-[16px] flex-wrap">
                {product.available_sizes.map((size, index) => (
                  <SizeSelector
                    key={`size-${size}-${index}`}
                    size={size}
                    isSelected={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  />
                ))}
              </div>
            </div>
          )}

          <QuantityDropdown
            selectedQuantity={selectedQuantity}
            onQuantityChange={setSelectedQuantity}
          />

          <button
            onClick={handleAddToCart}
            className="w-full cursor-pointer h-[59px] bg-[#FF4000] rounded-[10px] flex items-center justify-center gap-[10px] mt-[52px] hover:bg-[#e63600] transition-colors duration-200"
          >
            <Image
              src={ShoppingCart}
              width={24}
              height={24}
              alt="Shopping Cart"
            />
            <span className="text-white text-[18px] leading-[100%] tracking-[0%] font-medium mt-[1.5px]">
              Add to cart
            </span>
          </button>

          <div className="bg-[#E1DFE1] h-[1px] mt-[52px] w-full" />

          <div className="w-full h-[61px] flex items-center mt-[52px] justify-between">
            <h3 className="text-[#10151F] text-[20px] leading-[100%] tracking-[0%] font-medium">
              Details
            </h3>
            <div className="h-[61px] flex items-center">
              <ProductImage
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
              Description: {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
