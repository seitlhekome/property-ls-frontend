// src/config.js

// If deployed → uses Vercel environment variable
// If running locally → falls back to localhost
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3002/api";
