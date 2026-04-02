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
  const [sessionRestored, setSessionRestored] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

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
  const initialPropertyState = {
    title: "",
    price: "",
    rent_price: "",
    purpose: "buy",
    type: "House",
    district: "Maseru",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    images: [],
    phone: "",
    whatsapp: "",
    lat: "",
    lng: "",
  };

  const [newProp, setNewProp] = useState(initialPropertyState);

  // ================= HELPERS =================
  const fmt = (v) => `M ${Number(v || 0).toLocaleString()}`;

  const getCurrentUserId = useCallback(() => {
    return (
      currentUser?.id ||
      currentUser?.user?.id ||
      currentUser?._id ||
      currentUser?.user?._id ||
      null
    );
  }, [currentUser]);

  const getCurrentUserRole = useCallback(() => {
    return currentUser?.role || currentUser?.user?.role || null;
  }, [currentUser]);

  const normalizeProperty = useCallback((p) => {
    let parsedImages = [];

    try {
      if (Array.isArray(p.images)) {
        parsedImages = p.images;
      } else if (typeof p.images === "string") {
        parsedImages = JSON.parse(p.images);
      }
    } catch (error) {
      console.error("Failed to parse property images:", error);
      parsedImages = [];
    }

    return {
      ...p,
      id: p.id || p._id,
      agent_id: p.agent_id || p.agentId || p.user_id || p.userId,
      purpose: p.purpose || "buy",
      images: Array.isArray(parsedImages) ? parsedImages : [],
      phone: p.phone || "",
      whatsapp: p.whatsapp || "",
      lat: p.lat != null && p.lat !== "" ? Number(p.lat) : null,
      lng: p.lng != null && p.lng !== "" ? Number(p.lng) : null,
    };
  }, []);

  const resetAuthForm = () => {
    setAuthForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      whatsapp: "",
    });
  };

  const resetNewPropertyForm = () => {
    setNewProp(initialPropertyState);
  };

  // ================= FAVORITES =================
  const toggleFav = (id) => {
    if (!currentUser) {
      alert("Please sign in to save properties");
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      localStorage.removeItem("favorites");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ================= LOAD USER SESSION =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setSessionRestored(true);
        setShowWelcomeBanner(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // hide welcome banner after some seconds
  useEffect(() => {
    if (!showWelcomeBanner) return;

    const timer = setTimeout(() => {
      setShowWelcomeBanner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showWelcomeBanner]);

  // ================= FETCH PROPERTIES =================
  const fetchProperties = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/properties`, {
        timeout: 15000,
      });

      const formatted = Array.isArray(res.data)
        ? res.data.map(normalizeProperty)
        : [];

      setProperties(formatted);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  }, [normalizeProperty]);

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
      const res = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: authForm.email,
          password: authForm.password,
        },
        { timeout: 15000 }
      );

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setShowAuthModal(false);
      setSessionRestored(false);
      setShowWelcomeBanner(false);
      resetAuthForm();

      await fetchProperties();

      if ((res.data.role || res.data.user?.role) === "agent") {
        navigate("/agent/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
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
      const res = await axios.post(`${API_URL}/auth/signup`, authForm, {
        timeout: 15000,
      });

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setShowAuthModal(false);
      setSessionRestored(false);
      setShowWelcomeBanner(false);
      resetAuthForm();

      await fetchProperties();

      if ((res.data.role || res.data.user?.role) === "agent") {
        navigate("/agent/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      throw new Error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LIST PROPERTY =================
  const listProp = async (propData, imageFiles) => {
    const token = localStorage.getItem("token");

    if (!token || getCurrentUserRole() !== "agent") {
      alert("Only logged-in agents can list properties");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file) => fd.append("images", file));
      }

      Object.keys(propData).forEach((key) => {
        if (key === "images" || key === "_id" || key === "id") return;

        const value = propData[key];

        if (["lat", "lng"].includes(key)) {
          if (value !== "" && value !== null && value !== undefined) {
            const parsed = Number(value);
            if (!Number.isNaN(parsed)) {
              fd.append(key, parsed);
            }
          }
          return;
        }

        fd.append(key, value ?? "");
      });

      await axios.post(`${API_URL}/properties`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 20000,
      });

      setShowListModal(false);
      resetNewPropertyForm();
      await fetchProperties();
    } catch (err) {
      console.error("Failed to list property:", err);
      alert(err.response?.data?.error || "Failed to list property");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setCurrentUser(null);
    setShowWelcomeBanner(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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

  const isAgent = getCurrentUserRole() === "agent";
  const isHomePage = location.pathname === "/";

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

      {showWelcomeBanner && currentUser && isHomePage && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Welcome back{currentUser?.name ? `, ${currentUser.name}` : ""}.
              </p>
              <p className="text-sm text-blue-700">
                {isAgent
                  ? "Your session was restored. You can continue browsing or go back to your dashboard."
                  : "Your session was restored. Continue browsing available properties."}
              </p>
            </div>

            <div className="flex gap-2">
              {isAgent && (
                <button
                  onClick={() => navigate("/agent/dashboard")}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Go to Dashboard
                </button>
              )}
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="px-3 py-2 border border-blue-300 text-blue-700 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

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
            isAgent ? (
              <Dashboard
                setShowListModal={setShowListModal}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to="/" replace />
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

      {showListModal && isAgent && (
        <ListModal
          newProp={newProp}
          setNewProp={setNewProp}
          listPropBackend={listProp}
          loading={loading}
          setShowListModal={setShowListModal}
          currentUser={currentUser}
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