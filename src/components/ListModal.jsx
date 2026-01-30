import React, { useState } from "react";

export default function ListModal({ newProp, setNewProp, listPropBackend, loading, setShowListModal }) {
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProp((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setNewProp((prev) => ({ ...prev, images: files }));
    setImagesPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProp.title) return alert("Title is required");
    if (!newProp.location) return alert("Location is required");

    listPropBackend(newProp, newProp.images);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">List New Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newProp.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Type & Purpose */}
          <div className="flex gap-2">
            <select name="type" value={newProp.type} onChange={handleChange} className="flex-1 border px-3 py-2 rounded">
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>
            <select name="purpose" value={newProp.purpose} onChange={handleChange} className="flex-1 border px-3 py-2 rounded">
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* District & Location */}
          <div className="flex gap-2">
            <select name="district" value={newProp.district} onChange={handleChange} className="flex-1 border px-3 py-2 rounded">
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
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newProp.location}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Price & Rent Price */}
          <div className="flex gap-2">
            <input
              type="number"
              name="price"
              placeholder="Price (Buy)"
              value={newProp.price}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
              min={0}
            />
            <input
              type="number"
              name="rent_price"
              placeholder="Rent Price"
              value={newProp.rent_price}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
              min={0}
            />
          </div>

          {/* Bedrooms, Bathrooms, Size */}
          <div className="flex gap-2">
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={newProp.bedrooms}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
              min={0}
            />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={newProp.bathrooms}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
              min={0}
            />
            <input
              type="number"
              name="size"
              placeholder="Size (m²)"
              value={newProp.size}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
              min={0}
            />
          </div>

          {/* Phone & WhatsApp */}
          <div className="flex gap-2">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={newProp.phone}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Number"
              value={newProp.whatsapp}
              onChange={handleChange}
              className="flex-1 border px-3 py-2 rounded"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={newProp.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="w-full"
          />

          {/* Preview */}
          {imagesPreview.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagesPreview.map((src, i) => (
                <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowListModal(false)}
              className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Listing..." : "List Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
