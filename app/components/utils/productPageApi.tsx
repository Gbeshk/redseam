class NetworkErrorClass extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "NetworkError";
  }
}

class ValidationErrorClass extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthErrorClass extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {}

      if (response.status === 401) {
        throw new AuthErrorClass("Authentication required. Please log in.");
      } else if (response.status === 403) {
        throw new AuthErrorClass("Access denied. You do not have permission.");
      } else if (response.status === 404) {
        // Return null for 404s instead of throwing error
        return null;
      } else if (response.status >= 500) {
        throw new NetworkErrorClass(
          "Server error. Please try again later.",
          response.status
        );
      } else {
        throw new NetworkErrorClass(errorMessage, response.status);
      }
    }

    return await response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new NetworkErrorClass(
        "Request timed out. Please check your connection and try again."
      );
    }

    if (error instanceof NetworkErrorClass || error instanceof AuthErrorClass) {
      throw error;
    }

    if (!navigator.onLine) {
      throw new NetworkErrorClass(
        "No internet connection. Please check your network and try again."
      );
    }

    throw new NetworkErrorClass(
      "Network error. Please check your connection and try again."
    );
  }
};

export {
  NetworkErrorClass as NetworkError,
  ValidationErrorClass as ValidationError,
  AuthErrorClass as AuthError,
};