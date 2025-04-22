import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SetAvailability = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/restaurants/my-restaurant", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurant(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load restaurant data");
    }
  };

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedStatus = restaurant.status === "open" ? "closed" : "open";

      await axios.put(
        `http://localhost:4000/api/restaurants/${restaurant._id}`,
        { status: updatedStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRestaurant({ ...restaurant, status: updatedStatus });
      toast.success(`Restaurant marked as ${updatedStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="restaurant_owner"/>
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md mt-30">
      <h2 className="text-2xl font-semibold mb-4 text-center">Restaurant Availability</h2>
      <p className="mb-6 text-center text-lg">
        Current Status: <span className={`font-bold ${restaurant.status === "open" ? "text-green-500" : "text-red-500"}`}>{restaurant.status.toUpperCase()}</span>
      </p>
      <button
        onClick={toggleAvailability}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold"
      >
        Set as {restaurant.status === "open" ? "Closed" : "Open"}
      </button>
    </div>
    <Footer />
    </div>
  );
};

export default SetAvailability;

