import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";  // Assuming you have Navbar
import Footer from "../../components/Footer";  // Assuming you have Footer

const RequestDashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestAccess = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/dashboard-requests/", {
        email,
        password,
      });
      toast.success(res.data.message);
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-25">
        <h1 className="text-2xl font-bold mb-6 text-center">Request Dashboard Access</h1>
        
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="mb-4 text-sm text-red-600 font-medium text-center">
              ⚠️ Please make sure you have signed up before requesting dashboard access.
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-2"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={handleRequestAccess}
              className={`w-full bg-orange-500 text-white py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Request Access"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestDashboard;
