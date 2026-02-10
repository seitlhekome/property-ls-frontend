import React, { useState, useEffect } from "react";

export default function ListModal({
  newProp,
  setNewProp,
  listPropBackend,
  loading,
  setShowListModal,
}) {
  const [imagesPreview, setImagesPreview] = useState([]);
  const [locationStatus, setLocationStatus] = useState("");

  // Initialize images preview if there are existing images
  useEffect(() => {
    if (newProp?.images && newProp.images.length > 0) {
      setImagesPreview(
        newProp.images.map((f) =>
          typeof f === "string" ? f : URL.createObjectURL(f)
        )
      );
    }
  }, [newProp]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure lat/lng remain numbers
    if (name === "lat" || name === "lng") {
      setNewProp((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
    } else {
      setNewProp((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setNewProp((prev) => ({ ...prev, images: files }));
    setImagesPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProp.title) return alert("Title is required");
    if (!newProp.district) return alert("District is required");
    if (!newProp.location) return alert("Location is required");
    if (newProp.purpose === "buy" && !newProp.price)
      return alert("Price is required");
    if (newProp.purpose === "rent" && !newProp.rent_price)
      return alert("Rent price is required");

    // Pass lat/lng as numbers if provided
    const propData = {
      ...newProp,
      lat: newProp.lat ? Number(newProp.lat) : null,
      lng: newProp.lng ? Number(newProp.lng) : null,
    };

    listPropBackend(propData, newProp.images);
  };

  // Manual location trigger
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
        <h2 className="text-2xl font-bold mb-4">List New Property</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="font-semibold mb-1 block">Title</label>
            <input
              type="text"
              name="title"
              value={newProp.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter property title"
              required
            />
          </div>

          {/* Type & Purpose */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">Property Type</label>
              <select
                name="type"
                value={newProp.type}
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
                value={newProp.purpose}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          {/* District & Location */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">District</label>
              <select
                name="district"
                value={newProp.district}
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
                value={newProp.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          {/* Coordinates */}
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

          {/* Price / Rent */}
          {newProp.purpose === "buy" && (
            <div>
              <label className="font-semibold mb-1 block">Price (Buy)</label>
              <input
                type="number"
                name="price"
                value={newProp.price}
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
                value={newProp.rent_price}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min={0}
              />
            </div>
          )}

          {/* Bedrooms / Bathrooms */}
          {newProp.type === "House" && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="font-semibold mb-1 block">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={newProp.bedrooms}
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
                  value={newProp.bathrooms}
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
                value={newProp.size}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                min={0}
              />
            </div>
          )}

          {/* Contact Numbers */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-semibold mb-1 block">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={newProp.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="font-semibold mb-1 block">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={newProp.whatsapp}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="font-semibold mb-1 block">Images</label>
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
                />
              ))}
            </div>
          )}

          {/* Buttons */}
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
              {loading ? "Listing..." : "List Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
