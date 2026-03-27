import React from "react";

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

  const getImageUrl = (images) => {
    try {
      let parsed = images;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return fallbackImage;
      }

      const firstImage = parsed[0];

      if (typeof firstImage === "string" && firstImage.trim()) {
        return firstImage;
      }

      if (firstImage && typeof firstImage === "object" && firstImage.url) {
        return firstImage.url;
      }

      return fallbackImage;
    } catch (error) {
      console.error("Failed to get property image:", error);
      return fallbackImage;
    }
  };

  const imageUrl = getImageUrl(property.images);

  return (
    <div
      onClick={() => onSelect(property)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      <img
        src={imageUrl}
        alt={property.title || "Property"}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {property.title || "Untitled Property"}
        </h3>

        <p className="text-gray-600 text-sm">
          {property.location || "Unknown location"} • {property.district || "Lesotho"}
        </p>

        <p className="font-bold mt-2">
          {property.price
            ? "M " + Number(property.price).toLocaleString()
            : "Price on request"}
        </p>

        {property.whatsapp && (
          <p className="text-green-700 text-sm mt-2">
            WhatsApp: {property.whatsapp}
          </p>
        )}
      </div>
    </div>
  );
}