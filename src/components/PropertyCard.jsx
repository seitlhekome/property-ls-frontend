import React, { useMemo } from "react";

export default function PropertyCard({ property, onSelect }) {
  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="24" font-family="Arial, sans-serif">
          No Image
        </text>
      </svg>
    `);

  const normalizeImages = (images) => {
    try {
      let parsed = images;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((img) => {
          if (typeof img === "string" && img.trim()) {
            return img;
          }

          if (img && typeof img === "object" && img.url) {
            return img.url;
          }

          return null;
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Failed to normalize property images:", error);
      return [];
    }
  };

  const imageUrl = useMemo(() => {
    const normalized = normalizeImages(property?.images);
    return normalized[0] || fallbackImage;
  }, [property?.images]);

  const formatMoney = (value) => `M ${Number(value || 0).toLocaleString()}`;

  const displayPrice = () => {
    if (property?.purpose === "rent") {
      return Number(property?.rent_price) > 0
        ? `${formatMoney(property.rent_price)} / month`
        : "Rent on request";
    }

    return Number(property?.price) > 0
      ? formatMoney(property.price)
      : "Price on request";
  };

  const purposeLabel =
    property?.purpose === "rent" ? "For Rent" : "For Sale";

  const typeLabel = property?.type || "Property";
  const title = property?.title || "Untitled Property";
  const location = property?.location || "Unknown location";
  const district = property?.district || "Lesotho";

  return (
    <div
      onClick={() => onSelect(property)}
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />

        <div className="absolute left-3 top-3 flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
              property?.purpose === "rent"
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {purposeLabel}
          </span>

          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {typeLabel}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <p className="line-clamp-1 text-sm text-gray-600">
          {location} • {district}
        </p>

        <p className="mt-3 text-xl font-bold text-blue-600">
          {displayPrice()}
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          <span>🛏 {property?.bedrooms ?? "-"}</span>
          <span>🛁 {property?.bathrooms ?? "-"}</span>
          <span>📐 {property?.size ? `${property.size} m²` : "-"}</span>
        </div>

        {property?.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
            {property.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {property?.whatsapp ? (
            <p className="text-sm font-medium text-green-700">
              WhatsApp available
            </p>
          ) : (
            <p className="text-sm text-gray-400">No WhatsApp listed</p>
          )}

          <span className="text-sm font-medium text-blue-600 group-hover:underline">
            View details
          </span>
        </div>
      </div>
    </div>
  );
}