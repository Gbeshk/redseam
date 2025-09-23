import CartContent from "../CartContent/CartContent";
import CartHeader from "../CartHeader/CartHeader";
import CartSummary from "../CartSummary/CartSummary";

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  cover_image?: string;
}

interface CartProps {
  isOpen: boolean;
  cartItems: CartItemData[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function Cart({
  isOpen,
  cartItems,
  isLoading,
  error,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
}: CartProps) {
  const getSubtotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getDeliveryPrice = () => {
    return 5;
  };

  const getTotalPrice = () => {
    return getSubtotalPrice() + getDeliveryPrice();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[540px] bg-white pb-[40px] shadow-2xl transform transition-transform duration-500 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <CartHeader itemCount={cartItems.length} onClose={onClose} />

        <div className="flex-1 overflow-y-auto px-[40px] mt-[56px] cart-scroll">
          <CartContent
            cartItems={cartItems}
            isLoading={isLoading}
            error={error}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClose={onClose}
          />
        </div>

        {cartItems.length > 0 && (
          <CartSummary
            subtotal={getSubtotalPrice()}
            deliveryPrice={getDeliveryPrice()}
            total={getTotalPrice()}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
