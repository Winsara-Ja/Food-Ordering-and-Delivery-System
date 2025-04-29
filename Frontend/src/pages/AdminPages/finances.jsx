import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Finances = () => {
  const [groupedOrders, setGroupedOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5001/orderItems");
        const orders = response.data;

        // Group by RestaurantName and sum TotalPrice
        const grouped = {};

        orders.forEach((order) => {
          const restaurant = order.RestaurantName;
          const total = order.TotalPrice || 0;

          if (grouped[restaurant]) {
            grouped[restaurant] += total;
          } else {
            grouped[restaurant] = total;
          }
        });

        setGroupedOrders(grouped);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="admin" />
      <div className="pl-6 md:pl-40"> 
        <h1 className="text-2xl font-bold pt-30 mb-6">Finance Report</h1>
        <table className="min-w-150 bg-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Restaurant Name</th>
              <th className="py-3 px-4 text-left">Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedOrders).map(([restaurant, total]) => (
              <tr key={restaurant} className="border-t">
                <td className="py-3 px-4">{restaurant}</td>
                <td className="py-3 px-4">Rs.{total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default Finances;
