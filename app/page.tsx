"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      router.replace("/sign-in");
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      Checking authentication...
    </div>
  );
}
