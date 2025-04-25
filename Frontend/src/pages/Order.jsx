import React, { useEffect, useState, useContext, use } from "react";
import { GrLocation } from "react-icons/gr";
import { jwtDecode } from "jwt-decode";
import { FaChevronRight, FaChevronDown, FaRegClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Order = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userID = decoded?.id;

  const [orderItems, setOrderItems] = useState([]);
  const [search, setSearch] = useState([]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/orderItems/" + userID)
      .then((orderItems) => {
        setOrderItems(orderItems.data);
        setSearch(orderItems.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const filter = (e) => {
    setSearch(
      orderItems.filter((f) =>
        f.PaymetStatus.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <>
      <div className="p-12 bg-slate-50 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6 text-slate-800">
          Order History
        </h2>
        <div className="searchbox">
          <input
            type="text"
            className="search"
            onChange={filter}
            placeholder="Filter"
          ></input>
        </div>
        <div className="space-y-4">
          {search.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.ItemData.map((item, index) => (
                        <img
                          key={index}
                          src={item.Image}
                          alt={item.name}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {order.ItemData.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-sm text-slate-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800">
                          {order.RestaurantName}
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                          {order._id}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      {order.PaymetStatus}
                    </span>
                    {expandedOrder === order.id ? (
                      <FaChevronDown size={18} className="text-slate-400" />
                    ) : (
                      <FaChevronRight size={18} className="text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GrLocation size={20} />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaRegClock size={17} />
                      <span>Delivery time: {order.deliveryTime}</span>
                    </div>

                    <div className="space-y-3">
                      {order.ItemData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white p-3 rounded-xl"
                        >
                          <img
                            src={item.Image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800">
                              {item.ItemName}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-slate-600">
                                Rs. {item.ItemPrice} x {item.Quantity}
                              </span>
                              <span className="font-medium text-slate-800"></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                      <span className="font-medium text-slate-600">
                        Order Total
                      </span>
                      <span className="font-medium text-lg text-slate-800">
                        Rs. {order.TotalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Order;
