import React from 'react';
import logo from "../assets/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-300 mt-30">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">

          {/* Logo and App buttons */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Logo" className="h-10 w-10 object-cover rounded-full" />
              <h1 className="text-2xl font-bold">DELIVER EATS</h1>
            </div>

            <div className="flex gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/800px-Download_on_the_App_Store_RGB_blk.svg.png"
                alt="App Store"
                className="h-10"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10"
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <a href="#">Get Help</a>
              <a href="#">Add your restaurant</a>
              <a href="#">Sign up to deliver</a>
              <a href="#">Create a business account</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#">Restaurants near me</a>
              <a href="#">View all cities</a>
              <a href="#">View all countries</a>
              <a href="#">Pickup near me</a>
              <a href="#">About Uber Eats</a>
              <a href="#">🌐 English</a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <div className="flex gap-4">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Pricing</a>
            <a href="#">Do not sell or share my personal information</a>
          </div>
          <div>&copy; {new Date().getFullYear()} Deliver Eats Technologies Inc.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
