import Image from "next/image";
import ShoppingCart from "../../../public/images/shopping-cart.svg";
import ArrowDown from "../../../public/images/arrow-down.svg";
import defaultProfile from "../../../public/images/default-profile.svg";

export default function HeaderProfile() {
  return (
    <div className="flex items-center">
      <Image
        src={ShoppingCart}
        alt="shoppingCart"
        width={24}
        height={24}
        className="w-[24px] h-[24px] cursor-pointer"
      />
      <Image
        src={defaultProfile}
        alt="defaultProfile"
        width={40}
        height={40}
        className="w-[40px] h-[40px] ml-[20px]"
      />
      <Image
        src={ArrowDown}
        alt="arrowDown"
        width={20}
        height={20}
        className="w-[20px] h-[20px] ml-[4px] cursor-pointer"
      />
    </div>
  );
}
