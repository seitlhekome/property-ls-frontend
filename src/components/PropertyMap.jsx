import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./PropertyMap.css";

/* Fix default Leaflet icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Red icon for selected property */
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* District fallback coordinates */
const DISTRICT_COORDS = {
  maseru: [-29.3167, 27.4833],
  leribe: [-28.8718, 28.0456],
  berea: [-29.2000, 27.8333],
  mafeteng: [-29.8220, 27.2370],
  "butha buthe": [-28.8000, 28.3333],
  "mohale's hoek": [-30.1000, 27.1000],
  quthing: [-30.4000, 27.8000],
  semonkong: [-29.9333, 28.2167],
  "thaba tseka": [-29.5833, 28.7333],
  mantsonyane: [-29.6833, 28.2333],
  "qacha's neck": [-30.1000, 28.2000],
  mokhotlong: [-29.3000, 29.1000],
};

/* Recenter map on selected property */
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 12);
  }, [position, map]);
  return null;
}

export default function PropertyMap({ properties, onBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProperty } = location.state || {};

  const [userLocation, setUserLocation] = useState(null);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("User denied location"),
      { enableHighAccuracy: true }
    );
  }, []);

  const defaultCenter = [-29.3167, 27.4833]; // Maseru
  const mapCenter =
    (selectedProperty?.lat && selectedProperty?.lng
      ? [selectedProperty.lat, selectedProperty.lng]
      : userLocation) || defaultCenter;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <button
        onClick={onBack || (() => navigate(-1))}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>

      <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap position={mapCenter} />

        {/* User location */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Property markers */}
        {properties.map((property) => {
          let position = null;
          if (property.lat != null && property.lng != null)
            position = [property.lat, property.lng];
          else if (property.district)
            position =
              DISTRICT_COORDS[property.district.toLowerCase()] || null;

          if (!position) return null;

          const isSelected = selectedProperty && selectedProperty.id === property.id;

          return (
            <Marker
              key={property.id}
              position={position}
              icon={isSelected ? redIcon : new L.Icon.Default()}
              className={isSelected ? "pulse-marker" : ""}
            >
              <Popup>
                <div className="flex flex-col">
                  <strong>{property.title || "Property"}</strong>
                  <span>{property.location || "Unknown location"}</span>
                  <span>{property.district || "Lesotho"}</span>
                  {property.purpose === "buy" && property.price > 0 && (
                    <span>Price: {property.price}</span>
                  )}
                  {property.purpose === "rent" && property.rent_price > 0 && (
                    <span>Rent: {property.rent_price} / month</span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
