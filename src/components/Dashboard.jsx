import React, { useState, useEffect } from "react";
import axios from "axios";
import ListModal from "./ListModal";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard({ currentUser, setShowListModal }) {
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

  // Editing state
  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH PROPERTIES =================
  const fetchProperties = async () => {
    if (!currentUser?.id) return;

    setLoadingProps(true);
    try {
      const res = await axios.get(`${API}/api/properties/agent/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProperties(Array.isArray(res.data) ? res.data : []);
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

  // ================= DELETE PROPERTY =================
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
      await axios.delete(`${API}/api/properties/${propId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update UI immediately
      setMyProperties((prev) => prev.filter((p) => (p._id || p.id) !== propId));
      alert("Property deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      if (err.response?.status !== 204) {
        alert(err.response?.data?.error || "Failed to delete property");
      }
    }
  };

  // ================= EDIT PROPERTY =================
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

      imageFiles.forEach((file) => formData.append("images", file));

      Object.keys(propData).forEach((key) => {
        if (key !== "images" && propData[key] !== undefined) {
          formData.append(key, propData[key]);
        }
      });

      // Ensure agent_id is always included
      formData.append("agent_id", currentUser.id);

      await axios.put(
        `${API}/api/properties/${propData._id || propData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
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

  // ================= RENDER =================
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

            return (
              <div
                key={id}
                className="border rounded shadow p-4 bg-white flex flex-col"
              >
                {prop.images?.length > 0 && (
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-48 object-cover mb-2 rounded"
                  />
                )}

                <h2 className="text-lg font-semibold">{prop.title}</h2>

                <p className="text-gray-600">
                  {prop.type} | {prop.district}
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
                    ? new Date(prop.createdAt || prop.date_posted).toLocaleDateString()
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
          currentUser={currentUser} // ✅ Pass currentUser for agent_id
        />
      )}
    </div>
  );
}