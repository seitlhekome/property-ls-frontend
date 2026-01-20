import React from "react";

export default function PropertyList({
  properties,
  favorites,
  toggleFav,
  fmt,
  setSelectedProperty,
  currentUser,
}) {
  if (!properties) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {properties.length === 0 ? (
        <p className="col-span-full text-center text-gray-600">
          No properties found.
        </p>
      ) : (
        properties.map((property) => {
          const isFav = favorites.includes(property.id);

          return (
            <div
              key={property.id}
              className="border rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedProperty(property)}
            >
              {/* Property Image */}
              <img
                src={
                  property.images?.length
                    ? property.images[0]
                    : "/placeholder.jpg"
                }
                alt={property.title || "Property"}
                className="h-48 w-full object-cover"
              />

              {/* Property Info */}
              <div className="p-3 flex flex-col gap-1">
                <h2 className="font-semibold text-lg text-gray-800">
                  {property.title || "Untitled"}
                </h2>

                <p className="text-blue-700 font-bold mt-1 text-lg">
                  {property.price ? fmt(property.price) : "Price N/A"}
                </p>

                <p className="text-sm text-gray-600">
                  {property.district || ""} - {property.location || ""}
                </p>

                {/* WhatsApp on card if available */}
                {property.whatsapp && (
                  <p className="text-sm text-green-600">
                    WhatsApp: {property.whatsapp}
                  </p>
                )}

                {/* Listing Date */}
                {property.date_posted && (
                  <p className="text-xs text-gray-500 mt-1">
                    Listed: {new Date(property.date_posted).toLocaleDateString()}
                  </p>
                )}

                {/* Favorite Button */}
                {currentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav(property.id);
                    }}
                    className={`mt-2 px-3 py-1 text-sm rounded font-medium transition ${
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
        })
      )}
    </div>
  );
}
