"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import LoginPicture from "../../../public/images/login-picture.png";
import {
  SignUpApiResponse,
  SignUpFormData,
  SignUpFormErrors,
} from "@/app/types/sign-up-types/sign-up-types";
import SignUpAvatarUpload from "../SignUpAvatarUpload/SignUpAvatarUpload";
import SignUpMessageDisplay from "../SignUpMessageDisplay/SignUpMessageDisplay";
import SignUpForm from "../SignUpForm/SignUpForm";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [showRequired, setShowRequired] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setShowRequired(true);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof SignUpFormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }

      if (message) setMessage("");
    },
    [errors, message]
  );

  const handleAvatarChange = useCallback((file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setMessage(errorMessage);
  }, []);

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
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const submitData = new FormData();
      submitData.append("username", data.username.trim());
      submitData.append("email", data.email.trim());
      submitData.append("password", data.password);
      submitData.append("password_confirmation", data.confirmPassword);

      if (data.avatar) {
        submitData.append("avatar", data.avatar);
      }

      const response = await fetch(
        "https://api.redseam.redberryinternship.ge/api/register",
        {
          method: "POST",
          body: submitData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      let result: SignUpApiResponse;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = (await response.json()) as SignUpApiResponse;
      } else {
        const textResult = await response.text();
        result = { message: textResult };
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
        if (fileInput) {
          fileInput.value = "";
        }

        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 1000);
      } else {
        if (response.status === 422 && result.data) {
          const validationErrors = result.data as Record<string, string[]>;
          const newErrors: SignUpFormErrors = {};

          if (validationErrors.username) {
            newErrors.username = Array.isArray(validationErrors.username)
              ? validationErrors.username[0]
              : String(validationErrors.username);
          }
          if (validationErrors.email) {
            newErrors.email = Array.isArray(validationErrors.email)
              ? validationErrors.email[0]
              : String(validationErrors.email);
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
          if (Object.keys(newErrors).length === 0) {
            setMessage(
              result.message || "Validation failed. Please check your inputs."
            );
          }
        } else if (response.status === 400) {
          setMessage(
            result.message ||
              "Invalid registration data. Please check your inputs."
          );
        } else if (response.status === 401) {
          setMessage("Unauthorized. Please try again.");
        } else if (response.status === 409) {
          setMessage(
            "Username or email already exists. Please try different ones."
          );
        } else if (response.status === 422) {
          setMessage(
            result.message || "Validation failed. Please check your inputs."
          );
        } else if (response.status >= 500) {
          setMessage("Server error. Please try again later.");
        } else {
          setMessage(
            result.message ||
              result.error ||
              "Registration failed. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        setMessage(
          "Network connection failed. Please check your internet connection."
        );
      } else if (error instanceof SyntaxError) {
        setMessage("Server response error. Please try again later.");
      } else if (error instanceof Error) {
        setMessage(`An error occurred: ${error.message}`);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
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
