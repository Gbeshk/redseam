"use client";

import React from "react";
import Image from "next/image";
import LoginPicture from "../../../public/images/login-picture.png";
import SignInForm from "../SignInForm/SignInForm";

export default function SignInPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  return (
    <div className="max-w-[1920px] w-full flex">
      <Image
        src={LoginPicture}
        alt="loginPic"
        width={948}
        height={1000}
        className="w-[948px] h-[1000px]"
      />
      <div className="w-full justify-center flex items-center">
        <div className="max-w-[554px] w-full">
          <p className="text-[#10151F] font-semibold text-[42px] mb-8">
            Log In
          </p>
          <SignInForm apiUrl={API_URL} />
        </div>
      </div>
    </div>
  );
}
