"use client";

import Image from "next/image";
import LoginIcon from "../../../public/images/login-icon.svg";
import { useRouter } from "next/navigation";

export default function HeaderLogin() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/sign-in");
  };

  return (
    <div
      className="flex gap-[8px] items-center cursor-pointer"
      onClick={handleClick}
    >
      <Image
        src={LoginIcon}
        alt="loginIcon"
        width={20}
        height={20}
        className="w-[20px] h-[20px]"
      />
      <p className="text-[#10151F] font-medium text-[12px]">Log in</p>
    </div>
  );
}
