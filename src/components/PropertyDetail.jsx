import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3001";

export default function PropertyDetail({
  favorites = [],
  toggleFav,
  currentUser,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // ---------------- FETCH PROPERTY ----------------
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API}/api/properties`);
        const found = res.data.find((p) => String(p.id) === String(id));
        setProperty(found || null);
        if (found) setEditData({ ...found });
      } catch (err) {
        console.error("Failed to load property:", err);
        setProperty(null);
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  // ---------------- HANDLE EDIT ----------------
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // ensure you store token on login
      const formData = new FormData();
      for (let key in editData) {
        formData.append(key, editData[key]);
      }
      const res = await axios.put(`${API}/api/properties/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperty(res.data);
      setEditing(false);
      alert("Property updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update property");
    }
  };

  // ---------------- HANDLE DELETE ----------------
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Property deleted!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete property");
    }
  };

  // ---------------- STATES ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading property…
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Property not found.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(property.id);
  const images =
    Array.isArray(property.images) && property.images.length > 0
      ? property.images
      : ["https://via.placeholder.com/800x500?text=No+Image"];
  const isOwner = currentUser?.id === property.agent_id;

  // ---------------- RENDER ----------------
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to listings
      </button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {property.title || "Untitled Property"}
      </h1>

      {/* IMAGES */}
      <div className="mb-6">
        <img
          src={images[mainImageIndex]}
          alt="Property"
          className="w-full h-96 object-cover rounded mb-3"
        />

        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumb ${i}`}
              onClick={() => setMainImageIndex(i)}
              className={`h-20 w-24 object-cover rounded cursor-pointer border-2 ${
                i === mainImageIndex ? "border-blue-600" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <p><strong>Type:</strong> {property.type || "N/A"}</p>
        <p><strong>District:</strong> {property.district || "N/A"}</p>
        <p><strong>Location:</strong> {property.location || "N/A"}</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms || "N/A"}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms || "N/A"}</p>
        <p><strong>Size:</strong> {property.size ? `${property.size} m²` : "N/A"}</p>
        <p className="text-blue-600 font-bold text-lg">
          {property.price > 0 && `M ${property.price.toLocaleString()}`}
          {property.rent_price > 0 &&
            ` · M ${property.rent_price.toLocaleString()} / month`}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Description</h3>
        <p className="text-gray-700">
          {property.description || "No description provided."}
        </p>
      </div>

      {/* AGENT */}
      {property.agent_name && (
        <div className="border-t pt-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Agent Information</h3>
          <p><strong>Name:</strong> {property.agent_name}</p>
          {property.agent_phone && <p><strong>Phone:</strong> {property.agent_phone}</p>}
          {property.whatsapp && <p><strong>WhatsApp:</strong> {property.whatsapp}</p>}
        </div>
      )}

      {/* FAVORITE */}
      <button
        onClick={() => {
          if (!currentUser) return alert("Please log in to favorite properties");
          toggleFav(property.id);
        }}
        className={`px-4 py-2 rounded font-medium mb-4 ${
          isFav ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {isFav ? "❤️ Favorited" : "🤍 Favorite"}
      </button>

      {/* EDIT / DELETE FOR OWNER */}
      {isOwner && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            {editing ? "Cancel Edit" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}

      {/* EDIT FORM */}
      {editing && (
        <form
          onSubmit={handleEditSubmit}
          className="mt-6 border-t pt-4 flex flex-col gap-3"
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={editData.title || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={editData.type || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={editData.district || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={editData.location || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editData.price || 0}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="rent_price"
            placeholder="Rent Price"
            value={editData.rent_price || 0}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={editData.bedrooms || 0}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={editData.bathrooms || 0}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="size"
            placeholder="Size (m²)"
            value={editData.size || 0}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={editData.description || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={editData.phone || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="whatsapp"
            placeholder="WhatsApp"
            value={editData.whatsapp || ""}
            onChange={handleEditChange}
            className="p-2 border rounded"
          />
          <select
            name="purpose"
            value={editData.purpose || "buy"}
            onChange={handleEditChange}
            className="p-2 border rounded"
          >
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}
