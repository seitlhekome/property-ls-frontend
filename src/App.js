import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import PropertyList from "./components/PropertyList";
import AuthModal from "./components/AuthModal";
import ListModal from "./components/ListModal";
import CalculatorModal from "./components/CalculatorModal";
import Dashboard from "./components/Dashboard";
import PropertyDetail from "./components/PropertyDetail";

const API = "http://localhost:3001";

function App() {
  const navigate = useNavigate();

  // ---------------- UI STATES ----------------
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  // ---------------- DATA STATES ----------------
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- AUTH MODAL ----------------
  const [authIsSignup, setAuthIsSignup] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
    whatsapp: "",
  });

  // ---------------- NEW PROPERTY ----------------
  const [newProp, setNewProp] = useState({
    title: "",
    price: "",
    type: "House",
    district: "Maseru",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    images: [],
  });

  // ---------------- LOAD CURRENT USER ----------------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ---------------- LOAD PROPERTIES ----------------
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/properties`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.date_posted) - new Date(a.date_posted)
      );
      setProperties(sorted);
    } catch (err) {
      console.error("Fetch properties failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ---------------- AUTH ----------------
  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) return alert("Enter email and password");
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

  // ---------------- LIST PROPERTY ----------------
  const listProp = async (propData, imageFiles) => {
    const token = localStorage.getItem("token");
    if (!token || currentUser?.role !== "agent") return;

    if (!propData.title || !propData.price || imageFiles.length === 0)
      return alert("Title, price, and images are required");

    setLoading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));
      Object.keys(propData).forEach((key) => {
        if (key !== "images") formData.append(key, propData[key]);
      });

      const res = await axios.post(`${API}/api/properties`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.id) {
        alert("✅ Property listed successfully");
        setShowListModal(false);
        setNewProp({
          title: "",
          price: "",
          type: "House",
          district: "Maseru",
          location: "",
          bedrooms: "",
          bathrooms: "",
          size: "",
          description: "",
          images: [],
        });
        fetchProperties();
      } else {
        alert("Listing failed!");
      }
    } catch (err) {
      console.error("List property error:", err);
      alert(err.response?.data?.error || "Failed to list property");
    }
    setLoading(false);
  };

  // ---------------- FORMAT PRICE ----------------
  const fmt = (val) => `M ${Number(val || 0).toLocaleString()}`;

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // ---------------- RENDER ----------------
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
        userRoleLoading={false}
      />

      <Routes>
        <Route
          path="/"
          element={
            <PropertyList
              properties={properties.filter((p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              favorites={favorites}
              toggleFav={(id) =>
                setFavorites((prev) =>
                  prev.includes(id)
                    ? prev.filter((f) => f !== id)
                    : [...prev, id]
                )
              }
              fmt={fmt}
              setSelectedProperty={setSelectedProperty}
              loading={loading}
            />
          }
        />

        <Route
          path="/property/:id"
          element={
            selectedProperty ? (
              <PropertyDetail
                property={selectedProperty}
                setSelectedProperty={setSelectedProperty}
                toggleFav={() =>
                  setFavorites((prev) =>
                    prev.includes(selectedProperty.id)
                      ? prev.filter((f) => f !== selectedProperty.id)
                      : [...prev, selectedProperty.id]
                  )
                }
                favorites={favorites}
                currentUser={currentUser}
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
              <Dashboard
                setShowListModal={setShowListModal}
                currentUser={currentUser}
                fetchProperties={fetchProperties}
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
          calcVals={{ price: "", deposit: "200000", rate: "11.5", term: "20" }}
          setCalcVals={() => {}}
          calcMort={setShowCalculator}
          fmt={fmt}
        />
      )}
    </div>
  );
}

export default App;
