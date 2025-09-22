import Image from "next/image";
import { useRouter } from "next/navigation";
import EmptyCart from "../../../public/images/empty-cart.svg";

interface EmptyCartStateProps {
  onClose?: () => void;
}

export default function EmptyCartState({ onClose }: EmptyCartStateProps) {
  const router = useRouter();

  const handleStartShopping = () => {
    onClose?.();
    router.push("/dashboard");
  };
  return (
    <div className="flex flex-col items-center  text-center mt-[124px]">
      <div className="w-[277px] flex-col flex items-center ">
        <Image src={EmptyCart} alt="Empty cart" width={170} height={135} />
        <p className="text-[#10151F] font-semibold text-[24px] leading-[100%] tracking-[0px] mt-[24px]">
          Ooops!
        </p>
        <p className="text-[#3E424A] font-normal text-[14px] leading-[100%] tracking-[0px] mt-[16px]">
          You&apos;ve got nothing in your cart just yet...
        </p>
        <button
          onClick={handleStartShopping}
          className="mt-[52px] w-[214px] h-[41px] bg-[#FF4000] rounded-[10px] text-white cursor-pointer font-normal text-[14px] leading-[100%] tracking-[0px]"
        >
          Start shopping
        </button>
      </div>
    </div>
  );
}
