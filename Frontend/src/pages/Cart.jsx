import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaPlus, FaMinus, FaRegTrashAlt } from "react-icons/fa";

const Cart = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userID = decoded?.id;

  const UserName = "";

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  let Total = 0;
  useEffect(() => {
    axios
      .get("http://localhost:5000/cart/" + userID)
      .then((cartItems) => setCartItems(cartItems.data))
      .catch((err) => console.log(err));
  }, [cartItems]);

  const resID = cartItems[0]?.RestaurantID;
  const resName = cartItems[0]?.RestaurantName;

  const UpdateItemAdd = async (cartItem) => {
    const { _id, Quantity } = cartItem;
    try {
      await axios.put("http://localhost:5000/update/add", {
        _id,
        Quantity,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateItemRemove = async (cartItem) => {
    const { _id, Quantity } = cartItem;
    if (Quantity <= 1) {
      DeleteItem(cartItem._id);
    } else {
      try {
        await axios.put("http://localhost:5000/update/remove", {
          _id,
          Quantity,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const DeleteItem = async (id) => {
    try {
      await axios.delete("http://localhost:5000/item/delete/" + id);
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/cart/clear/" + userID);
    } catch (error) {
      console.log(error);
    }
  };

  const Order = async (cartItems) => {
    try {
      await axios.post("http://localhost:5000/order", {
        userID,
        resID,
        resName,
        UserName,
        cartItems,
        Total,
      });
      if (cartItems.error) {
        res.json({
          error: error,
        });
      } else {
        navigate("/order");
        clearCart();
        // toast.success("Order Placed Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  cartItems.map(
    ({ ItemPrice, Quantity }) => (Total = Total + ItemPrice * Quantity)
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6 text-slate-800">
            My Cart
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 flex gap-4"
              >
                <img
                  src={item.Image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-2">
                  <h3 className="font-medium text-lg text-slate-800">
                    {item.ItemName}
                  </h3>
                  <p className="text-slate-500 line-clamp-3">
                    {item.Description}
                  </p>
                  <div>
                    <div className="flex items-center gap-3">
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => UpdateItemRemove(item)}
                      >
                        <FaMinus size={16} className="text-slate-600" />
                      </button>
                      <span className="font-medium text-slate-800 w-6 text-center">
                        {item.Quantity}
                      </span>
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => UpdateItemAdd(item)}
                      >
                        <FaPlus size={16} className="text-slate-600" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 ml-2"
                        onClick={() => DeleteItem(item._id)}
                      >
                        <FaRegTrashAlt size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-1 text-right gap-12">
                  <div className="text-slate-600 font-medium">
                    <p className="text-slate-800">Item Price</p>
                    Rs. {item.ItemPrice}
                  </div>
                  <div className="text-slate-600 font-medium">
                    <p className="text-slate-800">Total Price</p>
                    Rs. {item.ItemPrice * item.Quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>Rs. {Total}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>Rs. TBD</span>
              </div>
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex justify-between font-medium text-base text-slate-800">
                  <span>Total</span>
                  <span>Rs. {Total}</span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-xl py-3 font-medium mt-6 hover:from-amber-700 hover:to-yellow-700 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => Order(cartItems)}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
