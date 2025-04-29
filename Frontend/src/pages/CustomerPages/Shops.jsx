import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Shops = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token"); 

        const response = await axios.get("http://localhost:4000/api/restaurants", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="text-white p-10">Loading restaurants...</div>;

  return (
    <div className="min-h-screen ">
      <Navbar role="customer"/>
      <div className="max-w-1xl mx-auto px-20 pt-30">
      <h1 className="text-3xl font-bold pl-5 mb-6">Explore Top Food Spots</h1>

      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
          <div
          key={restaurant._id}
          onClick={() => navigate(`/restaurant/${restaurant._id}`)}
          className="bg-gray-100 p-4 w-70 mx-auto rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
        
              {restaurant.logoUrl && (
                <img
                  src={restaurant.logoUrl}
                  alt={`${restaurant.name} logo`}
                  className="w-full h-60  rounded-lg mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-sm">{restaurant.address}</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  restaurant.status === "open" ? "text-green-400" : "text-red-400"
                }`}
              >
                {restaurant.status}
              </p>
            </div>
          ))}
        </div>
        
      )}
      </div>
      <Footer/>
    </div>
  );
};

export default Shops;
