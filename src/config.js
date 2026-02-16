// src/config.js

// Use Vercel environment variable if available, otherwise fallback to local backend
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";
