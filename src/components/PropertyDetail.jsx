// src/components/PropertyDetail.jsx
import React, { useState } from "react";

export default function PropertyDetail({
  property,
  setSelectedProperty,
  toggleFav,
  favorites,
  currentUser,
}) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  if (!property) return null;

  const isFav = favorites.includes(property.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative p-6">
        <button
          onClick={() => setSelectedProperty(null)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">{property.title || "Untitled Property"}</h2>

        {property.images?.length ? (
          <div>
            <img
              src={property.images[mainImageIndex]}
              alt={`Property ${mainImageIndex + 1}`}
              className="w-full h-72 object-cover rounded mb-2"
            />
            <div className="flex gap-2 overflow-x-auto">
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
                    idx === mainImageIndex ? "border-blue-600" : "border-transparent"
                  }`}
                  onClick={() => setMainImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No images available</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <p><strong>Price:</strong> {property.purpose === "buy" ? (property.price ? `M ${property.price}` : "N/A") : (property.rent_price ? `M ${property.rent_price}` : "N/A")}</p>
          <p><strong>Type:</strong> {property.type || "N/A"}</p>
          <p><strong>District:</strong> {property.district || "N/A"}</p>
          <p><strong>Location:</strong> {property.location || "N/A"}</p>
          <p><strong>Size:</strong> {property.size ? `${property.size} m²` : "N/A"}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms || "N/A"}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms || "N/A"}</p>
          {(property.phone || property.whatsapp) && (
            <p><strong>Contact:</strong> {property.phone || ""} {property.whatsapp ? `WhatsApp: ${property.whatsapp}` : ""}</p>
          )}
        </div>

        <p className="mb-4"><strong>Description:</strong> {property.description || "No description provided."}</p>

        {property.agent_name && (
          <div className="mb-4 border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Agent Info</h3>
            <p><strong>Name:</strong> {property.agent_name}</p>
            {property.phone && <p><strong>Phone:</strong> {property.phone}</p>}
            {property.whatsapp && <p><strong>WhatsApp:</strong> {property.whatsapp}</p>}
          </div>
        )}

        <button
          onClick={() => {
            if (!currentUser) return alert("Please log in to favorite properties");
            toggleFav(property.id);
          }}
          className={`mt-2 px-4 py-2 rounded font-medium transition ${
            isFav ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {isFav ? "❤️ Favorited" : "🤍 Favorite"}
        </button>
      </div>
    </div>
  );
}
