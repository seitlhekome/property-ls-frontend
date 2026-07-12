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

function normalizePurpose(value) {
  const purpose = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (
    ["rent", "for rent", "rental", "to let", "let"].includes(purpose)
  ) {
    return "rent";
  }

  if (
    ["buy", "sale", "for sale", "sell", "selling"].includes(purpose)
  ) {
    return "buy";
  }

  return purpose;
}

function BackIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function SearchIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function LocationIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ListingsIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function HomeOutlineIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function ChevronUpIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function ChevronDownIcon({ className = "map-ui-icon" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function formatMoney(value) {
  if (!value || Number(value) <= 0) return "Price not specified";
  return `M ${Number(value).toLocaleString("en-LS")}`;
}

function formatMarkerPrice(property) {
  const purpose = normalizePurpose(property?.purpose);

  const rawValue =
    purpose === "rent"
      ? property?.rent_price || property?.price
      : property?.price || property?.rent_price;

  const value = Number(rawValue);

  if (!value || Number.isNaN(value)) {
    return purpose === "rent" ? "Rent" : "Buy";
  }

  if (value >= 1000000) {
    const millions = value / 1000000;
    return `M${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}m`;
  }

  if (value >= 1000) return `M${Math.round(value / 1000)}k`;

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
  const purpose = normalizePurpose(property?.purpose);

  if (purpose === "rent") return "For Rent";
  if (purpose === "buy") return "For Sale";

  return "Property";
}

function getDisplayPrice(property) {
  if (!property) return "Price not specified";

  const purpose = normalizePurpose(property?.purpose);

  if (purpose === "rent") {
    return Number(property?.rent_price) > 0
      ? `${formatMoney(property.rent_price)} / month`
      : formatMoney(property?.price);
  }

  return formatMoney(property?.price || property?.rent_price);
}

function createPropertyIcon(property, isActive) {
  const purpose = normalizePurpose(property?.purpose);

  const purposeClass =
    purpose === "rent"
      ? "rent"
      : purpose === "buy"
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

function ResizeMapOnDrawerChange({ drawerOpen }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 280);

    return () => clearTimeout(timer);
  }, [drawerOpen, map]);

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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (selectedProperty) setActiveProperty(selectedProperty);
  }, [selectedProperty]);

  const mappedProperties = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return properties.filter((property) => {
      const hasPosition = getPropertyPosition(property);
      if (!hasPosition) return false;

      const propertyPurpose = normalizePurpose(property?.purpose);

      const matchesPurpose =
        purposeFilter === "all" || propertyPurpose === purposeFilter;

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

  useEffect(() => {
    if (!activeProperty) return;

    const activeId = String(activeProperty?.id || activeProperty?._id || "");
    const isStillVisible = mappedProperties.some(
      (property) =>
        String(property?.id || property?._id || "") === activeId
    );

    if (!isStillVisible) {
      setActiveProperty(null);
    }
  }, [mappedProperties, activeProperty]);

  const activePosition = getPropertyPosition(activeProperty);
  const mapCenter = activePosition || userLocation || DEFAULT_CENTER;

  const focusProperty = (property) => {
    setActiveProperty(property);
    setMobileDrawerOpen(false);
  };

  const handleUseMyLocation = () => {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported on this device.");
      return;
    }

    setLocationMessage("Finding your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocationMessage("Showing your current location.");
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === 1) {
          setLocationMessage("Please allow location permission in your browser.");
        } else if (error.code === 2) {
          setLocationMessage("Your location is currently unavailable.");
        } else if (error.code === 3) {
          setLocationMessage("Location request timed out. Try again.");
        } else {
          setLocationMessage("Unable to access your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
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

  const renderPropertyCard = (property, mode = "desktop") => {
    const image = getPropertyImage(property);
    const isActive =
      String(activeProperty?.id || activeProperty?._id) ===
      String(property.id || property._id);

    return (
      <button
        type="button"
        key={property.id || property._id}
        className={`map-property-card ${isActive ? "active" : ""} ${
          mode === "mobile" ? "mobile-drawer-property-card" : ""
        }`}
        onClick={() => focusProperty(property)}
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
  };

  return (
    <div className="property-map-page">
      <section className="property-map-toolbar">
        <div className="map-toolbar-left">
          <button type="button" className="map-back-btn" onClick={handleBack}>
            <BackIcon />
            <span>Back</span>
          </button>

          <div className="map-toolbar-heading">
            <h1>Explore Properties</h1>
            <p>
              <HomeOutlineIcon />
              <span>{mappedProperties.length} properties available</span>
            </p>
          </div>
        </div>

        <div className="map-toolbar-controls">
          <div className="map-search-wrap">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search location, district, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
              Buy
            </button>
          </div>

          <button
            type="button"
            className="map-location-btn desktop-location-btn"
            onClick={handleUseMyLocation}
          >
            <LocationIcon />
            <span>My Location</span>
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
                <p>Try searching another location or changing Rent/Buy.</p>
              </div>
            ) : (
              mappedProperties.slice(0, 30).map((property) =>
                renderPropertyCard(property, "desktop")
              )
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
            <ResizeMapOnDrawerChange drawerOpen={mobileDrawerOpen} />

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
                    eventHandlers={{
                      click: () => {
                        setActiveProperty(property);
                        setMobileDrawerOpen(false);
                      },
                    }}
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

          <div className="mobile-map-actions">
            <button
              type="button"
              className="mobile-map-action-btn"
              onClick={handleUseMyLocation}
              aria-label="Use my location"
              title="Use my location"
            >
              <LocationIcon className="mobile-action-icon" />
              <span>Location</span>
            </button>

            <button
              type="button"
              className="mobile-map-action-btn"
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              aria-label={`Open ${mappedProperties.length} listings`}
              title="View listings"
            >
              <ListingsIcon className="mobile-action-icon" />
              <span>Listings</span>
            </button>
          </div>

          {activeProperty && !mobileDrawerOpen && (
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

          <div
            className={`mobile-listings-drawer ${
              mobileDrawerOpen ? "open" : ""
            }`}
          >
            <button
              type="button"
              className="mobile-drawer-handle"
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              aria-expanded={mobileDrawerOpen}
            >
              <span className="mobile-drawer-grip"></span>

              <div className="mobile-drawer-title-row">
                <div>
                  <strong>{mappedProperties.length} Listings</strong>
                  <small>
                    {mobileDrawerOpen
                      ? "Browse and select a property"
                      : "Tap to view properties"}
                  </small>
                </div>

                {mobileDrawerOpen ? (
                  <ChevronDownIcon className="mobile-drawer-chevron" />
                ) : (
                  <ChevronUpIcon className="mobile-drawer-chevron" />
                )}
              </div>
            </button>

            <div className="mobile-drawer-filters">
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

            <div className="mobile-drawer-list">
              {mappedProperties.length === 0 ? (
                <div className="map-empty-state">
                  <h3>No properties found</h3>
                  <p>Try searching another location or changing Rent/Buy.</p>
                </div>
              ) : (
                mappedProperties.slice(0, 40).map((property) =>
                  renderPropertyCard(property, "mobile")
                )
              )}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}