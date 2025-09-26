"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/app/components/contexts/CartContext";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import CheckoutCart from "../CheckoutCart/CheckoutCart";
import SuccessModal from "../SuccessModal/SuccessModal";

interface FormData {
  name: string;
  surname: string;
  email: string;
  address: string;
  zipCode: string;
}
interface CartItem {
  id: number;
  name: string;
  price: number;
  cover_image: string;
  color: string;
  size: string;
  quantity: number;
}
interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  zipCode?: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  is_admin: number;
  remember_token: string | null;
  avatar: string | null;
}

function CheckoutPage() {
  const [emailValue, setEmailValue] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    address: "",
    zipCode: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { cartItems, isLoading, error, clearCart } = useCart();
  const router = useRouter();

  const getUserFromCookies = (): UserData | null => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "user") {
          try {
            return JSON.parse(decodeURIComponent(value));
          } catch (error) {
            console.error("Error parsing user cookie:", error);
            return null;
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const userData = getUserFromCookies();
    if (userData?.email) {
      setEmailValue(userData.email);
      setFormData((prev) => ({ ...prev, email: userData.email }));
    }

    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTokenFromCookies = (): string | null => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "token") {
          return value;
        }
      }
    }
    return null;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.surname.trim()) {
      errors.surname = "Surname is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    } else if (!/^\d+$/.test(formData.zipCode.trim())) {
      errors.zipCode = "Please enter a valid zip code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "email") {
      setEmailValue(value);
    }
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckout = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty");
      return;
    }

    const token = getTokenFromCookies();
    if (!token) {
      setSubmitError("Authentication required. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            address: formData.address,
            zip_code: formData.zipCode,
          }),
          redirect: "follow",
        }
      );

      if (response.status === 200) {
        clearCart();
        setShowSuccessModal(true);
      } else if (
        response.status === 307 ||
        response.status === 301 ||
        response.status === 302
      ) {
        setSubmitError(
          "API endpoint configuration issue. Please contact support."
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(
          errorData.message ||
            `Checkout failed (${response.status}). Please try again.`
        );
      }
    } catch (err) {
      setSubmitError(
        ` ${err}Network error. Please check your connection and try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  const getSubtotalPrice = (): number => {
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  };

  const getDeliveryPrice = (): number => {
    return 5;
  };

  const getTotalPrice = (): number => {
    return getSubtotalPrice() + getDeliveryPrice();
  };

  return (
    <>
      <div className="w-[1720px] mx-auto mt-[52px] pb-[224px]">
        <h1 className="text-[#10151F] font-semibold text-[42px] h-[64px]">
          Checkout
        </h1>
        <div className="mt-[36px] flex gap-[24px] justify-between">
          <CheckoutForm
            formData={formData}
            formErrors={formErrors}
            emailValue={emailValue}
            handleInputChange={handleInputChange}
          />
          <CheckoutCart
            isInitialLoad={isInitialLoad}
            isLoading={isLoading}
            error={error}
            cartItems={cartItems}
            submitError={submitError}
            isSubmitting={isSubmitting}
            getSubtotalPrice={getSubtotalPrice}
            getDeliveryPrice={getDeliveryPrice}
            getTotalPrice={getTotalPrice}
            handleCheckout={handleCheckout}
          />
        </div>
      </div>
      {showSuccessModal && <SuccessModal handleCloseModal={handleCloseModal} />}
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        input:focus {
          outline: none;
        }
      `}</style>
    </>
  );
}

export default CheckoutPage;
