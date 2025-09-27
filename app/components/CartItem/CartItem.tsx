"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  cover_image?: string;
  images?: string[];
  available_colors?: string[];
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (uniqueId: string, quantity: number) => void;
  onRemove: (uniqueId: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onClose,
}: CartItemProps & { onClose: () => void }) {
  const router = useRouter();

  const handleRedirect = () => {
    if (onClose) onClose();
    router.push(`/dashboard/products/${item.id}`);
  };

  const uniqueId = `${item.id}-${item.color || "no-color"}-${
    item.size || "no-size"
  }`;

  const getImageForColor = () => {
    if (!item.color || !item.available_colors || !item.images) {
      return item.cover_image;
    }

    const colorIndex = item.available_colors.findIndex(
      (color) => color.toLowerCase() === item.color?.toLowerCase()
    );

    if (colorIndex !== -1 && item.images[colorIndex]) {
      return item.images[colorIndex];
    }

    return item.cover_image;
  };

  const displayImage = getImageForColor();

  return (
    <div className="flex gap-[16px]">
      <div
        className="w-[100px] h-[134px] bg-gray-200 rounded-[10px] border-[1px] border-[#E1DFE1] flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={handleRedirect}
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={`${item.name} - ${item.color || "default"}`}
            width={100}
            height={134}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-gray-500">Image</span>
        )}
      </div>

      <div className="h-[117px] my-auto w-full flex flex-col justify-between">
        <div
          className="flex justify-between items-center w-full cursor-pointer"
          onClick={handleRedirect}
        >
          <p className="font-medium text-[14px] w-[200px] text-[#10151F] capitalize">
            {item.name}
          </p>
          <p className="font-medium text-[18px] text-[#10151F] capitalize">
            $ {item.price.toFixed(2)}
          </p>
        </div>

        <p className="text-[#3E424A] font-normal text-[12px]">{item.color}</p>
        <p className="text-[#3E424A] font-normal text-[12px]">{item.size}</p>

        <div className="h-[26px] flex justify-between items-center">
          <div className="w-[70px] h-[26px] flex items-center justify-around rounded-[22px] border-[1px] border-[#E1DFE1]">
            <button
              onClick={() => onUpdateQuantity(uniqueId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${
                item.quantity <= 1
                  ? "cursor-default"
                  : "cursor-pointer hover:bg-gray-100"
              }`}
              style={{
                color: item.quantity <= 1 ? "#E1DFE1" : "inherit",
              }}
            >
              -
            </button>
            <span className="font-normal text-[12px] text-[#3E424A]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(uniqueId, item.quantity + 1)}
              className="w-[24px] h-[24px] rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
            >
              +
            </button>
          </div>

          <button
            className="text-[12px] text-[#3E424A] hover:underline cursor-pointer"
            onClick={() => onRemove(uniqueId)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
