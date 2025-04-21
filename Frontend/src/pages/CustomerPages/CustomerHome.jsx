import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  { id: 1, name: "Pizza", icon: "🍕" },
  { id: 2, name: "Burgers", icon: "🍔" },
  { id: 3, name: "Sushi", icon: "🍣" },
  { id: 4, name: "Drinks", icon: "🥤" },
  { id: 5, name: "Desserts", icon: "🍰" },
  { id: 6, name: "Fruits", icon: "🍎" },
  { id: 7, name: "Coffee", icon: "☕" },
  { id: 8, name: "Bakery", icon: "🥖" },
  { id: 9, name: "Hotdogs", icon: "🌭" },
  { id: 10, name: "Chicken", icon: "🍗" },
  { id: 11, name: "Ice Cream", icon: "🍦" },
  { id: 12, name: "Tacos", icon: "🌮" },
  { id: 13, name: "Salad", icon: "🥗" },
  { id: 14, name: "Noodles", icon: "🍜" },
];

const filterTags = ["All", "Popular", "New", "Spicy", "Healthy", "Quick Bites"];

const CustomerHome = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [topSellers, setTopSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/menu", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedItems = res.data.menuItems.map((item) => ({
          id: item._id,
          name: item.name,
          image: item.imageUrl,
          price: `Rs. ${item.price}`,
        }));
        setTopSellers(fetchedItems);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="min-h-screen bg-white-100 overflow-x-hidden">
      <Navbar role="customer"/>

      <div className="max-w-1xl mx-auto px-10 pt-20">
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-semibold px-10 py-6">Categories</h2>
          <div className="px-10 pr-10 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 pb-4">
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.1 }}
                  className="min-w-[100px] bg-gray-300 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-400 transition"
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium text-center">
                    {cat.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Tags + Search */}
        <section className="pt-6 pb-2 px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-3">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm text-white font-medium transition ${
                    selectedTag === tag
                      ? "bg-orange-400 text-white"
                      : "bg-neutral-600 hover:bg-orange-500"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Bar with Icon */}
            <div className="relative w-full md:w-150">
              <FiSearch className="absolute left-3 top-3 text-white" />
              <input
                type="text"
                placeholder="Search top sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-600 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </section>

        {/* Top Sellers */}
        <section className="mb-10 py-8 px-10">
          <h2 className="text-2xl font-semibold mb-4">Top Sellers</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topSellers
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-100 rounded-lg shadow-lg overflow-hidden"
                  onClick={() => navigate(`/menu/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600 mt-1">{item.price}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerHome;
