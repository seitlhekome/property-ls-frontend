import React from "react";
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
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAgent = currentUser?.role === "agent";
  const isDashboardPage = location.pathname === "/agent/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div
          className="cursor-pointer"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/");
            }
          }}
        >
          <h1 className="text-3xl font-bold text-blue-600">Property LS</h1>
          <p className="text-sm text-gray-500">Lesotho Real Estate</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab && setActiveTab("buy")}
              className={`px-4 py-2 rounded ${
                activeTab === "buy"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Buy
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab("rent")}
              className={`px-4 py-2 rounded ${
                activeTab === "rent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Rent
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by title or location"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-64"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => setShowCalculator && setShowCalculator(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Calculator
          </button>

          <button
            onClick={() =>
              navigate("/map", { state: { properties: filteredProperties } })
            }
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Map
          </button>

          {currentUser ? (
            <>
              {isAgent && !isDashboardPage && (
                <button
                  onClick={() => navigate("/agent/dashboard")}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Dashboard
                </button>
              )}

              {isAgent && (
                <button
                  onClick={() => setShowListModal && setShowListModal(true)}
                  className="px-3 py-2 border border-blue-600 text-blue-600 rounded"
                >
                  List Property
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-2 border border-gray-400 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal && setShowAuthModal(true)}
              className="px-3 py-2 border border-blue-600 text-blue-600 rounded"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}