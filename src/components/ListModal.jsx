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

  // ================= PREVIEW =================
  const getPreviewUrl = (img) => {
    if (!img) return null;

    if (typeof img === "string" && img.trim()) return img;

    if (img instanceof File) return URL.createObjectURL(img);

    if (img?.url) return img.url;

    return null;
  };

  useEffect(() => {
    if (!newProp?.images) return;

    const previews = newProp.images
      .map(getPreviewUrl)
      .filter(Boolean);

    setImagesPreview(previews);

    return () => {
      previews.forEach((src) => {
        if (src.startsWith("blob:")) URL.revokeObjectURL(src);
      });
    };
  }, [newProp.images]);

  // ================= INPUT =================
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

  // ================= ADD IMAGES =================
  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    setNewProp((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...files],
    }));
  };

  // ================= REMOVE IMAGE =================
  const removeImage = (index) => {
    setNewProp((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProp.title) return alert("Title is required");

    const propData = {
      ...newProp,
      lat: newProp.lat === "" ? null : newProp.lat,
      lng: newProp.lng === "" ? null : newProp.lng,
      agent_id:
        currentUser?.id ||
        currentUser?.user?.id ||
        currentUser?._id ||
        currentUser?.user?._id,
    };

    listPropBackend(propData, newProp.images || []);
  };

  // ================= LOCATION =================
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNewProp((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        }));
        setLocationStatus("Location captured ✔");
      },
      () => alert("Location error"),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? "Edit Property" : "List Property"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <input
            name="title"
            value={newProp.title || ""}
            onChange={handleChange}
            placeholder="Property title"
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-semibold block mb-2">
              Images {isEditMode && "(you can remove or add new ones)"}
            </label>

            <input type="file" multiple accept="image/*" onChange={handleImages} />

            {/* PREVIEW GRID */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              {imagesPreview.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    className="w-full h-24 object-cover rounded-lg"
                    alt="preview"
                  />

                  {/* REMOVE BUTTON */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LOCATION */}
          <div className="flex gap-2">
            <input
              name="lat"
              value={newProp.lat ?? ""}
              onChange={handleChange}
              placeholder="Latitude"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="lng"
              value={newProp.lng ?? ""}
              onChange={handleChange}
              placeholder="Longitude"
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="button"
              onClick={useMyLocation}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Use
            </button>
          </div>

          {/* ACTIONS */}
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
              {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}