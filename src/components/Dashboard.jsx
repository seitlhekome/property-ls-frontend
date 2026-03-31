import React, { useState, useEffect } from "react";
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
      console.log("No current user ID found:", currentUser);
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

      console.log("Current user:", currentUser);
      console.log("Current user ID:", userId);
      console.log("All properties:", allProperties);
      console.log("My dashboard properties:", filtered);

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

      for (const pair of formData.entries()) {
        console.log("UPDATE FORM DATA:", pair[0], pair[1]);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>

      <div className="mb-6">
        <button
          onClick={() => setShowListModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + List New Property
        </button>
      </div>

      {loadingProps ? (
        <p>Loading properties...</p>
      ) : myProperties.length === 0 ? (
        <p>No properties listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.map((prop) => {
            const id = prop._id || prop.id;
            const imageUrl = getImageUrl(prop.images);

            return (
              <div
                key={id}
                className="border rounded shadow p-4 bg-white flex flex-col"
              >
                <img
                  src={imageUrl}
                  alt={prop.title || "Property"}
                  className="w-full h-48 object-cover mb-2 rounded"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                <h2 className="text-lg font-semibold">{prop.title}</h2>

                <p className="text-gray-600">
                  {prop.type || "N/A"} | {prop.district || "N/A"}
                </p>

                <p className="font-bold">
                  {prop.purpose === "buy"
                    ? fmtPrice(prop.price)
                    : `M ${Number(prop.rent_price || 0).toLocaleString()}/month`}
                </p>

                {(prop.phone || prop.whatsapp) && (
                  <p className="text-gray-700 text-sm">
                    Contact: {prop.phone || ""}
                    {prop.whatsapp ? ` (WhatsApp: ${prop.whatsapp})` : ""}
                  </p>
                )}

                <p className="text-gray-500 text-sm mt-1">
                  Posted:{" "}
                  {prop.createdAt || prop.date_posted
                    ? new Date(
                        prop.createdAt || prop.date_posted
                      ).toLocaleDateString()
                    : "—"}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(prop)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(prop)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
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