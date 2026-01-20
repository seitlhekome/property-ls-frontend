// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ListModal from "./ListModal";

const API = "http://localhost:3001";

export default function Dashboard({ currentUser, setShowListModal, fetchProperties, properties }) {
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // For editing
  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setMyProperties(properties);
  }, [properties]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${API}/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProperties((prev) => prev.filter((p) => p.id !== id));
      alert("Property deleted successfully");
      fetchProperties();
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || "Failed to delete property");
    }
  };

  const handleEdit = (prop) => {
    setEditProp(prop);
    setShowEditModal(true);
  };

  const updateProp = async (propData, imageFiles) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("images", file));
      Object.keys(propData).forEach((key) => {
        if (key !== "images") formData.append(key, propData[key]);
      });

      await axios.put(`${API}/api/properties/${propData.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Property updated successfully");
      setShowEditModal(false);
      setEditProp(null);
      fetchProperties();
    } catch (err) {
      console.error("Update property failed:", err);
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

      {loading ? (
        <p>Loading properties...</p>
      ) : myProperties.length === 0 ? (
        <p>No properties listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.map((prop) => (
            <div
              key={prop.id}
              className="border rounded shadow p-4 bg-white flex flex-col"
            >
              {prop.images && prop.images.length > 0 && (
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}

              <h2 className="text-lg font-semibold">{prop.title}</h2>
              <p className="text-gray-600">{prop.type} | {prop.district}</p>
              <p className="font-bold">
                {prop.purpose === "buy" ? fmtPrice(prop.price) : `M ${prop.rent_price.toLocaleString()}/month`}
              </p>
              {(prop.phone || prop.whatsapp) && (
                <p className="text-gray-700 text-sm">
                  Contact: {prop.phone || ""} {prop.whatsapp ? `(WhatsApp: ${prop.whatsapp})` : ""}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Posted: {new Date(prop.date_posted).toLocaleDateString()}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(prop)}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prop.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && editProp && (
        <ListModal
          newProp={editProp}
          setNewProp={setEditProp}
          listPropBackend={updateProp}
          loading={loading}
          setShowListModal={setShowEditModal}
        />
      )}
    </div>
  );
}
