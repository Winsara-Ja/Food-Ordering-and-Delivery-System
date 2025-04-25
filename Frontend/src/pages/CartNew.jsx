import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaMinus, FaRegTrashAlt } from "react-icons/fa";

const CartNew = () => {
  const userID = "663b79ac751b61805e4a1a03";
  const UserName = "Jayana";
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

  const Order = async (cartItems) => {
    try {
      await axios.post("http://localhost:5000/order", {
        userID,
        resID,
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-slate-800">
                    {item.ItemName}
                  </h3>
                  <p className="text-slate-500">{item.Description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium text-slate-800">
                      Rs. {item.ItemPrice}
                      {item.Quantity * item.ItemPrice}
                    </p>
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
                        onClick={() => UpdateItemRemove(item)}
                      >
                        <FaRegTrashAlt size={16} />
                      </button>
                    </div>
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
                  <span>$Rs. {Total}</span>Total
                </div>
              </div>
            </div>
            <button
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 font-medium mt-6 hover:from-indigo-700 hover:to-violet-700 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

export default CartNew;
