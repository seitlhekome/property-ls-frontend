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

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeDataView, setActiveDataView] = useState("saved");

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

  const handleDelete = async (property) => {
    const propertyId = getPropertyId(property);

    if (!propertyId) {
      alert("Invalid property ID");
      return;
    }

    if (!token) {
      alert("You must be logged in");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        property.title || "this property"
      }"?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/properties/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      alert("Property deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);

      alert(
        error.response?.data?.error ||
          "Failed to delete property"
      );
    }
  };

  const handleVisibilityChange = async (property) => {
    const propertyId = getPropertyId(property);

    if (!propertyId) {
      alert("Invalid property ID");
      return;
    }

    if (!token) {
      alert("You must be logged in");
      return;
    }

    const isHidden =
      (property.status || "active") === "hidden";

    const action = isHidden ? "show" : "hide";

    const confirmed = window.confirm(
      isHidden
        ? "Show this property publicly again?"
        : "Hide this property from the homepage, map, search and public listings?"
    );

    if (!confirmed) return;

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

      alert(
        isHidden
          ? "Property is visible again."
          : "Property hidden successfully."
      );
    } catch (error) {
      console.error(`${action} property failed:`, error);

      alert(
        error.response?.data?.error ||
          `Failed to ${action} property`
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
      alert("You must be logged in");
      return;
    }

    try {
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

      alert("Property updated successfully");

      setShowEditModal(false);
      setEditProp(null);

      await fetchProperties();
    } catch (error) {
      console.error("Update failed:", error);

      alert(
        error.response?.data?.error ||
          "Failed to update property"
      );
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
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

                  {/* POSTED DATE */}

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                    <CalendarIcon className="h-3.5 w-3.5" />

                    <span>
                      Posted{" "}
                      {postedDate
                        ? new Date(
                            postedDate
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>

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
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(property)
                          }
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            handleVisibilityChange(property)
                          }
                          className={`rounded-lg px-3 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isHidden
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-amber-500 hover:bg-amber-600"
                          }`}
                        >
                          {isUpdating
                            ? "Updating..."
                            : isHidden
                            ? "Show"
                            : "Hide"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(property)
                          }
                          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
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