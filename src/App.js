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

  // ================= STATE =================
  const [activeTab, setActiveTab] = useState("rent");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  const [appError, setAppError] = useState("");
  const [appSuccess, setAppSuccess] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [isFetchingProperties, setIsFetchingProperties] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // ================= HELPERS =================
  const fmt = (v) => `M ${Number(v || 0).toLocaleString()}`;

  const showAuthNotice = (msg) => {
    setAppError("");
    setAppSuccess("");
    setAuthNotice(msg);
  };

  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const saveSession = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  };

  // ================= FAVORITES =================
  const toggleFav = (id) => {
    if (!currentUser) {
      showAuthNotice("Please sign in to save properties.");
      return;
    }

    setAuthNotice("");

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
    if (user) {
      setCurrentUser(JSON.parse(user));
      setShowWelcomeBanner(true);
    }
  }, []);

  // auto dismiss notice
  useEffect(() => {
    if (!authNotice) return;

    const timer = setTimeout(() => {
      setAuthNotice("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [authNotice]);

  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      setIsFetchingProperties(true);
      const res = await axios.get(`${API_URL}/properties`);
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
      setAppError("Failed to load properties.");
    } finally {
      setIsFetchingProperties(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= AUTH =================
  const handleLogin = async (data) => {
    try {
      setIsAuthLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, data);
      setCurrentUser(res.data);
      saveSession(res.data);
      setShowAuthModal(false);
      setAuthNotice("");
    } catch {
      setAppError("Login failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearSession();
    navigate("/");
  };

  // ================= FILTER =================
  const filteredProperties = useMemo(() => {
    return properties.filter(
      (p) =>
        (p.purpose || "buy") === activeTab &&
        (!searchQuery ||
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [properties, activeTab, searchQuery]);

  // ================= UI =================
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

      {/* 🔵 AUTH NOTICE (FIXED + THEME MATCHED) */}
      {authNotice && (
        <div className="fixed right-4 top-24 z-[60] w-[calc(100%-2rem)] max-w-md">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Sign in required
                </p>
                <p className="text-sm text-blue-700">{authNotice}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign In
                </button>

                <button
                  onClick={() => setAuthNotice("")}
                  className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROUTES */}
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
                navigate(`/property/${p.id}`, { state: { selectedProperty: p } })
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
          path="/saved-properties"
          element={
            currentUser ? (
              <SavedProperties
                properties={properties}
                favorites={favorites}
                toggleFav={toggleFav}
                currentUser={currentUser}
                fmt={fmt}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/agent/dashboard"
          element={
            currentUser?.role === "agent" ? (
              <Dashboard currentUser={currentUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      {showAuthModal && (
        <AuthModal
          login={handleLogin}
          loading={isAuthLoading}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      {showCalculator && <CalculatorModal />}

      <Footer />
    </div>
  );
}