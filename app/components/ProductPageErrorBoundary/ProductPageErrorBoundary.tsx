"use client";

import React from "react";
import { ProductPageErrorMessage } from "../ProductPageErrorMessage/ProductPageErrorMessage";
interface ProductPageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ProductPageErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ProductPageErrorBoundary extends React.Component<
  ProductPageErrorBoundaryProps,
  ProductPageErrorBoundaryState
> {
  constructor(props: ProductPageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    if (process.env.NODE_ENV === "production") {
      // logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ProductPageErrorMessage
            message="Something went wrong. Please refresh the page and try again."
            onRetry={() => this.setState({ hasError: false, error: null })}
          />
        )
      );
    }

    return this.props.children;
  }
}
