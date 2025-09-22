interface CartSummaryProps {
  subtotal: number;
  deliveryPrice: number;
  total: number;
}

export default function CartSummary({
  subtotal,
  deliveryPrice,
  total,
}: CartSummaryProps) {
  return (
    <div className="px-[40px] pt-[24px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between h-[24px]">
          <p className="text-[#3E424A] text-[16px]">Items subtotal</p>
          <p className="text-[#3E424A] text-[16px]">$ {Math.round(subtotal)}</p>
        </div>
        <div className="flex items-center justify-between h-[24px] mt-[16px]">
          <p className="text-[#3E424A] text-[16px]">Delivery</p>
          <p className="text-[#3E424A] text-[16px]">$ {deliveryPrice}</p>
        </div>
        <div className="flex items-center justify-between h-[30px] mt-[16px]">
          <p className="text-[#3E424A] text-[20px] font-medium">Total</p>
          <p className="text-[#3E424A] text-[20px] font-medium">
            $ {Math.round(total)}
          </p>
        </div>
      </div>
      <button className="mt-[98px] h-[59px] w-full bg-[#FF4000] text-white rounded-[10px] cursor-pointer font-medium text-[18px] hover:bg-[#E63600] transition-colors">
        Go to checkout
      </button>
    </div>
  );
}
