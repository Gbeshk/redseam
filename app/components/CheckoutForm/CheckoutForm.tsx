import React from "react";
import Image from "next/image";
import Envelope from "../../../public/images/envelope.svg";

interface FormData {
  name: string;
  surname: string;
  email: string;
  address: string;
  zipCode: string;
}

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  zipCode?: string;
}

interface CheckoutFormProps {
  formData: FormData;
  formErrors: FormErrors;
  emailValue: string;
  handleInputChange: (field: keyof FormData, value: string) => void;
}

function CheckoutForm({
  formData,
  formErrors,
  emailValue,
  handleInputChange,
}: CheckoutFormProps) {
  return (
    <div className="w-[1129px] h-[635px] bg-[#F8F6F7] rounded-[16px] px-[46px] py-[72px]">
      <p className="text-[#3E424A] font-medium text-[22px] leading-[100%] tracking-[0]">
        Order details
      </p>
      <form className="mt-[52px] w-[578px] flex flex-col gap-[32px]">
        <div className="flex w-full justify-between">
          <div className="w-[277px]">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full h-[42px] bg-white border rounded-[8px] px-[12px] placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] ${
                formErrors.name ? "border-red-500" : "border-[#E1DFE1]"
              }`}
              placeholder="Name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-[12px] mt-1">{formErrors.name}</p>
            )}
          </div>
          <div className="w-[277px]">
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              className={`w-full h-[42px] bg-white border rounded-[8px] px-[12px] placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] ${
                formErrors.surname ? "border-red-500" : "border-[#E1DFE1]"
              }`}
              placeholder="Surname"
            />
            {formErrors.surname && (
              <p className="text-red-500 text-[12px] mt-1">
                {formErrors.surname}
              </p>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="relative w-full">
            <div className="absolute left-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Image src={Envelope} width={20} height={20} alt="envelope" />
            </div>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full h-[42px] bg-white border rounded-[8px] pl-[36px] pr-[12px] placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] ${
                formErrors.email ? "border-red-500" : "border-[#E1DFE1]"
              }`}
              placeholder="Email"
            />
          </div>
          {formErrors.email && (
            <p className="text-red-500 text-[12px] mt-1">{formErrors.email}</p>
          )}
        </div>
        <div className="flex w-full justify-between">
          <div className="w-[277px]">
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`w-full h-[42px] bg-white border rounded-[8px] px-[12px] placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] ${
                formErrors.address ? "border-red-500" : "border-[#E1DFE1]"
              }`}
              placeholder="Address"
            />
            {formErrors.address && (
              <p className="text-red-500 text-[12px] mt-1">
                {formErrors.address}
              </p>
            )}
          </div>
          <div className="w-[277px]">
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className={`w-full h-[42px] bg-white border rounded-[8px] px-[12px] placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] ${
                formErrors.zipCode ? "border-red-500" : "border-[#E1DFE1]"
              }`}
              placeholder="Zip code"
            />
            {formErrors.zipCode && (
              <p className="text-red-500 text-[12px] mt-1">
                {formErrors.zipCode}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;
