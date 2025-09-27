import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/components/contexts/CartContext";
import EmptyCartState from "../EmptyCartState/EmptyCartState";

interface CartItem {
  id: number;
  name: string;
  price: number;
  cover_image: string;
  color: string;
  size: string;
  quantity: number;
  images?: string[];
  available_colors?: string[];
}

interface CheckoutCartProps {
  isInitialLoad: boolean;
  isLoading: boolean;
  error: string | null;
  cartItems: CartItem[];
  submitError: string;
  isSubmitting: boolean;
  getSubtotalPrice: () => number;
  getDeliveryPrice: () => number;
  getTotalPrice: () => number;
  handleCheckout: () => Promise<void>;
}

function CheckoutCart({
  isInitialLoad,
  isLoading,
  error,
  cartItems,
  submitError,
  isSubmitting,
  getSubtotalPrice,
  getDeliveryPrice,
  getTotalPrice,
  handleCheckout,
}: CheckoutCartProps) {
  const { updateCartItem, removeCartItem } = useCart();
  const router = useRouter();

  const createUniqueId = (item: CartItem): string => {
    return `${item.id}-${item.color || "no-color"}-${item.size || "no-size"}`;
  };

  const getImageForColor = (item: CartItem) => {
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

  const handleUpdateQuantity = async (
    uniqueId: string,
    quantity: number
  ): Promise<void> => {
    try {
      await updateCartItem(uniqueId, quantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (uniqueId: string): Promise<void> => {
    try {
      await removeCartItem(uniqueId);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleRedirect = (itemId: number): void => {
    router.push(`/dashboard/products/${itemId}`);
  };

  const renderCartItem = (item: CartItem) => {
    const uniqueKey = createUniqueId(item);
    const displayImage = getImageForColor(item);

    return (
      <div key={uniqueKey} className="flex gap-[16px]">
        <div
          className="w-[100px] h-[134px] bg-gray-200 rounded-[10px] border-[1px] border-[#E1DFE1] flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => handleRedirect(item.id)}
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
        <div className="h-[117px] w-full flex flex-col justify-between">
          <div
            className="flex justify-between items-center w-full cursor-pointer"
            onClick={() => handleRedirect(item.id)}
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
                onClick={() =>
                  handleUpdateQuantity(uniqueKey, item.quantity - 1)
                }
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
                onClick={() =>
                  handleUpdateQuantity(uniqueKey, item.quantity + 1)
                }
                className="w-[24px] h-[24px] rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
            <button
              className="text-[12px] text-[#3E424A] hover:underline cursor-pointer"
              onClick={() => handleRemoveItem(uniqueKey)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCartContent = () => {
    if (isInitialLoad) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4000]"></div>
          <p className="text-[#3E424A] text-[16px]">Loading your cart...</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4000]"></div>
          <p className="text-[#3E424A] text-[16px]">Loading your cart...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-red-500 text-center px-4">{error}</p>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <div>
          <EmptyCartState />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-[36px] max-h-[385px] overflow-y-auto cart-scroll">
        {cartItems.map(renderCartItem)}
      </div>
    );
  };

  return (
    <div className="w-[460px] flex flex-col h-[635px]">
      <div className="flex-1 bg-white h-[635px] overflow-hidden">
        {renderCartContent()}
      </div>
      {(isInitialLoad ||
        isLoading ||
        (!isLoading && !error && cartItems.length > 0)) && (
        <div>
          <div className="flex flex-col mt-[24px]">
            <div className="flex items-center justify-between h-[24px]">
              <p className="text-[#3E424A] text-[16px]">Items subtotal</p>
              {isInitialLoad || isLoading ? (
                <div className="w-10 h-4 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-[#3E424A] text-[16px]">
                  $ {Math.round(getSubtotalPrice())}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between h-[24px] mt-[16px]">
              <p className="text-[#3E424A] text-[16px]">Delivery</p>
              <p className="text-[#3E424A] text-[16px]">
                $ {getDeliveryPrice()}
              </p>
            </div>
            <div className="flex items-center justify-between h-[30px] mt-[16px]">
              <p className="text-[#3E424A] text-[20px] font-medium">Total</p>
              {isInitialLoad || isLoading ? (
                <div className="w-12 h-5 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-[#3E424A] text-[20px] font-medium">
                  $ {Math.round(getTotalPrice())}
                </p>
              )}
            </div>
          </div>
          {submitError && (
            <div className="mt-[20px] p-3 bg-red-50 border border-red-200 rounded-[8px] h-[60px] flex items-center">
              <p className="text-red-600 text-[14px] line-clamp-2">
                {submitError}
              </p>
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={isSubmitting || isLoading || isInitialLoad}
            className={`${
              submitError ? "mt-[35px]" : "mt-[55px]"
            } h-[59px] w-full rounded-[10px] font-medium text-[18px] transition-all duration-200 ${
              isSubmitting || isLoading || isInitialLoad
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#FF4000] text-white cursor-pointer hover:bg-[#E63600] active:transform active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : isLoading || isInitialLoad ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              "Pay"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default CheckoutCart;
