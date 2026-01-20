import React, { useState } from "react";

export default function PropertyDetail({
  property,
  setSelectedProperty,
  toggleFav,
  favorites,
  currentUser,
}) {
  const [activeImage, setActiveImage] = useState(
    property.images?.length ? property.images[0] : null
  );

  if (!property) return null;

  const isFav = favorites?.includes(property.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative p-6">
        {/* Close button */}
        <button
          onClick={() => setSelectedProperty(null)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {property.title || "Untitled Property"}
        </h2>

        {/* Listing Date */}
        {property.date_posted && (
          <p className="text-xs text-gray-500 mb-2">
            Listed: {new Date(property.date_posted).toLocaleDateString()}
          </p>
        )}

        {/* Main Active Image */}
        {activeImage ? (
          <div className="mb-4">
            <img
              src={activeImage}
              alt="Active property"
              className="w-full h-64 md:h-96 object-cover rounded"
            />
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No images available</p>
        )}

        {/* Thumbnail images */}
        {property.images?.length > 1 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Property ${index + 1}`}
                className={`h-24 w-auto object-cover rounded cursor-pointer border ${
                  img === activeImage ? "border-blue-500" : "border-gray-200"
                }`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        )}

        {/* Property Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <p>
            <strong>Price:</strong>{" "}
            {property.price ? "M " + Number(property.price).toLocaleString() : "N/A"}
          </p>
          <p>
            <strong>Type:</strong> {property.type || "N/A"}
          </p>
          <p>
            <strong>District:</strong> {property.district || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {property.location || "N/A"}
          </p>
          <p>
            <strong>Size:</strong> {property.size ? `${property.size} m²` : "N/A"}
          </p>
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms || "N/A"}
          </p>
          <p>
            <strong>Bathrooms:</strong> {property.bathrooms || "N/A"}
          </p>
        </div>

        <p className="mb-4">
          <strong>Description:</strong> {property.description || "No description provided."}
        </p>

        {/* Agent Info */}
        {property.agent_name && (
          <div className="mb-4 border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">Agent Info</h3>
            <p>
              <strong>Name:</strong> {property.agent_name}
            </p>
            {property.phone && (
              <p>
                <strong>Phone:</strong> {property.phone}
              </p>
            )}
            {property.whatsapp && (
              <p>
                <strong>WhatsApp:</strong> {property.whatsapp}
              </p>
            )}
          </div>
        )}

        {/* Favorite Button */}
        {currentUser && (
          <button
            onClick={() => toggleFav(property.id)}
            className={`mt-2 px-4 py-2 rounded font-medium transition ${
              isFav
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isFav ? "❤️ Favorited" : "🤍 Favorite"}
          </button>
        )}
      </div>
    </div>
  );
}
