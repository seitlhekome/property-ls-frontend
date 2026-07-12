// src/config.js

const backendUrl =
  process.env.REACT_APP_API_URL ||
  "https://property-ls-backend-production.up.railway.app";

export const API_URL = `${backendUrl.replace(/\/+$/, "")}/api`;