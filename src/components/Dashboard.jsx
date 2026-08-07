import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListModal from "./ListModal";
import { API_URL } from "../config";
import Toast from "./ui/Toast";
import LoadingButton from "./ui/LoadingButton";
import ConfirmModal from "./ui/ConfirmModal";
import AdminDashboard from "./AdminDashboard";

// ================= SMALL SVG ICONS =================

const Icon = ({
  children,
  className = "h-4 w-4",
  viewBox = "0 0 24 24",
}) => (
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
  <Icon className={className}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </Icon>
);

const UserIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Icon>
);

const UsersIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

const PlusIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

const BuildingIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M3 21h18" />
    <path d="M6 21V4h12v17" />
    <path d="M9 8h1" />
    <path d="M14 8h1" />
    <path d="M9 12h1" />
    <path d="M14 12h1" />
    <path d="M9 16h1" />
    <path d="M14 16h1" />
  </Icon>
);

const CheckIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </Icon>
);

const EyeIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const EyeOffIcon = ({ className }) => (
  <Icon className={className}>
    <path d="m3 3 18 18" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9 4 10 8a12.7 12.7 0 0 1-2.1 4.2" />
    <path d="M6.6 6.6A12.3 12.3 0 0 0 2 12c1 4 5 8 10 8a10.8 10.8 0 0 0 5.4-1.5" />
  </Icon>
);

const TagIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M20 12 12 20l-8-8V4h8l8 8Z" />
    <circle cx="8.5" cy="8.5" r="1" />
  </Icon>
);

const KeyIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 9-9" />
    <path d="m17 6 2 2" />
    <path d="m14 9 2 2" />
  </Icon>
);

const HeartIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  </Icon>
);

const BedIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M3 18v-8" />
    <path d="M21 18v-5a3 3 0 0 0-3-3H7a4 4 0 0 0-4 4v1h18" />
    <path d="M7 10V7h4a2 2 0 0 1 2 2v1" />
    <path d="M3 18v2" />
    <path d="M21 18v2" />
  </Icon>
);

const BathIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M4 12h16" />
    <path d="M5 12v2a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-2" />
    <path d="M7 12V6a2 2 0 0 1 4 0" />
    <path d="M5 21v-2" />
    <path d="M19 21v-2" />
  </Icon>
);

const RulerIcon = ({ className }) => (
  <Icon className={className}>
    <path d="m4 19 15-15 2 2L6 21 4 19Z" />
    <path d="m14 9 2 2" />
    <path d="m11 12 2 2" />
    <path d="m8 15 2 2" />
  </Icon>
);

const MapPinIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

const CalendarIcon = ({ className }) => (
  <Icon className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h18" />
  </Icon>
);

const PhoneIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />
  </Icon>
);

const MessageIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
    <path d="M8 9h8" />
    <path d="M8 13h5" />
  </Icon>
);

const RefreshIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M20 11a8 8 0 1 0 2 5" />
    <path d="M20 4v7h-7" />
  </Icon>
);

// ================= DASHBOARD =================

export default function Dashboard({
  currentUser,
  setShowListModal,
  favorites = [],
}) {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [visibilityUpdatingId, setVisibilityUpdatingId] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
  });

  const [confirmAction, setConfirmAction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editUpdating, setEditUpdating] = useState(false);

  const [editProp, setEditProp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ================= PROMOTION STATE =================
  const [promotionProperty, setPromotionProperty] = useState(null);
  const [promotionDays, setPromotionDays] = useState(7);
  const [promotionSubmitting, setPromotionSubmitting] = useState(false);
  const [dismissedCancellationNotices, setDismissedCancellationNotices] =
    useState(() => new Set());

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

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeDataView, setActiveDataView] = useState("saved");

  const token = localStorage.getItem("token");

  const showToast = (type, title, message) => {
    setToast({
      open: true,
      type,
      title,
      message,
    });
  };

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

  const isAdmin = useMemo(() => {
    return getCurrentUserRole() === "admin";
  }, [currentUser]);

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
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="#6b7280"
          font-size="24"
          font-family="Arial, sans-serif"
        >
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

      return Array.isArray(parsed) ? parsed : [];
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

    if (
      firstImage &&
      typeof firstImage === "object" &&
      firstImage.url
    ) {
      return firstImage.url;
    }

    return fallbackImage;
  };

  const getPropertyId = useCallback(
    (property) => property?._id || property?.id,
    []
  );

  const fetchProperties = useCallback(async () => {
    setLoadingProps(true);

    try {
      const authHeaders = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const publicRequest = axios.get(`${API_URL}/properties`, {
        headers: authHeaders,
      });

      if (isAgent && token) {
        const [publicResponse, mineResponse] = await Promise.all([
          publicRequest,
          axios.get(`${API_URL}/properties/mine`, {
            headers: authHeaders,
          }),
        ]);

        const publicProperties = Array.isArray(publicResponse.data)
          ? publicResponse.data
          : [];

        const ownedProperties = Array.isArray(mineResponse.data)
          ? mineResponse.data.map((property) => ({
              ...property,
              status: property.status || "active",
            }))
          : [];

        setAllProperties(publicProperties);
        setMyProperties(ownedProperties);
      } else {
        const publicResponse = await publicRequest;

        setAllProperties(
          Array.isArray(publicResponse.data)
            ? publicResponse.data
            : []
        );

        setMyProperties([]);
      }
    } catch (error) {
      console.error("Fetch properties failed:", error);

      alert(
        error.response?.data?.error ||
          "Failed to load properties"
      );

      setAllProperties([]);
      setMyProperties([]);
    } finally {
      setLoadingProps(false);
    }
  }, [isAgent, token]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingUsers(true);

      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Fetch users failed:", error);

      alert(
        error.response?.data?.error ||
          "Failed to load users"
      );

      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Hide the cancelled-sponsorship confirmation after 5 seconds.
  // This is frontend-only: the database still keeps promotion_status = "cancelled"
  // so the admin Promotion Centre retains the cancellation history.
  useEffect(() => {
    const timers = [];

    myProperties.forEach((property) => {
      if (getPromotionStatus(property) !== "cancelled") return;

      const propertyId = getPropertyId(property);
      if (!propertyId) return;

      const noticeKey = `${propertyId}:${
        property.promotion_end || property.promoted_at || "cancelled"
      }`;

      if (dismissedCancellationNotices.has(noticeKey)) return;

      const timer = window.setTimeout(() => {
        setDismissedCancellationNotices((previous) => {
          if (previous.has(noticeKey)) return previous;

          const next = new Set(previous);
          next.add(noticeKey);
          return next;
        });
      }, 5000);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [
    myProperties,
    getPropertyId,
    dismissedCancellationNotices,
  ]);

  useEffect(() => {
    if (activeDataView === "users" && isAdmin) {
      fetchUsers();
    }
  }, [activeDataView, isAdmin, fetchUsers]);

  const savedProperties = useMemo(() => {
    return allProperties.filter((property) =>
      favorites.some(
        (favoriteId) =>
          String(favoriteId) === String(getPropertyId(property))
      )
    );
  }, [allProperties, favorites, getPropertyId]);

  const handleDelete = (property) => {
    const propertyId = getPropertyId(property);

    if (!propertyId) {
      showToast(
        "error",
        "Unable to delete",
        "This property has an invalid ID."
      );
      return;
    }

    if (!token) {
      showToast(
        "warning",
        "Sign in required",
        "You must be logged in to delete a property."
      );
      return;
    }

    setConfirmAction({
      type: "delete",
      property,
    });
  };

  const confirmDeleteProperty = async () => {
    const property = confirmAction?.property;
    const propertyId = getPropertyId(property);

    if (!propertyId || !token) return;

    try {
      setDeletingId(String(propertyId));

      await axios.delete(`${API_URL}/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyProperties((previous) =>
        previous.filter(
          (item) =>
            String(getPropertyId(item)) !== String(propertyId)
        )
      );

      setAllProperties((previous) =>
        previous.filter(
          (item) =>
            String(getPropertyId(item)) !== String(propertyId)
        )
      );

      setConfirmAction(null);

      showToast(
        "success",
        "Property deleted",
        "The listing has been permanently removed."
      );
    } catch (error) {
      console.error("Delete failed:", error);

      showToast(
        "error",
        "Delete failed",
        error.response?.data?.error ||
          "The property could not be deleted. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= PROMOTION HELPERS =================

  const getPromotionStatus = (property) =>
    String(property?.promotion_status || "none")
      .toLowerCase()
      .trim();

  const isPromotionActive = (property) =>
    property?.is_promoted === true &&
    getPromotionStatus(property) === "active";

  const getPromotionDaysRemaining = (property) => {
    if (!property?.promotion_end) return 0;

    const promotionEnd = new Date(property.promotion_end);

    if (Number.isNaN(promotionEnd.getTime())) return 0;

    return Math.max(
      0,
      Math.ceil(
        (promotionEnd.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    );
  };

  const formatPromotionEndDate = (property) => {
    if (!property?.promotion_end) return "";

    const promotionEnd = new Date(property.promotion_end);

    if (Number.isNaN(promotionEnd.getTime())) return "";

    return promotionEnd.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openPromotionDialog = (property) => {
    const propertyId = getPropertyId(property);

    if (!propertyId) {
      showToast(
        "error",
        "Unable to continue",
        "This property has an invalid ID."
      );
      return;
    }

    if ((property.status || "active") !== "active") {
      showToast(
        "warning",
        "Publish property first",
        "Only publicly active properties can be sponsored."
      );
      return;
    }

    setPromotionProperty(property);
    setPromotionDays(7);
  };

  const closePromotionDialog = () => {
    if (promotionSubmitting) return;

    setPromotionProperty(null);
    setPromotionDays(7);
  };

  const submitPromotion = async () => {
    const propertyId = getPropertyId(promotionProperty);

    if (!propertyId || !token) {
      showToast(
        "warning",
        "Sign in required",
        "You must be logged in to request a promotion."
      );
      return;
    }

    if (![7, 14].includes(Number(promotionDays))) {
      showToast(
        "error",
        "Invalid package",
        "Please choose either the 7-day or 14-day package."
      );
      return;
    }

    try {
      setPromotionSubmitting(true);

      const response = await axios.put(
        `${API_URL}/properties/${propertyId}/promotion/request`,
        {
          days: Number(promotionDays),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProperty = response.data?.property;

      if (updatedProperty) {
        setMyProperties((previous) =>
          previous.map((property) =>
            String(getPropertyId(property)) === String(propertyId)
              ? {
                  ...property,
                  ...updatedProperty,
                }
              : property
          )
        );
      } else {
        await fetchProperties();
      }

      setPromotionProperty(null);
      setPromotionDays(7);

      const autoApproved = response.data?.auto_approved === true;

      showToast(
        "success",
        autoApproved ? "Promotion activated" : "Promotion requested",
        autoApproved
          ? "Your property is now sponsored and receiving priority placement."
          : "Your sponsorship request is waiting for administrator approval."
      );
    } catch (error) {
      console.error("Promotion request failed:", error);

      showToast(
        "error",
        "Request failed",
        error.response?.data?.error ||
          "The promotion request could not be submitted. Please try again."
      );
    } finally {
      setPromotionSubmitting(false);
    }
  };

  const handleVisibilityChange = (property) => {
    const propertyId = getPropertyId(property);

    if (!propertyId) {
      showToast(
        "error",
        "Unable to continue",
        "This property has an invalid ID."
      );
      return;
    }

    if (!token) {
      showToast(
        "warning",
        "Sign in required",
        "You must be logged in to manage a property."
      );
      return;
    }

    const isHidden =
      (property.status || "active") === "hidden";

    setConfirmAction({
      type: isHidden ? "show" : "hide",
      property,
    });
  };

  const confirmVisibilityChange = async () => {
    const property = confirmAction?.property;
    const propertyId = getPropertyId(property);

    if (!propertyId || !token) return;

    const isHidden =
      (property.status || "active") === "hidden";
    const action = isHidden ? "show" : "hide";

    try {
      setVisibilityUpdatingId(String(propertyId));

      await axios.put(
        `${API_URL}/properties/${propertyId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProperties();
      setConfirmAction(null);

      showToast(
        "success",
        isHidden ? "Property published" : "Property hidden",
        isHidden
          ? "The listing is now visible on the homepage, map, search and public listings."
          : "The listing is now hidden from public pages and remains available in your Dashboard."
      );
    } catch (error) {
      console.error(`${action} property failed:`, error);

      showToast(
        "error",
        isHidden ? "Publish failed" : "Hide failed",
        error.response?.data?.error ||
          `The property could not be ${
            isHidden ? "published" : "hidden"
          }. Please try again.`
      );
    } finally {
      setVisibilityUpdatingId(null);
    }
  };

  const handleEdit = (property) => {
    setEditProp(property);
    setShowEditModal(true);
  };

  const updateProp = async (
    propertyData,
    imageFiles = []
  ) => {
    if (!token) {
      showToast(
        "warning",
        "Sign in required",
        "You must be logged in to update a property."
      );
      return;
    }

    try {
      setEditUpdating(true);

      const formData = new FormData();

      const cleanValue = (value) => {
        if (Array.isArray(value)) {
          return value[0] ?? "";
        }

        return value ?? "";
      };

      if (
        Array.isArray(imageFiles) &&
        imageFiles.length > 0
      ) {
        imageFiles.forEach((file) =>
          formData.append("images", file)
        );
      }

      Object.keys(propertyData).forEach((key) => {
        if (key === "images" || key === "_id") return;

        if (key === "removedExistingImages") {
          formData.append(
            "removedExistingImages",
            JSON.stringify(
              Array.isArray(propertyData[key])
                ? propertyData[key]
                : []
            )
          );

          return;
        }

        formData.append(
          key,
          cleanValue(propertyData[key])
        );
      });

      if (
        !propertyData.agent_id &&
        !propertyData.agentId
      ) {
        formData.append(
          "agent_id",
          getCurrentUserId() || ""
        );
      }

      await axios.put(
        `${API_URL}/properties/${
          propertyData.id || propertyData._id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast(
        "success",
        "Property updated",
        "Your changes have been saved successfully."
      );

      setShowEditModal(false);
      setEditProp(null);

      await fetchProperties();
    } catch (error) {
      console.error("Update failed:", error);

      showToast(
        "error",
        "Update failed",
        error.response?.data?.error ||
          "The property could not be updated. Please try again."
      );
    } finally {
      setEditUpdating(false);
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
      const response = await axios.put(
        `${API_URL}/auth/update-profile`,
        profileForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUserFromApi = response.data?.user;

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

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );
        }
      }

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update failed:", error);

      alert(
        error.response?.data?.error ||
          "Failed to update profile"
      );
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

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/auth/change-password`,
        passwordForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password update failed:", error);

      alert(
        error.response?.data?.error ||
          "Failed to update password"
      );
    }
  };

  const handleAdminResetPassword = async (user) => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

    const newPassword = window.prompt(
      `Enter a temporary password for ${
        user.name || user.email
      }:`
    );

    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/auth/admin-reset-password/${user.id}`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password reset successfully");
    } catch (error) {
      console.error(
        "Admin reset password failed:",
        error
      );

      alert(
        error.response?.data?.error ||
          "Failed to reset password"
      );
    }
  };

  const formatPrice = (value) =>
    `M ${Number(value || 0).toLocaleString()}`;

  const stats = useMemo(() => {
    const total = myProperties.length;

    const activeCount = myProperties.filter(
      (property) =>
        (property.status || "active") === "active"
    ).length;

    const hiddenCount = myProperties.filter(
      (property) => property.status === "hidden"
    ).length;

    const sponsoredCount = myProperties.filter((property) =>
      isPromotionActive(property)
    ).length;

    const buyCount = myProperties.filter(
      (property) => property.purpose === "buy"
    ).length;

    const rentCount = myProperties.filter(
      (property) => property.purpose === "rent"
    ).length;

    const savedCount = savedProperties.length;

    return {
      total,
      activeCount,
      hiddenCount,
      sponsoredCount,
      buyCount,
      rentCount,
      savedCount,
    };
  }, [myProperties, savedProperties]);

  const displayedProperties = useMemo(() => {
    if (activeDataView === "saved") {
      return savedProperties;
    }

    if (activeDataView === "active") {
      return myProperties.filter(
        (property) =>
          (property.status || "active") === "active"
      );
    }

    if (activeDataView === "hidden") {
      return myProperties.filter(
        (property) => property.status === "hidden"
      );
    }

    if (activeDataView === "sponsored") {
      return myProperties.filter((property) =>
        isPromotionActive(property)
      );
    }

    if (activeDataView === "buy") {
      return myProperties.filter(
        (property) => property.purpose === "buy"
      );
    }

    if (activeDataView === "rent") {
      return myProperties.filter(
        (property) => property.purpose === "rent"
      );
    }

    return myProperties;
  }, [
    activeDataView,
    myProperties,
    savedProperties,
  ]);

  const getSectionTitle = () => {
    if (activeDataView === "profile") return "My Profile";
    if (activeDataView === "users") return "Manage Users";
    if (activeDataView === "saved") return "Saved Properties";
    if (activeDataView === "active") return "Active Properties";
    if (activeDataView === "hidden") return "Hidden Properties";
    if (activeDataView === "sponsored") return "Sponsored Properties";
    if (activeDataView === "buy") return "Properties for Sale";
    if (activeDataView === "rent") return "Properties for Rent";

    return "My Properties";
  };

  const getSectionText = () => {
    if (activeDataView === "profile") {
      return "Update your profile information and account password.";
    }

    if (activeDataView === "users") {
      return "View registered users and reset passwords when required.";
    }

    if (activeDataView === "saved") {
      return "Properties you have saved for quick access.";
    }

    if (activeDataView === "active") {
      return "These listings are visible on the homepage, map, search and public property pages.";
    }

    if (activeDataView === "hidden") {
      return "These listings are hidden from public pages but remain available for editing or activation.";
    }

    if (activeDataView === "sponsored") {
      return "These listings currently receive priority placement across Property LS.";
    }

    if (activeDataView === "buy") {
      return "Your properties currently listed for sale.";
    }

    if (activeDataView === "rent") {
      return "Your properties currently listed for rent.";
    }

    return "View, edit and manage the properties you have listed.";
  };

  const openProperty = (property) => {
    const id = getPropertyId(property);

    if (!id) return;

    navigate(`/property/${id}`, {
      state: {
        selectedProperty: property,
      },
    });
  };

  const statItems = useMemo(
    () => [
      {
        title: "Total Listings",
        value: stats.total,
        stateKey: "all",
        icon: BuildingIcon,
      },
      {
        title: "Active",
        value: stats.activeCount,
        stateKey: "active",
        icon: CheckIcon,
      },
      {
        title: "Sponsored",
        value: stats.sponsoredCount,
        stateKey: "sponsored",
        icon: EyeIcon,
      },
      {
        title: "Hidden",
        value: stats.hiddenCount,
        stateKey: "hidden",
        icon: EyeOffIcon,
      },
      {
        title: "For Sale",
        value: stats.buyCount,
        stateKey: "buy",
        icon: TagIcon,
      },
      {
        title: "For Rent",
        value: stats.rentCount,
        stateKey: "rent",
        icon: KeyIcon,
      },
      {
        title: "Saved",
        value: stats.savedCount,
        stateKey: "saved",
        icon: HeartIcon,
      },
      {
        title: "Profile",
        value: "Edit",
        stateKey: "profile",
        icon: UserIcon,
      },
    ],
    [stats]
  );

  const StatCard = ({
    title,
    value,
    stateKey,
    icon: StatIcon,
  }) => {
    const isSelected = activeDataView === stateKey;

    return (
      <button
        type="button"
        onClick={() => setActiveDataView(stateKey)}
        className={`group w-full rounded-xl border px-4 py-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-white hover:border-blue-200"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`text-xs font-medium ${
                isSelected
                  ? "text-blue-700"
                  : "text-gray-500"
              }`}
            >
              {title}
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {value}
            </h2>
          </div>

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <StatIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      </button>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="h-52 w-full bg-gray-200" />

          <div className="p-4">
            <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
            <div className="mb-3 h-5 w-1/3 rounded bg-gray-200" />
            <div className="mb-3 h-4 w-2/3 rounded bg-gray-200" />
            <div className="mb-4 h-4 w-1/2 rounded bg-gray-200" />

            <div className="flex gap-2">
              <div className="h-9 flex-1 rounded-lg bg-gray-200" />
              <div className="h-9 flex-1 rounded-lg bg-gray-200" />
              <div className="h-9 flex-1 rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isAdmin) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        setShowListModal={setShowListModal}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() =>
          setToast((previous) => ({
            ...previous,
            open: false,
          }))
        }
      />

      <ConfirmModal
        open={Boolean(confirmAction)}
        type={
          confirmAction?.type === "delete"
            ? "danger"
            : confirmAction?.type === "show"
            ? "success"
            : "warning"
        }
        title={
          confirmAction?.type === "delete"
            ? "Delete Property"
            : confirmAction?.type === "hide"
            ? "Hide Property"
            : "Publish Property"
        }
        message={
          confirmAction?.type === "delete"
            ? `Permanently delete "${
                confirmAction?.property?.title || "this property"
              }"?`
            : confirmAction?.type === "hide"
            ? "This property will be removed from the homepage, map, search and public listings."
            : "This property will become visible publicly again."
        }
        description={
          confirmAction?.type === "delete"
            ? "This action cannot be undone."
            : confirmAction?.type === "hide"
            ? "You can restore it at any time from your Dashboard."
            : "It may appear immediately across Property LS."
        }
        confirmText={
          confirmAction?.type === "delete"
            ? "Delete Property"
            : confirmAction?.type === "hide"
            ? "Hide Property"
            : "Publish Property"
        }
        loadingText={
          confirmAction?.type === "delete"
            ? "Deleting..."
            : confirmAction?.type === "hide"
            ? "Hiding..."
            : "Publishing..."
        }
        loading={
          confirmAction?.type === "delete"
            ? deletingId ===
              String(getPropertyId(confirmAction?.property))
            : visibilityUpdatingId ===
              String(getPropertyId(confirmAction?.property))
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={
          confirmAction?.type === "delete"
            ? confirmDeleteProperty
            : confirmVisibilityChange
        }
      >
        {confirmAction?.type === "hide" && (
          <ul className="space-y-2">
            <li>• Removed from the homepage</li>
            <li>• Removed from search results</li>
            <li>• Removed from the property map</li>
            <li>• Still available in your Dashboard</li>
          </ul>
        )}
      </ConfirmModal>

      {/* ================= HEADER ================= */}

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <BuildingIcon className="h-3.5 w-3.5" />
              {isAgent ? "Agent Dashboard" : "Buyer Dashboard"}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome, {getCurrentUserName()}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              {isAgent
                ? "Manage your property listings, control their public visibility and keep your portfolio current."
                : "Review your saved properties and quickly return to the homes you are interested in."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <HomeIcon className="h-4 w-4" />
              Homepage
            </button>

            <button
              type="button"
              onClick={() => setActiveDataView("profile")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveDataView("users")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <UsersIcon className="h-4 w-4" />
                Users
              </button>
            )}

            {isAgent && (
              <button
                type="button"
                onClick={() => setShowListModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                List Property
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      {isAgent ? (
        <section
          className={`mb-8 grid gap-3 ${
            isAdmin
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8"
          }`}
        >
          {statItems.map((item) => (
            <StatCard key={item.stateKey} {...item} />
          ))}

          {isAdmin && (
            <StatCard
              title="Users"
              value={users.length > 0 ? users.length : "View"}
              stateKey="users"
              icon={UsersIcon}
            />
          )}
        </section>
      ) : (
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Saved Properties"
            value={stats.savedCount}
            stateKey="saved"
            icon={HeartIcon}
          />

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Your Favourites
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Keep track of homes and rentals you want to revisit.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Browse More
            </h2>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Go to Homepage
            </button>
          </div>

          <StatCard
            title="My Profile"
            value="Edit"
            stateKey="profile"
            icon={UserIcon}
          />
        </section>
      )}

      {/* ================= SECTION TITLE ================= */}

      <section className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          {getSectionTitle()}
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {getSectionText()}
        </p>
      </section>

      {/* ================= PROFILE ================= */}

      {activeDataView === "profile" ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Profile Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your personal and contact information.
          </p>

          <div className="mb-6 mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm({
                    ...profileForm,
                    name: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={profileForm.email}
                onChange={(event) =>
                  setProfileForm({
                    ...profileForm,
                    email: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="text"
                value={profileForm.phone}
                onChange={(event) =>
                  setProfileForm({
                    ...profileForm,
                    phone: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                WhatsApp
              </label>

              <input
                type="text"
                value={profileForm.whatsapp}
                onChange={(event) =>
                  setProfileForm({
                    ...profileForm,
                    whatsapp: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleProfileUpdate}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Save Profile
          </button>

          <hr className="my-8 border-gray-200" />

          <h3 className="text-lg font-bold text-gray-900">
            Change Password
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter your current password before setting a new one.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: event.target.value,
                })
              }
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: event.target.value,
                })
              }
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: event.target.value,
                })
              }
              className="rounded-xl border border-gray-200 px-3.5 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handlePasswordChange}
            className="mt-4 rounded-xl bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Update Password
          </button>
        </section>
      ) : activeDataView === "users" && isAdmin ? (
        /* ================= USERS ================= */

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Manage Users
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View registered users and reset passwords when needed.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchUsers}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <RefreshIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {loadingUsers ? (
            <p className="text-sm text-gray-500">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-500">
                No users found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "Role",
                      "Phone",
                      "WhatsApp",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {user.name || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        {user.email || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        {user.role || "user"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        {user.phone || "—"}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-800">
                        {user.whatsapp || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleAdminResetPassword(user)
                          }
                          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                          Reset Password
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : loadingProps ? (
        renderSkeletons()
      ) : displayedProperties.length === 0 ? (
        /* ================= EMPTY STATE ================= */

        <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <h3 className="text-lg font-bold text-gray-800">
            {activeDataView === "saved"
              ? "No saved properties yet"
              : "No properties found"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {activeDataView === "saved"
              ? "Save properties from the homepage and they will appear here."
              : "Try another dashboard section or create a new listing."}
          </p>

          {activeDataView === "saved" ? (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse Properties
            </button>
          ) : (
            isAgent && (
              <button
                type="button"
                onClick={() => setShowListModal(true)}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                List Property
              </button>
            )
          )}
        </section>
      ) : (
        /* ================= PROPERTY GRID ================= */

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayedProperties.map((property) => {
            const id = getPropertyId(property);
            const imageUrl = getImageUrl(property.images);

            const isSavedView = activeDataView === "saved";
            const isHidden = property.status === "hidden";
            const isUpdating =
              visibilityUpdatingId === String(id);

            const promotionStatus = getPromotionStatus(property);
            const promotionActive = isPromotionActive(property);
            const promotionPending = promotionStatus === "pending";
            const promotionExpired = promotionStatus === "expired";
            const promotionRejected = promotionStatus === "rejected";
            const promotionCancelled = promotionStatus === "cancelled";
            const cancellationNoticeKey = `${id}:${
              property.promotion_end || property.promoted_at || "cancelled"
            }`;
            const showCancellationNotice =
              promotionCancelled &&
              !dismissedCancellationNotices.has(cancellationNoticeKey);
            const promotionDaysRemaining =
              getPromotionDaysRemaining(property);
            const promotionEndDate =
              formatPromotionEndDate(property);

            const postedDate =
              property.createdAt || property.date_posted;

            return (
              <article
                key={`${activeDataView}-${id}`}
                onClick={
                  isSavedView
                    ? () => openProperty(property)
                    : undefined
                }
                className={`group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  isSavedView ? "cursor-pointer" : ""
                }`}
              >
                {/* IMAGE */}

                <div className="relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={property.title || "Property"}
                    className={`h-48 w-full object-cover transition duration-300 group-hover:scale-[1.01] sm:h-52 ${
                      isHidden
                        ? "opacity-65 grayscale-[10%]"
                        : ""
                    }`}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />

                  {isHidden && (
                    <div className="pointer-events-none absolute inset-0 bg-slate-900/10" />
                  )}

                  {!isSavedView && (
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${
                        isHidden
                          ? "border-gray-200 bg-white/95 text-gray-700"
                          : "border-emerald-200 bg-emerald-50/95 text-emerald-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isHidden
                            ? "bg-gray-400"
                            : "bg-emerald-500"
                        }`}
                      />

                      {isHidden
                        ? "Hidden from Public"
                        : "Active"}
                    </span>
                  )}

                  {!isSavedView && promotionActive && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                      Sponsored
                    </span>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                      property.purpose === "buy"
                        ? "bg-blue-50/95 text-blue-700"
                        : "bg-sky-50/95 text-sky-700"
                    }`}
                  >
                    {property.purpose === "buy"
                      ? "For Sale"
                      : "For Rent"}
                  </span>
                </div>

                {/* DETAILS */}

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-bold leading-snug text-gray-900">
                    {property.title || "Untitled Property"}
                  </h3>

                  <p className="mt-2 text-xl font-bold text-blue-600">
                    {property.purpose === "buy"
                      ? formatPrice(property.price)
                      : `${formatPrice(
                          property.rent_price
                        )}/month`}
                  </p>

                  <div className="mt-2 flex items-start gap-2 text-sm leading-5 text-gray-600">
                    <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

                    <span>
                      {property.location || "Unknown location"}

                      {property.district
                        ? `, ${property.district}`
                        : ""}
                    </span>
                  </div>

                  {/* PROPERTY FACTS */}

                  <div className="mt-4 grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-100 bg-gray-50/70 py-2.5">
                    <div className="flex items-center justify-center gap-2 px-2">
                      <BedIcon className="h-3.5 w-3.5 text-gray-500" />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {property.bedrooms ?? "—"}
                        </p>

                        <p className="text-[10px] text-gray-500">
                          Beds
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 px-2">
                      <BathIcon className="h-3.5 w-3.5 text-gray-500" />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {property.bathrooms ?? "—"}
                        </p>

                        <p className="text-[10px] text-gray-500">
                          Baths
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 px-2">
                      <RulerIcon className="h-3.5 w-3.5 text-gray-500" />

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {property.size ?? "—"}
                        </p>

                        <p className="text-[10px] text-gray-500">
                          Area
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CONTACT NUMBERS */}

                  {!isSavedView &&
                    isAgent &&
                    (property.phone ||
                      property.whatsapp) && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
                        {property.phone && (
                          <div className="flex items-center gap-1.5">
                            <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-blue-500" />

                            <span>{property.phone}</span>
                          </div>
                        )}

                        {property.whatsapp && (
                          <div className="flex items-center gap-1.5">
                            <MessageIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />

                            <span>{property.whatsapp}</span>
                          </div>
                        )}
                      </div>
                    )}

                  {/* POSTED DATE + VIEWS */}

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-400">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0" />

                      <span className="truncate">
                        Posted{" "}
                        {postedDate
                          ? new Date(
                              postedDate
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>

                    <div
                      className="inline-flex shrink-0 items-center gap-1.5"
                      title={`${Number(property.views || 0).toLocaleString()} ${
                        Number(property.views || 0) === 1 ? "view" : "views"
                      }`}
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      <span>
                        {Number(property.views || 0).toLocaleString()}{" "}
                        {Number(property.views || 0) === 1 ? "view" : "views"}
                      </span>
                    </div>
                  </div>

                  {!isSavedView && (
                    <div className="mt-4">
                      {promotionActive ? (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-blue-700">
                                Sponsored listing
                              </p>

                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {promotionDaysRemaining > 0
                                  ? `${promotionDaysRemaining} ${
                                      promotionDaysRemaining === 1
                                        ? "day"
                                        : "days"
                                    } remaining`
                                  : "Ends today"}
                              </p>

                              {promotionEndDate && (
                                <p className="mt-1 text-[11px] text-gray-500">
                                  Ends {promotionEndDate}
                                </p>
                              )}
                            </div>

                            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                              Active
                            </span>
                          </div>
                        </div>
                      ) : promotionPending ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-amber-700">
                                Promotion requested
                              </p>

                              <p className="mt-1 text-sm text-gray-700">
                                Waiting for administrator approval.
                              </p>
                            </div>

                            <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                              Pending
                            </span>
                          </div>
                        </div>
                      ) : promotionRejected ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold text-rose-700">
                                Promotion not approved
                              </p>

                              <p className="mt-1 text-sm text-gray-600">
                                This request was not approved. You can submit a new promotion request when ready.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => openPromotionDialog(property)}
                              disabled={isHidden}
                              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                isHidden
                                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                  : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {isHidden ? "Publish first" : "Request again"}
                            </button>
                          </div>
                        </div>
                      ) : showCancellationNotice ? (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                Sponsorship cancelled
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                This listing is back in its normal position and can be promoted again.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => openPromotionDialog(property)}
                              disabled={isHidden}
                              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                isHidden
                                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                  : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {isHidden ? "Publish first" : "Promote again"}
                            </button>
                          </div>
                        </div>
                      ) : promotionExpired ? (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold text-gray-700">
                                Sponsorship expired
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                The promotion has ended and this listing is back in its normal position.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => openPromotionDialog(property)}
                              disabled={isHidden}
                              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                isHidden
                                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                  : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                              }`}
                            >
                              {isHidden ? "Publish first" : "Promote again"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openPromotionDialog(property)}
                          disabled={isHidden}
                          className={`flex w-full items-center justify-center rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
                            isHidden
                              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                              : "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100"
                          }`}
                        >
                          {isHidden ? "Publish to promote" : "Promote Property"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* ACTION BUTTONS */}

                  <div className="mt-auto pt-4">
                    {isSavedView ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openProperty(property);
                        }}
                        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        View Property
                      </button>
                    ) : (
                      <div className="grid w-full grid-cols-3 gap-2">
                        <LoadingButton
                          size="small"
                          variant="primary"
                          onClick={() => handleEdit(property)}
                          disabled={
                            isUpdating ||
                            deletingId === String(id) ||
                            editUpdating
                          }
                          className="w-full"
                        >
                          Edit
                        </LoadingButton>

                        <LoadingButton
                          size="small"
                          variant={isHidden ? "success" : "warning"}
                          loading={isUpdating}
                          loadingText={isHidden ? "Publishing..." : "Hiding..."}
                          onClick={() =>
                            handleVisibilityChange(property)
                          }
                          disabled={
                            deletingId === String(id) || editUpdating
                          }
                          className="w-full"
                        >
                          {isHidden ? "Show" : "Hide"}
                        </LoadingButton>

                        <LoadingButton
                          size="small"
                          variant="dark"
                          loading={deletingId === String(id)}
                          loadingText="Deleting..."
                          onClick={() => handleDelete(property)}
                          disabled={isUpdating || editUpdating}
                          className="w-full"
                        >
                          Delete
                        </LoadingButton>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {promotionProperty && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePromotionDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promotion-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Sponsored placement
                  </p>

                  <h2
                    id="promotion-modal-title"
                    className="mt-1 text-xl font-bold text-gray-900"
                  >
                    Promote your property
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Choose how long you want this property to receive
                    priority placement.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePromotionDialog}
                  disabled={promotionSubmitting}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Close promotion window"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500">
                  Selected property
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                  {promotionProperty.title || "Untitled Property"}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[7, 14].map((days) => {
                  const selected =
                    Number(promotionDays) === Number(days);

                  return (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setPromotionDays(days)}
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p
                            className={`text-base font-bold ${
                              selected
                                ? "text-blue-700"
                                : "text-gray-900"
                            }`}
                          >
                            {days} Days
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Sponsored homepage placement
                          </p>
                        </div>

                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-sm font-semibold text-gray-900">
                  Your sponsored listing will:
                </p>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>• Appear before ordinary listings</p>
                  <p>• Display the Sponsored badge</p>
                  <p>• Receive increased homepage visibility</p>
                  <p>• Remain sponsored for the selected period</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closePromotionDialog}
                disabled={promotionSubmitting}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitPromotion}
                disabled={promotionSubmitting}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {promotionSubmitting
                  ? "Submitting..."
                  : `Request ${promotionDays}-Day Promotion`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editProp && isAgent && (
        <ListModal
          newProp={editProp}
          setNewProp={setEditProp}
          listPropBackend={updateProp}
          loading={editUpdating}
          setShowListModal={setShowEditModal}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}