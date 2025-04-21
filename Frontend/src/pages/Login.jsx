import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/bg1.jpg"; 
import "@fontsource/manrope"; // Defaults to weight 400

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;

      // Save token to localStorage
      localStorage.setItem("token", token);
      if (remember) localStorage.setItem("rememberedEmail", email);

      // Navigate based on role
      if (role === "customer") navigate("/customer-home");
      else if (role === "restaurant_owner") navigate("/restaurant-home");
      else if (role === "admin") navigate("/admin-home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative font-manrope"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      {/* Animated Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md  border border-white/20"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-m font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
              required
            />
          </div>
          <div>
            <label className="block text-m font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl bg-white/10 placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 text-gray-600"
              />
              <span className="text-gray-600">Remember Me</span>
            </label>
            <a href="#" className="text-gray-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-40 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-xl font-semibold block mx-auto"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
