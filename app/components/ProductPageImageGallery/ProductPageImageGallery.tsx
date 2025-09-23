import React from "react";
import Image from "next/image";
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

interface ProductPageImageGalleryProps {
  product: Product;
  selectedImage: string;
  onImageSelect: (image: string, colorIndex?: number) => void;
}

export const ProductPageImageGallery: React.FC<
  ProductPageImageGalleryProps
> = ({ product, selectedImage, onImageSelect }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageKey, setImageKey] = React.useState(0);

  React.useEffect(() => {
    setIsLoading(true);
    setImageKey((prev) => prev + 1);
  }, [selectedImage]);

  const handleImageSelect = (img: string, index?: number) => {
    onImageSelect(img, index);
  };

  return (
    <div className="flex gap-[24px]">
      <div className="flex flex-col gap-[9px]">
        {product.images.map((img, index) => (
          <ProductPageImage
            key={`thumb-${index}`}
            src={img}
            alt={`${product.name}-${index}`}
            width={121}
            height={161}
            className="w-[121px] h-[161px] rounded-md"
            onClick={() => handleImageSelect(img, index)}
            isSelected={img === selectedImage}
          />
        ))}
      </div>

      <div className="relative ml-[24px]">
        {isLoading && (
          <div className="absolute inset-0 w-[703px] h-[937px] rounded-[10px] bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span className="text-gray-500 text-sm font-medium">
                Loading image...
              </span>
            </div>
          </div>
        )}

        <Image
          key={imageKey}
          width={703}
          height={937}
          alt={product.name}
          src={selectedImage || product.cover_image}
          className={`w-[703px] h-[937px] rounded-[10px] object-cover transition-all duration-500 ease-out ${
            isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          priority={true}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
    </div>
  );
};
