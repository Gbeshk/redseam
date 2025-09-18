import { SignUpMessageDisplayProps } from "@/app/types/sign-up-types/sign-up-types";
import React from "react";

const SignUpMessageDisplay: React.FC<SignUpMessageDisplayProps> = ({
  message,
}) => {
  if (!message) return null;

  return (
    <div
      className={`mt-4 p-3 rounded-md transition-all duration-300 ${
        message.includes("successful")
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {message}
    </div>
  );
};

export default SignUpMessageDisplay;
