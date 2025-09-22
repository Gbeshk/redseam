interface CartHeaderProps {
  itemCount: number;
  onClose: () => void;
}

export default function CartHeader({ itemCount, onClose }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between px-[40px] pt-[40px] border-gray-200">
      <h2 className="text-[24px] font-medium text-[#10151F]">
        Shopping cart: ({itemCount})
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close cart"
      >
        <svg
          className="w-[32px] h-[32px] cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
