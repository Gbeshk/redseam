"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SignInMessage from "../SignInMessage/SignInMessage";
import SignInInput from "../SignInInput/SignInInput";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface SignInFormProps {
  apiUrl: string;
}

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
};

const SignInForm: React.FC<SignInFormProps> = ({ apiUrl }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (message) setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 3)
      newErrors.password = "Password must be at least 3 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response
        .json()
        .catch(() => ({ message: "Invalid server response" }));

      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        if (result.token) setCookie("token", result.token, 7);
        if (result.user) setCookie("user", JSON.stringify(result.user), 7);
        setFormData({ email: "", password: "" });

        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        if (response.status === 401 || response.status === 405) {
          setMessage("Email or password is incorrect. Please try again.");
        } else if (response.status === 422 && result.errors) {
          const serverErrors: FormErrors = {};
          if (result.errors.email)
            serverErrors.email = Array.isArray(result.errors.email)
              ? result.errors.email[0]
              : result.errors.email;
          if (result.errors.password)
            serverErrors.password = Array.isArray(result.errors.password)
              ? result.errors.password[0]
              : result.errors.password;
          setErrors(serverErrors);
        } else setMessage("Email or password is incorrect. Please try again.");
      }
    } catch {
      setMessage(
        "Network connection failed. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const EyeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {showPassword ? (
        <>
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke="#10151F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="#10151F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            stroke="#10151F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 1l22 22"
            stroke="#10151F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-[52px]">
      {message && <SignInMessage message={message} />}
      <SignInInput
        type="text"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        error={errors.email}
        required={true}
      />
      <SignInInput
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        error={errors.password}
        hasIcon
        icon={<EyeIcon />}
        onIconClick={togglePasswordVisibility}
        required={true}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-[552px] cursor-pointer mt-[28px]  h-[42px] bg-[#FF4000] text-white rounded-[8px] font-poppins font-semibold text-[14px] hover:bg-[#e63900] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging In..." : "Log In"}
      </button>
      <p className="text-[#3E424A] text-[14px] leading-[100%] tracking-[0] text-center">
        Not a member?
        <span
          onClick={() => router.push("/sign-up")}
          className="ml-[8px] text-[#FF4000] cursor-pointer hover:underline transition-all duration-200 hover:text-[#e63900]"
        >
          Register
        </span>
      </p>
    </form>
  );
};

export default SignInForm;