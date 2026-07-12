import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }) {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c.8-4 3.1-6 6.5-6s5.7 2 6.5 6" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function FilterIcon({ className = "h-5 w-5" }) {
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
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function MapIcon({ className = "h-5 w-5" }) {
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

function HomeIcon({ className = "h-5 w-5" }) {
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
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function CalculatorIcon({ className = "h-5 w-5" }) {
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
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 11h1" />
      <path d="M12 11h1" />
      <path d="M16 11h1" />
      <path d="M8 15h1" />
      <path d="M12 15h1" />
      <path d="M16 15h1" />
      <path d="M8 18h1" />
      <path d="M12 18h5" />
    </svg>
  );
}

function DashboardIcon({ className = "h-5 w-5" }) {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function PlusIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }) {
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
      <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  );
}

function SignInIcon({ className = "h-5 w-5" }) {
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
      <path d="M14 5h5v14h-5" />
      <path d="m10 8-4 4 4 4" />
      <path d="M6 12h9" />
    </svg>
  );
}

function LogOutIcon({ className = "h-5 w-5" }) {
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
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Header                                   */
/* -------------------------------------------------------------------------- */

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

  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const filterRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const isHomePage = location.pathname === "/";
  const isAgentDashboardPage = location.pathname === "/agent/dashboard";
  const isBuyerDashboardPage = location.pathname === "/dashboard";
  const isSavedPropertiesPage = location.pathname === "/saved-properties";

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

  const resultCount = filteredProperties?.length || 0;
  const hasOpenLayer = showMenu || showAccountMenu || showFilters;

  const fieldClass =
    "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const menuItemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700";

  useEffect(() => {
    const dismissed = localStorage.getItem("propertyLsInstallDismissed");

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);

      if (dismissed !== "true") {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setShowInstallBanner(false);
      localStorage.setItem("propertyLsInstallDismissed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!hasOpenLayer) return undefined;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowMenu(false);
        setShowAccountMenu(false);
        setShowFilters(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [hasOpenLayer]);

  useEffect(() => {
    setShowMenu(false);
    setShowAccountMenu(false);
    setShowFilters(false);
  }, [location.pathname]);

  const closeAllMenus = () => {
    setShowMenu(false);
    setShowAccountMenu(false);
    setShowFilters(false);
  };

  const runAndClose = (action) => {
    closeAllMenus();

    window.requestAnimationFrame(() => {
      if (typeof action === "function") {
        action();
      }
    });
  };

  const handleHomeClick = () => {
    runAndClose(() => navigate("/"));
  };

  const handleMapClick = () => {
    runAndClose(() => {
      navigate("/map", {
        state: {
          properties: filteredProperties,
        },
      });
    });
  };

  const handleCalculatorClick = () => {
    runAndClose(() => {
      if (typeof setShowCalculator === "function") {
        setShowCalculator(true);
      }
    });
  };

  const handleDashboardClick = () => {
    runAndClose(() => {
      navigate(isAgent ? "/agent/dashboard" : "/dashboard");
    });
  };

  const handleListPropertyClick = () => {
    if (!currentUser) {
      runAndClose(() => {
        if (typeof setShowAuthModal === "function") {
          setShowAuthModal(true);
        }
      });
      return;
    }

    if (!isAgent) {
      return;
    }

    runAndClose(() => {
      if (typeof setShowListModal === "function") {
        setShowListModal(true);
      }
    });
  };

  const handleSavedPropertiesClick = () => {
    runAndClose(() => navigate("/saved-properties"));
  };

  const handleSignInClick = () => {
    runAndClose(() => {
      if (typeof setShowAuthModal === "function") {
        setShowAuthModal(true);
      }
    });
  };

  const handleLogoutClick = () => {
    runAndClose(() => {
      if (typeof handleLogout === "function") {
        handleLogout();
      }
    });
  };

  const clearFilters = () => {
    if (typeof setFilters === "function") {
      setFilters({
        district: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        bedrooms: "",
      });
    }

    if (typeof setSearchQuery === "function") {
      setSearchQuery("");
    }
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setInstallPrompt(null);
      setShowInstallBanner(false);
      localStorage.setItem("propertyLsInstallDismissed", "true");
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("propertyLsInstallDismissed", "true");
  };

  return (
    <>
      {hasOpenLayer && (
        <button
          type="button"
          aria-label="Close open menu"
          className="fixed inset-0 z-40 cursor-default bg-black/10 backdrop-blur-[1px]"
          onPointerDown={(event) => {
            event.preventDefault();
            closeAllMenus();
          }}
        />
      )}

      {/* Compact top navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-[64px] max-w-7xl grid-cols-[42px_1fr_42px] items-center px-4 sm:h-[68px] sm:grid-cols-[44px_1fr_44px] sm:px-6">
          {/* Hamburger menu */}
          <div ref={menuRef} className="relative justify-self-start">
            <button
              type="button"
              onClick={() => {
                setShowMenu((previous) => !previous);
                setShowAccountMenu(false);
                setShowFilters(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label={
                showMenu ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={showMenu}
            >
              {showMenu ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>

            {showMenu && (
              <div className="absolute left-0 top-11 z-[70] w-64 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl sm:top-12"
                onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleHomeClick}
                  className={menuItemClass}
                >
                  <HomeIcon />
                  Home
                </button>

                <button
                  type="button"
                  onClick={handleMapClick}
                  className={menuItemClass}
                >
                  <MapIcon />
                  Explore Map
                </button>

                <button
                  type="button"
                  onClick={handleCalculatorClick}
                  className={menuItemClass}
                >
                  <CalculatorIcon />
                  Property Calculator
                </button>

                {currentUser ? (
                  <>
                    <div className="my-2 border-t border-gray-100" />

                    {!(
                      isAgent ? isAgentDashboardPage : isBuyerDashboardPage
                    ) && (
                      <button
                        type="button"
                        onClick={handleDashboardClick}
                        className={menuItemClass}
                      >
                        <DashboardIcon />
                        Dashboard
                      </button>
                    )}

                    {isAgent && (
                      <button
                        type="button"
                        onClick={handleListPropertyClick}
                        className={menuItemClass}
                      >
                        <PlusIcon />
                        List Property
                      </button>
                    )}

                    {!isSavedPropertiesPage && !isAgent && (
                      <button
                        type="button"
                        onClick={handleSavedPropertiesClick}
                        className={menuItemClass}
                      >
                        <HeartIcon />
                        Saved Properties
                      </button>
                    )}

                    <div className="my-2 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOutIcon />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="my-2 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={handleSignInClick}
                      className={menuItemClass}
                    >
                      <SignInIcon />
                      Sign In
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Centred brand */}
          <button
            type="button"
            onClick={handleHomeClick}
            className="justify-self-center text-center focus:outline-none"
            aria-label="Go to Property LS home"
          >
            <span className="block text-xl font-bold leading-tight tracking-tight text-blue-600 sm:text-2xl">
              Property LS
            </span>

            <span className="mt-0.5 block text-[11px] leading-none text-gray-500 sm:text-xs">
              Lesotho Real Estate
            </span>
          </button>

          {/* Profile button */}
          <div ref={accountRef} className="relative justify-self-end">
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                setShowFilters(false);

                if (!currentUser) {
                  handleSignInClick();
                  return;
                }

                setShowAccountMenu((previous) => !previous);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-10 sm:w-10 sm:rounded-xl ${
                currentUser
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
              }`}
              aria-label={currentUser ? "Open account menu" : "Sign in"}
              aria-expanded={showAccountMenu}
            >
              <UserIcon className="h-5 w-5" />
            </button>

            {currentUser && showAccountMenu && (
              <div className="absolute right-0 top-11 z-[70] w-64 max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl sm:top-12"
                onPointerDown={(event) => event.stopPropagation()}>
                <div className="mb-2 rounded-xl bg-gray-50 px-3 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Signed in as
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                    {userName}
                  </p>

                  <p className="mt-0.5 text-xs capitalize text-gray-500">
                    {currentRole || "user"}
                  </p>
                </div>

                {!(
                  isAgent ? isAgentDashboardPage : isBuyerDashboardPage
                ) && (
                  <button
                    type="button"
                    onClick={handleDashboardClick}
                    className={menuItemClass}
                  >
                    <DashboardIcon />
                    Dashboard
                  </button>
                )}

                {isAgent && (
                  <button
                    type="button"
                    onClick={handleListPropertyClick}
                    className={menuItemClass}
                  >
                    <PlusIcon />
                    List Property
                  </button>
                )}

                {!isSavedPropertiesPage && !isAgent && (
                  <button
                    type="button"
                    onClick={handleSavedPropertiesClick}
                    className={menuItemClass}
                  >
                    <HeartIcon />
                    Saved Properties
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleMapClick}
                  className={menuItemClass}
                >
                  <MapIcon />
                  Explore Map
                </button>

                <button
                  type="button"
                  onClick={handleCalculatorClick}
                  className={menuItemClass}
                >
                  <CalculatorIcon />
                  Calculator
                </button>

                <div className="my-2 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOutIcon />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Homepage controls */}
      {isHomePage && (
        <section className="border-b border-gray-100 bg-gradient-to-b from-blue-50/70 to-white">
          <div className="mx-auto max-w-5xl px-4 pb-2.5 pt-2.5 sm:px-6 sm:pb-4 sm:pt-4">
            {/* Compact Rent / Buy selector */}
            <div className="mx-auto grid w-full max-w-[210px] grid-cols-2 rounded-[10px] bg-gray-100 p-[3px] sm:max-w-[260px] sm:rounded-xl sm:p-1">
              <button
                type="button"
                onClick={() => {
                  if (typeof setActiveTab === "function") {
                    setActiveTab("rent");
                  }
                }}
                className={`h-[30px] rounded-lg text-xs font-semibold transition sm:h-9 sm:text-sm ${
                  activeTab === "rent"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                Rent
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof setActiveTab === "function") {
                    setActiveTab("buy");
                  }
                }}
                className={`h-[30px] rounded-lg text-xs font-semibold transition sm:h-9 sm:text-sm ${
                  activeTab === "buy"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }`}
              >
                Buy
              </button>
            </div>

            {/* Centred Map / Search / Filter controls */}
            <div className="mx-auto mt-2.5 flex w-full max-w-[360px] items-center justify-center gap-2 sm:mt-3 sm:grid sm:max-w-[620px] sm:grid-cols-[92px_minmax(0,1fr)_92px] sm:gap-3">
              {/* Map button */}
              <button
                type="button"
                onClick={handleMapClick}
                className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-blue-600 bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-11 sm:w-full sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-sm sm:font-semibold"
                aria-label="View properties on map"
                title="View map"
              >
                <MapIcon className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" />

                <span className="hidden sm:inline">Map</span>
              </button>

              {/* Search input */}
              <div className="relative w-[230px] min-w-0 sm:w-full">
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-gray-400 sm:left-3 sm:h-5 sm:w-5" />

                <input
                  type="search"
                  placeholder="Search location or title"
                  value={searchQuery || ""}
                  onChange={(event) => {
                    if (typeof setSearchQuery === "function") {
                      setSearchQuery(event.target.value);
                    }
                  }}
                  className="h-[38px] w-full rounded-[10px] border border-gray-300 bg-white pl-8 pr-2.5 text-xs text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:h-11 sm:rounded-xl sm:pl-10 sm:pr-3 sm:text-sm sm:focus:ring-4"
                />
              </div>

              {/* Filter button and panel */}
              <div ref={filterRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowFilters((previous) => !previous);
                    setShowMenu(false);
                    setShowAccountMenu(false);
                  }}
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border transition focus:outline-none focus:ring-4 focus:ring-blue-100 sm:h-11 sm:w-full sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-sm sm:font-semibold ${
                    showFilters
                      ? "border-blue-600 bg-blue-100 text-blue-700"
                      : "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100"
                  }`}
                  aria-expanded={showFilters}
                  aria-label="Open property filters"
                  title="Property filters"
                >
                  <FilterIcon className="h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5" />

                  <span className="hidden sm:inline">Filter</span>
                </button>

                {showFilters && (
                  <div className="fixed left-4 right-4 top-[118px] z-[70] max-h-[calc(100vh-8.5rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-[520px] sm:overflow-visible sm:p-5"
                    onPointerDown={(event) => event.stopPropagation()}>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-950">
                          Refine your search
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Choose the details that matter most.
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                        >
                          Clear all
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowFilters(false)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                          aria-label="Close filters"
                        >
                          <CloseIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          District
                        </label>

                        <select
                          value={filters?.district || ""}
                          onChange={(event) => {
                            if (typeof setFilters === "function") {
                              setFilters((previous) => ({
                                ...previous,
                                district: event.target.value,
                              }));
                            }
                          }}
                          className={fieldClass}
                        >
                          <option value="">All districts</option>
                          <option value="Maseru">Maseru</option>
                          <option value="Butha Buthe">Butha Buthe</option>
                          <option value="Leribe">Leribe</option>
                          <option value="Berea">Berea</option>
                          <option value="Mafeteng">Mafeteng</option>
                          <option value="Mohale's Hoek">
                            Mohale&apos;s Hoek
                          </option>
                          <option value="Quthing">Quthing</option>
                          <option value="Qacha's Neck">
                            Qacha&apos;s Neck
                          </option>
                          <option value="Thaba Tseka">Thaba Tseka</option>
                          <option value="Mokhotlong">Mokhotlong</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Property type
                        </label>

                        <select
                          value={filters?.type || ""}
                          onChange={(event) => {
                            if (typeof setFilters === "function") {
                              setFilters((previous) => ({
                                ...previous,
                                type: event.target.value,
                              }));
                            }
                          }}
                          className={fieldClass}
                        >
                          <option value="">All types</option>
                          <option value="House">House</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Land">Land</option>
                          <option value="Guesthouse">Guesthouse</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Minimum price
                        </label>

                        <input
                          type="number"
                          value={filters?.minPrice || ""}
                          onChange={(event) => {
                            if (typeof setFilters === "function") {
                              setFilters((previous) => ({
                                ...previous,
                                minPrice: event.target.value,
                              }));
                            }
                          }}
                          placeholder="M 0"
                          className={fieldClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Maximum price
                        </label>

                        <input
                          type="number"
                          value={filters?.maxPrice || ""}
                          onChange={(event) => {
                            if (typeof setFilters === "function") {
                              setFilters((previous) => ({
                                ...previous,
                                maxPrice: event.target.value,
                              }));
                            }
                          }}
                          placeholder="M 500,000"
                          className={fieldClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                          Bedrooms
                        </label>

                        <select
                          value={filters?.bedrooms || ""}
                          onChange={(event) => {
                            if (typeof setFilters === "function") {
                              setFilters((previous) => ({
                                ...previous,
                                bedrooms: event.target.value,
                              }));
                            }
                          }}
                          className={fieldClass}
                        >
                          <option value="">Any number</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                          <option value="5">5+</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                          {resultCount}
                        </span>{" "}
                        {resultCount === 1 ? "property" : "properties"} found
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowFilters(false)}
                        className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        View results
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile installation banner */}
      {installPrompt && showInstallBanner && (
        <div className="fixed inset-x-0 bottom-4 z-[999] px-4 sm:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-950">
                Get the Property LS app
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                Faster access and a smoother experience.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleInstallApp}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Install
              </button>

              <button
                type="button"
                onClick={dismissInstallBanner}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Dismiss install banner"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}