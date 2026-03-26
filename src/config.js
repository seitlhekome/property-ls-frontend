// src/config.js
const isDev = import.meta.env.DEV;

export const API_URL = import.meta.env.VITE_API_URL || (
  isDev
    ? "http://localhost:3002/api"
    : "https://property-ls-backend-production.up.railway.app/api"
);