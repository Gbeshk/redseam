import React from "react";
import Image from "next/image";
import XMark from "../../../public/images/x-mark.svg";
import DoneIcon from "../../../public/images/Frame 69.svg";

interface SuccessModalProps {
  handleCloseModal: () => void;
}

function SuccessModal({ handleCloseModal }: SuccessModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
        <div className="absolute inset-0 bg-[#10151F] opacity-30 backdrop-blur-sm"></div>
        <div className="relative h-[590px] w-[876px] bg-white p-[30px] animate-scaleIn overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-20 w-3 h-3 bg-green-200 rounded-full animate-float-1 opacity-40"></div>
            <div className="absolute top-32 right-32 w-2 h-2 bg-orange-200 rounded-full animate-float-2 opacity-40"></div>
            <div className="absolute bottom-32 left-32 w-4 h-4 bg-blue-200 rounded-full animate-float-3 opacity-40"></div>
            <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-200 rounded-full animate-float-4 opacity-40"></div>
          </div>

          <Image
            src={XMark}
            alt="x"
            width={40}
            height={40}
            className="absolute top-[30px] right-[30px] cursor-pointer hover:rotate-90 hover:scale-110 transition-all duration-300"
            onClick={handleCloseModal}
          />

          <div className="relative mx-auto mt-[84px] w-[76px] h-[76px]">
            <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping opacity-60"></div>
            <div className="absolute inset-[-8px] rounded-full border border-green-100 animate-pulse opacity-40"></div>
            <Image
              src={DoneIcon}
              alt="doneIcon"
              width={76}
              height={76}
              className="relative z-10 animate-bounce-in"
            />
          </div>

          <h1 className="mt-[40px] text-[#10151F] font-semibold text-[42px] leading-[100%] tracking-[0%] text-center animate-slide-up">
            <span className="bg-gradient-to-r text-[#10151F]  bg-clip-text ">
              Congrats
            </span>
          </h1>

          <p className="text-[#3E424A] text-center mt-[24px] font-normal text-[14px] leading-[100%] tracking-[0%] animate-slide-up-delayed">
            Your order is placed successfully!
          </p>

          <button
            onClick={handleCloseModal}
            className="mt-[76px] rounded-[10px] text-white font-normal text-[14px] leading-[100%] tracking-[0%] cursor-pointer w-[214px] h-[41px] bg-[#FF4000] block mx-auto hover:bg-[#E63600] hover:scale-105 active:scale-95 transition-all duration-200 animate-slide-up-final relative overflow-hidden group shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative">Continue shopping</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-15px) translateX(3px);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-8px) translateX(-3px);
          }
          66% {
            transform: translateY(-12px) translateX(4px);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          40% {
            transform: translateY(-6px) translateX(2px);
          }
          80% {
            transform: translateY(-10px) translateX(-4px);
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          30% {
            transform: translateY(-7px) translateX(-2px);
          }
          60% {
            transform: translateY(-4px) translateX(3px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out 0.2s both;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out 0.5s both;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.5s ease-out 0.7s both;
        }

        .animate-slide-up-final {
          animation: slide-up 0.5s ease-out 0.9s both;
        }

        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite 0.5s;
        }

        .animate-float-3 {
          animation: float-3 6s ease-in-out infinite 1s;
        }

        .animate-float-4 {
          animation: float-4 4.5s ease-in-out infinite 1.5s;
        }

        input:focus {
          outline: none;
        }
      `}</style>
    </>
  );
}

export default SuccessModal;
