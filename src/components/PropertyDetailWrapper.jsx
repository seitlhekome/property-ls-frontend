import React from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import PropertyDetail from "./PropertyDetail";

export default function PropertyDetailWrapper({
  properties,
  favorites,
  toggleFav,
  currentUser,
}) {
  const { id } = useParams();
  const location = useLocation();

  // Check if property was passed via navigate state
  const selectedProperty = location.state?.selectedProperty || 
    properties.find((p) => p.id.toString() === id);

  if (!selectedProperty) {
    return <Navigate to="/" />;
  }

  return (
    <PropertyDetail
      property={selectedProperty}
      favorites={favorites}
      toggleFav={toggleFav}
      currentUser={currentUser}
    />
  );
}
