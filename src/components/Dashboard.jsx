// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ListModal from "./ListModal";

const API = "http://localhost:3001";

export default function Dashboard({ currentUser, setShowListModal }) {
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // For editing
  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch agent's own properties
  const fetchMyProperties = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const agentProps = res.data.filter((p) => p.agent_id === currentUser.id);
      // Sort newest first
      agentProps.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
      setMyProperties(agentProps);
    } catch (err) {
      console.error("Failed to fetch agent properties:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  // Delete property
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
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || "Failed to delete property");
    }
  };

  // Open Edit Modal
  const handleEdit = (prop) => {
    setEditProp(prop);
    setShowEditModal(true);
  };

  // Update property
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
      fetchMyProperties();
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
              <p className="font-bold">{fmtPrice(prop.price)}</p>
              <p className="text-gray-500 text-sm mt-1">
                Posted: {new Date(prop.date_posted).toLocaleString()}
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

      {/* Edit Modal */}
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
