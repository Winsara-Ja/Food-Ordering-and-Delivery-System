import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/bg1.jpg";
import "@fontsource/manrope"; // Defaults to weight 400

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!formData.agree) {
      return setError("Please agree to the Terms & Conditions");
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(res.data.message);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative font-manrope"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      {/* Animated Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md border border-white/20"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-m font-medium">Name</label>
            <input
              type="text"
              name="username"
              autoComplete="off"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
              required
            />
          </div>
          <div>
            <label className="block text-m font-medium">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
              required
            />
          </div>
          <div>
            <label className="block text-m font-medium">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
              required
            />
          </div>
          <div>
            <label className="block text-m font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="off"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
              required
            />
          </div>

          {/* Agree to Terms */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-gray-600"
              />
              <span className="text-gray-600">
                I agree to the{" "}
                <span className="underline cursor-pointer">
                  Terms & Conditions
                </span>
              </span>
            </label>
          </div>

          {/* Error & Success Messages */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-40 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-xl font-semibold block mx-auto"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-4 text-white/90">
            Already have an account?{" "}
            <a href="/login" className="text-gray-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
