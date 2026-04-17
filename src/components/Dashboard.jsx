import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListModal from "./ListModal";
import { API_URL } from "../config";

export default function Dashboard({
  currentUser,
  setShowListModal,
  favorites = [],
}) {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);

  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  const getCurrentUserId = () =>
    currentUser?.id ||
    currentUser?.user?.id ||
    currentUser?._id ||
    currentUser?.user?._id ||
    null;

  const getCurrentUserName = () =>
    currentUser?.name ||
    currentUser?.user?.name ||
    currentUser?.full_name ||
    currentUser?.user?.full_name ||
    "User";

  const getCurrentUserRole = () =>
    (
      currentUser?.role ||
      currentUser?.user?.role ||
      currentUser?.accountType ||
      currentUser?.user?.accountType ||
      ""
    )
      .toString()
      .toLowerCase()
      .trim();

  const getCurrentUserEmail = () =>
    currentUser?.email || currentUser?.user?.email || "";

  const getCurrentUserPhone = () =>
    currentUser?.phone || currentUser?.user?.phone || "";

  const getCurrentUserWhatsapp = () =>
    currentUser?.whatsapp || currentUser?.user?.whatsapp || "";

  const isAgent = useMemo(() => {
    const role = getCurrentUserRole();
    return (
      role === "agent" ||
      role === "admin" ||
      role === "seller" ||
      role === "property_agent"
    );
  }, [currentUser]);

  const [activeDataView, setActiveDataView] = useState("saved");

  useEffect(() => {
    setActiveDataView(isAgent ? "all" : "saved");
  }, [isAgent]);

  useEffect(() => {
    if (!currentUser) return;

    setProfileForm({
      name: getCurrentUserName(),
      email: getCurrentUserEmail(),
      phone: getCurrentUserPhone(),
      whatsapp: getCurrentUserWhatsapp(),
    });
  }, [currentUser]);

  const fallbackImage =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="24" font-family="Arial, sans-serif">
          No Image
        </text>
      </svg>
    `);

  const normalizeImages = (images) => {
    try {
      let parsed = images;

      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!Array.isArray(parsed)) return [];

      return parsed;
    } catch (error) {
      console.error("Failed to normalize images:", error);
      return [];
    }
  };

  const getImageUrl = (images) => {
    const normalized = normalizeImages(images);

    if (!normalized.length) return fallbackImage;

    const firstImage = normalized[0];

    if (typeof firstImage === "string" && firstImage.trim()) {
      return firstImage;
    }

    if (firstImage && typeof firstImage === "object" && firstImage.url) {
      return firstImage.url;
    }

    return fallbackImage;
  };

  const getPropertyId = useCallback((prop) => prop?._id || prop?.id, []);

  const fetchProperties = useCallback(async () => {
    const userId = getCurrentUserId();

    setLoadingProps(true);

    try {
      const res = await axios.get(`${API_URL}/properties`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const fetchedProperties = Array.isArray(res.data) ? res.data : [];
      setAllProperties(fetchedProperties);

      if (!userId) {
        setMyProperties([]);
        return;
      }

      const filtered = fetchedProperties.filter(
        (p) =>
          String(p.agent_id ?? p.agentId ?? p.user_id ?? p.userId ?? "") ===
          String(userId)
      );

      setMyProperties(filtered);
    } catch (err) {
      console.error("Fetch properties failed:", err);
      alert("Failed to load properties");
      setAllProperties([]);
      setMyProperties([]);
    } finally {
      setLoadingProps(false);
    }
  }, [currentUser, token]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const savedProperties = useMemo(() => {
    return allProperties.filter((prop) =>
      favorites.some((favId) => String(favId) === String(getPropertyId(prop)))
    );
  }, [allProperties, favorites, getPropertyId]);

  const handleDelete = async (prop) => {
    const propId = prop._id || prop.id;

    if (!propId) {
      alert("Invalid property ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) return;

    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      await axios.delete(`${API_URL}/properties/${propId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyProperties((prev) =>
        prev.filter((p) => String(p._id || p.id) !== String(propId))
      );

      setAllProperties((prev) =>
        prev.filter((p) => String(p._id || p.id) !== String(propId))
      );

      alert("Property deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || "Failed to delete property");
    }
  };

  const handleEdit = (prop) => {
    setEditProp(prop);
    setShowEditModal(true);
  };

  const updateProp = async (propData, imageFiles = []) => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      const formData = new FormData();

      const cleanValue = (value) => {
        if (Array.isArray(value)) return value[0] ?? "";
        return value ?? "";
      };

      if (Array.isArray(imageFiles) && imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append("images", file));
      }

      Object.keys(propData).forEach((key) => {
        if (key === "images") return;
        if (key === "_id") return;

        if (key === "removedExistingImages") {
          formData.append(
            "removedExistingImages",
            JSON.stringify(Array.isArray(propData[key]) ? propData[key] : [])
          );
          return;
        }

        formData.append(key, cleanValue(propData[key]));
      });

      if (!propData.agent_id && !propData.agentId) {
        formData.append("agent_id", getCurrentUserId() || "");
      }

      await axios.put(
        `${API_URL}/properties/${propData.id || propData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Property updated successfully");
      setShowEditModal(false);
      setEditProp(null);
      fetchProperties();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.error || "Failed to update property");
    }
  };

  const handleProfileUpdate = async () => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

    if (!profileForm.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!profileForm.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/auth/update-profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUserFromApi = res.data?.user;

      if (updatedUserFromApi) {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          const updatedUser = {
            ...parsedUser,
            ...updatedUserFromApi,
            user: parsedUser.user
              ? {
                  ...parsedUser.user,
                  ...updatedUserFromApi,
                }
              : parsedUser.user,
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

    if (!passwordForm.currentPassword) {
      alert("Current password is required");
      return;
    }

    if (!passwordForm.newPassword) {
      alert("New password is required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(`${API_URL}/auth/change-password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password update failed:", err);
      alert(err.response?.data?.error || "Failed to update password");
    }
  };

  const fmtPrice = (val) => `M ${Number(val || 0).toLocaleString()}`;

  const stats = useMemo(() => {
    const total = myProperties.length;
    const buyCount = myProperties.filter((p) => p.purpose === "buy").length;
    const rentCount = myProperties.filter((p) => p.purpose === "rent").length;
    const savedCount = savedProperties.length;

    return { total, buyCount, rentCount, savedCount };
  }, [myProperties, savedProperties]);

  const displayedProperties = useMemo(() => {
    if (activeDataView === "saved") return savedProperties;
    if (activeDataView === "buy") return myProperties.filter((p) => p.purpose === "buy");
    if (activeDataView === "rent") return myProperties.filter((p) => p.purpose === "rent");
    return myProperties;
  }, [activeDataView, myProperties, savedProperties]);

  const getSectionTitle = () => {
    if (activeDataView === "profile") return "My Profile";
    if (activeDataView === "saved") return "Saved Properties";
    if (activeDataView === "buy") return "For Sale";
    if (activeDataView === "rent") return "For Rent";
    return "My Properties";
  };

  const getSectionText = () => {
    if (activeDataView === "profile") {
      return "Update your profile details and change your password securely.";
    }
    if (activeDataView === "saved") {
      return "These are the properties you have saved. Click any card to open the full property details.";
    }
    if (activeDataView === "buy") {
      return "These are your listed properties that are for sale.";
    }
    if (activeDataView === "rent") {
      return "These are your listed properties that are for rent.";
    }
    return "View, edit, and manage the properties you have listed.";
  };

  const openProperty = (prop) => {
    const id = getPropertyId(prop);
    if (!id) return;

    navigate(`/property/${id}`, {
      state: { selectedProperty: prop },
    });
  };

  const StatCard = ({ title, value, stateKey }) => (
    <button
      type="button"
      onClick={() => setActiveDataView(stateKey)}
      className={`w-full rounded-xl border p-5 shadow-sm text-left transition ${
        activeDataView === stateKey
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 mt-1">{value}</h2>
    </button>
  );

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-pulse"
        >
          <div className="w-full h-52 bg-gray-200" />
          <div className="p-5">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
              <div className="h-10 bg-gray-200 rounded-lg flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              {isAgent ? "Agent Dashboard" : "Buyer Dashboard"}
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{getCurrentUserName()}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {isAgent
                ? "Manage your property listings, update details, and keep your portfolio current."
                : "View the properties you have saved and quickly open the ones you want to revisit."}
            </p>
          </div>

          {isAgent ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/")}
                className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                Go to Homepage
              </button>

              <button
                onClick={() => setActiveDataView("profile")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-100"
              >
                Edit Profile
              </button>

              <button
                onClick={() => setShowListModal(true)}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                + List New Property
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Browse More
              </button>

              <button
                onClick={() => setActiveDataView("profile")}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-100"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {isAgent ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Listings" value={stats.total} stateKey="all" />
          <StatCard title="For Sale" value={stats.buyCount} stateKey="buy" />
          <StatCard title="For Rent" value={stats.rentCount} stateKey="rent" />
          <StatCard title="Saved Properties" value={stats.savedCount} stateKey="saved" />
          <StatCard title="My Profile" value="Edit" stateKey="profile" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Saved Properties"
            value={stats.savedCount}
            stateKey="saved"
          />
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Quick Access</p>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Your Favourites</h2>
            <p className="text-sm text-gray-500 mt-2">
              Keep track of the homes and rentals you liked most.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Browse More</p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Homepage
            </button>
          </div>
          <StatCard title="My Profile" value="Edit" stateKey="profile" />
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{getSectionTitle()}</h2>
        <p className="text-sm text-gray-500 mt-1">{getSectionText()}</p>
      </div>

      {activeDataView === "profile" ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">WhatsApp</label>
              <input
                type="text"
                value={profileForm.whatsapp}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, whatsapp: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Profile
          </button>

          <hr className="my-8" />

          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            className="mt-4 bg-slate-700 text-white px-5 py-2 rounded-lg hover:bg-slate-800"
          >
            Update Password
          </button>
        </div>
      ) : loadingProps ? (
        renderSkeletons()
      ) : displayedProperties.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {activeDataView === "saved"
              ? "No saved properties yet"
              : "No properties found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {activeDataView === "saved"
              ? "Save properties from the homepage, and they will appear here with real details."
              : "Try another dashboard section or add a new property listing."}
          </p>

          {activeDataView === "saved" ? (
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Properties
            </button>
          ) : (
            isAgent && (
              <button
                onClick={() => setShowListModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                List Property
              </button>
            )
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedProperties.map((prop) => {
            const id = prop._id || prop.id;
            const imageUrl = getImageUrl(prop.images);
            const isSavedView = activeDataView === "saved";

            return (
              <div
                key={`${activeDataView}-${id}`}
                className={`bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col ${
                  isSavedView ? "cursor-pointer" : ""
                }`}
                onClick={isSavedView ? () => openProperty(prop) : undefined}
              >
                <img
                  src={imageUrl}
                  alt={prop.title || "Property"}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {prop.title || "Untitled Property"}
                    </h3>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        prop.purpose === "buy"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {prop.purpose === "buy" ? "For Sale" : "For Rent"}
                    </span>
                  </div>

                  <p className="text-blue-600 font-bold text-lg mb-1">
                    {prop.purpose === "buy"
                      ? fmtPrice(prop.price)
                      : `M ${Number(prop.rent_price || 0).toLocaleString()}/month`}
                  </p>

                  <p className="text-sm text-gray-600">
                    {prop.type || "N/A"} • {prop.location || "Unknown location"},{" "}
                    {prop.district || "N/A"}
                  </p>

                  <div className="flex gap-4 text-xs text-gray-500 mt-3">
                    <span>🛏 {prop.bedrooms ?? "-"}</span>
                    <span>🛁 {prop.bathrooms ?? "-"}</span>
                    <span>📐 {prop.size ?? "-"} m²</span>
                  </div>

                  {(prop.phone || prop.whatsapp) && !isSavedView && isAgent && (
                    <p className="text-gray-700 text-sm mt-3">
                      Contact: {prop.phone || ""}
                      {prop.whatsapp ? ` (WhatsApp: ${prop.whatsapp})` : ""}
                    </p>
                  )}

                  <p className="text-gray-400 text-xs mt-3">
                    Posted:{" "}
                    {prop.createdAt || prop.date_posted
                      ? new Date(prop.createdAt || prop.date_posted).toLocaleDateString()
                      : "—"}
                  </p>

                  <div className="mt-auto pt-4 flex gap-2">
                    {isSavedView ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openProperty(prop);
                        }}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                      >
                        View Saved Property
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(prop)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(prop)}
                          className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showEditModal && editProp && isAgent && (
        <ListModal
          newProp={editProp}
          setNewProp={setEditProp}
          listPropBackend={updateProp}
          setShowListModal={setShowEditModal}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}