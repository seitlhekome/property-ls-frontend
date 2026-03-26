import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import PropertyList from "./components/PropertyList";
import PropertyDetail from "./components/PropertyDetail";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import ListModal from "./components/ListModal";
import CalculatorModal from "./components/CalculatorModal";
import Footer from "./components/Footer";
import PropertyMap from "./components/PropertyMap";

import { API_URL } from "./config";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= UI STATE =================
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  // ================= DATA STATE =================
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= AUTH FORM =================
  const [authIsSignup, setAuthIsSignup] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    whatsapp: "",
  });

  // ================= NEW PROPERTY =================
  const [newProp, setNewProp] = useState({
    title: "",
    price: 0,
    rent_price: 0,
    purpose: "buy",
    type: "House",
    district: "Maseru",
    location: "",
    bedrooms: 0,
    bathrooms: 0,
    size: 0,
    description: "",
    images: [],
    phone: "",
    whatsapp: "",
    lat: "",
    lng: "",
  });

  // ================= DEBUG =================
  console.log("API_URL =", API_URL);
  console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
  console.log("DEV =", import.meta.env.DEV);
  console.log("Current route =", location.pathname);

  // ================= HELPERS =================
  const fmt = (v) => `M ${Number(v || 0).toLocaleString()}`;

  const normalizeProperty = (p) => ({
    ...p,
    id: p.id || p._id,
    agent_id: p.agent_id || p.agentId || p.user_id || p.userId,
    purpose: p.purpose || "buy",
    images: Array.isArray(p.images) ? p.images : [],
    phone: p.phone || "",
    whatsapp: p.whatsapp || "",
    lat: p.lat != null && p.lat !== "" ? Number(p.lat) : null,
    lng: p.lng != null && p.lng !== "" ? Number(p.lng) : null,
  });

  const toggleFav = (id) => {
    if (!currentUser) {
      alert("Login to favorite");
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getCurrentUserId = () => currentUser?.id || currentUser?._id;

  // ================= LOAD USER =================
  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("token");

    if (u && t) {
      try {
        setCurrentUser(JSON.parse(u));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.clear();
      }
    }
  }, []);

  // ================= FETCH PROPERTIES =================
  const fetchProperties = useCallback(async () => {
    setLoading(true);

    try {
      const url = `${API_URL}/properties`;
      console.log("Fetching properties from:", url);

      const res = await axios.get(url, {
        timeout: 15000,
      });

      console.log("Properties response:", res.data);

      const formatted = Array.isArray(res.data)
        ? res.data.map(normalizeProperty)
        : [];

      setProperties(formatted);
    } catch (err) {
      console.error("Failed to fetch properties", err);
      console.error("Fetch properties message:", err.message);
      console.error("Fetch properties response:", err.response?.data);
      console.error("Fetch properties URL:", `${API_URL}/properties`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ================= AUTH =================
  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) {
      throw new Error("Enter email and password");
    }

    setLoading(true);

    try {
      const url = `${API_URL}/auth/login`;
      console.log("Login URL:", url);

      const res = await axios.post(
        url,
        {
          email: authForm.email,
          password: authForm.password,
        },
        {
          timeout: 15000,
        }
      );

      console.log("Login response:", res.data);

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setShowAuthModal(false);
      await fetchProperties();

      if (res.data.role === "agent") {
        navigate("/agent/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      console.error("Login error response:", err.response?.data);
      throw new Error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!authForm.name || !authForm.email || !authForm.password) {
      throw new Error("Fill all required fields");
    }

    setLoading(true);

    try {
      const url = `${API_URL}/auth/signup`;
      console.log("Signup URL:", url);

      const res = await axios.post(url, authForm, {
        timeout: 15000,
      });

      console.log("Signup response:", res.data);

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setShowAuthModal(false);
      await fetchProperties();

      if (res.data.role === "agent") {
        navigate("/agent/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      console.error("Signup error response:", err.response?.data);
      throw new Error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LIST PROPERTY =================
  const listProp = async (propData, imageFiles) => {
    const token = localStorage.getItem("token");

    if (!token || currentUser?.role !== "agent") {
      alert("Only logged in agents can list properties");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      if (Array.isArray(imageFiles)) {
        imageFiles.forEach((file) => fd.append("images", file));
      }

      Object.keys(propData).forEach((key) => {
        if (key === "images") return;

        if (key === "lat" || key === "lng") {
          const val = parseFloat(propData[key]);
          if (!Number.isNaN(val)) {
            fd.append(key, val);
          }
        } else {
          fd.append(key, propData[key] ?? "");
        }
      });

      const url = `${API_URL}/properties`;
      console.log("List property URL:", url);

      await axios.post(url, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 20000,
      });

      setShowListModal(false);
      await fetchProperties();
    } catch (err) {
      console.error("Failed to list property:", err);
      console.error("List property error response:", err.response?.data);
      alert(err.response?.data?.error || "Failed to list property");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.clear();
    navigate("/");
  };

  // ================= FILTER =================
  const filteredProperties = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return properties.filter((p) => {
      const purpose = p.purpose || "buy";
      const matchesTab = purpose === activeTab;

      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [properties, activeTab, searchQuery]);

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        setShowCalculator={setShowCalculator}
        setShowAuthModal={setShowAuthModal}
        setShowListModal={setShowListModal}
        handleLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredProperties={filteredProperties}
      />

      <Routes>
        <Route
          path="/"
          element={
            <PropertyList
              properties={filteredProperties}
              favorites={favorites}
              toggleFav={toggleFav}
              fmt={fmt}
              setSelectedProperty={(p) =>
                navigate(`/property/${p.id || p._id}`, {
                  state: { selectedProperty: p },
                })
              }
              currentUser={currentUser}
              loading={loading}
            />
          }
        />

        <Route
          path="/map"
          element={
            <PropertyMap
              properties={filteredProperties}
              onBack={() => navigate("/")}
            />
          }
        />

        <Route
          path="/property/:id"
          element={
            <PropertyDetail
              favorites={favorites}
              toggleFav={toggleFav}
              currentUser={currentUser}
            />
          }
        />

        <Route
          path="/agent/dashboard"
          element={
            currentUser?.role === "agent" ? (
              <Dashboard
                setShowListModal={setShowListModal}
                currentUser={currentUser}
                properties={properties.filter(
                  (p) => String(p.agent_id) === String(getCurrentUserId())
                )}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      {showAuthModal && (
        <AuthModal
          authIsSignup={authIsSignup}
          setAuthIsSignup={setAuthIsSignup}
          authForm={authForm}
          setAuthForm={setAuthForm}
          login={handleLogin}
          signup={handleSignup}
          loading={loading}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      {showListModal && currentUser?.role === "agent" && (
        <ListModal
          newProp={newProp}
          setNewProp={setNewProp}
          listPropBackend={listProp}
          loading={loading}
          setShowListModal={setShowListModal}
        />
      )}

      {showCalculator && (
        <CalculatorModal
          calcVals={{}}
          setCalcVals={() => {}}
          calcMort={setShowCalculator}
          fmt={fmt}
        />
      )}

      <Footer />
    </div>
  );
}