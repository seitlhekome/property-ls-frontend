// src/components/PropertyList.jsx
import React from "react";

export default function PropertyList({
  properties,
  favorites,
  toggleFav,
  fmt,
  setSelectedProperty,
  currentUser,
  loading,
  activeTab,
}) {
  // Filter properties by activeTab (buy/rent)
  const filtered = properties.filter((p) => p.purpose === activeTab);

  if (loading) return <p className="p-6">Loading properties...</p>;
  if (filtered.length === 0)
    return <p className="p-6 text-center text-gray-600">No properties found for {activeTab}.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((prop) => (
        <div
          key={prop.id}
          className="border rounded shadow p-4 bg-white flex flex-col"
        >
          {/* Property Image */}
          {prop.images && prop.images.length > 0 && (
            <img
              src={prop.images[0]}
              alt={prop.title}
              className="w-full h-48 object-cover mb-2 rounded cursor-pointer"
              onClick={() => setSelectedProperty(prop)}
            />
          )}

          {/* Property Info */}
          <h2 className="text-lg font-semibold">{prop.title}</h2>
          <p className="text-gray-600">{prop.type} | {prop.district}</p>

          {/* Price */}
          <p className="font-bold text-blue-600">
            {prop.purpose === "buy"
              ? `Sale: ${fmt(prop.price)}`
              : `Rent: ${fmt(prop.rent_price)} / month`}
          </p>

          {/* Optional Contact */}
          {(prop.phone || prop.whatsapp) && (
            <p className="text-gray-500 text-sm mt-1">
              Contact: {prop.phone ? prop.phone : ""}{prop.phone && prop.whatsapp ? " / " : ""}{prop.whatsapp ? prop.whatsapp : ""}
            </p>
          )}

          <p className="text-gray-500 text-sm mt-1">
            Posted: {new Date(prop.date_posted).toLocaleString()}
          </p>

          {/* Favorites */}
          {currentUser && (
            <button
              onClick={() => toggleFav(prop.id)}
              className={`mt-2 px-2 py-1 rounded text-sm ${
                favorites.includes(prop.id)
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {favorites.includes(prop.id) ? "♥ Favorited" : "♡ Favorite"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
