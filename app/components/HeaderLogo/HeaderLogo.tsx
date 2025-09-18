"use client";

import Image from "next/image";
import Logo from "../../../public/images/HandEye.svg";
import { useRouter } from "next/navigation";

export default function HeaderLogo() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex gap-[4px] items-center cursor-pointer"
    >
      <Image
        src={Logo}
        width={24}
        height={24}
        alt="Logo"
        className="w-[24px] h-[24px]"
      />
      <p className="font-semibold text-[16px] text-[#10151F]">
        RedSeam Clothing
      </p>
    </div>
  );
}
