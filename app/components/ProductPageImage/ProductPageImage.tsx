"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";

const ImageSkeleton: React.FC<{
  width: number;
  height: number;
  className?: string;
}> = ({ width, height, className }) => (
  <div
    className={`bg-gray-200 animate-pulse rounded-md ${className}`}
    style={{ width: `${width}px`, height: `${height}px` }}
  />
);

interface ProductPageImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  onError?: () => void;
}

export const ProductPageImage: React.FC<ProductPageImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
  isSelected = false,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();

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
          key={`${src}-${retryCount}`}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-200 ${
            isSelected
              ? "hover:ring-1 hover:ring-gray-300"
              : "hover:ring-1 hover:ring-gray-300"
          } ${onClick ? "cursor-pointer" : ""}`}
        />
      )}
    </div>
  );
};
