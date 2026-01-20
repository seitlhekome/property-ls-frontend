// src/components/ListModal.jsx
import React, { useState } from "react";

export default function ListModal({
  newProp,
  setNewProp,
  listPropBackend,
  loading,
  setShowListModal,
}) {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProp((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowListModal(false);
    setImagePreviews([]);
    setImagesFiles([]);
    setNewProp({
      title: "",
      price: "",
      rent_price: "",
      type: "House",
      district: "Maseru",
      location: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      description: "",
      images: [],
    });
  };

  const handleSubmit = async () => {
    if (!newProp.title || !newProp.price || imagesFiles.length === 0) {
      return alert("Please fill in title, price, and upload at least 1 image.");
    }
    await listPropBackend(newProp, imagesFiles);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">List New Property</h2>

        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={newProp.title}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Sale Price (M)"
          value={newProp.price}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="number"
          name="rent_price"
          placeholder="Rent Price / month (M)"
          value={newProp.rent_price}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <select
          name="type"
          value={newProp.type}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        >
          <option value="House">House</option>
          <option value="Apartment">Apartment</option>
          <option value="Land">Land</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select
          name="district"
          value={newProp.district}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        >
          <option value="Maseru">Maseru</option>
          <option value="Butha Buthe">Butha Buthe</option>
          <option value="Leribe">Leribe</option>
          <option value="Berea">Berea</option>
          <option value="Mafeteng">Mafeteng</option>
          <option value="Mohale's Hoek">Mohale's Hoek</option>
          <option value="Quthing">Quthing</option>
          <option value="Semonkong">Semonkong</option>
          <option value="Thaba Tseka">Thaba Tseka</option>
          <option value="Mantsonyane">Mantsonyane</option>
          <option value="Qacha's Neck">Qacha's Neck</option>
          <option value="Mokhotlong">Mokhotlong</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location / Street"
          value={newProp.location}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={newProp.bedrooms}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded"
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={newProp.bathrooms}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded"
          />
        </div>

        <input
          type="number"
          name="size"
          placeholder="Size (m²)"
          value={newProp.size}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={newProp.description}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <div className="mb-3">
          <label className="font-medium mb-1 block">Property Images</label>
          <input type="file" multiple onChange={handleImageChange} className="mb-2" />
          <div className="flex gap-2 flex-wrap mt-2">
            {imagePreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Preview ${i + 1}`}
                className="h-20 w-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || imagesFiles.length === 0}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Listing..." : "List Property"}
        </button>
      </div>
    </div>
  );
}
