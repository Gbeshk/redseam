"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ShoppingCart from "../../../public/images/shopping-cart.svg";
import ArrowDown from "../../../public/images/arrow-down.svg";
import defaultProfile from "../../../public/images/default-profile.svg";
import { User } from "@/app/types/sign-up-types/sign-up-types";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

export default function HeaderProfile() {
  const [profileUrl, setProfileUrl] = useState<string>(defaultProfile.src);

  useEffect(() => {
    try {
      const userCookie = getCookie("user");
      console.log(userCookie);

      if (!userCookie) return;

      const user: User = JSON.parse(decodeURIComponent(userCookie));
      if (user.avatar) {
        setProfileUrl(user.avatar);
      }
    } catch (error) {
      console.error("Failed to parse user from cookie:", error);
    }
  }, []);

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
        src={profileUrl}
        alt="profile"
        width={40}
        height={40}
        className="w-[40px] h-[40px] ml-[20px] rounded-full object-cover"
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
