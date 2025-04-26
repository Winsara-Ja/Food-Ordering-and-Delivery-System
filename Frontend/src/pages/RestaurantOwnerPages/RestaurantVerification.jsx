import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundImage from "../../assets/bg1.jpg"; 
import "@fontsource/manrope";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantVerification = () => {
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
      toast.success("Document uploaded successfully!");

      setTimeout(() => navigate("/restaurant-home"), 3000); // wait for toast then navigate
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative font-manrope"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ToastContainer />

      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-xl border border-white/20"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Your Business Registration Document</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full">
            <label
              htmlFor="document-upload"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-40 px-4 py-6 border-2 border-dashed border-white/30 rounded-xl bg-white/10 text-white text-sm font-medium backdrop-blur-md hover:bg-white/20 transition duration-200"
            >
              {document ? (
                <span className="text-center">{document.name}</span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 mb-2 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-center text-white/70">Click to upload or drag & drop</span>
                </>
              )}
            </label>
            <input
              id="document-upload"
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
              className="hidden"
              required
            />
          </div>

          <button
            type="submit"
            className="w-40 bg-orange-400 hover:bg-orange-500 py-2 rounded-xl font-semibold block mx-auto"
          >
            Upload
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-white">{message}</p>
        )}
      </motion.div>

      <button
        onClick={() => navigate("/restaurant-home")}
        className="fixed bottom-10 right-10 bg-white/20 backdrop-blur-md hover:bg-white/30 text-sm font-semibold py-2 px-4 rounded-lg border border-white/30 transition duration-200"
      >
        Skip for now
      </button>

    </div>
  );
};

export default RestaurantVerification;
