"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/app/components/contexts/CartContext";
import ShoppingCart from "../../../public/images/shopping-cart-white.svg";
import { ApiError, Product } from "../types/productPageTypes";
import {
  apiRequest,
  NetworkError,
  ValidationError,
} from "../utils/productPageApi";
import { ProductPageLoadingSpinner } from "../ProductPageLoadingSpinner/ProductPageLoadingSpinner";
import { ProductPageErrorMessage } from "../ProductPageErrorMessage/ProductPageErrorMessage";
import { ProductPageErrorBoundary } from "../ProductPageErrorBoundary/ProductPageErrorBoundary";
import { ProductPageBreadcrumb } from "../ProductPageBreadcrumb/ProductPageBreadcrumb";
import { ProductPageImageGallery } from "../ProductPageImageGallery/ProductPageImageGallery";
import { ProductPageDetails } from "../ProductPageDetails/ProductPageDetails";
import { ProductPageNotFound } from "../ProductPageNotFound/ProductPageNotFound";

function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!params.id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error(
          "API configuration is missing. Please contact support."
        );
      }

      const data = await apiRequest(`${apiUrl}/products/${params.id}`);

      // Handle 404 case (API returns null)
      if (data === null) {
        setNotFound(true);
        return;
      }

      if (!data || typeof data !== "object") {
        throw new ValidationError("Invalid product data received from server");
      }

      const requiredFields = ["id", "name", "price"];
      const missingFields = requiredFields.filter((field) => !data[field]);
      if (missingFields.length > 0) {
        throw new ValidationError(
          `Product data is incomplete: missing ${missingFields.join(", ")}`
        );
      }

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
      }
    },
    [product]
  );

  const handleAddToCart = useCallback(async () => {
    if (!product || isAddingToCart) return;

    const hasColors =
      product.available_colors && product.available_colors.length > 0;

    try {
      setIsAddingToCart(true);

      await addToCart(
        product.id,
        selectedQuantity,
        hasColors ? selectedColor : undefined,
        selectedSize
      );
    } catch (error: unknown) {
      console.error("Failed to add to cart:", error);
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

  if (loading) return <ProductPageLoadingSpinner />;

  if (notFound) {
    return (
      <ProductPageErrorBoundary>
        <div className="w-[1720px] mx-auto mt-[52px] px-4">
          <ProductPageBreadcrumb />
          <ProductPageNotFound productId={params.id as string} />
        </div>
      </ProductPageErrorBoundary>
    );
  }

  if (error) {
    return (
      <ProductPageErrorMessage message={error.message} onRetry={fetchProduct} />
    );
  }

  if (!product) {
    return (
      <ProductPageErrorBoundary>
        <div className="w-[1720px]  mx-auto mt-[52px] px-4">
          <ProductPageBreadcrumb />
          <ProductPageNotFound productId={params.id as string} />
        </div>
      </ProductPageErrorBoundary>
    );
  }

  return (
    <ProductPageErrorBoundary>
      <div className="w-[1920px] mx-auto mt-[52px] px-[100px]">
        <ProductPageBreadcrumb />

        <div className="mt-[51px] flex justify-between">
          <ProductPageImageGallery
            product={product}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
          />

          <ProductPageDetails
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedQuantity={selectedQuantity}
            isAddingToCart={isAddingToCart}
            shoppingCartIcon={ShoppingCart}
            onColorSelect={handleColorSelect}
            onSizeSelect={setSelectedSize}
            onQuantityChange={setSelectedQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </ProductPageErrorBoundary>
  );
}

export default ProductPage;
