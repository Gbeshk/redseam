import { SignUpFormProps } from "@/app/types/sign-up-types/sign-up-types";
import React from "react";
import SignUpFormInput from "../SignUpFormInput/SignUpFormInput";
import SignUpPasswordIcon from "../SignUpPasswordIcon/SignUpPasswordIcon";

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isSubmitting,
  errors,
  formData,
  onInputChange,
  onTogglePassword,
  showPassword,
  showConfirmPassword,
  showRequired,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPlaceholderText = (
    fieldName: keyof typeof formData,
    baseText: string
  ) => {
    const value = formData[fieldName];
    const hasError =
      showRequired && (!value || (typeof value === "string" && !value.trim()));
    return hasError ? `${baseText} *` : baseText;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[52px] flex flex-col gap-[24px]"
    >
      <SignUpFormInput
        type="text"
        name="username"
        value={formData.username}
        onChange={onInputChange}
        placeholder={getPlaceholderText("username", "Username")}
        error={errors.username}
      />

      <SignUpFormInput
        type="text"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder={getPlaceholderText("email", "Email")}
        error={errors.email}
      />

      <SignUpFormInput
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder={getPlaceholderText("password", "Password")}
        error={errors.password}
        hasIcon={true}
        icon={<SignUpPasswordIcon isVisible={showPassword} />}
        onIconClick={() => onTogglePassword("password")}
      />

      <SignUpFormInput
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onInputChange}
        placeholder={getPlaceholderText("confirmPassword", "Confirm Password")}
        error={errors.confirmPassword}
        hasIcon={true}
        icon={<SignUpPasswordIcon isVisible={showConfirmPassword} />}
        onIconClick={() => onTogglePassword("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full h-[41px] mt-[28px] text-white text-[14px] cursor-pointer rounded-[10px] transition-all duration-200 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF4000] hover:bg-[#e63900] hover:shadow-lg active:transform active:scale-95"
        }`}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>

      <p className="text-[#3E424A] text-[14px] leading-[100%] tracking-[0] text-center">
        Already member?
        <span className="ml-[8px] text-[#FF4000] cursor-pointer hover:underline transition-all duration-200 hover:text-[#e63900]">
          Log in
        </span>
      </p>
    </form>
  );
};

export default SignUpForm;
