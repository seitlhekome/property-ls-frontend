// src/pages/Homepage.jsx
import React, { useState } from "react";
import PropertyList from "../components/PropertyList";

export default function Homepage({
  properties,
  favorites,
  toggleFav,
  fmt,
  setSelectedProperty,
  currentUser,
  loading,
}) {
  // Active tab: "buy" for sale, "rent" for rent
  const [activeTab, setActiveTab] = useState("buy");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Property Listings</h1>

      {/* Tabs for Buy / Rent */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "buy"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("buy")}
        >
          For Sale
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "rent"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("rent")}
        >
          For Rent
        </button>
      </div>

      {/* Property List filtered by activeTab */}
      <PropertyList
        properties={properties}
        favorites={favorites}
        toggleFav={toggleFav}
        fmt={fmt}
        setSelectedProperty={setSelectedProperty}
        currentUser={currentUser}
        loading={loading}
        activeTab={activeTab}
      />
    </div>
  );
}
