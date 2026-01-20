import React from "react";

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
  userRoleLoading, // Loading flag to show agent actions only after role is known
}) {
  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Property LS</h1>
          <p className="text-gray-500 text-sm">Lesotho Real Estate</p>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "buy"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("buy")}
            >
              Buy
            </button>

            <button
              className={`px-4 py-2 rounded font-medium ${
                activeTab === "rent"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab("rent")}
            >
              Rent
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-64"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Always show calculator */}
          <button
            onClick={() => setShowCalculator(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Calculator
          </button>

          {/* User logged in */}
          {currentUser ? (
            <>
              {/* Agent-only: show List Property button if role loaded */}
              {currentUser.role === "agent" && !userRoleLoading && (
                <button
                  onClick={() => setShowListModal(true)}
                  className="px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  List Property
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
