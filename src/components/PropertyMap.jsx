import React, { useEffect, useMemo, useState } from "react";
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

/* District fallback coordinates */
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        if (typeof first === "string") return first;
        if (first?.url) return first.url;
      }
    } catch {
      return images;
    }
  }

  return image_url || image || null;
}

function getPropertyPosition(property) {
  if (!property) return null;

  const lat = property.lat ?? property.latitude;
  const lng = property.lng ?? property.longitude;

  if (lat != null && lng != null && lat !== "" && lng !== "") {
    return [Number(lat), Number(lng)];
  }

  if (property.district) {
    return DISTRICT_COORDS[property.district.toLowerCase()] || null;
  }

  return null;
}

function getPurposeLabel(property) {
  if (property?.purpose === "buy") return "For Sale";
  if (property?.purpose === "rent") return "For Rent";
  return "Property";
}

function getDisplayPrice(property) {
  if (!property) return "Price not specified";

  if (property.purpose === "buy") {
    return formatMoney(property.price);
  }

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
    className: `property-map-marker ${purposeClass} ${
      isActive ? "active" : ""
    }`,
    html: `
      <div class="property-marker-dot">
        <span>${property?.purpose === "rent" ? "R" : property?.purpose === "buy" ? "S" : "P"}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
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

/* Recenter map on selected property */
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

  const [userLocation, setUserLocation] = useState(null);
  const [activeProperty, setActiveProperty] = useState(selectedProperty || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn("User denied location"),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      setActiveProperty(selectedProperty);
    }
  }, [selectedProperty]);

  const visibleProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchableText = [
        property.title,
        property.location,
        property.district,
        property.property_type,
        property.type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());

      const matchesPurpose =
        purposeFilter === "all" || property.purpose === purposeFilter;

      return matchesSearch && matchesPurpose && getPropertyPosition(property);
    });
  }, [properties, searchTerm, purposeFilter]);

  const activePosition = getPropertyPosition(activeProperty);

  const mapCenter =
    activePosition ||
    userLocation ||
    getPropertyPosition(selectedProperty) ||
    DEFAULT_CENTER;

  const handleViewDetails = (property) => {
    if (!property?.id) return;
    navigate(`/property/${property.id}`);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Unable to get your current location."),
      { enableHighAccuracy: true }
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPurposeFilter("all");
    setShowMobileFilters(false);
  };

  return (
    <div className="property-map-page">
      <div className="property-map-topbar">
        <div className="map-title-group">
          <button
            type="button"
            onClick={onBack || (() => navigate(-1))}
            className="map-back-btn"
          >
            ← Back
          </button>

          <div>
            <h1>Explore Properties</h1>
            <p>Find houses, rentals, land, and listed properties across Lesotho.</p>
          </div>
        </div>

        <div className="map-search-area">
          <input
            type="text"
            placeholder="Search by location, district, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() => setShowMobileFilters((prev) => !prev)}
          >
            Filters
          </button>
        </div>
      </div>

      <div className="property-map-content">
        <aside
          className={`property-map-sidebar ${
            showMobileFilters ? "show-mobile-filters" : ""
          }`}
        >
          <div className="sidebar-card">
            <div className="sidebar-header">
              <div>
                <h2>Map Filters</h2>
                <p>{visibleProperties.length} properties found</p>
              </div>

              <button type="button" onClick={resetFilters}>
                Reset
              </button>
            </div>

            <div className="filter-group">
              <label>Property Purpose</label>
              <div className="purpose-toggle">
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
            </div>

            <button
              type="button"
              className="my-location-btn"
              onClick={handleUseMyLocation}
            >
              📍 Use My Location
            </button>
          </div>

          <div className="sidebar-results">
            {visibleProperties.length === 0 ? (
              <div className="empty-map-results">
                <h3>No properties found</h3>
                <p>Try changing your search or filters.</p>
              </div>
            ) : (
              visibleProperties.slice(0, 12).map((property) => {
                const isActive = activeProperty?.id === property.id;
                const image = getPropertyImage(property);

                return (
                  <button
                    type="button"
                    key={property.id}
                    className={`map-result-card ${isActive ? "active" : ""}`}
                    onClick={() => setActiveProperty(property)}
                  >
                    <div className="result-image">
                      {image ? (
                        <img src={image} alt={property.title || "Property"} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>

                    <div className="result-details">
                      <span className="result-purpose">
                        {getPurposeLabel(property)}
                      </span>
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
          <MapContainer
            center={mapCenter}
            zoom={12}
            className="property-map"
            zoomControl
          >
            <TileLayer
              attribution='© OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap position={activePosition || mapCenter} />

            {userLocation && (
              <Marker
                position={userLocation}
                icon={createUserLocationIcon()}
              >
                <Popup>
                  <strong>You are here</strong>
                </Popup>
              </Marker>
            )}

            {visibleProperties.map((property) => {
              const position = getPropertyPosition(property);
              if (!position) return null;

              const isActive = activeProperty?.id === property.id;
              const image = getPropertyImage(property);

              return (
                <Marker
                  key={property.id}
                  position={position}
                  icon={createPropertyIcon(property, isActive)}
                  eventHandlers={{
                    click: () => setActiveProperty(property),
                  }}
                >
                  <Popup>
                    <div className="property-popup-card">
                      <div className="popup-image">
                        {image ? (
                          <img
                            src={image}
                            alt={property.title || "Property"}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>

                      <div className="popup-content">
                        <span>{getPurposeLabel(property)}</span>
                        <h3>{property.title || "Listed Property"}</h3>
                        <p>
                          {property.location ||
                            property.district ||
                            "Lesotho"}
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
          </MapContainer>

          {activeProperty && (
            <div className="mobile-bottom-card">
              <div className="mobile-card-image">
                {getPropertyImage(activeProperty) ? (
                  <img
                    src={getPropertyImage(activeProperty)}
                    alt={activeProperty.title || "Property"}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="mobile-card-info">
                <span>{getPurposeLabel(activeProperty)}</span>
                <h3>{activeProperty.title || "Listed Property"}</h3>
                <p>
                  {activeProperty.location ||
                    activeProperty.district ||
                    "Lesotho"}
                </p>
                <strong>{getDisplayPrice(activeProperty)}</strong>
              </div>

              <button
                type="button"
                onClick={() => handleViewDetails(activeProperty)}
              >
                View
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}