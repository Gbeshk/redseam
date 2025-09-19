"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import LoginPicture from "../../../public/images/login-picture.png";
import {
  SignUpApiResponsee,
  SignUpFormData,
  SignUpFormErrors,
} from "@/app/types/sign-up-types/sign-up-types";

import SignUpAvatarUpload from "../SignUpAvatarUpload/SignUpAvatarUpload";
import SignUpMessageDisplay from "../SignUpMessageDisplay/SignUpMessageDisplay";
import SignUpForm from "../SignUpForm/SignUpForm";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [showRequired, setShowRequired] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 3)
      newErrors.password = "Password must be at least 3 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    setShowRequired(true);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof SignUpFormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
      if (message) setMessage("");
    },
    [errors, message]
  );

  const handleAvatarChange = useCallback(
    (file: File | null) => {
      if (file) {
        const maxSize = 1024 * 1024;
        if (file.size > maxSize) {
          setMessage("Avatar file size must be less than 1MB.");
          return;
        }
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
          setMessage("Avatar must be JPEG, PNG, or GIF.");
          return;
        }
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
      if (message) setMessage("");
    },
    [message]
  );

  const handleError = useCallback((msg: string) => setMessage(msg), []);

  const handleTogglePassword = useCallback(
    (field: "password" | "confirmPassword") => {
      if (field === "password") {
        setShowPassword((prev) => !prev);
      } else {
        setShowConfirmPassword((prev) => !prev);
      }
    },
    []
  );

  const handleSubmit = async (data: SignUpFormData) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const submitData = new FormData();
      submitData.append("username", data.username.trim());
      submitData.append("email", data.email.trim());
      submitData.append("password", data.password);
      submitData.append("password_confirmation", data.confirmPassword);
      if (data.avatar) submitData.append("avatar", data.avatar);

      const response = await fetch("/api/register", {
        method: "POST",
        body: submitData,
      });

      let result: SignUpApiResponsee = { message: "" };
      const text = await response.text();
      if (text) {
        try {
          result = JSON.parse(text) as SignUpApiResponsee;
        } catch {
          result = { message: text };
        }
      }

      if (response.ok) {
        setMessage("Registration successful! Redirecting to sign-in...");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          avatar: null,
        });
        setErrors({});
        setShowRequired(false);

        const fileInput = document.getElementById(
          "signUpImageUpload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 1000);
        return;
      }

      const newErrors: SignUpFormErrors = {};
      const validationErrors = result.errors || {};

      if (validationErrors.username) {
        const usernameError = Array.isArray(validationErrors.username)
          ? validationErrors.username[0]
          : String(validationErrors.username);
        newErrors.username = usernameError;
      }

      if (validationErrors.email) {
        const emailError = Array.isArray(validationErrors.email)
          ? validationErrors.email[0]
          : String(validationErrors.email);
        newErrors.email = emailError;
      }

      if (validationErrors.password) {
        newErrors.password = Array.isArray(validationErrors.password)
          ? validationErrors.password[0]
          : String(validationErrors.password);
      }

      if (validationErrors.password_confirmation) {
        newErrors.confirmPassword = Array.isArray(
          validationErrors.password_confirmation
        )
          ? validationErrors.password_confirmation[0]
          : String(validationErrors.password_confirmation);
      }

      if (validationErrors.avatar) {
        newErrors.avatar = Array.isArray(validationErrors.avatar)
          ? validationErrors.avatar[0]
          : String(validationErrors.avatar);
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0 && result.message) {
        setMessage(result.message);
      }
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      if (error instanceof Error) {
        setMessage(`Registration failed: ${error.message}`);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-[#10151F] font-semibold text-[42px]">
            Registration
          </p>
          <SignUpAvatarUpload
            avatar={formData.avatar}
            onAvatarChange={handleAvatarChange}
            onError={handleError}
          />
          <SignUpMessageDisplay message={message} />
          <SignUpForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
            formData={formData}
            onInputChange={handleInputChange}
            onAvatarChange={handleAvatarChange}
            onTogglePassword={handleTogglePassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            showRequired={showRequired}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
