import React from "react";
import Image from "next/image";
import XMark from "../../../public/images/x-mark.svg";
import DoneIcon from "../../../public/images/Frame 69.svg";

interface SuccessModalProps {
  handleCloseModal: () => void;
}

function SuccessModal({ handleCloseModal }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-[#10151F] opacity-30 backdrop-blur-sm"></div>
      <div className="relative h-[590px] w-[876px] bg-white p-[30px] animate-scaleIn">
        <Image
          src={XMark}
          alt="x"
          width={40}
          height={40}
          className="absolute top-[30px] right-[30px] cursor-pointer"
          onClick={handleCloseModal}
        />
        <Image
          src={DoneIcon}
          alt="doneIcon"
          width={76}
          height={76}
          className="mx-auto mt-[84px]"
        />
        <h1 className="mt-[40px] text-[#10151F] font-semibold text-[42px] leading-[100%] tracking-[0%] text-center">
          Congrats
        </h1>
        <p className="text-[#3E424A] text-center mt-[24px] font-normal text-[14px] leading-[100%] tracking-[0%]">
          Your order is placed successfully!
        </p>
        <button
          onClick={handleCloseModal}
          className="mt-[76px] rounded-[10px] text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer w-[214px] h-[41px] bg-[#FF4000] block mx-auto"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
