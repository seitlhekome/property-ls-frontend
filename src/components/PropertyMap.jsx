import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./PropertyMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DISTRICT_COORDS = {
  maseru: [-29.3167, 27.4833],
  leribe: [-28.8718, 28.0456],
  berea: [-29.2, 27.8333],
  mafeteng: [-29.822, 27.237],
  "butha buthe": [-28.8, 28.3333],
  "mohale's hoek": [-30.1, 27.1],
  quthing: [-30.4, 27.8],
  semonkong: [-29.9333, 28.2167],
  "thaba tseka": [-29.5833, 28.7333],
  mantsonyane: [-29.6833, 28.2333],
  "qacha's neck": [-30.1, 28.2],
  mokhotlong: [-29.3, 29.1],
};

const DEFAULT_CENTER = [-29.3167, 27.4833];

function formatMoney(value) {
  if (!value || Number(value) <= 0) return "Price not specified";
  return `M ${Number(value).toLocaleString("en-LS")}`;
}

function formatMarkerPrice(property) {
  const rawValue =
    property?.purpose === "rent"
      ? property?.rent_price || property?.price
      : property?.price || property?.rent_price;

  const value = Number(rawValue);

  if (!value || Number.isNaN(value)) {
    return property?.purpose === "rent" ? "Rent" : "Sale";
  }

  if (value >= 1000000) {
    const millions = value / 1000000;
    return `M${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}m`;
  }

  if (value >= 1000) {
    return `M${Math.round(value / 1000)}k`;
  }

  return `M${value}`;
}

function getPropertyImage(property) {
  if (!property) return null;

  const { images, image, image_url } = property;

  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      const first = parsed?.[0];
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
    } catch {
      return images;
    }
  }

  return image_url || image || null;
}

function getPropertyPosition(property) {
  const lat = property?.lat ?? property?.latitude;
  const lng = property?.lng ?? property?.longitude;

  if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLng)) {
      return [parsedLat, parsedLng];
    }
  }

  if (property?.district) {
    return DISTRICT_COORDS[property.district.toLowerCase()] || null;
  }

  return null;
}

function getPurposeLabel(property) {
  if (property?.purpose === "rent") return "For Rent";
  if (property?.purpose === "buy") return "For Sale";
  return "Property";
}

function getDisplayPrice(property) {
  if (!property) return "Price not specified";

  if (property.purpose === "rent") {
    return property.rent_price
      ? `${formatMoney(property.rent_price)} / month`
      : formatMoney(property.price);
  }

  return formatMoney(property.price || property.rent_price);
}

function createPropertyIcon(property, isActive) {
  const purposeClass =
    property?.purpose === "rent"
      ? "rent"
      : property?.purpose === "buy"
      ? "sale"
      : "default";

  return L.divIcon({
    className: `property-price-marker ${purposeClass} ${
      isActive ? "active" : ""
    }`,
    html: `<div class="property-price-pill">${formatMarkerPrice(property)}</div>`,
    iconSize: [76, 34],
    iconAnchor: [38, 34],
    popupAnchor: [0, -30],
  });
}

function createUserLocationIcon() {
  return L.divIcon({
    className: "user-location-marker",
    html: `<div class="user-location-dot"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [position, map]);

  return null;
}

export default function PropertyMap({ properties = [], onBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProperty } = location.state || {};

  const [activeProperty, setActiveProperty] = useState(selectedProperty || null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [locationMessage, setLocationMessage] = useState("");

  useEffect(() => {
    if (selectedProperty) setActiveProperty(selectedProperty);
  }, [selectedProperty]);

  const mappedProperties = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return properties.filter((property) => {
      const hasPosition = getPropertyPosition(property);
      if (!hasPosition) return false;

      const matchesPurpose =
        purposeFilter === "all" || property.purpose === purposeFilter;

      const matchesSearch =
        !q ||
        [
          property.title,
          property.location,
          property.district,
          property.type,
          property.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesPurpose && matchesSearch;
    });
  }, [properties, searchTerm, purposeFilter]);

  const activePosition = getPropertyPosition(activeProperty);
  const mapCenter = activePosition || userLocation || DEFAULT_CENTER;

  const handleUseMyLocation = () => {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationMessage("Showing your current location.");
      },
      () => setLocationMessage("Unable to access your location."),
      { enableHighAccuracy: true }
    );
  };

  const handleViewDetails = (property) => {
    const id = property?.id || property?._id;
    if (id) navigate(`/property/${id}`);
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="property-map-page">
      <section className="property-map-toolbar">
        <div className="map-toolbar-left">
          <button type="button" className="map-back-btn" onClick={handleBack}>
            ← Back
          </button>

          <div>
            <h1>Explore Properties</h1>
            <p>🏠 {mappedProperties.length} properties available</p>
          </div>
        </div>

        <div className="map-toolbar-controls">
          <input
            type="text"
            placeholder="Search location, district, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="map-purpose-buttons">
            <button
              type="button"
              className={purposeFilter === "all" ? "active" : ""}
              onClick={() => setPurposeFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={purposeFilter === "rent" ? "active" : ""}
              onClick={() => setPurposeFilter("rent")}
            >
              Rent
            </button>
            <button
              type="button"
              className={purposeFilter === "buy" ? "active" : ""}
              onClick={() => setPurposeFilter("buy")}
            >
              Sale
            </button>
          </div>

          <button
            type="button"
            className="map-location-btn"
            onClick={handleUseMyLocation}
          >
            📍 My Location
          </button>
        </div>
      </section>

      {locationMessage && (
        <div className="map-location-message">{locationMessage}</div>
      )}

      <section className="property-map-layout">
        <aside className="property-map-panel">
          <div className="map-panel-header">
            <h2>Listings</h2>
            <p>Select a property to focus on the map.</p>
          </div>

          <div className="map-results-list">
            {mappedProperties.length === 0 ? (
              <div className="map-empty-state">
                <h3>No properties found</h3>
                <p>Try searching another location or changing Rent/Sale.</p>
              </div>
            ) : (
              mappedProperties.slice(0, 14).map((property) => {
                const image = getPropertyImage(property);
                const isActive =
                  String(activeProperty?.id || activeProperty?._id) ===
                  String(property.id || property._id);

                return (
                  <button
                    type="button"
                    key={property.id || property._id}
                    className={`map-property-card ${isActive ? "active" : ""}`}
                    onClick={() => setActiveProperty(property)}
                  >
                    <div className="map-card-image">
                      {image ? (
                        <img src={image} alt={property.title || "Property"} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="map-card-info">
                      <span>{getPurposeLabel(property)}</span>
                      <h3>{property.title || "Listed Property"}</h3>
                      <p>{property.location || property.district || "Lesotho"}</p>
                      <strong>{getDisplayPrice(property)}</strong>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="property-map-holder">
          <MapContainer center={mapCenter} zoom={12} className="property-map">
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap position={mapCenter} />

            {userLocation && (
              <Marker position={userLocation} icon={createUserLocationIcon()}>
                <Popup>
                  <strong>You are here</strong>
                </Popup>
              </Marker>
            )}

            <MarkerClusterGroup
              chunkedLoading
              spiderfyOnMaxZoom
              showCoverageOnHover={false}
              maxClusterRadius={45}
            >
              {mappedProperties.map((property) => {
                const position = getPropertyPosition(property);
                const image = getPropertyImage(property);
                const isActive =
                  String(activeProperty?.id || activeProperty?._id) ===
                  String(property.id || property._id);

                return (
                  <Marker
                    key={property.id || property._id}
                    position={position}
                    icon={createPropertyIcon(property, isActive)}
                    eventHandlers={{ click: () => setActiveProperty(property) }}
                  >
                    <Popup>
                      <div className="property-popup-card">
                        <div className="popup-image">
                          {image ? (
                            <img src={image} alt={property.title || "Property"} />
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>

                        <div className="popup-content">
                          <span>{getPurposeLabel(property)}</span>
                          <h3>{property.title || "Listed Property"}</h3>
                          <p>
                            {property.location || property.district || "Lesotho"}
                          </p>
                          <strong>{getDisplayPrice(property)}</strong>

                          <button
                            type="button"
                            onClick={() => handleViewDetails(property)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>

          {activeProperty && (
            <div className="mobile-map-card">
              <div className="mobile-map-image">
                {getPropertyImage(activeProperty) ? (
                  <img
                    src={getPropertyImage(activeProperty)}
                    alt={activeProperty.title || "Property"}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="mobile-map-info">
                <span>{getPurposeLabel(activeProperty)}</span>
                <h3>{activeProperty.title || "Listed Property"}</h3>
                <p>
                  {activeProperty.location ||
                    activeProperty.district ||
                    "Lesotho"}
                </p>
                <strong>{getDisplayPrice(activeProperty)}</strong>
              </div>

              <button type="button" onClick={() => handleViewDetails(activeProperty)}>
                View
              </button>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}