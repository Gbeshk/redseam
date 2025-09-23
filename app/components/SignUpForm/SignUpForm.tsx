import { SignUpFormProps } from "@/app/types/sign-up-types/sign-up-types";
import React from "react";
import SignUpFormInput from "../SignUpFormInput/SignUpFormInput";
import SignUpPasswordIcon from "../SignUpPasswordIcon/SignUpPasswordIcon";
import { useRouter } from "next/navigation";

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isSubmitting,
  errors,
  formData,
  onInputChange,
  onTogglePassword,
  showPassword,
  showConfirmPassword,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-[46px] flex flex-col gap-[24px]"
    >
      <SignUpFormInput
        type="text"
        name="username"
        value={formData.username}
        onChange={onInputChange}
        placeholder="Username"
        error={errors.username}
        required={true}
      />

      <SignUpFormInput
        type="text"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="Email"
        error={errors.email}
        required={true}
      />

      <SignUpFormInput
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Password"
        error={errors.password}
        hasIcon={true}
        icon={<SignUpPasswordIcon isVisible={showPassword} />}
        onIconClick={() => onTogglePassword("password")}
        required={true}
      />

      <SignUpFormInput
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onInputChange}
        placeholder="Confirm Password"
        error={errors.confirmPassword}
        hasIcon={true}
        icon={<SignUpPasswordIcon isVisible={showConfirmPassword} />}
        onIconClick={() => onTogglePassword("confirmPassword")}
        required={true}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full h-[41px] mt-[20px] text-white text-[14px] cursor-pointer rounded-[10px] transition-all duration-200 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#FF4000] hover:bg-[#e63900] hover:shadow-lg active:transform active:scale-95"
        }`}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>

      <p className="text-[#3E424A] text-[14px] leading-[100%] tracking-[0] text-center">
        Already member?
        <span
          onClick={() => {
            router.push("/sign-in");
          }}
          className="ml-[8px] text-[#FF4000] cursor-pointer hover:underline transition-all duration-200 hover:text-[#e63900]"
        >
          Log in
        </span>
      </p>
    </form>
  );
};

export default SignUpForm;
