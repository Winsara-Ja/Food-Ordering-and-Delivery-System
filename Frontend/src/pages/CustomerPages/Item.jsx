import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const Item = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/api/menu/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.menuItem;
        setItem({
          id: data._id,
          name: data.name,
          image: data.imageUrl,
          price: data.price,
          description: data.description,
          category: data.category,
          available: data.available,
          restaurantName: data.restaurant?.name || "Unknown",
          restaurantID: data.restaurant?._id || "Unknown",
        });
      } catch (err) {
        console.error("Failed to fetch item details:", err);
      }
    };

    fetchItem();
  }, [id]);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userID = decoded?.id;

  const restaurant = item?.restaurantID || "Unknown";
  const restaurant_name = item?.restaurantName || "Unknown";

  const Quantity = 1;

  const AddToCart = async (item) => {
    const { _id, name, description, price, image } = item;
    try {
      await axios.post("http://localhost:5000/addtocart", {
        userID,
        _id,
        restaurant,
        restaurant_name,
        name,
        description,
        Quantity,
        image,
        price,
      });
      if (item.error) {
        toast.error(item.error);
        console.error(item.error);
      } else {
        toast.success("Item Added To The Cart");
        console.log("Item Added To The Cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!item) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar role="customer" />
      <div className="max-w-4xl mx-auto p-10 pt-30">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-85 object-cover rounded-4xl mb-6"
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold">{item.name}</h1>
          <div className="flex gap-3">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
              onClick={() => AddToCart(item)}
            >
              Order Now
            </button>
            <button
              className="bg-orange-400 hover:bg-orange-500 text-black font-semibold py-2 px-4 rounded-xl transition duration-200"
              onClick={() => AddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <p className="text-2xl font-semibold mb-2">Rs. {item.price}</p>
        <p className="text-lg mb-4">
          {item.description || "No description available."}
        </p>

        <div className="space-y-1">
          <p>
            <span className="font-semibold">Category:</span> {item.category}
          </p>
          <p>
            <span className="font-semibold">Restaurant:</span>{" "}
            {item.restaurantName}
          </p>
          <p>
            <span className="font-semibold">Availability:</span>{" "}
            {item.available ? (
              <span className="text-green-400">Available</span>
            ) : (
              <span className="text-red-400">Unavailable</span>
            )}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Item;
