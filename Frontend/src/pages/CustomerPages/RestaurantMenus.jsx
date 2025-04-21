import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const RestaurantMenus = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:4000/api/restaurants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurant(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurant", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!restaurant) return <div className="text-red-500 p-10">Restaurant not found</div>;

  return (
    <div className="min-h-screen">
      <Navbar role="customer"/>
      <div className="max-w-1xl mx-auto px-10 pt-30">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{restaurant.name} - Menus</h1>
          <p className="text-gray-400 mb-2">{restaurant.address}</p>
          <p className="text-sm text-gray-400 mb-6">{restaurant.email}</p>

          {restaurant.logoUrl && (
            <img
              src={restaurant.logoUrl}
              alt={`${restaurant.name} logo`}
              className="w-52 h-52 object-contain rounded-xl border mb-8"
            />
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>

        <div className="flex flex-wrap gap-6">
          {restaurant.menu.map((item) => (
            <Link to={`/menu/${item._id}`} key={item._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="bg-gray-100 p-4 rounded-lg hover:shadow-lg transition cursor-pointer h-full">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
                <p className="text-gray-500 font-bold">Rs. {item.price}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
      <Footer />

    </div>
  );
};

export default RestaurantMenus;
