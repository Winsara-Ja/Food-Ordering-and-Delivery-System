import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";

const RestaurantHome = () => {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/api/restaurants/my-restaurant`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurant(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurant details:", err);
      }
    };

    fetchRestaurant();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-manrope">
      <Navbar role="restaurant_owner" />
      <main className="flex-grow">
        <div className="text-center pt-28">
          {restaurant && (
            <div className="flex flex-col items-center space-y-4 mb-8">
              {restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt="Restaurant Logo"
                  className="h-40 w-40 rounded-full object-cover border-2 border-orange-400"
                />
              )}
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            </div>
          )}
          <div className="text-2xl font-bold text-white mb-4">
            Welcome, owner!
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 px-4">
          {/* Register Notice */}
          <div className="bg-gray-100 backdrop-blur-md p-6 rounded-xl w-80 text-center shadow-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/433/433036.png"
              alt="Register"
              className="h-20 w-20 mx-auto mb-4"
            />
            <p className="text-lg mb-4 text-gray-800">Haven't registered your restaurant yet?</p>
            <Link
              to="/register-restaurant"
              className="inline-block bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded-full transition duration-200 font-semibold"
            >
              Register Now
            </Link>
          </div>

          {/* Verify Notice */}
          <div className="bg-gray-100 backdrop-blur-md p-6 rounded-xl w-80 text-center shadow-md">
            <img
              src="https://files.softicons.com/download/system-icons/crystal-intense-icons-by-tatice/png/256/Valide.png"
              alt="Verify"
              className="h-20 w-20 mx-auto mb-4"
            />
            <p className="text-lg mb-4 text-gray-800">Haven't verified your restaurant yet?</p>
            <Link
              to="/restaurant-verification"
              className="inline-block bg-orange-400 hover:bg-orange-500 text-white py-2 px-6 rounded-full transition duration-200 font-semibold"
            >
              Verify Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantHome;
