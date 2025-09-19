"use client";
import { useEffect, useState, useCallback } from "react";
import HeaderLogo from "../HeaderLogo/HeaderLogo";
import HeaderLogin from "../HeaderLogin/HeaderLogin";
import HeaderProfile from "../HeaderProfile/HeaderProfile";
import { useRouter } from "next/navigation";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const isAuthenticated = (): boolean => {
  const token = getCookie("token");
  return token !== null && token.trim() !== "";
};

const clearCookies = () => {
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  window.dispatchEvent(new Event("authStatusChanged"));
};

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const checkAuthStatus = useCallback(() => {
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("authStatusChanged", handleAuthChange);

    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("authStatusChanged", handleAuthChange);
      clearInterval(interval);
    };
  }, [checkAuthStatus]);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleLogout = () => {
    clearCookies();
    setIsModalOpen(false);
    setIsLoggedIn(false);
    router.push("/sign-in");
  };

  if (isLoading) {
    return (
      <div className="max-w-[1920px] w-full h-[80px] px-[100px] flex items-center justify-between mx-auto">
        <HeaderLogo />
        <div className="w-[100px] h-[40px]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] w-full h-[80px] px-[100px] flex items-center justify-between mx-auto">
      <HeaderLogo />
      {!isLoggedIn && <HeaderLogin />}
      {isLoggedIn && (
        <div className="relative">
          <HeaderProfile onArrowClick={toggleModal} />
          {isModalOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer px-4 py-2 text-left text-[14px] text-[#10151F] hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}