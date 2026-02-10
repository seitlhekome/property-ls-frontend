import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

const API = "http://localhost:3001";

export default function App() {
  const navigate = useNavigate();

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
    lat: "",  // Added
    lng: "",  // Added
  });

  // ================= LOAD USER =================
  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("token");
    if (u && t) {
      try {
        setCurrentUser(JSON.parse(u));
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  // ================= FETCH PROPERTIES =================
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/properties`);
      const formatted = res.data.map((p) => ({
        ...p,
        purpose: p.purpose || "buy",
        images: p.images || [],
        phone: p.phone || "",
        whatsapp: p.whatsapp || "",
        lat: p.lat != null ? Number(p.lat) : null,
        lng: p.lng != null ? Number(p.lng) : null,
      }));
      setProperties(formatted);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= AUTH =================
  const handleLogin = async () => {
    if (!authForm.email || !authForm.password)
      return alert("Enter email and password");

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: authForm.email,
        password: authForm.password,
      });

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setShowAuthModal(false);
      fetchProperties();

      if (res.data.role === "agent") navigate("/agent/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!authForm.name || !authForm.email || !authForm.password)
      return alert("Fill all required fields");

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/signup`, authForm);

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      setShowAuthModal(false);
      fetchProperties();

      if (res.data.role === "agent") navigate("/agent/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
    setLoading(false);
  };

  // ================= LIST PROPERTY =================
  const listProp = async (propData, imageFiles) => {
    const token = localStorage.getItem("token");
    if (!token || currentUser?.role !== "agent") return;

    setLoading(true);
    try {
      const fd = new FormData();

      // Append images
      imageFiles.forEach((f) => fd.append("images", f));

      // Append all other fields
      Object.keys(propData).forEach((k) => {
        if (k === "images") return;

        // Handle lat/lng: only append if valid number
        if (k === "lat" || k === "lng") {
          const val = parseFloat(propData[k]);
          if (!isNaN(val)) fd.append(k, val);
        } else {
          fd.append(k, propData[k] || "");
        }
      });

      await axios.post(`${API}/api/properties`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowListModal(false);
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to list property");
    }
    setLoading(false);
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.clear();
    navigate("/");
  };

  // ================= HELPERS =================
  const fmt = (v) => `M ${Number(v || 0).toLocaleString()}`;

  // ================= FILTER =================
  const filteredProperties = properties.filter((p) => {
    const purpose = p.purpose || "buy";
    const matchesTab = purpose === activeTab;
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
              toggleFav={(id) => {
                if (!currentUser) return alert("Login to favorite");
                setFavorites((p) =>
                  p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
                );
              }}
              fmt={fmt}
              setSelectedProperty={(p) => navigate(`/property/${p.id}`, { state: { selectedProperty: p } })}
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
              toggleFav={(id) => {
                if (!currentUser) return alert("Login to favorite");
                setFavorites((p) =>
                  p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
                );
              }}
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
                  (p) => p.agent_id === currentUser.id
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
