import React, { useState } from "react";
import axios from "axios";

const CreateProperty = ({ currentUser }) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    rent_price: "",
    purpose: "buy", // <-- important for filtering
    type: "House",
    district: "Maseru",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    features: [],
    images: [],
  });

  const [loading, setLoading] = useState(false);

  // Add feature dynamically
  const addFeature = () => {
    const f = prompt("Enter feature name:");
    if (f) setForm({ ...form, features: [...form.features, f] });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  // Upload images to Cloudinary
  const uploadImgCloudinary = async (files) => {
    const cloudName = "dkaqpvzee"; // your Cloudinary cloud name
    const uploadPreset = "ml_default"; // unsigned preset
    const urls = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        return res.data.secure_url;
      })
    );
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to create a property.");
    if (!form.title || (!form.price && !form.rent_price) || !form.images.length)
      return alert("Title, price/rent, and at least 1 image are required.");

    setLoading(true);

    try {
      const urls = await uploadImgCloudinary(form.images);

      const payload = {
        ...form,
        images: urls,
        agent_id: currentUser.id || 1,
        purpose: form.purpose.toLowerCase(), // normalize to lowercase
      };

      await axios.post("http://localhost:3001/api/properties", payload);

      alert("Property created successfully!");
      setForm({
        title: "",
        price: "",
        rent_price: "",
        purpose: "buy",
        type: "House",
        district: "Maseru",
        location: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        description: "",
        features: [],
        images: [],
      });
    } catch (err) {
      console.error("Error creating property:", err);
      alert("Failed to create property: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Property Listing</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Purpose selector */}
        <select
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
        >
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Sale Price (for Buy)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Rent Price / month (for Rent)"
          value={form.rent_price}
          onChange={(e) => setForm({ ...form, rent_price: e.target.value })}
        />
        <input
          placeholder="Type (House, Apartment...)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <input
          placeholder="District"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
        />
        <input
          type="number"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
        />
        <input
          type="number"
          placeholder="Size (m²)"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="button" onClick={addFeature} className="bg-gray-200 p-2 rounded">
          + Add Feature
        </button>
        <input type="file" multiple onChange={handleFileChange} />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Create Property"}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
