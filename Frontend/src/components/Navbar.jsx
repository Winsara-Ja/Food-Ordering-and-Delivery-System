import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import Profile from "./Profile";

const Navbar = ({ role = null }) => {

  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const toggleProfileDialog = () => {
    setShowProfileDialog(!showProfileDialog);
  };

  const handleLogout = () => {
    // Clear JWT token from storage
    localStorage.removeItem("token"); // or whatever key you're using
  
    // Optionally clear other session-related data
    localStorage.removeItem("userRole"); // example
  
    // Redirect to login page
    window.location.href = "/login";
  
    // Close the profile dialog
    setShowProfileDialog(false);
  };
  

  return (
    <nav className="fixed w-full bg-neutral-900 text-white px-4 py-5 shadow-md z-50">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold">
            {role === "admin"
              ? "Irish Café Admin"
              :  "Irish Café"}
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-8 font-medium text-lg">
          {role === "admin" && (
            <>
              <li>
                <Link to="/admin-home" className="hover:text-orange-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/admin/users" className="hover:text-orange-400 transition">Manage Users</Link>
              </li>
              <li>
                <Link to="/verify-restaurants" className="hover:text-orange-400 transition">Verify Restaurants</Link>
              </li>
              <li>
                <Link to="/admin/finances" className="hover:text-orange-400 transition">Finances</Link>
              </li>
            </>
          )}

          {role === "restaurant_owner" && (
            <>
              <li>
                <Link to="/restaurant-home" className="hover:text-orange-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/restaurant/menus" className="hover:text-orange-400 transition">Manage Menus</Link>
              </li>
              <li>
                <Link to="/restaurant/availability" className="hover:text-orange-400 transition">Set Availability</Link>
              </li>
              <li>
                <Link to="/restaurant/orders" className="hover:text-orange-400 transition">Manage Orders</Link>
              </li>
            </>
          )}

          {role === "customer" && (
            <>
              <li>
                <Link to="/customer-home" className="hover:text-orange-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/shops" className="hover:text-orange-400 transition">Shops</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-orange-400 transition">Favorites</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition">Orders</Link>
              </li>
            </>
          )}

          {role == null && (
            <>
              <li>
                <Link to="/" className="hover:text-orange-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-orange-400 transition">Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition">Contact</Link>
              </li>
            </>
          )}

        </ul>

        {/* Right-side Icons */}
        <div className="flex items-center space-x-6 text-xl">
          {role === "customer" && (
            <>
              <Link to="/cart" className="hover:text-orange-400 transition">
                <FaShoppingCart />
              </Link>
              <button onClick={toggleProfileDialog} className="hover:text-orange-400 transition">
                <FaUserCircle />
              </button>
            </>
          )}

          {(role === "admin" || role === "restaurant_owner") && (
            <button onClick={toggleProfileDialog} className="hover:text-orange-400 transition">
              <FaUserCircle />
            </button>
          )}

          {role == null && (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition">
                    Sign Up
                  </button>
                </Link>
              </>
            )}

            {/* Profile Dialog Component */}
            {showProfileDialog && <Profile onLogout={handleLogout} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
