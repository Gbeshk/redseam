"use client";

import { useEffect, useState } from "react";
import HeaderLogo from "../HeaderLogo/HeaderLogo";
import HeaderLogin from "../HeaderLogin/HeaderLogin";
import HeaderProfile from "../HeaderProfile/HeaderProfile";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="max-w-[1920px] w-full h-[80px] px-[120px] flex items-center justify-between mx-auto">
      <HeaderLogo />

      {!isLoggedIn && <HeaderLogin />}

      {isLoggedIn && <HeaderProfile />}
    </div>
  );
}
