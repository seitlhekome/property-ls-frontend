import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function PropertyDetail({ favorites = [], toggleFav, currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [pageError, setPageError] = useState("");

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="28" font-family="Arial, sans-serif">
          No Image
        </text>
      </svg>
    `);

  const formatMoney = useCallback((value) => {
    return `M ${Number(value || 0).toLocaleString()}`;
  }, []);

  const normalizeImages = useCallback((images) => {
    try {
      let parsed = images;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((img) => {
          if (typeof img === "string" && img.trim()) {
            return img;
          }

          if (img && typeof img === "object" && typeof img.url === "string" && img.url.trim()) {
            return img.url;
          }

          return null;
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Failed to normalize property images:", error);
      return [];
    }
  }, []);

  const normalizeProperty = useCallback((raw) => {
    if (!raw || typeof raw !== "object") return null;

    return {
      ...raw,
      id: raw.id || raw._id,
      purpose: raw.purpose || "buy",
      type: raw.type || "N/A",
      district: raw.district || "N/A",
      location: raw.location || "N/A",
      bedrooms: raw.bedrooms ?? "N/A",
      bathrooms: raw.bathrooms ?? "N/A",
      size: raw.size ?? "",
      description: raw.description || "",
      title: raw.title || "Untitled Property",
      images: normalizeImages(raw.images),
      phone: raw.phone || "",
      whatsapp: raw.whatsapp || "",
      agent_name: raw.agent_name || raw.agentName || "",
      price: raw.price ?? "",
      rent_price: raw.rent_price ?? "",
    };
  }, [normalizeImages]);

  useEffect(() => {
    let isMounted = true;

    const fetchProperty = async () => {
      setLoading(true);
      setPageError("");

      try {
        const res = await axios.get(`${API_URL}/properties/${id}`, {
          timeout: 15000,
        });

        if (!isMounted) return;

        const normalized = normalizeProperty(res.data);
        setProperty(normalized);
      } catch (err) {
        console.error("Failed to load property directly:", err);

        try {
          const all = await axios.get(`${API_URL}/properties`, {
            timeout: 15000,
          });

          if (!isMounted) return;

          const list = Array.isArray(all.data) ? all.data : [];
          const found = list.find(
            (p) =>
              String(p.id) === String(id) ||
              String(p._id) === String(id)
          );

          const normalizedFallback = normalizeProperty(found);
          setProperty(normalizedFallback || null);

          if (!normalizedFallback) {
            setPageError("Property not found.");
          }
        } catch (err2) {
          console.error("Fallback fetch failed:", err2);

          if (!isMounted) return;

          setProperty(null);
          setPageError("Failed to load this property. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      isMounted = false;
    };
  }, [id, normalizeProperty]);

  const propertyId = property?.id ?? property?._id;

  const images = useMemo(() => {
    const normalized = Array.isArray(property?.images) ? property.images : [];
    return normalized.length > 0 ? normalized : [fallbackImage];
  }, [property, fallbackImage]);

  useEffect(() => {
    setMainImageIndex(0);
  }, [propertyId]);

  const safeMainImage = images[mainImageIndex] || fallbackImage;
  const isFav = propertyId ? favorites.includes(propertyId) : false;

  const whatsappNumber = property?.whatsapp
    ? String(property.whatsapp).replace(/\D/g, "")
    : null;

  const handleFavoriteClick = () => {
    if (!propertyId) return;

    if (!currentUser) {
      setPageError("Please log in to save properties.");
      return;
    }

    setPageError("");
    toggleFav(propertyId);
  };

  const displayPrice = () => {
    if (!property) return "Price not available";

    if (property.purpose === "buy" && Number(property.price) > 0) {
      return formatMoney(property.price);
    }

    if (property.purpose === "rent" && Number(property.rent_price) > 0) {
      return `${formatMoney(property.rent_price)} / month`;
    }

    return "Price not available";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-md w-full">
          <p className="text-gray-700 font-medium">
            {pageError || "Property not found."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <button
            onClick={() => navigate("/")}
            className="mb-4 inline-flex items-center text-blue-600 hover:underline"
          >
            ← Back to listings
          </button>

          {pageError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{pageError}</p>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
              {property.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 capitalize">
                {property.purpose}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {property.type}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {displayPrice()}
              </span>
            </div>

            <div className="mb-5">
              <img
                src={safeMainImage}
                alt={property.title}
                className="mb-3 h-72 w-full rounded-xl object-cover sm:h-96"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />

              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <img
                    key={`${img}-${i}`}
                    src={img}
                    alt={`Property ${i + 1}`}
                    onClick={() => setMainImageIndex(i)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                    className={`h-20 w-24 flex-shrink-0 cursor-pointer rounded-lg object-cover border-2 transition ${
                      i === mainImageIndex
                        ? "border-blue-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
              <p><strong>District:</strong> {property.district}</p>
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
              <p><strong>Size:</strong> {property.size ? `${property.size} m²` : "N/A"}</p>
              <p><strong>Listing Type:</strong> <span className="capitalize">{property.purpose}</span></p>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Description</h3>
              <p className="leading-7 text-gray-700">
                {property.description || "No description provided."}
              </p>
            </div>

            <button
              onClick={handleFavoriteClick}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                isFav
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {isFav ? "Saved" : "Save property"}
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Contact Agent
            </h3>

            {property.agent_name && (
              <p className="mb-3 text-sm font-semibold text-gray-900">
                {property.agent_name}
              </p>
            )}

            <div className="flex flex-col gap-2">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  WhatsApp
                </a>
              )}

              {property.phone && (
                <a
                  href={`tel:${property.phone}`}
                  className="flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  Call {property.phone}
                </a>
              )}
            </div>

            {!property.phone && !whatsappNumber && (
              <p className="mt-3 text-xs text-gray-400">
                No contact details provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}