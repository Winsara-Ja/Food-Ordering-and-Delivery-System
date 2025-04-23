import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const RestaurantHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar role="restaurant_owner" />
      <main className="flex-grow">
        <div className="text-center pt-32 text-3xl">Welcome, owner!</div>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantHome;
