import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListModal from "./ListModal";
import { API_URL } from "../config";

export default function Dashboard({ currentUser, setShowListModal, favorites = [] }) {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeDataView, setActiveDataView] = useState("all");

  const token = localStorage.getItem("token");

  const getCurrentUserId = () =>
    currentUser?.id ||
    currentUser?.user?.id ||
    currentUser?._id ||
    currentUser?.user?._id ||
    null;

  const getCurrentUserName = () =>
    currentUser?.name ||
    currentUser?.user?.name ||
    currentUser?.full_name ||
    currentUser?.user?.full_name ||
    "Agent";

  // 🔥 Skeleton Loader
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-gray-200"></div>

      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>

        <div className="flex gap-4 mt-2">
          <div className="h-3 bg-gray-200 rounded w-10"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="24">
          No Image
        </text>
      </svg>
    `);

  const normalizeImages = (images) => {
    try {
      let parsed = images;
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getImageUrl = (images) => {
    const normalized = normalizeImages(images);
    if (!normalized.length) return fallbackImage;

    const first = normalized[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;

    return fallbackImage;
  };

  const getPropertyId = useCallback((prop) => prop?._id || prop?.id, []);

  const fetchProperties = useCallback(async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    setLoadingProps(true);

    try {
      const res = await axios.get(`${API_URL}/properties`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setAllProperties(data);

      const mine = data.filter(
        (p) =>
          String(p.agent_id ?? p.agentId ?? p.user_id ?? p.userId ?? "") ===
          String(userId)
      );

      setMyProperties(mine);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoadingProps(false);
    }
  }, [currentUser, token]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const savedProperties = useMemo(() => {
    return allProperties.filter((p) =>
      favorites.includes(getPropertyId(p))
    );
  }, [allProperties, favorites]);

  const stats = useMemo(() => {
    return {
      total: myProperties.length,
      buyCount: myProperties.filter((p) => p.purpose === "buy").length,
      rentCount: myProperties.filter((p) => p.purpose === "rent").length,
      savedCount: savedProperties.length,
    };
  }, [myProperties, savedProperties]);

  const displayedProperties = useMemo(() => {
    if (activeDataView === "saved") return savedProperties;
    if (activeDataView === "buy") return myProperties.filter((p) => p.purpose === "buy");
    if (activeDataView === "rent") return myProperties.filter((p) => p.purpose === "rent");
    return myProperties;
  }, [activeDataView, myProperties, savedProperties]);

  const openProperty = (prop) => {
    navigate(`/property/${getPropertyId(prop)}`, {
      state: { selectedProperty: prop },
    });
  };

  const fmtPrice = (v) => `M ${Number(v || 0).toLocaleString()}`;

  const StatCard = ({ title, value, stateKey }) => (
    <button
      onClick={() => setActiveDataView(stateKey)}
      className={`w-full p-5 rounded-xl border ${
        activeDataView === stateKey ? "bg-blue-50 border-blue-600" : "bg-white"
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {getCurrentUserName()}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Listings" value={stats.total} stateKey="all" />
        <StatCard title="For Sale" value={stats.buyCount} stateKey="buy" />
        <StatCard title="For Rent" value={stats.rentCount} stateKey="rent" />
        <StatCard title="Saved" value={stats.savedCount} stateKey="saved" />
      </div>

      {/* Content */}
      {loadingProps ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedProperties.map((p) => (
            <div
              key={getPropertyId(p)}
              className="bg-white rounded-xl shadow cursor-pointer overflow-hidden"
              onClick={() => openProperty(p)}
            >
              <img
                src={getImageUrl(p.images)}
                className="w-full h-52 object-cover"
                alt=""
              />

              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-blue-600 font-bold">
                  {p.purpose === "rent"
                    ? `${fmtPrice(p.rent_price)} / month`
                    : fmtPrice(p.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && editProp && (
        <ListModal
          newProp={editProp}
          setNewProp={setEditProp}
          listPropBackend={() => {}}
          setShowListModal={setShowEditModal}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}