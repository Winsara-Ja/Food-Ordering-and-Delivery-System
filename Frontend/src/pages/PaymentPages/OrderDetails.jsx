import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderAndRestaurant = async () => {
      try {
        // Fetch order details
        const response = await fetch(`http://localhost:5001/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const data = await response.json();
        setOrderDetails(data);
        setError(null);
  
        // Fetch restaurant details if RestaurantID is available
        if (data.RestaurantID) {
          const token = localStorage.getItem("token");
          const resResponse = await axios.get(
            `http://localhost:4000/api/restaurants/${data.RestaurantID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRestaurant(resResponse.data);
        }
      } catch (err) {
        setError(err.message);
        setOrderDetails(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrderAndRestaurant();
  }, [orderId]);
  

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="text-center pt-6 pb-6 px-40 bg-zinc-50 rounded-xl border-2 border-zinc-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-8">
        <div className="text-center pt-6 pb-6 px-40 bg-zinc-50 rounded-xl border-2 border-zinc-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="flex justify-center mt-8">
        <div className="text-center pt-6 pb-6 px-40 bg-zinc-50 rounded-xl border-2 border-zinc-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
          <p className="text-gray-700">No order details found.</p>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = orderDetails.ItemData
    ? orderDetails.ItemData.reduce(
        (acc, item) => acc + item.ItemPrice * item.Quantity,
        0
      )
    : 0;

  return (
    <div className="flex justify-center mt-8">
     <div
    className="w-full max-w-2xl bg-zinc-50 rounded-xl border-2 border-zinc-300 shadow-lg flex flex-col mt-6"
    style={{ height: "110vh", overflow: "hidden" }} // Fixed height, no scroll on card
     >

      {/* Header with Restaurant Logo and Order ID */}
    <div className="pl-8 pr-8 pt-5 pb-5 border-b flex items-center gap-6">
      {restaurant && restaurant.logoUrl && (
        <img
          src={restaurant.logoUrl}
          alt={restaurant.name || "Restaurant Logo"}
          className="w-17 h-17 rounded-full object-cover border"
        />
      )}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1 pb-1">{orderDetails.RestaurantName}</h2>
        <p className="font-mono text-orange-500 text-sm flex items-center font-semibold gap-1">
        Order ID: 
          <span className="font-mono bg-orange-100 text-orange-500 px-2 py-1 rounded-md text-sm font-semibold">
            {orderDetails._id}
          </span>
        </p>
      </div>
    </div>


        {/* Scrollable Items */}
        <div className="overflow-y-auto px-8 py-4 flex-1">
          {orderDetails.ItemData && orderDetails.ItemData.length > 0 ? (
            orderDetails.ItemData.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 flex gap-4 mb-4"
              >
                <img
                  src={item.Image}
                  alt={item.ItemName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-lg text-slate-800">{item.ItemName}</p>
                  {item.Description && (
                    <p className="text-sm text-slate-500">{item.Description}</p>
                  )}
                  <div className="flex items-center gap-6 mt-2">
                    <span className="text-sm text-slate-600">
                      Unit Price: <span className="font-semibold">Rs. {item.ItemPrice}</span>
                    </span>
                    <span className="text-sm text-slate-600">
                      Qty: <span className="font-semibold">{item.Quantity}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-600 min-w-[100px]">
                  <p className="font-semibold text-lg">Rs. {item.ItemPrice * item.Quantity}</p>
                  <p className="text-xs text-slate-400">({item.ItemPrice} × {item.Quantity})</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found in this order.</p>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 pt-4 pb-4 px-8 border-t bg-zinc-50 shadow-inner">
          <div className="flex justify-between text-slate-700 mb-2">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-700 mb-2">
            <span>Delivery Fee</span>
            <span>Rs. TBD</span>
          </div>
          <div className="flex justify-between font-semibold text-xl">
            <span>Total</span>
            <span>Rs. {orderDetails.TotalPrice || subtotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;