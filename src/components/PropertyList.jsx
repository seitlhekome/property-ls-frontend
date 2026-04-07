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

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="28">
          No Image
        </text>
      </svg>
    `);

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

  const getImageUrl = (property) => {
    if (!Array.isArray(property.images) || property.images.length === 0) {
      return fallbackImage;
    }

    const first = property.images[0];

    if (typeof first === "string") return first;
    if (typeof first === "object" && first?.url) return first.url;

    return fallbackImage;
  };

  const getPropertyId = (p) => p.id ?? p._id;

  const getLatLng = (property) => {
    const lat = property.lat ?? property.latitude ?? null;
    const lng = property.lng ?? property.longitude ?? null;
    if (lat != null && lng != null) return [lat, lng];
    return [-29.3152, 27.4869];
  };

  const getPostedDate = (property) => {
    const rawDate =
      property.date_posted ||
      property.createdAt ||
      property.created_at ||
      property.datePosted ||
      null;

    if (!rawDate) return null;

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => {
        const id = getPropertyId(p);
        const image = getImageUrl(p);
        const isSaved = favorites.some((fav) => String(fav) === String(id));
        const isLoggedIn = !!currentUser;
        const postedDate = getPostedDate(p);

        return (
          <div
            key={id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col overflow-hidden"
            onClick={() =>
              navigate(`/property/${id}`, {
                state: { selectedProperty: p },
              })
            }
          >
            <div className="relative">
              <img
                src={image}
                alt={p.title || "Property"}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="text-blue-600 font-semibold text-lg">
                {p.purpose === "buy" && Number(p.price) > 0 && fmt(p.price)}
                {p.purpose === "rent" && Number(p.rent_price) > 0 && (
                  <>
                    {fmt(p.rent_price)}
                    <span className="text-sm text-gray-500"> / month</span>
                  </>
                )}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mt-1">
                {p.title || "Untitled Property"}
              </h3>

              <p className="text-sm text-gray-500">
                {p.location || "Unknown location"}, {p.district || "Lesotho"}
              </p>

              <div className="flex gap-4 text-xs text-gray-600 mt-2">
                <span>🛏 {p.bedrooms ?? "-"}</span>
                <span>🛁 {p.bathrooms ?? "-"}</span>
                <span>📐 {p.size ?? "-"} m²</span>
              </div>

              {postedDate && (
                <p className="text-xs text-gray-400 mt-2">
                  Posted on {postedDate}
                </p>
              )}

              <div className="mt-auto flex justify-between items-center gap-2 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(id);
                  }}
                  className={`text-sm font-medium transition ${
                    !isLoggedIn
                      ? "text-gray-400"
                      : isSaved
                      ? "text-red-600"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  {isSaved ? "Saved ❤️" : "Save 🤍"}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/map", {
                      state: {
                        selectedProperty: p,
                        coords: getLatLng(p),
                      },
                    });
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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