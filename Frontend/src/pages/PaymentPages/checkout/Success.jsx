import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/footer";
import axios from "axios";

const Success = () => {
  const params = useParams();
  const location = useLocation();
  const orderId = params.orderId || location.state?.orderId;

  const [orderDetails, setOrderDetails] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }
    const fetchOrderAndRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:5000/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const data = await response.json();
        setOrderDetails(data);
        setError(null);

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

  const subtotal = orderDetails?.ItemData
    ? orderDetails.ItemData.reduce(
        (acc, item) => acc + item.ItemPrice * item.Quantity,
        0
      )
    : 0;

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gradient-to-b from-white to-zinc-100">
      <Navbar role="customer" />

      <main className="flex-1 flex flex-col justify-center w-full px-0 py-8 pt-24">
        {/* Thank You Section: Full width */}
        <section className="w-full bg-white py-8 shadow-md border-b border-zinc-200 text-center ">
          <div className="flex flex-col items-center gap-2 pb-2">
            <div className="rounded-full bg-green-100 p-3 mb-2 inline-block">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-green-700 text-3xl font-bold mb-1">Thank you for your order!</h2>
            <p className="text-gray-700 text-lg mb-1">
              Your payment was successful and your order is being processed.
            </p>
            <p className="text-gray-500 mb-2">
              You will receive a confirmation email with your order details shortly.
            </p>
            {(orderDetails?._id || orderId) && (
  <p className="font-mono text-orange-500 text-base font-semibold">
    Order ID: <span className="bg-orange-100 px-2 py-1 rounded-md">{orderDetails?._id || orderId}</span>
  </p>
)}

          </div>
        </section>

        {/* Order Details Section: Full width */}
        <section className="w-full bg-zinc-50 py-5">
          <div className="w-full flex flex-col gap-8 px-35">
            {loading ? (
              <div className="text-center py-8">Loading order details...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">Error: {error}</div>
            ) : !orderDetails ? (
              <div className="text-center py-8">No order details found.</div>
            ) : (
              <>
                {/* Restaurant Header */}
                <div className="flex items-center gap-4 border-b border-zinc-200 pb-5 mb-1 w-full pl-10">
                  {restaurant && restaurant.logoUrl && (
                    <img
                      src={restaurant.logoUrl}
                      alt={restaurant.name || "Restaurant Logo"}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  )}
                  <div className="text-left">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                      {orderDetails.RestaurantName}
                    </h2>
                    <p className="text-sm text-gray-500">{restaurant.address}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full">
                  {orderDetails.ItemData && orderDetails.ItemData.length > 0 ? (
                    orderDetails.ItemData.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 flex gap-4"
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


                {/* Totals */}
                <div className="mt-5 border-t border-zinc-200 pt-4 flex flex-col gap-2 w-full max-w-2xl mx-auto">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Delivery Fee</span>
                    <span>Rs. TBD</span>
                  </div>
                  <div className="flex justify-between font-semibold text-xl">
                    <span>Total</span>
                    <span>Rs. {orderDetails.TotalPrice || subtotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Success;
