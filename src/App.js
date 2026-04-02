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
import SavedProperties from "./components/SavedProperties";

import { API_URL } from "./config";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ CHANGED HERE (buy → rent)
  const [activeTab, setActiveTab] = useState("rent");

  const [searchQuery, setSearchQuery] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  const [appError, setAppError] = useState("");
  const [appSuccess, setAppSuccess] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [isFetchingProperties, setIsFetchingProperties] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isListingProperty, setIsListingProperty] = useState(false);

  const [authIsSignup, setAuthIsSignup] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    whatsapp: "",
  });

  const [newProp, setNewProp] = useState({
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
  });

  const fmt = (v) => `M ${Number(v || 0).toLocaleString()}`;

  const clearFeedback = () => {
    setAppError("");
    setAppSuccess("");
  };

  const showError = (msg) => {
    setAppSuccess("");
    setAppError(msg);
  };

  const showSuccess = (msg) => {
    setAppError("");
    setAppSuccess(msg);
  };

  // ================= FAVORITES =================
  const toggleFav = (id) => {
    if (!currentUser) {
      showError("Please sign in to save properties.");
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ================= SESSION =================
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      setCurrentUser(JSON.parse(user));
      setShowWelcomeBanner(true);
    }
  }, []);

  // ================= FETCH =================
  const fetchProperties = async () => {
    setIsFetchingProperties(true);

    try {
      const res = await axios.get(`${API_URL}/properties`);
      setProperties(res.data || []);
    } catch (err) {
      showError("Failed to load properties");
    } finally {
      setIsFetchingProperties(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= FILTER =================
  const filteredProperties = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return properties.filter((p) => {
      const matchesTab = (p.purpose || "buy") === activeTab;

      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [properties, activeTab, searchQuery]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.clear();
    navigate("/");
  };

  const isAgent = currentUser?.role === "agent";

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
        favoritesCount={favorites.length}
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
              loading={isFetchingProperties}
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
                favorites={favorites}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}