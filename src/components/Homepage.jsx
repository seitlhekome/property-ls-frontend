import React from "react";
import PropertyList from "./PropertyList";

export default function Homepage({
  properties,
  activeTab,
  searchQuery,
  setSelectedProperty,
  favorites,
  toggleFav,
  fmt,
  currentUser,
  loading,
}) {
  // Filter by purpose (buy/rent) and search query
  const filteredProperties = properties.filter(
    (p) =>
      p.purpose === activeTab &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {loading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : filteredProperties.length === 0 ? (
        <p className="text-center text-gray-600">
          No properties found for {activeTab}.
        </p>
      ) : (
        <PropertyList
          properties={filteredProperties}
          favorites={favorites}
          toggleFav={toggleFav}
          fmt={fmt}
          setSelectedProperty={setSelectedProperty}
          currentUser={currentUser}
          loading={loading}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
