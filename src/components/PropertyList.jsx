import React from "react";
import { useNavigate } from "react-router-dom";

export default function PropertyList({
  properties = [],
  favorites = [],
  toggleFav,
  fmt,
  setSelectedProperty,
  currentUser,
  loading,
}) {
  const navigate = useNavigate();

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-500">
        Loading properties…
      </div>
    );
  }

  // No properties
  if (!loading && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-500">
        No properties available.
      </div>
    );
  }

  // Get coordinates safely
  const getLatLng = (property) => {
    if (property.lat != null && property.lng != null) {
      return [property.lat, property.lng];
    }
    return null;
  };

  // Default map coords if a property has no lat/lng
  const defaultCoords = [-29.3152, 27.4869]; // Center of Lesotho

  return (
    <div className="max-w-7xl mx-auto p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => {
        const image =
          Array.isArray(p.images) && p.images.length > 0
            ? p.images[0]
            : "https://via.placeholder.com/600x400?text=No+Image";

        const isFav = favorites.includes(p.id);

        return (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden"
            onClick={() => setSelectedProperty(p)}
            role="button"
            tabIndex={0}
          >
            {/* Image */}
            <div className="relative">
              <img
                src={image}
                alt={p.title || "Property"}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Property Info */}
            <div className="p-4 flex flex-col flex-1">
              {/* Price */}
              <div className="text-blue-600 font-semibold text-lg">
                {p.purpose === "buy" && p.price > 0 && <span>{fmt(p.price)}</span>}
                {p.purpose === "rent" && p.rent_price > 0 && (
                  <span>
                    {fmt(p.rent_price)}
                    <span className="text-sm font-normal text-gray-500"> / month</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 mt-1">
                {p.title || "Untitled Property"}
              </h3>

              {/* Location */}
              <p className="text-sm text-gray-500">
                {p.location || "Unknown location"}, {p.district || "Lesotho"}
              </p>

              {/* Property details */}
              <div className="flex gap-4 text-xs text-gray-600 mt-1">
                <span>🛏 {p.bedrooms ?? "-"}</span>
                <span>🛁 {p.bathrooms ?? "-"}</span>
                <span>📐 {p.size ?? "-"} m²</span>
              </div>

              {/* Dates and agent */}
              {p.date_posted && (
                <div className="text-xs text-gray-400 mt-1">
                  Posted on {new Date(p.date_posted).toLocaleDateString()}
                </div>
              )}

              {p.agent_name && (
                <div className="text-xs text-gray-400 mt-1">
                  Listed by {p.agent_name}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto flex justify-between items-center gap-2">
                {/* Save / Favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentUser)
                      return alert("Please log in to save properties");
                    toggleFav(p.id);
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600 transition"
                >
                  <span>{isFav ? "Saved" : "Save"}</span>
                  <span className="text-base">{isFav ? "❤️" : "🤍"}</span>
                </button>

                {/* View on Map */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const coords = getLatLng(p) || defaultCoords;
                    navigate("/map", { state: { selectedProperty: p, coords } });
                  }}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
