import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */

function ArrowLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function HeartIcon({ className = "h-4 w-4", filled = false }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  );
}

function LocationIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BedIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18v-6" />
      <path d="M21 18v-6" />
      <path d="M3 14h18" />
      <path d="M5 14V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
      <path d="M11 14v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
      <path d="M3 18v2" />
      <path d="M21 18v2" />
    </svg>
  );
}

function BathIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 13h16" />
      <path d="M5 13v2a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-2" />
      <path d="M7 13V6.5A2.5 2.5 0 0 1 9.5 4 2.5 2.5 0 0 1 12 6.5" />
      <path d="M10 7h4" />
      <path d="M7 20v1" />
      <path d="M17 20v1" />
    </svg>
  );
}

function AreaIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9V4h5" />
      <path d="M15 4h5v5" />
      <path d="M20 15v5h-5" />
      <path d="M9 20H4v-5" />
      <path d="m4 4 6 6" />
      <path d="m20 4-6 6" />
      <path d="m20 20-6-6" />
      <path d="m4 20 6-6" />
    </svg>
  );
}

function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
      <path d="M8.8 8.2c.5 2.7 2.5 4.7 5.2 5.2" />
      <path d="m8.8 8.2-1.2.7" />
      <path d="m14 13.4 1.1-1.1" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2C9.7 21 3 14.3 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Property Detail                               */
/* -------------------------------------------------------------------------- */

export default function PropertyDetail({
  favorites = [],
  toggleFav,
  currentUser,
}) {
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

          if (
            img &&
            typeof img === "object" &&
            typeof img.url === "string" &&
            img.url.trim()
          ) {
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

  const normalizeProperty = useCallback(
    (raw) => {
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
        date_posted:
          raw.date_posted ||
          raw.createdAt ||
          raw.created_at ||
          raw.datePosted ||
          "",
      };
    },
    [normalizeImages]
  );

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
            (p) => String(p.id) === String(id) || String(p._id) === String(id)
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

  const isSaved = propertyId
    ? favorites.some((favId) => String(favId) === String(propertyId))
    : false;

  const isLoggedIn = !!currentUser;
  const hasMultipleImages = images.length > 1;

  const whatsappNumber = property?.whatsapp
    ? String(property.whatsapp).replace(/\D/g, "")
    : null;

  const handleFavoriteClick = (event) => {
    if (event) event.stopPropagation();
    if (!propertyId || typeof toggleFav !== "function") return;

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

  const goToPreviousImage = () => {
    setMainImageIndex((previous) =>
      previous === 0 ? images.length - 1 : previous - 1
    );
  };

  const goToNextImage = () => {
    setMainImageIndex((previous) =>
      previous === images.length - 1 ? 0 : previous + 1
    );
  };

  const getPostedDate = () => {
    if (!property?.date_posted) return null;

    const parsed = new Date(property.date_posted);

    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleDateString();
  };

  const postedDate = getPostedDate();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="font-medium text-gray-700">
            {pageError || "Property not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeftIcon />
            Back to listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-6 lg:px-6">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to listings
      </button>

      {pageError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{pageError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <main className="min-w-0">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    {property.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                      {property.purpose}
                    </span>

                    <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      {property.type}
                    </span>
                  </div>
                </div>

                <p className="shrink-0 text-xl font-bold text-blue-600 sm:text-2xl">
                  {displayPrice()}
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-5">
              <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={safeMainImage}
                  alt={property.title}
                  className="h-72 w-full object-cover sm:h-[420px]"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />

                {hasMultipleImages && (
                  <>
                    <button
                      type="button"
                      onClick={goToPreviousImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white"
                      aria-label="Next image"
                    >
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-3 right-3 rounded-full bg-gray-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      {mainImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {hasMultipleImages && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, index) => (
                    <button
                      type="button"
                      key={`${img}-${index}`}
                      onClick={() => setMainImageIndex(index)}
                      className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        index === mainImageIndex
                          ? "border-blue-600 shadow-sm"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Property ${index + 1}`}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage;
                        }}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <BedIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Bedrooms</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-gray-900">
                    {property.bedrooms}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <BathIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Bathrooms</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-gray-900">
                    {property.bathrooms}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <AreaIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Size</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-gray-900">
                    {property.size ? `${property.size} m²` : "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <LocationIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">District</span>
                  </div>
                  <p className="mt-1.5 truncate text-sm font-semibold text-gray-900">
                    {property.district}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <LocationIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">Location</span>
                  </div>
                  <p className="mt-1.5 truncate text-sm font-semibold text-gray-900">
                    {property.location}
                  </p>
                </div>

                {postedDate && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">Posted</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-gray-900">
                      {postedDate}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <h2 className="text-lg font-semibold text-gray-950">
                  Description
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {property.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    !isLoggedIn
                      ? "bg-gray-100 text-gray-400"
                      : isSaved
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                  aria-label={
                    isSaved ? "Remove saved property" : "Save property"
                  }
                >
                  <HeartIcon
                    className="h-4 w-4"
                    filled={isSaved && isLoggedIn}
                  />
                  {isSaved && isLoggedIn ? "Saved" : "Save property"}
                </button>
              </div>
            </div>
          </section>
        </main>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Contact agent
              </p>

              {property.agent_name && (
                <p className="mt-2 text-sm font-semibold text-gray-950">
                  {property.agent_name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              )}

              {property.phone && (
                <a
                  href={`tel:${property.phone}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                >
                  <PhoneIcon className="h-4 w-4" />
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
        </aside>
      </div>
    </div>
  );
}