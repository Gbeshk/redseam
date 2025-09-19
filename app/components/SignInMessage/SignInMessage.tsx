"use client";

import React from "react";

interface SignInMessageProps {
  message: string;
}

const SignInMessage: React.FC<SignInMessageProps> = ({ message }) => {
  const isSuccess = message.toLowerCase().includes("successful");
  return (
    <div
      className={`mb-4 p-3 rounded-md text-sm ${
        isSuccess
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {message}
    </div>
  );
};

export default SignInMessage;
