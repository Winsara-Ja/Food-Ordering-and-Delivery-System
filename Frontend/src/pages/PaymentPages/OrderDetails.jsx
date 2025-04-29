import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/orderItems/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        const data = await response.json();
        setOrderDetails(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setOrderDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
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

  return (
    <div className="flex justify-center mt-8">
      <div className="text-center pt-6 pb-6 px-40 bg-zinc-50 rounded-xl border-2 border-zinc-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
        {orderDetails ? (
          <pre className="text-gray-700 text-left">{JSON.stringify(orderDetails, null, 2)}</pre>
        ) : (
          <p className="text-gray-700">No order details found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;