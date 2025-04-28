import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import CheckoutStepper from './CheckoutStepper';
import OrderDetails from './OrderDetails';
import Footer from '../../components/footer';
import Navbar from '../../components/Navbar';

const CheckoutPage = () => {
  const token = localStorage.getItem("token");

  // Get orderId from route params
  const { orderId } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="customer" />
      {/* Main content area */}
      <div className="flex flex-1 w-full pt-20">
        <div className="w-[57vw] bg-white px-20 py-5">
          <CheckoutStepper token={token} orderId={orderId} /> {/* Pass orderId if needed */}
        </div>
        <div className="w-[43vw] bg-white pl-1 pr-14">
          <OrderDetails orderId={orderId} /> {/* Pass orderId as prop */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
