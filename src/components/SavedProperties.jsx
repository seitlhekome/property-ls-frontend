import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedProperties({
  properties = [],
  favorites = [],
  toggleFav,
  currentUser,
  fmt,
}) {
  const navigate = useNavigate();

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="28" font-family="Arial, sans-serif">
          No Image
        </text>
      </svg>
    `);

  const userName =
    currentUser?.name ||
    currentUser?.user?.name ||
    currentUser?.full_name ||
    currentUser?.user?.full_name ||
    "User";

  const normalizeImages = (images) => {
    try {
      let parsed = images;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((img) => {
          if (typeof img === "string" && img.trim()) return img;
          if (img && typeof img === "object" && img.url) return img.url;
          return null;
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Failed to normalize saved property images:", error);
      return [];
    }
  };

  const getPropertyId = (prop) => prop?._id || prop?.id;

  const savedProperties = useMemo(() => {
    return properties.filter((prop) =>
      favorites.some((favId) => String(favId) === String(getPropertyId(prop)))
    );
  }, [properties, favorites]);

  const stats = useMemo(() => {
    const total = savedProperties.length;
    const buyCount = savedProperties.filter((p) => p.purpose === "buy").length;
    const rentCount = savedProperties.filter((p) => p.purpose === "rent").length;

    return { total, buyCount, rentCount };
  }, [savedProperties]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Saved Properties</p>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{userName}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              These are the properties you saved while signed in. Open any listing when you want to review it again.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Browse More
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Saved</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">For Sale</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.buyCount}</h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">For Rent</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.rentCount}</h2>
        </div>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No saved properties yet
          </h3>
          <p className="text-gray-500 mb-4">
            Browse listings and save the ones you want to come back to later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedProperties.map((prop) => {
            const id = getPropertyId(prop);
            const imageUrl = normalizeImages(prop.images)[0] || fallbackImage;
            const isSaved = favorites.some((favId) => String(favId) === String(id));

            return (
              <div
                key={id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col cursor-pointer"
                onClick={() =>
                  navigate(`/property/${id}`, {
                    state: { selectedProperty: prop },
                  })
                }
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={prop.title || "Property"}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(id);
                    }}
                    className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border bg-white/95 shadow-sm transition ${
                      isSaved
                        ? "border-red-200 text-red-500"
                        : "border-gray-200 text-gray-500 hover:text-red-500"
                    }`}
                    aria-label={isSaved ? "Remove from saved properties" : "Save property"}
                    title={isSaved ? "Remove from saved" : "Save property"}
                  >
                    <span className="text-lg">{isSaved ? "❤️" : "🤍"}</span>
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {prop.title || "Untitled Property"}
                    </h3>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        prop.purpose === "buy"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {prop.purpose === "buy" ? "For Sale" : "For Rent"}
                    </span>
                  </div>

                  <p className="text-blue-600 font-bold text-lg mb-1">
                    {prop.purpose === "buy"
                      ? fmt(prop.price)
                      : `${fmt(prop.rent_price)} / month`}
                  </p>

                  <p className="text-sm text-gray-600">
                    {prop.type || "N/A"} • {prop.location || "Unknown location"},{" "}
                    {prop.district || "N/A"}
                  </p>

                  <div className="flex gap-4 text-xs text-gray-500 mt-3">
                    <span>🛏 {prop.bedrooms ?? "-"}</span>
                    <span>🛁 {prop.bathrooms ?? "-"}</span>
                    <span>📐 {prop.size ?? "-"} m²</span>
                  </div>

                  <p className="text-gray-400 text-xs mt-3">
                    Posted:{" "}
                    {prop.createdAt || prop.date_posted
                      ? new Date(prop.createdAt || prop.date_posted).toLocaleDateString()
                      : "—"}
                  </p>

                  <div className="mt-auto pt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/property/${id}`, {
                          state: { selectedProperty: prop },
                        });
                      }}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                    >
                      View Property
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(id);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isSaved
                          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {isSaved ? "Remove" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}