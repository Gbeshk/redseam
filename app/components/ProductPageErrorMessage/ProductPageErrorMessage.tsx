import React from "react";

interface ProductPageErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning" | "info";
}

export const ProductPageErrorMessage: React.FC<ProductPageErrorMessageProps> = ({
  message,
  onRetry,
  type = "error",
}) => {
  const colors = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div
        className={`${colors[type].bg} border ${colors[type].border} rounded-lg p-6 max-w-md`}
      >
        <h3 className={`text-lg font-medium ${colors[type].text} mb-2`}>
          {type === "error"
            ? "Error"
            : type === "warning"
            ? "Warning"
            : "Information"}
        </h3>
        <p className={`${colors[type].text} mb-4`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`${colors[type].button} text-white px-4 py-2 rounded-md transition-colors`}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};