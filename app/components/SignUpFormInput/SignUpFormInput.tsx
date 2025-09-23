import { SignUpFormInputProps } from "@/app/types/sign-up-types/sign-up-types";
import React from "react";

interface ExtendedSignUpFormInputProps extends SignUpFormInputProps {
  required?: boolean;
}

const SignUpFormInput: React.FC<ExtendedSignUpFormInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  hasIcon = false,
  icon,
  onIconClick,
  required = false,
}) => {
  const [hasAutoFill, setHasAutoFill] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const checkAutoFill = () => {
      if (inputRef.current) {
        const domValue = inputRef.current.value;
        const hasWebkitAutofill = inputRef.current.matches(":-webkit-autofill");
        const hasDifferentValue = domValue !== value;
        const hasDomValueWithoutReactValue = Boolean(domValue) && !value;

        const isAutoFilled =
          hasWebkitAutofill ||
          hasDifferentValue ||
          hasDomValueWithoutReactValue;
        setHasAutoFill(isAutoFilled);
      }
    };

    checkAutoFill();
    const interval = setInterval(checkAutoFill, 100);

    return () => clearInterval(interval);
  }, [value]);

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
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`${getInputClasses()} ${getPlaceholderClass()}`}
          placeholder={required ? "" : placeholder}
        />
        {hasIcon && icon && (
          <div
            className="absolute right-[12px] top-[11px] cursor-pointer transition-opacity duration-200 hover:opacity-70"
            onClick={onIconClick}
          >
            {icon}
          </div>
        )}
        {!value && !hasAutoFill && required && (
          <div className="absolute left-[12px] top-[50%] transform -translate-y-1/2 pointer-events-none z-10">
            <span className="text-[#10151F] font-poppins font-normal text-[14px]">
              {placeholder} <span className="text-[#FF4000]">*</span>
            </span>
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
