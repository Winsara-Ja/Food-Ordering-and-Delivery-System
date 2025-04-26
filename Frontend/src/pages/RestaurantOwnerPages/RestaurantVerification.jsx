import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Add this

const RestaurantVerification = () => {
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document) return;

    const formData = new FormData();
    formData.append("document", document);

    try {
      const res = await axios.post("http://localhost:4000/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setMessage(res.data.message);

      // ✅ Navigate after success
      navigate("/restaurant-home");

    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Business Registration Document</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setDocument(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RestaurantVerification;
