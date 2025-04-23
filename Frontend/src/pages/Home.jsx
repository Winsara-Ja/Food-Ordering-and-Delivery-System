import React from "react";
import backgroundImage from "../assets/bg1.jpg";
import logo from "../assets/logo.png"; 
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navbar />
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-6">WELCOME TO THE IRISH CAFE</h1>
        <p className="text-lg mb-8 max-w-xl">
          Ut dictum pellentesque libero venenatis pharetra dapibus magna sagittis in amet nisl et,
          mauris, tincidunt amet erat sed at sit montes, feugiat hac velit.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded text-white font-semibold">
          ORDER ONLINE
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
