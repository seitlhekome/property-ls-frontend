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
  const [isListingProperty, setIsListingProperty] = useState(false);

  const [authIsSignup, setAuthIsSignup] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    whatsapp: "",
  });

  const initialPropertyState = useMemo(
    () => ({
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
    }),
    []
  );

  const [newProp, setNewProp] = useState(initialPropertyState);

  const fmt = (v) => `M ${Number(v || 0).toLocaleString()}`;

  const clearFeedback = useCallback(() => {
    setAppError("");
    setAppSuccess("");
  }, []);

  const showError = useCallback((message) => {
    setAppSuccess("");
    setAppError(message || "Something went wrong");
  }, []);

  const showSuccess = useCallback((message) => {
    setAppError("");
    setAppSuccess(message || "");
  }, []);

  const showAuthNotice = useCallback((message = "Please sign in to save properties.") => {
    setAppError("");
    setAppSuccess("");
    setAuthNotice(message);
  }, []);

  const getErrorMessage = useCallback((err, fallback = "Something went wrong") => {
    if (err?.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }

    if (err?.response?.data?.error) {
      return err.response.data.error;
    }

    if (err?.response?.data?.message) {
      return err.response.data.message;
    }

    if (err?.message) {
      return err.message;
    }

    return fallback;
  }, []);

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
    return (
      currentUser?.role ||
      currentUser?.user?.role ||
      currentUser?.accountType ||
      currentUser?.user?.accountType ||
      null
    );
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
      description: p.description || "",
      date_posted: p.date_posted || p.createdAt || p.created_at || null,
      lat: p.lat != null && p.lat !== "" ? Number(p.lat) : null,
      lng: p.lng != null && p.lng !== "" ? Number(p.lng) : null,
    };
  }, []);

  const resetAuthForm = useCallback(() => {
    setAuthForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      whatsapp: "",
    });
  }, []);

  const resetNewPropertyForm = useCallback(() => {
    setNewProp(initialPropertyState);
  }, [initialPropertyState]);

  const saveSession = useCallback((userData) => {
    if (!userData?.token) {
      throw new Error("Missing authentication token");
    }

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const toggleFav = useCallback(
    (id) => {
      if (!currentUser) {
        showAuthNotice("Please sign in to save properties.");
        return;
      }

      setAuthNotice("");
      clearFeedback();

      setFavorites((prev) =>
        prev.some((favId) => String(favId) === String(id))
          ? prev.filter((favId) => String(favId) !== String(id))
          : [...prev, id]
      );
    },
    [currentUser, clearFeedback, showAuthNotice]
  );

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (!storedUser || !storedToken) return;

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser) {
        clearSession();
        return;
      }

      setCurrentUser(parsedUser);
      setAuthNotice("");
      setShowWelcomeBanner(true);
    } catch (error) {
      console.error("Failed to restore stored session:", error);
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    try {
      const userId =
        currentUser?.id ||
        currentUser?.user?.id ||
        currentUser?._id ||
        currentUser?.user?._id;

      if (!userId) {
        setFavorites([]);
        return;
      }

      const storageKey = `favorites_${userId}`;
      const storedFavorites = localStorage.getItem(storageKey);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    try {
      const userId =
        currentUser?.id ||
        currentUser?.user?.id ||
        currentUser?._id ||
        currentUser?.user?._id;

      if (!userId) return;

      const storageKey = `favorites_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    if (!showWelcomeBanner) return;

    const timer = setTimeout(() => {
      setShowWelcomeBanner(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showWelcomeBanner]);

  useEffect(() => {
    if (!appError && !appSuccess) return;

    const timer = setTimeout(() => {
      setAppError("");
      setAppSuccess("");
    }, 4500);

    return () => clearTimeout(timer);
  }, [appError, appSuccess]);

  useEffect(() => {
    if (!authNotice) return;

    const timer = setTimeout(() => {
      setAuthNotice("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [authNotice]);

  const fetchProperties = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        clearFeedback();
      }

      setIsFetchingProperties(true);

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
        showError(getErrorMessage(err, "Failed to load properties."));
      } finally {
        setIsFetchingProperties(false);
      }
    },
    [normalizeProperty, clearFeedback, showError, getErrorMessage]
  );

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) {
      throw new Error("Enter email and password");
    }

    clearFeedback();
    setIsAuthLoading(true);

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
      saveSession(res.data);

      setAuthNotice("");
      setShowAuthModal(false);
      setShowWelcomeBanner(false);
      resetAuthForm();
      showSuccess("Logged in successfully.");

      await fetchProperties({ silent: true });

      const role = (
        res.data.role ||
        res.data.user?.role ||
        res.data.accountType ||
        res.data.user?.accountType ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim();

      if (role === "agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error(getErrorMessage(err, "Login failed"));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!authForm.name || !authForm.email || !authForm.password) {
      throw new Error("Fill all required fields");
    }

    clearFeedback();
    setIsAuthLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/signup`, authForm, {
        timeout: 15000,
      });

      setCurrentUser(res.data);
      saveSession(res.data);

      setAuthNotice("");
      setShowAuthModal(false);
      setShowWelcomeBanner(false);
      resetAuthForm();
      showSuccess("Account created successfully.");

      await fetchProperties({ silent: true });

      const role = (
        res.data.role ||
        res.data.user?.role ||
        res.data.accountType ||
        res.data.user?.accountType ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim();

      if (role === "agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      throw new Error(getErrorMessage(err, "Signup failed"));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const listProp = async (propData, imageFiles) => {
    const token = localStorage.getItem("token");

    if (!token || getCurrentUserRole()?.toLowerCase() !== "agent") {
      showError("Only logged-in agents can list properties.");
      return;
    }

    clearFeedback();
    setIsListingProperty(true);

    try {
      const fd = new FormData();

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file) => fd.append("images", file));
      }

      Object.keys(propData).forEach((key) => {
        if (key === "images" || key === "_id" || key === "id") return;

        const value = propData[key];

        if (key === "retainedImages") {
          fd.append("retainedImages", JSON.stringify(Array.isArray(value) ? value : []));
          return;
        }

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

      const targetUrl =
        propData.id || propData._id
          ? `${API_URL}/properties/${propData.id || propData._id}`
          : `${API_URL}/properties`;

      const requestMethod = propData.id || propData._id ? axios.put : axios.post;

      await requestMethod(targetUrl, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 20000,
      });

      setShowListModal(false);
      resetNewPropertyForm();
      showSuccess(
        propData.id || propData._id
          ? "Property updated successfully."
          : "Property listed successfully."
      );
      await fetchProperties({ silent: true });
    } catch (err) {
      console.error("Failed to save property:", err);
      showError(
        getErrorMessage(
          err,
          propData.id || propData._id
            ? "Failed to update property."
            : "Failed to list property."
        )
      );
    } finally {
      setIsListingProperty(false);
    }
  };

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setFavorites([]);
    setShowWelcomeBanner(false);
    clearSession();
    showSuccess("Logged out successfully.");
    navigate("/");
  }, [clearSession, navigate, showSuccess]);

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

  const currentUserId = getCurrentUserId();
  const isAgent =
    (getCurrentUserRole() || "").toString().toLowerCase().trim() === "agent";
  const isHomePage = location.pathname === "/";

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

      {authNotice && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
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

      {(appError || appSuccess) && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          {appError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Something needs attention
                  </p>
                  <p className="text-sm text-red-700">{appError}</p>
                </div>
                <button
                  onClick={() => setAppError("")}
                  className="text-sm font-medium text-red-700 hover:text-red-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {appSuccess && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-green-800">Success</p>
                  <p className="text-sm text-green-700">{appSuccess}</p>
                </div>
                <button
                  onClick={() => setAppSuccess("")}
                  className="text-sm font-medium text-green-700 hover:text-green-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showWelcomeBanner && currentUser && isHomePage && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Welcome back
                {currentUser?.name
                  ? `, ${currentUser.name}`
                  : currentUser?.user?.name
                  ? `, ${currentUser.user.name}`
                  : ""}
                .
              </p>
              <p className="text-sm text-blue-700">
                {isAgent
                  ? "Your session was restored. You can continue managing your listings."
                  : "Your session was restored. Continue browsing available properties."}
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="rounded border border-blue-300 px-3 py-2 text-blue-700 hover:bg-blue-100"
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
              loading={isFetchingProperties}
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
              currentUserId={currentUserId}
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
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard
                setShowListModal={setShowListModal}
                currentUser={currentUser}
                favorites={favorites}
              />
            ) : (
              <Navigate to="/" replace />
            )
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
          loading={isAuthLoading}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      {showListModal && isAgent && (
        <ListModal
          newProp={newProp}
          setNewProp={setNewProp}
          listPropBackend={listProp}
          loading={isListingProperty}
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