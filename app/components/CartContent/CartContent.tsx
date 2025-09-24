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
  onUpdateQuantity: (uniqueId: string, quantity: number) => void;
  onRemoveItem: (uniqueId: string) => void;
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

  // Create unique key for each cart item
  const createUniqueKey = (item: CartItemData) => {
    return `${item.id}-${item.color || 'no-color'}-${item.size || 'no-size'}`;
  };

  return (
    <div className="flex flex-col gap-[36px] ">
      {cartItems.map((item) => (
        <CartItem
          onClose={onClose}
          key={createUniqueKey(item)}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}