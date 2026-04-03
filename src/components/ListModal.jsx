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

    if (["price", "rent_price", "bedrooms", "bathrooms", "size"].includes(name)) {
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

    setNewProp((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProp.title) return alert("Title is required");
    if (!newProp.district) return alert("District is required");
    if (!newProp.location) return alert("Location is required");
    if (newProp.purpose === "buy" && !newProp.price) {
      return alert("Price is required");
    }
    if (newProp.purpose === "rent" && !newProp.rent_price) {
      return alert("Rent price is required");
    }

    const propData = {
      ...newProp,
      lat: newProp.lat === "" ? null : newProp.lat,
      lng: newProp.lng === "" ? null : newProp.lng,
      agent_id:
        currentUser?.id ||
        currentUser?.user?.id ||
        currentUser?._id ||
        currentUser?.user?._id ||
        null,
    };

    listPropBackend(propData, Array.isArray(newProp.images) ? newProp.images : []);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? "Edit Property" : "List New Property"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold mb-1 block">Title</label>
            <input
              type="text"
              name="title"
              value={newProp.title || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter property title"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">Property Type</label>
              <select
                name="type"
                value={newProp.type || "House"}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option>House</option>
                <option>Land</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="font-semibold mb-1 block">Purpose</label>
              <select
                name="purpose"
                value={newProp.purpose || "buy"}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">District</label>
              <select
                name="district"
                value={newProp.district || "Maseru"}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option>Maseru</option>
                <option>Butha Buthe</option>
                <option>Leribe</option>
                <option>Berea</option>
                <option>Mafeteng</option>
                <option>Mohale's Hoek</option>
                <option>Quthing</option>
                <option>Semonkong</option>
                <option>Thaba Tseka</option>
                <option>Mantsonyane</option>
                <option>Qacha's Neck</option>
                <option>Mokhotlong</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="font-semibold mb-1 block">Street / Area</label>
              <input
                type="text"
                name="location"
                value={newProp.location || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">Latitude (Optional)</label>
              <input
                type="number"
                name="lat"
                value={newProp.lat ?? ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                step="any"
                placeholder="Optional"
              />
            </div>

            <div className="flex-1">
              <label className="font-semibold mb-1 block">Longitude (Optional)</label>
              <input
                type="number"
                name="lng"
                value={newProp.lng ?? ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                step="any"
                placeholder="Optional"
              />
            </div>

            <button
              type="button"
              onClick={useMyLocation}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Use My Location
            </button>
          </div>

          {locationStatus && (
            <p className="text-sm text-gray-600">{locationStatus}</p>
          )}

          {newProp.purpose === "buy" && (
            <div>
              <label className="font-semibold mb-1 block">Price (Buy)</label>
              <input
                type="number"
                name="price"
                value={newProp.price ?? ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min={0}
              />
            </div>
          )}

          {newProp.purpose === "rent" && (
            <div>
              <label className="font-semibold mb-1 block">Rent Price</label>
              <input
                type="number"
                name="rent_price"
                value={newProp.rent_price ?? ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min={0}
              />
            </div>
          )}

          {newProp.type === "House" && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={newProp.bedrooms ?? ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  min={0}
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={newProp.bathrooms ?? ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  min={0}
                />
              </div>
            </div>
          )}

          {newProp.type === "Land" && (
            <div>
              <label className="font-semibold mb-1 block">Size (m²)</label>
              <input
                type="number"
                name="size"
                value={newProp.size ?? ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min={0}
              />
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={newProp.phone || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold mb-1 block">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={newProp.whatsapp || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold mb-1 block">
              Images {isEditMode ? "(choose new ones to replace current images)" : ""}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
            />
          </div>

          {imagesPreview.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imagesPreview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowListModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading
                ? (isEditMode ? "Updating..." : "Listing...")
                : (isEditMode ? "Update Property" : "List Property")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}