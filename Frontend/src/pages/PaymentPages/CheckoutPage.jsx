import React from 'react';
import CheckoutStepper from './CheckoutStepper';
import OrderDetails from './OrderDetails';
import Footer from '../../components/footer';
import Navbar from '../../components/Navbar';

const CheckoutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
       <Navbar role="customer"/>
      {/* Main content area */}
      <div className="flex flex-1 w-full pt-20">
        <div className="w-[58vw] bg-white px-20 py-5">
          <CheckoutStepper />
        </div>
        <div className="w-[42vw] bg-white px-8 py-10 pr-20">
          <OrderDetails />
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default CheckoutPage;
