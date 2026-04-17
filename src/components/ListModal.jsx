import React, { useState, useEffect } from "react";

export default function ListModal({
  newProp,
  setNewProp,
  listPropBackend,
  loading = false,
  setShowListModal,
  currentUser,
}) {
  const [imagesPreview, setImagesPreview] = useState([]);
  const [locationStatus, setLocationStatus] = useState("");

  const isEditMode = Boolean(newProp?.id || newProp?._id);

  const districtOptions = [
    "Maseru",
    "Butha Buthe",
    "Leribe",
    "Berea",
    "Mafeteng",
    "Mohale's Hoek",
    "Quthing",
    "Semonkong",
    "Thaba Tseka",
    "Mantsonyane",
    "Qacha's Neck",
    "Mokhotlong",
  ];

  const propertyTypes = [
    "House",
    "Apartment",
    "Guesthouse",
    "Land",
    "Commercial",
  ];

  const getPreviewUrl = (img) => {
    if (!img) return null;

    if (typeof img === "string" && img.trim()) {
      return img;
    }

    if (img instanceof File || img instanceof Blob) {
      return URL.createObjectURL(img);
    }

    if (typeof img === "object" && img.url) {
      return img.url;
    }

    return null;
  };

  const isExistingImage = (img) => {
    return (
      (typeof img === "string" && img.trim()) ||
      (img &&
        typeof img === "object" &&
        !(img instanceof File) &&
        !(img instanceof Blob) &&
        typeof img.url === "string" &&
        img.url.trim())
    );
  };

  const isNewFileImage = (img) => img instanceof File || img instanceof Blob;

  useEffect(() => {
    if (!newProp?.images || newProp.images.length === 0) {
      setImagesPreview([]);
      return;
    }

    const previews = newProp.images.map(getPreviewUrl).filter(Boolean);
    setImagesPreview(previews);

    return () => {
      previews.forEach((src) => {
        if (typeof src === "string" && src.startsWith("blob:")) {
          URL.revokeObjectURL(src);
        }
      });
    };
  }, [newProp?.images]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["lat", "lng"].includes(name)) {
      setNewProp((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    if (
      ["price", "rent_price", "bedrooms", "bathrooms", "size"].includes(name)
    ) {
      setNewProp((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    setNewProp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setNewProp((prev) => ({
      ...prev,
      images: [...(Array.isArray(prev.images) ? prev.images : []), ...files],
    }));

    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewProp((prev) => ({
      ...prev,
      images: (Array.isArray(prev.images) ? prev.images : []).filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProp.title?.trim()) return alert("Title is required");
    if (!newProp.district?.trim()) return alert("District is required");
    if (!newProp.location?.trim()) return alert("Location is required");

    if (newProp.purpose === "buy" && !newProp.price) {
      return alert("Price is required");
    }

    if (newProp.purpose === "rent" && !newProp.rent_price) {
      return alert("Rent price is required");
    }

    const allImages = Array.isArray(newProp.images) ? newProp.images : [];
    const newImageFiles = allImages.filter(isNewFileImage);

    const retainedImages = allImages
      .filter(isExistingImage)
      .map((img) => {
        if (typeof img === "string") {
          return { url: img };
        }

        if (img && typeof img === "object") {
          return {
            url: img.url,
            public_id: img.public_id || null,
          };
        }

        return null;
      })
      .filter(Boolean);

    const propData = {
      ...newProp,
      description: newProp.description || "",
      lat: newProp.lat === "" ? null : newProp.lat,
      lng: newProp.lng === "" ? null : newProp.lng,
      retainedImages,
      agent_id:
        currentUser?.id ||
        currentUser?.user?.id ||
        currentUser?._id ||
        currentUser?.user?._id ||
        null,
    };

    listPropBackend(propData, newImageFiles);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your device");
      return;
    }

    setLocationStatus("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNewProp((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        }));
        setLocationStatus("Location captured ✔");
      },
      () => {
        setLocationStatus("Unable to access your location");
        alert("Unable to access your location");
      },
      { enableHighAccuracy: true }
    );
  };

  const showBedroomBathroomFields =
    newProp.type === "House" ||
    newProp.type === "Apartment" ||
    newProp.type === "Guesthouse";

  const showSizeField =
    newProp.type === "Land" ||
    newProp.type === "Commercial" ||
    newProp.type === "Guesthouse";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Property" : "List New Property"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add full property details, photos, location, and contact
              information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowListModal(false)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block font-semibold text-gray-800">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newProp.title || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Enter property title"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Property Type
              </label>
              <select
                name="type"
                value={newProp.type || "House"}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {propertyTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Purpose
              </label>
              <select
                name="purpose"
                value={newProp.purpose || "buy"}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                District
              </label>
              <select
                name="district"
                value={newProp.district || "Maseru"}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {districtOptions.map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Street / Area
              </label>
              <input
                type="text"
                name="location"
                value={newProp.location || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. Masowe 3, Roma, Hills View"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Latitude (Optional)
              </label>
              <input
                type="number"
                name="lat"
                value={newProp.lat ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                step="any"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Longitude (Optional)
              </label>
              <input
                type="number"
                name="lng"
                value={newProp.lng ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                step="any"
                placeholder="Optional"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={useMyLocation}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Use My Location
              </button>
            </div>
          </div>

          {locationStatus && (
            <p className="text-sm text-gray-600">{locationStatus}</p>
          )}

          {newProp.purpose === "buy" && (
            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Price (Buy)
              </label>
              <input
                type="number"
                name="price"
                value={newProp.price ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min={0}
              />
            </div>
          )}

          {newProp.purpose === "rent" && (
            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Rent Price
              </label>
              <input
                type="number"
                name="rent_price"
                value={newProp.rent_price ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min={0}
              />
            </div>
          )}

          {showBedroomBathroomFields && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-gray-800">
                  Bedrooms / Rooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={newProp.bedrooms ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  min={0}
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-800">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={newProp.bathrooms ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  min={0}
                />
              </div>
            </div>
          )}

          {showSizeField && (
            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Size (m²)
              </label>
              <input
                type="number"
                name="size"
                value={newProp.size ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                min={0}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block font-semibold text-gray-800">
              Description
            </label>
            <textarea
              name="description"
              value={newProp.description || ""}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Write a clear description of the property, rooms, access, features, surroundings, and anything buyers or renters should know."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={newProp.phone || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. 57123456"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-gray-800">
                WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsapp"
                value={newProp.whatsapp || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. 57123456"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-800">
              Photos{" "}
              {isEditMode
                ? "(you can add more and remove the ones you do not want)"
                : "(you can upload multiple photos)"}
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
              className="block w-full text-sm text-gray-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              You can select many photos. They will appear below, and you can
              remove any photo before saving.
            </p>
          </div>

          {imagesPreview.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {imagesPreview.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-2"
                >
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="mb-2 h-24 w-full rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="w-full rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Remove Photo
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowListModal(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Listing..."
                : isEditMode
                ? "Update Property"
                : "List Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}