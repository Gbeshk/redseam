import SignInPage from "@/app/components/SignInPage/SignInPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/dashboard");
  }

  return <SignInPage />;
}

export default page;
