import React from "react";

export default function PropertyList({
  properties = [],
  favorites = [],
  toggleFav,
  fmt,
  setSelectedProperty,
  currentUser,
  loading,
}) {
  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-500">
        Loading properties…
      </div>
    );
  }

  // ---------------- EMPTY STATE ----------------
  if (!loading && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-500">
        No properties available.
      </div>
    );
  }

  // ---------------- RENDER LIST ----------------
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
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
            onClick={() => setSelectedProperty(p)}
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={image}
                alt={p.title || "Property"}
                className="w-full h-48 object-cover"
              />

              {/* FAVORITE BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!currentUser) {
                    alert("Please log in to save properties");
                    return;
                  }
                  toggleFav(p.id);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                title={currentUser ? "Save property" : "Login to save"}
              >
                {isFav ? "❤️" : "🤍"}
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {p.title || "Untitled Property"}
              </h3>

              <p className="text-sm text-gray-500">
                {p.location || "Unknown location"}, {p.district || "Lesotho"}
              </p>

              {/* PRICE */}
              <div className="text-blue-600 font-bold">
                {p.purpose === "buy" && p.price > 0 && <span>{fmt(p.price)}</span>}
                {p.purpose === "rent" && p.rent_price > 0 && (
                  <span>{fmt(p.rent_price)} / month</span>
                )}
              </div>

              {/* META */}
              <div className="flex gap-4 text-sm text-gray-600">
                {p.bedrooms > 0 && <span>🛏 {p.bedrooms}</span>}
                {p.bathrooms > 0 && <span>🛁 {p.bathrooms}</span>}
                {p.size > 0 && <span>📐 {p.size} m²</span>}
              </div>

              {/* DATE POSTED */}
              {p.date_posted && (
                <div className="text-xs text-gray-400">
                  Posted on {new Date(p.date_posted).toLocaleDateString()}
                </div>
              )}

              {/* AGENT */}
              {p.agent_name && (
                <div className="text-xs text-gray-400">Listed by {p.agent_name}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
