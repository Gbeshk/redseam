import Image from "next/image";

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  cover_image?: string;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex">
      <div className="w-[100px] h-[134px] bg-gray-200 rounded-[10px]  border-[1px] border-[#E1DFE1] flex items-center justify-center overflow-hidden">
        {item.cover_image ? (
          <Image
            src={item.cover_image}
            alt={item.name}
            width={100}
            height={134}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-gray-500">Image</span>
        )}
      </div>
      <div className="h-[117px] my-auto ml-[16px] w-full flex flex-col justify-between">
        <div className="flex justify-between items-center w-full">
          <p className="font-medium text-[14px] w-[200px]  text-[#10151F] capitalize">
            {item.name}
          </p>
          <p className="font-medium text-[18px]  text-[#10151F] capitalize">
            $ {item.price.toFixed(2)}
          </p>
        </div>
        <p className="text-[#3E424A] font-normal text-[12px]">{item.color}</p>
        <p className="text-[#3E424A] font-normal text-[12px]">{item.size}</p>
        <div className="h-[26px] flex justify-between items-center">
          <div className="w-[70px] h-[26px] flex items-center justify-around rounded-[22px] border-[1px] border-[#E1DFE1]">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
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
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-[24px] h-[24px] rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
          <button
            className="text-[12px] text-[#3E424A] hover:underline cursor-pointer"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
