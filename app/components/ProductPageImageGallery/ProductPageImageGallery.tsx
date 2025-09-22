
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
            onClick={() => onImageSelect(img, index)}
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
  );
};
