import React from "react";
import XMark from "../../../public/images/x-mark.svg";
import DoneIcon from "../../../public/images/Frame 69.svg";
import Image from "next/image";

function page() {
  return (
    <>
      <div className="relative h-[590px]   w-[876px] bg-red-50 p-[30px]">
        <Image
          src={XMark}
          alt="x"
          width={40}
          height={40}
          className="absolute top-[30px] right-[30px] cursor-pointer"
        />
        <Image
          src={DoneIcon}
          alt="doneIcon"
          width={76}
          height={76}
          className="mx-auto mt-[84px]"
        ></Image>
        <h1 className="mt-[40px] text-[#10151F] font-semibold text-[42px] leading-[100%] tracking-[0%] text-center">
          Congrats
        </h1>
        <p className="text-[#3E424A] text-center mt-[24px] font-normal text-[14px] leading-[100%] tracking-[0%] ">
          Your order is placed successfully!
        </p>
        <button className="mt-[76px] rounded-[10px] text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer w-[214px] h-[41px] bg-[#FF4000] block mx-auto">
          Continue shopping
        </button>
      </div>
    </>
  );
}

export default page;
