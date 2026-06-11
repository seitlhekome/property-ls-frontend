import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({
  currentUser,
  setShowCalculator,
  setShowAuthModal,
  setShowListModal,
  handleLogout,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  filteredProperties,
  filters,
  setFilters,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showFilters, setShowFilters] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const currentRole = (
    currentUser?.role ||
    currentUser?.user?.role ||
    currentUser?.accountType ||
    currentUser?.user?.accountType ||
    ""
  )
    .toString()
    .toLowerCase()
    .trim();

  const isAgent =
    currentRole === "agent" ||
    currentRole === "admin" ||
    currentRole === "seller" ||
    currentRole === "property_agent";

  const userName =
    currentUser?.name ||
    currentUser?.user?.name ||
    currentUser?.full_name ||
    currentUser?.user?.full_name ||
    "Account";

  const isAgentDashboardPage = location.pathname === "/agent/dashboard";
  const isBuyerDashboardPage = location.pathname === "/dashboard";
  const isSavedPropertiesPage = location.pathname === "/saved-properties";
  const isHomePage = location.pathname === "/";

  const primaryButtonClass =
    "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700";

  const secondaryButtonClass =
    "rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50";

  const neutralButtonClass =
    "rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50";

  const infoBadgeClass =
    "rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700";

  const fieldClass =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const clearFilters = () => {
    if (setFilters) {
      setFilters({
        district: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
      });
    }

    if (setSearchQuery) {
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between xl:flex-1">
            <div
              className="cursor-pointer text-center lg:text-left shrink-0"
              onClick={() => navigate("/")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/");
                }
              }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-blue-600">
                Property LS
              </h1>
              <p className="text-sm text-gray-500">Lesotho Real Estate</p>
            </div>

            {isHomePage && (
              <div className="flex w-full flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center lg:justify-center">
                <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setActiveTab && setActiveTab("rent")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      activeTab === "rent"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-white"
                    }`}
                  >
                    Rent
                  </button>

                  <button
                    onClick={() => setActiveTab && setActiveTab("buy")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      activeTab === "buy"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-white"
                    }`}
                  >
                    Buy
                  </button>
                </div>

                <div className="relative flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
                  <input
                    type="text"
                    placeholder="Search by title, district, or location"
                    value={searchQuery || ""}
                    onChange={(e) =>
                      setSearchQuery && setSearchQuery(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`${secondaryButtonClass} flex items-center justify-center gap-2`}
                  >
                    <span>Filter</span>
                    <span className="text-xs">{showFilters ? "▲" : "▼"}</span>
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:w-[460px]">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            Advanced Filters
                          </p>
                          <p className="text-xs text-gray-500">
                            Narrow down properties quickly
                          </p>
                        </div>

                        <button
                          onClick={clearFilters}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            District
                          </label>

                          <select
                            value={filters?.district || ""}
                            onChange={(e) =>
                              setFilters &&
                              setFilters((prev) => ({
                                ...prev,
                                district: e.target.value,
                              }))
                            }
                            className={fieldClass}
                          >
                            <option value="">All Districts</option>
                            <option value="Maseru">Maseru</option>
                            <option value="Butha Buthe">Butha Buthe</option>
                            <option value="Leribe">Leribe</option>
                            <option value="Berea">Berea</option>
                            <option value="Mafeteng">Mafeteng</option>
                            <option value="Mohale's Hoek">Mohale's Hoek</option>
                            <option value="Quthing">Quthing</option>
                            <option value="Qacha's Neck">Qacha's Neck</option>
                            <option value="Thaba Tseka">Thaba Tseka</option>
                            <option value="Mokhotlong">Mokhotlong</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Property Type
                          </label>

                          <select
                            value={filters?.type || ""}
                            onChange={(e) =>
                              setFilters &&
                              setFilters((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            className={fieldClass}
                          >
                            <option value="">All Types</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Land">Land</option>
                            <option value="Guesthouse">Guesthouse</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Min Price
                          </label>

                          <input
                            type="number"
                            value={filters?.minPrice || ""}
                            onChange={(e) =>
                              setFilters &&
                              setFilters((prev) => ({
                                ...prev,
                                minPrice: e.target.value,
                              }))
                            }
                            placeholder="M 0"
                            className={fieldClass}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Max Price
                          </label>

                          <input
                            type="number"
                            value={filters?.maxPrice || ""}
                            onChange={(e) =>
                              setFilters &&
                              setFilters((prev) => ({
                                ...prev,
                                maxPrice: e.target.value,
                              }))
                            }
                            placeholder="M 500000"
                            className={fieldClass}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Bedrooms
                          </label>

                          <select
                            value={filters?.bedrooms || ""}
                            onChange={(e) =>
                              setFilters &&
                              setFilters((prev) => ({
                                ...prev,
                                bedrooms: e.target.value,
                              }))
                            }
                            className={fieldClass}
                          >
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                          {filteredProperties?.length || 0} properties found
                        </p>

                        <button
                          onClick={() => setShowFilters(false)}
                          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-end">
            {currentUser && (
              <div className={infoBadgeClass}>
                Welcome,{" "}
                <span className="font-semibold text-blue-700">{userName}</span>
              </div>
            )}

            <button
              onClick={() => setShowCalculator && setShowCalculator(true)}
              className={primaryButtonClass}
            >
              Calculator
            </button>

            <button
              onClick={() =>
                navigate("/map", { state: { properties: filteredProperties } })
              }
              className={secondaryButtonClass}
            >
              Map
            </button>

            {installPrompt && (
              <button onClick={handleInstallApp} className={primaryButtonClass}>
                📱 Install App
              </button>
            )}

            {currentUser ? (
              <>
                {isAgent ? (
                  <>
                    {!isAgentDashboardPage && (
                      <button
                        onClick={() => navigate("/agent/dashboard")}
                        className={primaryButtonClass}
                      >
                        Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => setShowListModal && setShowListModal(true)}
                      className={secondaryButtonClass}
                    >
                      List Property
                    </button>
                  </>
                ) : (
                  <>
                    {!isBuyerDashboardPage && (
                      <button
                        onClick={() => navigate("/dashboard")}
                        className={primaryButtonClass}
                      >
                        Dashboard
                      </button>
                    )}

                    {!isSavedPropertiesPage && (
                      <button
                        onClick={() => navigate("/saved-properties")}
                        className={secondaryButtonClass}
                      >
                        Saved
                      </button>
                    )}
                  </>
                )}

                <button onClick={handleLogout} className={neutralButtonClass}>
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal && setShowAuthModal(true)}
                className={secondaryButtonClass}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}