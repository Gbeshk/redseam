import React from "react";
import Link from "next/link";

interface ProductPageNotFoundProps {
  productId?: string;
}

export const ProductPageNotFound: React.FC<ProductPageNotFoundProps> = ({
  productId,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a8.949 8.949 0 008.354-5.646z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4"
              />
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            We couldn&apos;t find the product you&apos;re looking for.
          </p>
          {productId && (
            <p className="text-sm text-gray-500">
              Product ID: <span className="font-mono">{productId}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Browse All Products
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center cursor-pointer justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            What you can do:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Check if the product URL is correct
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              The product might be temporarily unavailable
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Browse our catalog for similar products
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
