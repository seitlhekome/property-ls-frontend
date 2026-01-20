import React, { useState } from "react";
import { API_URL } from "../config";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState(user.phone || "");
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || "");

  const updateProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone, whatsapp }),
      });

      const data = await res.json();

      if (data.success) {
        const updatedUser = { ...user, phone, whatsapp };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated!");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Profile</h1>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="WhatsApp Number (Optional)"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
      />

      <button onClick={updateProfile}>Save Changes</button>
    </div>
  );
};

export default UserProfile;
