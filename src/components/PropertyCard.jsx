import React from "react";

export default function PropertyCard({ property, onSelect }) {
  return (
    <div
      onClick={() => onSelect(property)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      {/* Image */}
      {property.images?.length ? (
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">
          {property.title || "Untitled Property"}
        </h3>

        <p className="text-gray-600 text-sm">
          {property.location} • {property.district}
        </p>

        <p className="font-bold mt-2">
          {property.price
            ? "M " + Number(property.price).toLocaleString()
            : "Price on request"}
        </p>

        {/* WhatsApp shown but NOT clickable */}
        {property.whatsapp && (
          <p className="text-green-700 text-sm mt-2">
            WhatsApp: {property.whatsapp}
          </p>
        )}
      </div>
    </div>
  );
}
