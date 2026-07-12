import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */

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

function MapIcon({ className = "h-4 w-4" }) {
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
      <path d="m3.5 6.5 5-2 7 2.5 5-2v13l-5 2-7-2.5-5 2z" />
      <path d="M8.5 4.5v13" />
      <path d="M15.5 7v13" />
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

function ChevronLeftIcon({ className = "h-4 w-4" }) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "h-4 w-4" }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Property List                               */
/* -------------------------------------------------------------------------- */

export default function PropertyList({
  properties = [],
  favorites = [],
  toggleFav,
  fmt,
  setSelectedProperty,
  currentUser,
  loading,
}) {
  const navigate = useNavigate();

  const propertiesPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [properties]);

  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const goToPage = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="#6b7280"
          font-size="28"
          font-family="Arial, sans-serif"
        >
          No Image
        </text>
      </svg>
    `);

  const SkeletonCard = () => (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      style={{
        animation: "propertyListSkeletonFade 1.4s ease-in-out infinite",
      }}
    >
      <div className="h-44 w-full bg-gray-200 sm:h-48" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="h-12 rounded-xl bg-gray-100" />
          <div className="h-12 rounded-xl bg-gray-100" />
          <div className="h-12 rounded-xl bg-gray-100" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="h-8 w-20 rounded-lg bg-gray-200" />
          <div className="h-8 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes propertyListSkeletonFade {
              0%, 100% {
                opacity: 1;
              }

              50% {
                opacity: 0.55;
              }
            }
          `}
        </style>

        <div className="mx-auto grid max-w-7xl gap-5 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </>
    );
  }

  const getImageUrl = (property) => {
    if (!Array.isArray(property?.images) || property.images.length === 0) {
      return fallbackImage;
    }

    const firstImage = property.images[0];

    if (typeof firstImage === "string" && firstImage.trim()) {
      return firstImage;
    }

    if (
      firstImage &&
      typeof firstImage === "object" &&
      typeof firstImage.url === "string" &&
      firstImage.url.trim()
    ) {
      return firstImage.url;
    }

    return fallbackImage;
  };

  const getPropertyId = (property) => property?.id ?? property?._id;

  const getLatLng = (property) => {
    const latitude = property?.lat ?? property?.latitude ?? null;
    const longitude = property?.lng ?? property?.longitude ?? null;

    if (latitude != null && longitude != null) {
      return [latitude, longitude];
    }

    return [-29.3152, 27.4869];
  };

  const getPostedDate = (property) => {
    const rawDate =
      property?.date_posted ||
      property?.createdAt ||
      property?.created_at ||
      property?.datePosted ||
      null;

    if (!rawDate) return null;

    const parsedDate = new Date(rawDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString();
  };

  const formatPrice = (value) => {
    if (typeof fmt === "function") {
      return fmt(value);
    }

    return `M ${Number(value || 0).toLocaleString()}`;
  };

  const getPriceDisplay = (property) => {
    if (property?.purpose === "rent") {
      if (Number(property?.rent_price) > 0) {
        return {
          price: formatPrice(property.rent_price),
          suffix: "/ month",
        };
      }

      return {
        price: "Rent on request",
        suffix: "",
      };
    }

    if (Number(property?.price) > 0) {
      return {
        price: formatPrice(property.price),
        suffix: "",
      };
    }

    return {
      price: "Price on request",
      suffix: "",
    };
  };

  if (properties.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            No properties found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstProperty + 1}-
          {Math.min(indexOfLastProperty, properties.length)} of{" "}
          {properties.length} properties
        </p>

        {totalPages > 1 && (
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {currentProperties.map((property) => {
          const id = getPropertyId(property);
          const image = getImageUrl(property);

          const isSaved = favorites.some(
            (favoriteId) => String(favoriteId) === String(id)
          );

          const isLoggedIn = !!currentUser;
          const postedDate = getPostedDate(property);
          const priceDisplay = getPriceDisplay(property);

          const typeLabel = property?.type || "Property";

          const bedrooms =
            property?.bedrooms !== undefined &&
            property?.bedrooms !== null &&
            property?.bedrooms !== ""
              ? property.bedrooms
              : "—";

          const bathrooms =
            property?.bathrooms !== undefined &&
            property?.bathrooms !== null &&
            property?.bathrooms !== ""
              ? property.bathrooms
              : "—";

          const area =
            property?.size !== undefined &&
            property?.size !== null &&
            property?.size !== ""
              ? `${property.size} m²`
              : "—";

          const handlePropertyOpen = () => {
            if (typeof setSelectedProperty === "function") {
              setSelectedProperty(property);
            }

            navigate(`/property/${id}`, {
              state: {
                selectedProperty: property,
              },
            });
          };

          const handleFavoriteClick = (event) => {
            event.stopPropagation();

            if (typeof toggleFav === "function") {
              toggleFav(id);
            }
          };

          return (
            <article
              key={id}
              role="button"
              tabIndex={0}
              onClick={handlePropertyOpen}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handlePropertyOpen();
                }
              }}
              className="group flex min-h-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
              aria-label={`View details for ${
                property?.title || "this property"
              }`}
            >
              <div className="relative h-44 w-full overflow-hidden bg-gray-100 sm:h-48">
                <img
                  src={image}
                  alt={property?.title || "Property"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </div>

              <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                <div className="flex flex-wrap items-baseline gap-1">
                  <p className="text-[17px] font-bold leading-tight text-blue-600 sm:text-lg">
                    {priceDisplay.price}
                  </p>

                  {priceDisplay.suffix && (
                    <span className="text-xs font-medium text-gray-500">
                      {priceDisplay.suffix}
                    </span>
                  )}
                </div>

                <h3 className="mt-1.5 line-clamp-1 text-[15px] font-semibold leading-snug text-gray-950 sm:text-base">
                  {property?.title || "Untitled Property"}
                </h3>

                <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-500 sm:text-[13px]">
                  <LocationIcon className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                  <p className="min-w-0 truncate">
                    {property?.location || "Unknown location"}
                    {property?.district
                      ? `, ${property.district}`
                      : ", Lesotho"}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-100 bg-gray-50/80 py-2.5">
                  <div className="flex items-center justify-center gap-1.5 px-1.5">
                    <BedIcon className="h-4 w-4 shrink-0 text-gray-500" />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-none text-gray-800">
                        {bedrooms}
                      </p>

                      <p className="mt-1 text-[10px] leading-none text-gray-400">
                        Beds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 px-1.5">
                    <BathIcon className="h-4 w-4 shrink-0 text-gray-500" />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-none text-gray-800">
                        {bathrooms}
                      </p>

                      <p className="mt-1 text-[10px] leading-none text-gray-400">
                        Baths
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 px-1.5">
                    <AreaIcon className="h-4 w-4 shrink-0 text-gray-500" />

                    <div className="min-w-0">
                      <p className="max-w-[72px] truncate text-xs font-semibold leading-none text-gray-800">
                        {area}
                      </p>

                      <p className="mt-1 text-[10px] leading-none text-gray-400">
                        Area
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-3">
                  {postedDate ? (
                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-gray-400">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0" />

                      <span className="truncate">Posted {postedDate}</span>
                    </div>
                  ) : (
                    <span />
                  )}

                  <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                    {typeLabel}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={handleFavoriteClick}
                    className={`inline-flex min-w-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
                      !isLoggedIn
                        ? "bg-gray-50 text-gray-400"
                        : isSaved
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600"
                    }`}
                    aria-label={
                      isSaved
                        ? "Remove saved property"
                        : "Save property"
                    }
                  >
                    <HeartIcon
                      className="h-4 w-4 shrink-0"
                      filled={isSaved && isLoggedIn}
                    />

                    <span>{isSaved ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      navigate("/map", {
                        state: {
                          selectedProperty: property,
                          coords: getLatLng(property),
                        },
                      });
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <MapIcon className="h-4 w-4" />
                    <span>View Map</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mb-6 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition sm:w-auto ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>

          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition sm:w-auto ${
              currentPage === totalPages
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next Listings
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}