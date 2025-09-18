import { SignUpFormInputProps } from "@/app/types/sign-up-types/sign-up-types";
import React from "react";

const SignUpFormInput: React.FC<SignUpFormInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  hasIcon = false,
  icon,
  onIconClick,
}) => {
  const getInputClasses = () => {
    const baseClasses =
      "max-w-[552px] w-full h-[42px] rounded-[8px] border-[1px] p-[12px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4000] focus:ring-opacity-20 hover:border-[#FF4000] hover:border-opacity-50";
    const errorClasses = error
      ? "border-red-500 bg-red-50"
      : "border-[#E1DFE1]";
    const paddingClasses = hasIcon ? "pr-[44px]" : "";

    return `${baseClasses} ${errorClasses} ${paddingClasses}`;
  };

  const getPlaceholderClass = () => {
    return error
      ? "placeholder:text-red-500 placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0%]"
      : "placeholder:text-[#10151F] placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0%]";
  };

  return (
    <div>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${getInputClasses()} ${getPlaceholderClass()}`}
          placeholder={placeholder}
        />
        {hasIcon && icon && (
          <div
            className="absolute right-[12px] top-[11px] cursor-pointer transition-opacity duration-200 hover:opacity-70"
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default SignUpFormInput;
