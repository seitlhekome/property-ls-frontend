import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://property-ls-backend-production.up.railway.app"; // live backend

export default function PropertyDetail({ favorites = [], toggleFav, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch single property by ID if backend supports it
        const res = await axios.get(`${API}/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Failed to load property:", err);

        // Fallback: fetch all and find
        try {
          const all = await axios.get(`${API}/api/properties`);
          const found = all.data.find((p) => String(p.id) === String(id));
          setProperty(found || null);
        } catch (err2) {
          console.error("Fallback fetch failed:", err2);
          setProperty(null);
        }
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

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

  const whatsappNumber = property.whatsapp
    ? property.whatsapp.replace(/\D/g, "")
    : null;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* MAIN CONTENT */}
      <div className="lg:col-span-2">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to listings
        </button>

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
                alt=""
                onClick={() => setMainImageIndex(i)}
                className={`h-20 w-24 object-cover rounded cursor-pointer border-2 ${
                  i === mainImageIndex ? "border-blue-600" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
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

        {/* FAVORITE */}
        <button
          onClick={() => {
            if (!currentUser) return alert("Please log in to favorite properties");
            toggleFav(property.id);
          }}
          className={`px-4 py-2 rounded text-sm font-medium ${
            isFav
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {isFav ? "Saved" : "Save property"}
        </button>
      </div>

      {/* CONTACT CARD */}
      <div className="lg:sticky lg:top-24 h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Contact Agent
        </h3>

        {property.agent_name && (
          <p className="text-sm font-semibold text-gray-900 mb-3">
            {property.agent_name}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              WhatsApp
            </a>
          )}

          {property.phone && (
            <a
              href={`tel:${property.phone}`}
              className="flex items-center justify-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              Call {property.phone}
            </a>
          )}
        </div>

        {!property.phone && !whatsappNumber && (
          <p className="mt-3 text-xs text-gray-400">
            No contact details provided.
          </p>
        )}
      </div>
    </div>
  );
}
