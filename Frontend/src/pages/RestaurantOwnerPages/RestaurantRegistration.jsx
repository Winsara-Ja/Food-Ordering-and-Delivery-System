import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundImage from "../../assets/bg1.jpg";
import "@fontsource/manrope";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantRegistration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    logoUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/restaurants", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Restaurant Registered successfully!");

      setTimeout(() => navigate("/restaurant-home"), 3000); // Wait for toast before navigating
    } catch (err) {
      toast.error("Create failed");
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
        <h2 className="text-3xl font-bold mb-6 text-center">Register Your Restaurant</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Restaurant Name"
            className="w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
            required
          />
          <input
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleChange}
            placeholder="Logo URL (Optional)"
            className="w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
          />

          <button
            type="submit"
            className="w-40 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-xl font-semibold block mx-auto"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RestaurantRegistration;
