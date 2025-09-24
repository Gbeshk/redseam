"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Envelope from "../../../public/images/envelope.svg";
import { useCart } from "@/app/components/contexts/CartContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  cover_image: string;
  color: string;
  size: string;
  quantity: number;
}

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

function Checkoutpage() {
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

  const { cartItems, isLoading, error, updateCartItem, removeCartItem } =
    useCart();
  const router = useRouter();

  useEffect(() => {
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
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode.trim())) {
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
        router.push("/success");
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

  const createUniqueId = (item: CartItem): string => {
    return `${item.id}-${item.color || "no-color"}-${item.size || "no-size"}`;
  };

  const handleUpdateQuantity = async (
    uniqueId: string,
    quantity: number
  ): Promise<void> => {
    try {
      await updateCartItem(uniqueId, quantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (uniqueId: string): Promise<void> => {
    try {
      await removeCartItem(uniqueId);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleRedirect = (itemId: number): void => {
    router.push(`/dashboard/products/${itemId}`);
  };

  const renderCartItem = (item: CartItem) => {
    const uniqueKey = createUniqueId(item);

    return (
      <div key={uniqueKey} className="flex gap-[16px]">
        <div
          className="w-[100px] h-[134px] bg-gray-200 rounded-[10px] border-[1px] border-[#E1DFE1] flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => handleRedirect(item.id)}
        >
          {item.cover_image ? (
            <Image
              src={item.cover_image}
              alt={item.name}
              width={100}
              height={134}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500">Image</span>
          )}
        </div>

        <div className="h-[117px]  w-full flex flex-col justify-between">
          <div
            className="flex justify-between items-center w-full cursor-pointer"
            onClick={() => handleRedirect(item.id)}
          >
            <p className="font-medium text-[14px] w-[200px] text-[#10151F] capitalize">
              {item.name}
            </p>
            <p className="font-medium text-[18px] text-[#10151F] capitalize">
              $ {item.price.toFixed(2)}
            </p>
          </div>

          <p className="text-[#3E424A] font-normal text-[12px]">{item.color}</p>
          <p className="text-[#3E424A] font-normal text-[12px]">{item.size}</p>

          <div className="h-[26px] flex justify-between items-center">
            <div className="w-[70px] h-[26px] flex items-center justify-around rounded-[22px] border-[1px] border-[#E1DFE1]">
              <button
                onClick={() =>
                  handleUpdateQuantity(uniqueKey, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-colors ${
                  item.quantity <= 1
                    ? "cursor-default"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
                style={{
                  color: item.quantity <= 1 ? "#E1DFE1" : "inherit",
                }}
              >
                -
              </button>
              <span className="font-normal text-[12px] text-[#3E424A]">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  handleUpdateQuantity(uniqueKey, item.quantity + 1)
                }
                className="w-[24px] h-[24px] rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
              >
                +
              </button>
            </div>

            <button
              className="text-[12px] text-[#3E424A] hover:underline cursor-pointer"
              onClick={() => handleRemoveItem(uniqueKey)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCartContent = () => {
    if (isInitialLoad) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4000]"></div>
          <p className="text-[#3E424A] text-[16px]">Loading your cart...</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4000]"></div>
          <p className="text-[#3E424A] text-[16px]">Loading your cart...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-red-500 text-center px-4">{error}</p>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-[80px] space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-[#3E424A] text-[16px]">Your cart is empty</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-[36px] max-h-[385px] overflow-y-auto cart-scroll px-[20px] py-[20px]">
        {cartItems.map(renderCartItem)}
      </div>
    );
  };

  return (
    <>
      <div className="max-w-[1720px] w-full mx-auto mt-[52px] pb-[224px]">
        <h1 className="text-[#10151F] font-semibold text-[42px] h-[64px]">
          Checkout
        </h1>
        <div className="mt-[36px] flex gap-[24px] justify-between">
          <div className="max-w-[1129px] w-full h-[635px] bg-[#F8F6F7] rounded-[16px] px-[46px] py-[72px]">
            <p className="text-[#3E424A] font-medium text-[22px] leading-[100%] tracking-[0]">
              Order details
            </p>
            <form className="mt-[52px] max-w-[578px] w-full flex flex-col gap-[32px]">
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
                    <p className="text-red-500 text-[12px] mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div className="w-[277px]">
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) =>
                      handleInputChange("surname", e.target.value)
                    }
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
                  {!emailValue && (
                    <div className="absolute left-[12px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Image
                        src={Envelope}
                        width={20}
                        height={20}
                        alt="envelope"
                      />
                    </div>
                  )}
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full h-[42px] bg-white border rounded-[8px] ${
                      emailValue ? "px-[12px]" : "pl-[36px] pr-[12px]"
                    } placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] ${
                      formErrors.email ? "border-red-500" : "border-[#E1DFE1]"
                    }`}
                    placeholder="Email"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="flex w-full justify-between">
                <div className="w-[277px]">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
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

          <div className="w-[460px] flex flex-col h-[635px]">
            <div className="flex-1 bg-white rounded-[16px] h-[635px] overflow-hidden">
              {renderCartContent()}
            </div>

            {(isInitialLoad ||
              isLoading ||
              (!isLoading && !error && cartItems.length > 0)) && (
              <div>
                <div className="flex flex-col mt-[24px]">
                  <div className="flex items-center justify-between h-[24px]">
                    <p className="text-[#3E424A] text-[16px]">Items subtotal</p>
                    {isInitialLoad || isLoading ? (
                      <div className="w-10 h-4 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-[#3E424A] text-[16px]">
                        $ {Math.round(getSubtotalPrice())}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between h-[24px] mt-[16px]">
                    <p className="text-[#3E424A] text-[16px]">Delivery</p>
                    <p className="text-[#3E424A] text-[16px]">
                      $ {getDeliveryPrice()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between h-[30px] mt-[16px]">
                    <p className="text-[#3E424A] text-[20px] font-medium">
                      Total
                    </p>
                    {isInitialLoad || isLoading ? (
                      <div className="w-12 h-5 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-[#3E424A] text-[20px] font-medium">
                        $ {Math.round(getTotalPrice())}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="mt-[20px] p-3 bg-red-50 border border-red-200 rounded-[8px] h-[60px] flex items-center">
                    <p className="text-red-600 text-[14px] line-clamp-2">
                      {submitError}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting || isLoading || isInitialLoad}
                  className={`${
                    submitError ? "mt-[35px]" : "mt-[55px]"
                  } h-[59px] w-full rounded-[10px] font-medium text-[18px] transition-all duration-200 ${
                    isSubmitting || isLoading || isInitialLoad
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[#FF4000] text-white cursor-pointer hover:bg-[#E63600] active:transform active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : isLoading || isInitialLoad ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Pay"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkoutpage;
