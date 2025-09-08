// API Configuration - Use your TripleTen student token here
export const API_CONFIG = {
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "12c3a7ea-f9fe-4d1a-b905-983f501aca74",
    "Content-Type": "application/json",
  },
};

// Fallback configuration for development/demo purposes
export const FALLBACK_CONFIG = {
  baseUrl: "https://jsonplaceholder.typicode.com", // Mock API for demo
  headers: {
    "Content-Type": "application/json",
  },
}; // Alternative configuration for different environments
export const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    baseUrl: isDevelopment
      ? "http://localhost:3000/v1"
      : "https://around-api.en.tripleten-services.com/v1",
    headers: {
      authorization: "12c3a7ea-f9fe-4d1a-b905-983f501aca74",
      "Content-Type": "application/json",
    },
  };
};

// Error messages for better UX
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  AUTH_ERROR: "Authentication failed. Please log in again.",
};
