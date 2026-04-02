import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ListModal from "./ListModal";
import { API_URL } from "../config";

export default function Dashboard({ currentUser, setShowListModal }) {
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="24" font-family="Arial, sans-serif">
          No Image
        </text>
      </svg>
    `);

  const normalizeImages = (images) => {
    try {
      let parsed = images;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!Array.isArray(parsed)) return [];

      return parsed;
    } catch (error) {
      console.error("Failed to normalize images:", error);
      return [];
    }
  };

  const getImageUrl = (images) => {
    const normalized = normalizeImages(images);

    if (!normalized.length) return fallbackImage;

    const firstImage = normalized[0];

    if (typeof firstImage === "string" && firstImage.trim()) {
      return firstImage;
    }

    if (firstImage && typeof firstImage === "object" && firstImage.url) {
      return firstImage.url;
    }

    return fallbackImage;
  };

  const fetchProperties = async () => {
    const userId = getCurrentUserId();

    if (!userId) {
      setMyProperties([]);
      return;
    }

    setLoadingProps(true);

    try {
      const res = await axios.get(`${API_URL}/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allProperties = Array.isArray(res.data) ? res.data : [];

      const filtered = allProperties.filter(
        (p) => String(p.agent_id ?? p.agentId ?? "") === String(userId)
      );

      setMyProperties(filtered);
    } catch (err) {
      console.error("Fetch properties failed:", err);
      alert("Failed to load properties");
    } finally {
      setLoadingProps(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentUser]);

  const handleDelete = async (prop) => {
    const propId = prop._id || prop.id;

    if (!propId) {
      alert("Invalid property ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) return;

    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      await axios.delete(`${API_URL}/properties/${propId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyProperties((prev) =>
        prev.filter((p) => String(p._id || p.id) !== String(propId))
      );

      alert("Property deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || "Failed to delete property");
    }
  };

  const handleEdit = (prop) => {
    setEditProp(prop);
    setShowEditModal(true);
  };

  const updateProp = async (propData, imageFiles = []) => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      const formData = new FormData();

      const cleanValue = (value) => {
        if (Array.isArray(value)) return value[0] ?? "";
        return value ?? "";
      };

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append("images", file));
      }

      Object.keys(propData).forEach((key) => {
        if (key === "images") return;
        if (key === "_id") return;

        formData.append(key, cleanValue(propData[key]));
      });

      if (!propData.agent_id && !propData.agentId) {
        formData.append("agent_id", getCurrentUserId() || "");
      }

      await axios.put(
        `${API_URL}/properties/${propData.id || propData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Property updated successfully");
      setShowEditModal(false);
      setEditProp(null);
      fetchProperties();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.error || "Failed to update property");
    }
  };

  const fmtPrice = (val) => `M ${Number(val || 0).toLocaleString()}`;

  const stats = useMemo(() => {
    const total = myProperties.length;
    const buyCount = myProperties.filter((p) => p.purpose === "buy").length;
    const rentCount = myProperties.filter((p) => p.purpose === "rent").length;
    const withImages = myProperties.filter((p) => normalizeImages(p.images).length > 0).length;

    return { total, buyCount, rentCount, withImages };
  }, [myProperties]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Agent Dashboard</p>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{getCurrentUserName()}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your property listings, update details, and keep your portfolio current.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowListModal(true)}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + List New Property
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Listings</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">For Sale</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.buyCount}</h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">For Rent</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.rentCount}</h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Listings With Images</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.withImages}</h2>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
        <p className="text-sm text-gray-500 mt-1">
          View, edit, and manage the properties you have listed.
        </p>
      </div>

      {loadingProps ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
          Loading your properties...
        </div>
      ) : myProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No properties listed yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start by adding your first property listing to make it visible to buyers or renters.
          </p>
          <button
            onClick={() => setShowListModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            List Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myProperties.map((prop) => {
            const id = prop._id || prop.id;
            const imageUrl = getImageUrl(prop.images);

            return (
              <div
                key={id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <img
                  src={imageUrl}
                  alt={prop.title || "Property"}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {prop.title || "Untitled Property"}
                    </h3>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        prop.purpose === "buy"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {prop.purpose === "buy" ? "For Sale" : "For Rent"}
                    </span>
                  </div>

                  <p className="text-blue-600 font-bold text-lg mb-1">
                    {prop.purpose === "buy"
                      ? fmtPrice(prop.price)
                      : `M ${Number(prop.rent_price || 0).toLocaleString()}/month`}
                  </p>

                  <p className="text-sm text-gray-600">
                    {prop.type || "N/A"} • {prop.location || "Unknown location"},{" "}
                    {prop.district || "N/A"}
                  </p>

                  <div className="flex gap-4 text-xs text-gray-500 mt-3">
                    <span>🛏 {prop.bedrooms ?? "-"}</span>
                    <span>🛁 {prop.bathrooms ?? "-"}</span>
                    <span>📐 {prop.size ?? "-"} m²</span>
                  </div>

                  {(prop.phone || prop.whatsapp) && (
                    <p className="text-gray-700 text-sm mt-3">
                      Contact: {prop.phone || ""}
                      {prop.whatsapp ? ` (WhatsApp: ${prop.whatsapp})` : ""}
                    </p>
                  )}

                  <p className="text-gray-400 text-xs mt-3">
                    Posted:{" "}
                    {prop.createdAt || prop.date_posted
                      ? new Date(
                          prop.createdAt || prop.date_posted
                        ).toLocaleDateString()
                      : "—"}
                  </p>

                  <div className="mt-auto pt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(prop)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(prop)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showEditModal && editProp && (
        <ListModal
          newProp={editProp}
          setNewProp={setEditProp}
          listPropBackend={updateProp}
          setShowListModal={setShowEditModal}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}