"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import ShoppingCart from "../../../../../public/images/shopping-cart-white.svg";
import { useParams } from "next/navigation";
import { useCart } from "@/app/components/contexts/CartContext";

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
  code?: string;
}

// Custom Error Classes
class NetworkError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "NetworkError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
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

// Enhanced Toast Notification System
const Toast = ({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColors[type]} max-w-md shadow-lg animate-slide-in`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorMessage
            message="Something went wrong. Please refresh the page and try again."
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
        )
      );
    }

    return this.props.children;
  }
}

// Enhanced Loading Spinner
const LoadingSpinner = ({
  size = "large",
}: {
  size?: "small" | "medium" | "large";
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

// Enhanced Error Message Component
const ErrorMessage = ({
  message,
  onRetry,
  type = "error",
}: {
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning" | "info";
}) => {
  const colors = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div
        className={`${colors[type].bg} border ${colors[type].border} rounded-lg p-6 max-w-md`}
      >
        <h3 className={`text-lg font-medium ${colors[type].text} mb-2`}>
          {type === "error"
            ? "Error"
            : type === "warning"
            ? "Warning"
            : "Information"}
        </h3>
        <p className={`${colors[type].text} mb-4`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`${colors[type].button} text-white px-4 py-2 rounded-md transition-colors`}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// Enhanced Image Components with better error handling
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
  onError,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  onError?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();

    // Auto-retry up to 2 times with exponential backoff
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setHasError(false);
        setIsLoading(true);
      }, Math.pow(2, retryCount) * 1000);
    }
  }, [onError, retryCount]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setRetryCount(0);
  }, []);

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
          <div className="text-center">
            <span className="text-xs block">Image not available</span>
            {retryCount < 2 && (
              <span className="text-xs text-gray-300">Retrying...</span>
            )}
          </div>
        </div>
      ) : (
        <Image
          width={width}
          height={height}
          alt={alt}
          src={src}
          key={`${src}-${retryCount}`} // Force re-render on retry
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
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

// Enhanced API helper with better error handling
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }

      if (response.status === 401) {
        throw new AuthError("Authentication required. Please log in.");
      } else if (response.status === 403) {
        throw new AuthError("Access denied. You do not have permission.");
      } else if (response.status === 404) {
        throw new NetworkError("Resource not found.", response.status);
      } else if (response.status >= 500) {
        throw new NetworkError(
          "Server error. Please try again later.",
          response.status
        );
      } else {
        throw new NetworkError(errorMessage, response.status);
      }
    }

    return await response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new NetworkError(
        "Request timed out. Please check your connection and try again."
      );
    }

    if (error instanceof NetworkError || error instanceof AuthError) {
      throw error;
    }

    // Network connectivity issues
    if (!navigator.onLine) {
      throw new NetworkError(
        "No internet connection. Please check your network and try again."
      );
    }

    throw new NetworkError(
      "Network error. Please check your connection and try again."
    );
  }
};

// Rest of the component code remains the same but with enhanced error handling...
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

// Main Product Page Component with Enhanced Error Handling
function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  // Enhanced product fetching with better error handling
  const fetchProduct = useCallback(async () => {
    if (!params.id) {
      setError({ message: "Product ID is missing" });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          "API configuration is missing. Please contact support."
        );
      }

      const data = await apiRequest(`${apiUrl}/products/${params.id}`);

      // Validate product data structure
      if (!data || typeof data !== "object") {
        throw new ValidationError("Invalid product data received from server");
      }

      // Validate required fields
      const requiredFields = ["id", "name", "price"];
      const missingFields = requiredFields.filter((field) => !data[field]);
      if (missingFields.length > 0) {
        throw new ValidationError(
          `Product data is incomplete: missing ${missingFields.join(", ")}`
        );
      }

      // Ensure arrays exist and are valid
      const safeProduct: Product = {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        available_colors: Array.isArray(data.available_colors)
          ? data.available_colors
          : [],
        available_sizes: Array.isArray(data.available_sizes)
          ? data.available_sizes
          : [],
        cover_image: data.cover_image || data.images?.[0] || "",
        description: data.description || "",
      };

      setProduct(safeProduct);
      setSelectedImage(
        safeProduct.cover_image || safeProduct.images?.[0] || ""
      );
      setSelectedColor(safeProduct.available_colors?.[0] || "");
      setSelectedSize(safeProduct.available_sizes?.[0] || "");
    } catch (err: unknown) {
      console.error("Failed to fetch product:", err);

      let errorMessage = "Failed to load product";

      if (err instanceof NetworkError) {
        errorMessage = err.message;
      } else if (err instanceof ValidationError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleImageSelect = useCallback(
    (image: string, colorIndex?: number) => {
      try {
        setSelectedImage(image);
        if (
          colorIndex !== undefined &&
          product?.available_colors?.[colorIndex]
        ) {
          setSelectedColor(product.available_colors[colorIndex]);
        }
      } catch (error: unknown) {
        console.error("Error selecting image:", error);
        setToast({ message: "Error selecting image", type: "error" });
      }
    },
    [product]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      try {
        const colorIndex = product?.available_colors.indexOf(color);
        setSelectedColor(color);
        if (
          colorIndex !== undefined &&
          colorIndex >= 0 &&
          product?.images?.[colorIndex]
        ) {
          setSelectedImage(product.images[colorIndex]);
        }
      } catch (error: unknown) {
        console.error("Error selecting color:", error);
        setToast({ message: "Error selecting color", type: "error" });
      }
    },
    [product]
  );

  // Enhanced add to cart with comprehensive error handling
  // In your ProductPage component, replace the handleAddToCart function with:

  const { addToCart } = useCart();

  const handleAddToCart = useCallback(async () => {
    if (!product || isAddingToCart) return;

    const hasColors =
      product.available_colors && product.available_colors.length > 0;

    try {
      // Your existing validation logic here...

      setIsAddingToCart(true);

      // Use the context function instead of direct API call
      await addToCart(
        product.id,
        selectedQuantity,
        hasColors ? selectedColor : undefined,
        selectedSize
      );

      setToast({
        message: "Product added to cart successfully!",
        type: "success",
      });
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [
    product,
    selectedColor,
    selectedSize,
    selectedQuantity,
    isAddingToCart,
    addToCart,
  ]);
  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setToast({ message: "Connection restored", type: "success" });
    };

    const handleOffline = () => {
      setToast({
        message: "You are offline. Some features may not work.",
        type: "warning",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={fetchProduct} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const hasColors =
    product.available_colors && product.available_colors.length > 0;
  const hasSizes =
    product.available_sizes && product.available_sizes.length > 0;
  const hasDescription =
    product.description && product.description.trim() !== "";

  return (
    <ErrorBoundary>
      <div className="max-w-[1720px] w-full mx-auto mt-[52px] px-4">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

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
              {hasColors ? (
                <>
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
                      <SizeSelector
                        key={`size-${size}-${index}`}
                        size={size}
                        isSelected={selectedSize === size}
                        onClick={() => setSelectedSize(size)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-[16px] text-yellow-800 font-medium">
                    ⚠️ No sizes available - This product cannot be purchased at
                    the moment
                  </p>
                </div>
              )}
            </div>

            <QuantityDropdown
              selectedQuantity={selectedQuantity}
              onQuantityChange={setSelectedQuantity}
            />

            <button
              onClick={handleAddToCart}
              disabled={!hasSizes || isAddingToCart}
              className={`w-full h-[59px] rounded-[10px] flex items-center justify-center gap-[10px] mt-[52px] transition-colors duration-200 ${
                !hasSizes || isAddingToCart
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#FF4000] cursor-pointer hover:bg-[#e63600]"
              }`}
            >
              {isAddingToCart ? (
                <LoadingSpinner size="small" />
              ) : (
                <Image
                  src={ShoppingCart}
                  width={24}
                  height={24}
                  alt="Shopping Cart"
                  className={!hasSizes ? "opacity-50" : ""}
                />
              )}
              <span
                className={`text-[18px] leading-[100%] tracking-[0%] font-medium mt-[1.5px] ${
                  !hasSizes || isAddingToCart ? "text-gray-500" : "text-white"
                }`}
              >
                {isAddingToCart
                  ? "Adding..."
                  : !hasSizes
                  ? "Not Available"
                  : "Add to cart"}
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
                Description:{" "}
                {hasDescription
                  ? product.description
                  : "No description available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ProductPage;
