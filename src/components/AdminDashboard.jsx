import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import Toast from "./ui/Toast";

const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="#6b7280" font-size="24" font-family="Arial, sans-serif">No Image</text>
    </svg>
  `);

const normaliseImages = (images) => {
  try {
    const parsed = typeof images === "string" ? JSON.parse(images) : images;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getImageUrl = (images) => {
  const first = normaliseImages(images)[0];
  if (typeof first === "string") return first;
  return first?.url || fallbackImage;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const packageLabel = (value) => {
  if (value === "7_days") return "7 days";
  if (value === "14_days") return "14 days";
  return value || "—";
};

const daysRemaining = (endDate) => {
  if (!endDate) return 0;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
};

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  active: "border-blue-200 bg-blue-50 text-blue-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  expired: "border-gray-200 bg-gray-100 text-gray-600",
  cancelled: "border-slate-300 bg-slate-100 text-slate-700",
};


const SvgIcon = ({ children, className = "h-5 w-5", viewBox = "0 0 24 24" }) => (
  <svg
    viewBox={viewBox}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

const HomeIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M3.5 10.5 12 3.5l8.5 7" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M9.5 20v-6h5v6" />
  </SvgIcon>
);

const BuildingIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M5 21V4.8c0-.7.5-1.3 1.2-1.4l9-1.4c.9-.1 1.8.6 1.8 1.5V21" />
    <path d="M3 21h18" />
    <path d="M9 7h.01M13 7h.01M9 11h.01M13 11h.01M9 15h.01M13 15h.01" />
  </SvgIcon>
);

const PlusIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M12 5v14M5 12h14" />
  </SvgIcon>
);

const RefreshIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M20 6v5h-5" />
    <path d="M19 11a7.5 7.5 0 1 0 1 4" />
  </SvgIcon>
);

const OverviewIcon = ({ className }) => (
  <SvgIcon className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </SvgIcon>
);

const PromotionIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M4 13V9l12-4v12L4 13Z" />
    <path d="M8 13.8V18a2 2 0 0 0 2 2h1" />
    <path d="M19 8.5c1 .9 1.5 2 1.5 3.5S20 14.6 19 15.5" />
  </SvgIcon>
);

const ListingsIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M8 6h12M8 12h12M8 18h12" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </SvgIcon>
);

const UsersIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </SvgIcon>
);

const BellIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
  </SvgIcon>
);

const EyeIcon = ({ className }) => (
  <SvgIcon className={className}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </SvgIcon>
);

const StatCard = ({ label, value, hint, onClick, icon: IconComponent, accent = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
      accent ? "border-blue-300 bg-blue-600 text-white" : "border-gray-200 bg-white"
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? "text-blue-100" : "text-gray-500"}`}>
          {label}
        </p>
        <p className={`mt-2 text-3xl font-bold ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
      </div>

      {IconComponent && (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            accent ? "bg-white/15 text-white" : "bg-blue-50 text-blue-600"
          }`}
        >
          <IconComponent className="h-5 w-5" />
        </span>
      )}
    </div>

    <p className={`mt-1 text-xs ${accent ? "text-blue-100" : "text-gray-500"}`}>{hint}</p>
  </button>
);

export default function AdminDashboard({ currentUser, setShowListModal }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeView, setActiveView] = useState("overview");
  const [promotionTab, setPromotionTab] = useState("pending");
  const [promotions, setPromotions] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [publicProperties, setPublicProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [promotionProperty, setPromotionProperty] = useState(null);
  const [promotionDays, setPromotionDays] = useState(7);
  const [toast, setToast] = useState({ open: false, type: "info", title: "", message: "" });

  // Admin management modals
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "user",
    phone: "",
    whatsapp: "",
  });

  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: "",
    purpose: "rent",
    type: "",
    district: "",
    location: "",
    price: "",
    rent_price: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    phone: "",
    whatsapp: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const showToast = (type, title, message) => setToast({ open: true, type, title, message });

  const loadDashboard = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    const requests = [
      {
        key: "promotions",
        request: axios.get(`${API_URL}/properties/admin/promotions`, {
          headers: authHeaders,
        }),
      },
      {
        key: "mine",
        request: axios.get(`${API_URL}/properties/mine`, {
          headers: authHeaders,
        }),
      },
      {
        key: "public",
        request: axios.get(`${API_URL}/properties`),
      },
      {
        key: "users",
        request: axios.get(`${API_URL}/auth/users`, {
          headers: authHeaders,
        }),
      },
    ];

    try {
      const results = await Promise.allSettled(
        requests.map((item) => item.request)
      );

      const failures = [];

      results.forEach((result, index) => {
        const key = requests[index].key;

        if (result.status === "fulfilled") {
          const data = result.value.data;

          if (key === "promotions") {
            setPromotions(
              Array.isArray(data?.promotions) ? data.promotions : []
            );
          }

          if (key === "mine") {
            setMyProperties(Array.isArray(data) ? data : []);
          }

          if (key === "public") {
            setPublicProperties(Array.isArray(data) ? data : []);
          }

          if (key === "users") {
            setUsers(Array.isArray(data) ? data : []);
          }

          return;
        }

        const error = result.reason;
        console.error(`Admin dashboard ${key} load failed:`, error);
        failures.push({ key, error });
      });

      if (failures.length > 0) {
        const firstFailure = failures[0];
        const sectionNames = {
          promotions: "promotion data",
          mine: "your listings",
          public: "public listings",
          users: "registered users",
        };

        showToast(
          "error",
          "Some admin data could not be loaded",
          firstFailure.error?.response?.data?.error ||
            `Unable to load ${sectionNames[firstFailure.key]}.`
        );
      }
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredPromotions = useMemo(
    () => promotions.filter((item) => item.promotion_status === promotionTab),
    [promotions, promotionTab]
  );

  const promotionSummary = useMemo(
    () => ({
      pending: promotions.filter(
        (item) => item.promotion_status === "pending"
      ).length,
      active: promotions.filter(
        (item) => item.promotion_status === "active"
      ).length,
      rejected: promotions.filter(
        (item) => item.promotion_status === "rejected"
      ).length,
      expired: promotions.filter(
        (item) => item.promotion_status === "expired"
      ).length,
      cancelled: promotions.filter(
        (item) => item.promotion_status === "cancelled"
      ).length,
    }),
    [promotions]
  );

  const approvePromotion = async (property) => {
    const id = property.id || property._id;
    try {
      setActionId(`approve-${id}`);
      await axios.put(`${API_URL}/properties/${id}/promotion/approve`, {}, { headers: authHeaders });
      showToast("success", "Promotion approved", `${property.title || "The property"} is now sponsored.`);
      await loadDashboard();
    } catch (error) {
      showToast("error", "Approval failed", error.response?.data?.error || "The request could not be approved.");
    } finally {
      setActionId(null);
    }
  };

  const rejectPromotion = async (property) => {
    const id = property.id || property._id;
    try {
      setActionId(`reject-${id}`);
      await axios.put(`${API_URL}/properties/${id}/promotion/reject`, {}, { headers: authHeaders });
      showToast("success", "Promotion rejected", `${property.title || "The property"} was moved to promotion history.`);
      await loadDashboard();
    } catch (error) {
      showToast("error", "Rejection failed", error.response?.data?.error || "The request could not be rejected.");
    } finally {
      setActionId(null);
    }
  };

  const cancelPromotion = async (property) => {
    const id = property.id || property._id;

    try {
      setActionId(`cancel-${id}`);

      await axios.put(
        `${API_URL}/properties/${id}/promotion/cancel`,
        {},
        { headers: authHeaders }
      );

      showToast(
        "success",
        "Promotion cancelled",
        `${property.title || "The property"} is no longer sponsored.`
      );

      await loadDashboard();
    } catch (error) {
      showToast(
        "error",
        "Cancellation failed",
        error.response?.data?.error ||
          "The active promotion could not be cancelled."
      );
    } finally {
      setActionId(null);
    }
  };

  const promoteOwnProperty = async () => {
    if (!promotionProperty) return;
    const id = promotionProperty.id || promotionProperty._id;
    try {
      setActionId(`promote-${id}`);
      const response = await axios.put(
        `${API_URL}/properties/${id}/promotion/request`,
        { days: Number(promotionDays) },
        { headers: authHeaders }
      );
      setPromotionProperty(null);
      showToast(
        "success",
        response.data?.auto_approved ? "Sponsorship activated" : "Promotion requested",
        response.data?.message || "The promotion was processed successfully."
      );
      await loadDashboard();
    } catch (error) {
      showToast("error", "Promotion failed", error.response?.data?.error || "The promotion could not be processed.");
    } finally {
      setActionId(null);
    }
  };


  // ================= ADMIN USER MANAGEMENT =================

  const openUserEditor = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user?.name || "",
      email: user?.email || "",
      role: String(user?.role || "user").toLowerCase(),
      phone: user?.phone || "",
      whatsapp: user?.whatsapp || "",
    });
  };

  const saveUserChanges = async () => {
    if (!editingUser?.id) return;

    try {
      setActionId(`user-edit-${editingUser.id}`);

      await axios.put(
        `${API_URL}/auth/admin/users/${editingUser.id}`,
        {
          name: userForm.name.trim(),
          email: userForm.email.trim(),
          role: userForm.role,
          phone: userForm.phone.trim(),
          whatsapp: userForm.whatsapp.trim(),
        },
        { headers: authHeaders }
      );

      setEditingUser(null);
      showToast("success", "User updated", "The account details were updated successfully.");
      await loadDashboard();
    } catch (error) {
      showToast(
        "error",
        "Update failed",
        error.response?.data?.error || "The user account could not be updated."
      );
    } finally {
      setActionId(null);
    }
  };

  const deleteUser = async (user) => {
    if (!user?.id) return;

    try {
      setActionId(`user-delete-${user.id}`);

      await axios.delete(`${API_URL}/auth/admin/users/${user.id}`, {
        headers: authHeaders,
      });

      setDeleteTarget(null);
      showToast("success", "User deleted", "The user account was removed.");
      await loadDashboard();
    } catch (error) {
      showToast(
        "error",
        "Delete failed",
        error.response?.data?.error ||
          "The user could not be deleted. Remove or reassign their listings first."
      );
    } finally {
      setActionId(null);
    }
  };

  // ================= ADMIN PROPERTY MANAGEMENT =================

  const openPropertyEditor = (property) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property?.title || "",
      purpose: property?.purpose || "rent",
      type: property?.type || "",
      district: property?.district || "",
      location: property?.location || "",
      price: property?.price ?? "",
      rent_price: property?.rent_price ?? "",
      bedrooms: property?.bedrooms ?? "",
      bathrooms: property?.bathrooms ?? "",
      size: property?.size ?? "",
      description: property?.description || "",
      phone: property?.phone || "",
      whatsapp: property?.whatsapp || "",
    });
  };

  const savePropertyChanges = async () => {
    if (!editingProperty?.id) return;

    try {
      setActionId(`property-edit-${editingProperty.id}`);

      const formData = new FormData();

      Object.entries(propertyForm).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      await axios.put(
        `${API_URL}/properties/${editingProperty.id}`,
        formData,
        {
          headers: {
            ...authHeaders,
          },
        }
      );

      setEditingProperty(null);
      showToast("success", "Property updated", "The listing changes were saved successfully.");
      await loadDashboard();
    } catch (error) {
      showToast(
        "error",
        "Update failed",
        error.response?.data?.error || "The property could not be updated."
      );
    } finally {
      setActionId(null);
    }
  };

  const deleteProperty = async (property) => {
    if (!property?.id) return;

    try {
      setActionId(`property-delete-${property.id}`);

      await axios.delete(`${API_URL}/properties/${property.id}`, {
        headers: authHeaders,
      });

      setDeleteTarget(null);
      showToast("success", "Property deleted", "The listing was permanently removed.");
      await loadDashboard();
    } catch (error) {
      showToast(
        "error",
        "Delete failed",
        error.response?.data?.error || "The property could not be deleted."
      );
    } finally {
      setActionId(null);
    }
  };

  const navItems = [
    ["overview", "Overview", OverviewIcon],
    ["promotions", "Promotion Centre", PromotionIcon],
    ["my-listings", "My Listings", BuildingIcon],
    ["all-listings", "Public Listings", ListingsIcon],
    ["users", "Users", UsersIcon],
  ];

  const adminName = currentUser?.name || currentUser?.user?.name || "Administrator";

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((previous) => ({ ...previous, open: false }))}
      />

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 text-slate-900 shadow-sm">
          <div className="flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-700">
                <BuildingIcon className="h-3.5 w-3.5" />
                Property LS Administration
              </div>
              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Admin Control Centre</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Welcome, {adminName}. Review promotion requests, manage listings and users, and monitor platform activity from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <HomeIcon className="h-4 w-4" />
                View website
              </button>

              <button
                onClick={() => setShowListModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                List property
              </button>

              <button
                onClick={loadDashboard}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshIcon className="h-4 w-4" />
                Refresh data
              </button>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-blue-100 bg-white/75 px-3 py-2 backdrop-blur sm:px-5">
            {navItems.map(([key, label, NavIcon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveView(key)}
                className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeView === key ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <NavIcon className="h-4 w-4" />
                <span>{label}</span>
                {key === "promotions" && Number(promotionSummary.pending) > 0 && (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {promotionSummary.pending}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </header>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Loading administration data…</div>
        ) : (
          <>
            {activeView === "overview" && (
              <div className="mt-6 space-y-6">
                {Number(promotionSummary.pending) > 0 && (
                  <button
                    type="button"
                    onClick={() => { setActiveView("promotions"); setPromotionTab("pending"); }}
                    className="flex w-full flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-amber-900">New promotion requests require your attention</p>
                      <p className="mt-1 text-sm text-amber-700">You have {promotionSummary.pending} pending request{Number(promotionSummary.pending) === 1 ? "" : "s"} to approve or reject.</p>
                    </div>
                    <span className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Review requests</span>
                  </button>
                )}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  <StatCard icon={ListingsIcon} label="Public listings" value={publicProperties.length} hint="Currently visible" onClick={() => setActiveView("all-listings")} />
                  <StatCard icon={UsersIcon} label="Registered users" value={users.length} hint="Platform accounts" onClick={() => setActiveView("users")} />
                  <StatCard icon={BellIcon} label="Pending requests" value={promotionSummary.pending} hint="Need a decision" accent={Number(promotionSummary.pending) > 0} onClick={() => { setActiveView("promotions"); setPromotionTab("pending"); }} />
                  <StatCard icon={PromotionIcon} label="Active promotions" value={promotionSummary.active} hint="Sponsored now" onClick={() => { setActiveView("promotions"); setPromotionTab("active"); }} />
                  <StatCard icon={BuildingIcon} label="My listings" value={myProperties.length} hint="Admin-owned properties" onClick={() => setActiveView("my-listings")} />
                </section>

                <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Latest promotion requests</h2>
                        <p className="mt-1 text-sm text-slate-500">The most recent requests waiting for action.</p>
                      </div>
                      <button onClick={() => { setActiveView("promotions"); setPromotionTab("pending"); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {promotions.filter((p) => p.promotion_status === "pending").slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                          <img src={getImageUrl(item.images)} alt="" className="h-14 w-16 rounded-lg object-cover" onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="truncate text-xs text-slate-500">{item.agent_name || item.agent_email || "Unknown agent"} · {packageLabel(item.promotion_package)}</p>
                          </div>
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Pending</span>
                        </div>
                      ))}
                      {!promotions.some((p) => p.promotion_status === "pending") && <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">No pending promotion requests.</p>}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Promotion activity</h2>
                    <p className="mt-1 text-sm text-slate-500">Current status across the platform.</p>
                    <div className="mt-5 space-y-3">
                      {[
                        ["Pending", promotionSummary.pending, "bg-amber-500"],
                        ["Active", promotionSummary.active, "bg-blue-600"],
                        ["Rejected", promotionSummary.rejected, "bg-red-500"],
                        ["Expired", promotionSummary.expired, "bg-slate-400"],
                        ["Cancelled", promotionSummary.cancelled, "bg-slate-600"],
                      ].map(([label, value, color]) => (
                        <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                          <span className="flex items-center gap-2 text-sm font-medium text-slate-700"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span>
                          <span className="text-sm font-bold text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeView === "promotions" && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5 sm:p-6">
                  <h2 className="text-xl font-bold text-slate-900">Promotion Centre</h2>
                  <p className="mt-1 text-sm text-slate-500">Review requests, monitor active sponsorships and inspect promotion history.</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      ["pending", "Pending", promotionSummary.pending],
                      ["active", "Active", promotionSummary.active],
                      ["rejected", "Rejected", promotionSummary.rejected],
                      ["expired", "Expired", promotionSummary.expired],
                      ["cancelled", "Cancelled", promotionSummary.cancelled],
                    ].map(([key, label, count]) => (
                      <button key={key} onClick={() => setPromotionTab(key)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${promotionTab === key ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                        {label} <span className="ml-1 opacity-80">({count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {filteredPromotions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                      <p className="font-semibold text-slate-700">No {promotionTab} promotions</p>
                      <p className="mt-1 text-sm text-slate-500">Items will appear here when their status changes.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                      {filteredPromotions.map((item) => (
                        <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <div className="flex gap-4 p-4">
                            <img src={getImageUrl(item.images)} alt={item.title || "Property"} className="h-28 w-32 shrink-0 rounded-xl object-cover" onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="line-clamp-2 font-bold text-slate-900">{item.title || "Untitled property"}</h3>
                                  <p className="mt-1 text-sm text-slate-500">{item.location || "Unknown location"}{item.district ? `, ${item.district}` : ""}</p>
                                </div>
                                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[item.promotion_status] || statusStyles.expired}`}>{item.promotion_status}</span>
                              </div>
                              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                                <div><dt className="text-slate-400">Agent</dt><dd className="truncate font-semibold text-slate-700">{item.agent_name || "—"}</dd></div>
                                <div><dt className="text-slate-400">Package</dt><dd className="font-semibold text-slate-700">{packageLabel(item.promotion_package)}</dd></div>
                                <div><dt className="text-slate-400">Email</dt><dd className="truncate font-semibold text-slate-700">{item.agent_email || "—"}</dd></div>
                                <div><dt className="text-slate-400">Requested</dt><dd className="font-semibold text-slate-700">{formatDate(item.promoted_at || item.date_posted)}</dd></div>
                              </dl>
                            </div>
                          </div>

                          {item.promotion_status === "active" && (
                            <div className="border-t border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                              {daysRemaining(item.promotion_end)} day{daysRemaining(item.promotion_end) === 1 ? "" : "s"} remaining · Ends {formatDate(item.promotion_end)}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
                            <button onClick={() => navigate(`/property/${item.id}`, { state: { selectedProperty: item } })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">View property</button>
                            {item.agent_phone && <a href={`tel:${item.agent_phone}`} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Call agent</a>}
                            {item.promotion_status === "pending" && (
                              <>
                                <button disabled={Boolean(actionId)} onClick={() => approvePromotion(item)} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{actionId === `approve-${item.id}` ? "Approving…" : "Approve"}</button>
                                <button disabled={Boolean(actionId)} onClick={() => rejectPromotion(item)} className="rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">{actionId === `reject-${item.id}` ? "Rejecting…" : "Reject"}</button>
                              </>
                            )}
                            {item.promotion_status === "active" && (
                              <button
                                disabled={Boolean(actionId)}
                                onClick={() => cancelPromotion(item)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                              >
                                {actionId === `cancel-${item.id}`
                                  ? "Cancelling…"
                                  : "Cancel promotion"}
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeView === "my-listings" && (
              <section className="mt-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-900">My Listings</h2>
                  <p className="mt-1 text-sm text-slate-500">Your own properties can be sponsored immediately without approval.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {myProperties.map((item) => {
                    const active = item.is_promoted === true && item.promotion_status === "active";
                    return (
                      <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="relative">
                          <img src={getImageUrl(item.images)} alt={item.title || "Property"} className="h-48 w-full object-cover" onError={(e) => { e.currentTarget.src = fallbackImage; }} />
                          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.status === "hidden" ? "bg-white text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>{item.status === "hidden" ? "Hidden" : "Active"}</span>
                          {active && <span className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white">Sponsored</span>}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                          <div className="mt-1 flex items-center justify-between gap-3">
                            <p className="min-w-0 truncate text-sm text-slate-500">{item.location || "Unknown location"}</p>
                            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-400">
                              <EyeIcon className="h-3.5 w-3.5" />
                              {Number(item.views || 0).toLocaleString()} {Number(item.views || 0) === 1 ? "view" : "views"}
                            </span>
                          </div>
                          {active ? (
                            <div className="mt-4 space-y-2">
                              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                                Active sponsorship · {daysRemaining(item.promotion_end)} days remaining
                              </div>
                              <button
                                type="button"
                                disabled={Boolean(actionId)}
                                onClick={() => cancelPromotion(item)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                              >
                                {actionId === `cancel-${item.id}`
                                  ? "Cancelling…"
                                  : "Cancel promotion"}
                              </button>
                            </div>
                          ) : item.promotion_status === "pending" ? (
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Pending approval from an earlier request. Refresh after deploying the new backend.</div>
                          ) : (
                            <button disabled={item.status === "hidden"} onClick={() => { setPromotionProperty(item); setPromotionDays(7); }} className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400">{item.status === "hidden" ? "Publish before sponsoring" : "Sponsor property"}</button>
                          )}
                          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <button
                              onClick={() =>
                                navigate(`/property/${item.id}`, {
                                  state: { selectedProperty: item },
                                })
                              }
                              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <SvgIcon className="h-3.5 w-3.5">
                                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                <circle cx="12" cy="12" r="2.5" />
                              </SvgIcon>
                              View
                            </button>

                            <button
                              onClick={() => openPropertyEditor(item)}
                              className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                              <SvgIcon className="h-3.5 w-3.5">
                                <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
                                <path d="m14 8 3 3" />
                              </SvgIcon>
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: "property",
                                  item,
                                })
                              }
                              className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-900"
                            >
                              <SvgIcon className="h-3.5 w-3.5">
                                <path d="M4 7h16" />
                                <path d="M9 7V4h6v3" />
                                <path d="m7 7 1 13h8l1-13" />
                              </SvgIcon>
                              Delete
                            </button>

                            <button
                              onClick={() => setShowListModal(true)}
                              className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                              Add listing
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {activeView === "all-listings" && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Public Listings</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review and manage every property currently visible to visitors.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {publicProperties.length} visible
                  </span>
                </div>

                {/* Desktop / tablet table */}
                <div className="mt-5 hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-blue-50/60">
                      <tr>
                        {["Property", "Purpose", "Location", "Price", "Views", "Promotion", "Actions"].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {publicProperties.map((item) => (
                        <tr key={item.id} className="transition hover:bg-blue-50/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={getImageUrl(item.images)}
                                alt=""
                                className="h-11 w-14 rounded-lg object-cover"
                                onError={(event) => {
                                  event.currentTarget.src = fallbackImage;
                                }}
                              />
                              <span className="max-w-[260px] truncate font-semibold text-slate-900">
                                {item.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize text-slate-600">{item.purpose}</td>
                          <td className="px-4 py-3 text-slate-600">{item.location || "—"}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                            M {Number(item.purpose === "buy" ? item.price : item.rent_price || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                              <EyeIcon className="h-3.5 w-3.5" />
                              {Number(item.views || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.is_promoted ? (
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                Sponsored
                              </span>
                            ) : (
                              <span className="text-slate-400">Standard</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => navigate(`/property/${item.id}`, { state: { selectedProperty: item } })}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                View
                              </button>
                              <button
                                onClick={() => openPropertyEditor(item)}
                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: "property", item })}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="mt-5 grid gap-3 md:hidden">
                  {publicProperties.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex gap-3">
                        <img
                          src={getImageUrl(item.images)}
                          alt=""
                          className="h-20 w-24 shrink-0 rounded-xl object-cover"
                          onError={(event) => {
                            event.currentTarget.src = fallbackImage;
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{item.title}</h3>
                            {item.is_promoted && (
                              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                                Sponsored
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-500">{item.location || "Unknown location"}</p>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-blue-600">
                              M {Number(item.purpose === "buy" ? item.price : item.rent_price || 0).toLocaleString()}
                            </p>
                            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-slate-400">
                              <EyeIcon className="h-3.5 w-3.5" />
                              {Number(item.views || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                          onClick={() => navigate(`/property/${item.id}`, { state: { selectedProperty: item } })}
                          className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openPropertyEditor(item)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "property", item })}
                          className="rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeView === "users" && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review accounts, update details and remove accounts when necessary.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{users.length} accounts</span>
                </div>

                {/* Desktop / tablet table */}
                <div className="mt-5 hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-blue-50/60">
                      <tr>
                        {["Name", "Email", "Role", "Phone", "WhatsApp", "Actions"].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {users.map((user) => {
                        const isCurrentAdmin =
                          String(user.id) === String(currentUser?.id || currentUser?.user?.id);

                        return (
                          <tr key={user.id} className="transition hover:bg-blue-50/30">
                            <td className="px-4 py-3 font-semibold text-slate-900">{user.name || "—"}</td>
                            <td className="px-4 py-3 text-slate-600">{user.email || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                String(user.role || "user").toLowerCase() === "admin"
                                  ? "bg-blue-50 text-blue-700"
                                  : String(user.role || "user").toLowerCase() === "agent"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {user.role || "user"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{user.phone || "—"}</td>
                            <td className="px-4 py-3 text-slate-600">{user.whatsapp || "—"}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => openUserEditor(user)}
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                >
                                  Edit
                                </button>
                                <button
                                  disabled={isCurrentAdmin}
                                  title={isCurrentAdmin ? "You cannot delete the account you are currently using." : ""}
                                  onClick={() => setDeleteTarget({ type: "user", item: user })}
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="mt-5 grid gap-3 md:hidden">
                  {users.map((user) => {
                    const isCurrentAdmin =
                      String(user.id) === String(currentUser?.id || currentUser?.user?.id);

                    return (
                      <article key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-900">{user.name || "Unnamed user"}</h3>
                            <p className="mt-1 truncate text-sm text-slate-500">{user.email || "No email"}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-blue-700">
                            {user.role || "user"}
                          </span>
                        </div>
                        <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                          <div>
                            <dt className="text-slate-400">Phone</dt>
                            <dd className="mt-1 font-semibold text-slate-700">{user.phone || "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">WhatsApp</dt>
                            <dd className="mt-1 font-semibold text-slate-700">{user.whatsapp || "—"}</dd>
                          </div>
                        </dl>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openUserEditor(user)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700"
                          >
                            Edit user
                          </button>
                          <button
                            disabled={isCurrentAdmin}
                            onClick={() => setDeleteTarget({ type: "user", item: user })}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>


      {/* ================= EDIT USER MODAL ================= */}
      {editingUser && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-blue-100 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">User management</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Edit user</h2>
              <p className="mt-1 text-sm text-slate-500">Update account and contact information.</p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label className="sm:col-span-2">
                <span className="text-xs font-semibold text-slate-600">Full name</span>
                <input value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-semibold text-slate-600">Email</span>
                <input type="email" value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Role</span>
                <select value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-blue-400">
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Phone</span>
                <input value={userForm.phone} onChange={(e) => setUserForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-400" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-semibold text-slate-600">WhatsApp</span>
                <input value={userForm.whatsapp} onChange={(e) => setUserForm((p) => ({ ...p, whatsapp: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-400" />
              </label>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
              <button disabled={Boolean(actionId)} onClick={() => setEditingUser(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
              <button disabled={Boolean(actionId)} onClick={saveUserChanges} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {actionId === `user-edit-${editingUser.id}` ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT PROPERTY MODAL ================= */}
      {editingProperty && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-blue-100 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Property management</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Edit property</h2>
              <p className="mt-1 text-sm text-slate-500">Update the main listing information without changing its images.</p>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label className="sm:col-span-2">
                <span className="text-xs font-semibold text-slate-600">Title</span>
                <input value={propertyForm.title} onChange={(e) => setPropertyForm((p) => ({ ...p, title: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Purpose</span>
                <select value={propertyForm.purpose} onChange={(e) => setPropertyForm((p) => ({ ...p, purpose: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
                  <option value="rent">Rent</option>
                  <option value="buy">Sale</option>
                </select>
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Property type</span>
                <input value={propertyForm.type} onChange={(e) => setPropertyForm((p) => ({ ...p, type: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">District</span>
                <input value={propertyForm.district} onChange={(e) => setPropertyForm((p) => ({ ...p, district: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Location</span>
                <input value={propertyForm.location} onChange={(e) => setPropertyForm((p) => ({ ...p, location: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Sale price</span>
                <input type="number" value={propertyForm.price} onChange={(e) => setPropertyForm((p) => ({ ...p, price: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Monthly rent</span>
                <input type="number" value={propertyForm.rent_price} onChange={(e) => setPropertyForm((p) => ({ ...p, rent_price: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Bedrooms</span>
                <input type="number" value={propertyForm.bedrooms} onChange={(e) => setPropertyForm((p) => ({ ...p, bedrooms: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Bathrooms</span>
                <input type="number" value={propertyForm.bathrooms} onChange={(e) => setPropertyForm((p) => ({ ...p, bathrooms: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Size</span>
                <input type="number" value={propertyForm.size} onChange={(e) => setPropertyForm((p) => ({ ...p, size: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">Phone</span>
                <input value={propertyForm.phone} onChange={(e) => setPropertyForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label>
                <span className="text-xs font-semibold text-slate-600">WhatsApp</span>
                <input value={propertyForm.whatsapp} onChange={(e) => setPropertyForm((p) => ({ ...p, whatsapp: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-semibold text-slate-600">Description</span>
                <textarea rows="4" value={propertyForm.description} onChange={(e) => setPropertyForm((p) => ({ ...p, description: e.target.value }))} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </label>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
              <button disabled={Boolean(actionId)} onClick={() => setEditingProperty(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
              <button disabled={Boolean(actionId)} onClick={savePropertyChanges} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {actionId === `property-edit-${editingProperty.id}` ? "Saving…" : "Save property"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[330] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">!</div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Delete {deleteTarget.type === "user" ? "user account" : "property"}?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {deleteTarget.type === "user"
                ? `This will permanently remove ${deleteTarget.item?.name || deleteTarget.item?.email || "this user"}. Users with existing properties should have those listings removed or reassigned first.`
                : `This will permanently delete "${deleteTarget.item?.title || "this property"}" and its stored images. This action cannot be undone.`}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button disabled={Boolean(actionId)} onClick={() => setDeleteTarget(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Keep it</button>
              <button
                disabled={Boolean(actionId)}
                onClick={() =>
                  deleteTarget.type === "user"
                    ? deleteUser(deleteTarget.item)
                    : deleteProperty(deleteTarget.item)
                }
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionId ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {promotionProperty && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !actionId) setPromotionProperty(null); }}>
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Immediate admin sponsorship</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Sponsor {promotionProperty.title}</h2>
              <p className="mt-1 text-sm text-slate-500">Admin-owned properties activate immediately and do not require approval.</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {[7, 14].map((days) => <button key={days} onClick={() => setPromotionDays(days)} className={`rounded-xl border p-4 text-left ${promotionDays === days ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:bg-slate-50"}`}><p className="font-bold text-slate-900">{days} days</p><p className="mt-1 text-xs text-slate-500">Sponsored placement</p></button>)}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 p-4">
              <button disabled={Boolean(actionId)} onClick={() => setPromotionProperty(null)} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
              <button disabled={Boolean(actionId)} onClick={promoteOwnProperty} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{actionId ? "Activating…" : "Activate sponsorship"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}