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

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>

      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>

        <div className="flex gap-4 mt-2">
          <div className="h-3 bg-gray-200 rounded w-10"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-7 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!loading && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-gray-500">
        No properties available.
      </div>
    );
  }

  const getLatLng = (property) => {
    const lat = property.lat ?? property.latitude ?? null;
    const lng = property.lng ?? property.longitude ?? null;
    if (lat != null && lng != null) return [lat, lng];
    return null;
  };

  const getImageUrl = (property) => {
    if (!Array.isArray(property.images) || property.images.length === 0) {
      return "/no-image.png";
    }

    const firstImage = property.images[0];

    if (typeof firstImage === "string" && firstImage.trim()) {
      return firstImage;
    }

    if (typeof firstImage === "object" && firstImage?.url) {
      return firstImage.url;
    }

    return "/no-image.png";
  };

  const defaultCoords = [-29.3152, 27.4869];

  return (
    <div className="max-w-7xl mx-auto p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => {
        const image = getImageUrl(p);
        const propertyId = p.id ?? p._id;
        const isSaved = favorites.includes(propertyId);
        const isLoggedIn = !!currentUser;

        return (
          <div
            key={propertyId}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden"
            onClick={() => setSelectedProperty(p)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedProperty(p);
              }
            }}
          >
            <div className="relative">
              <img
                src={image}
                alt={p.title || "Property"}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/no-image.png";
                }}
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="text-blue-600 font-semibold text-lg">
                {p.purpose === "buy" && Number(p.price) > 0 && <span>{fmt(p.price)}</span>}
                {p.purpose === "rent" && Number(p.rent_price) > 0 && (
                  <span>
                    {fmt(p.rent_price)}
                    <span className="text-sm font-normal text-gray-500"> / month</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mt-1">
                {p.title || "Untitled Property"}
              </h3>

              <p className="text-sm text-gray-500">
                {p.location || "Unknown location"}, {p.district || "Lesotho"}
              </p>

              <div className="flex gap-4 text-xs text-gray-600 mt-1">
                <span>🛏 {p.bedrooms ?? "-"}</span>
                <span>🛁 {p.bathrooms ?? "-"}</span>
                <span>📐 {p.size ?? "-"} m²</span>
              </div>

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

              <div className="mt-auto flex justify-between items-center gap-2 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(propertyId);
                  }}
                  className={`inline-flex items-center gap-1 text-sm font-medium transition ${
                    !isLoggedIn
                      ? "text-gray-400 hover:text-gray-500"
                      : isSaved
                      ? "text-red-600 hover:text-red-700"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                  aria-label={isSaved ? "Saved property" : "Save property"}
                  title={
                    !isLoggedIn
                      ? "Sign in to save properties"
                      : isSaved
                      ? "Saved"
                      : "Save property"
                  }
                >
                  <span>{isSaved && isLoggedIn ? "Saved" : "Save"}</span>
                  <span className="text-base">{isSaved && isLoggedIn ? "❤️" : "🤍"}</span>
                </button>

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