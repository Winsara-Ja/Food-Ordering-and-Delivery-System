import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/footer';

const OrderSuccess = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar at top */}
      <Navbar role="customer" />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center pt-30">
        <div className="px-10 py-10 rounded-lg shadow-md border text-center">
          <h2 className="text-green-600 text-2xl font-bold mb-2">Thank you for your order!</h2>
          <p className="text-gray-600">Your payment was successful and your order is being processed.</p>
          <p className="text-gray-600">Your payment was successful and your order is being processed.</p>
          <p className="text-gray-600">Your payment was successful and your order is being processed.</p>
          <p className="text-gray-600">Your payment was successful and your order is being processed.</p>
        </div>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default OrderSuccess;
