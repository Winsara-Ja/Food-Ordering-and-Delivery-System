import React, { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { FaChevronRight, FaChevronDown, FaRegClock } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "../../components/Header";
import axios from "axios";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/orderItems") // Fetch all orders
      .then((res) => {
        setOrders(res.data);
        setSearch(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filterOrders = (e) => {
    setSearch(
      orders.filter((order) =>
        order.PaymetStatus.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const incomeData = orders.map((order) => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    income: order.TotalPrice,
  }));

  return (
    <>
      <Header />
      <div className="p-8 bg-slate-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">
          Restaurant Orders Overview
        </h2>

        {/* Income Chart */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">
            Income Summary
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#e17200" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Payment Status..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            onChange={filterOrders}
          />
        </div>

        {/* Order List */}
        <div className="space-y-5">
          {search.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-slate-100 transition-all"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {order.ItemData.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.Image}
                          alt={item.ItemName}
                          className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {order.ItemData.length > 3 && (
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-500 text-sm rounded-full border-2 border-white">
                          +{order.ItemData.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800">
                        {order._id}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.PaymetStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {order.PaymetStatus}
                    </span>
                    {expandedOrder === order._id ? (
                      <FaChevronDown size={20} className="text-slate-400" />
                    ) : (
                      <FaChevronRight size={20} className="text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="border-t border-slate-200 p-5 bg-slate-50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GrLocation size={20} />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaRegClock size={18} />
                      <span>Delivery Time: {order.deliveryTime}</span>
                    </div>

                    <div className="space-y-3">
                      {order.ItemData.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                        >
                          <img
                            src={item.Image}
                            alt={item.ItemName}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-slate-800">
                              {item.ItemName}
                            </h5>
                            <p className="text-slate-600 mt-1">
                              Rs. {item.ItemPrice} x {item.Quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                      <span className="font-semibold text-slate-600">
                        Order Total
                      </span>
                      <span className="text-lg font-bold text-slate-800">
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

export default ManagerOrders;
