import axios from "axios";

// Use your Railway backend URL here
const API = axios.create({
  baseURL: "https://property-ls-backend-production.up.railway.app",
});

export default API;
