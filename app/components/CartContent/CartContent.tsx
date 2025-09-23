import CartItem from "../CartItem/CartItem";
import EmptyCartState from "../EmptyCartState/EmptyCartState";
import ErrorState from "../ErrorState/ErrorState";
import LoadingState from "../LoadingState/LoadingState";

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  cover_image?: string;
}

interface CartContentProps {
  cartItems: CartItemData[];
  isLoading: boolean;
  error: string | null;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClose: () => void;
}

export default function CartContent({
  cartItems,
  isLoading,
  error,
  onUpdateQuantity,
  onRemoveItem,
  onClose,
}: CartContentProps) {
  if (error) {
    return <ErrorState error={error} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (cartItems.length === 0) {
    return <EmptyCartState onClose={onClose} />;
  }

  return (
    <div className="flex flex-col gap-[36px] ">
      {cartItems.map((item) => (
        <CartItem
          onClose={onClose}
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}
