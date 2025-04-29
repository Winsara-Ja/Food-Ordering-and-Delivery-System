import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "react-toastify/dist/ReactToastify.css";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShopRegistration from "./pages/ShopRegistration";
import Cart from "./pages/Cart";
import Order from "./pages/Order";

import CustomerHome from "./pages/CustomerPages/CustomerHome";
import Item from "./pages/CustomerPages/Item";
import Shops from "./pages/CustomerPages/Shops";
import RestaurantMenus from "./pages/CustomerPages/RestaurantMenus";

import AdminHome from "./pages/AdminPages/AdminHome";
import ManageUsers from "./pages/AdminPages/ManageUsers";
import Verification from "./pages/AdminPages/Verification";

import RestaurantHome from "./pages/RestaurantOwnerPages/RestaurantHome";
import ManageMenus from "./pages/RestaurantOwnerPages/ManageMenus";
import SetAvailability from "./pages/RestaurantOwnerPages/SetAvailability";
import RestaurantRegistration from "./pages/RestaurantOwnerPages/RestaurantRegistration";
import RequestDashboardAccess from "./pages/RestaurantOwnerPages/RequestDashboard";
import RestaurantVerification from "./pages/RestaurantOwnerPages/RestaurantVerification";

// Checkout pages
import Complete from "./pages/PaymentPages/checkout/Complete";
import OrderSuccess from "./pages/PaymentPages/checkout/Success";
import CheckoutPage from "./pages/PaymentPages/CheckoutPage";


//Delivery Pages
import CustomerDeliveryTracking  from "./pages/DeliveryPages/CustomerDeliveryTracking"

import { DriverLogin } from './pages/DeliveryPages/DriverPages/DriverLogin';
import { Register } from './pages/DeliveryPages/DriverPages/Register';
import { DriverLocation } from './pages/DeliveryPages/DriverPages/DriverLocation';
import { DriverDeliveries } from './pages/DeliveryPages/DriverPages/DriverDeliveries';
import { DriverAcceptDelivery } from './pages/DeliveryPages/DriverPages/DriverAcceptDelivery';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer-home" element={<CustomerHome />} />
          <Route path="/restaurant-home" element={<RestaurantHome />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/menu/:id" element={<Item />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/restaurant/:id" element={<RestaurantMenus />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/restaurant/menus" element={<ManageMenus />} />
          <Route path="/restaurant/availability" element={<SetAvailability />} />
          <Route path="/register-restaurant" element={<RestaurantRegistration />} />
          <Route path="/add-restaurant" element={<ShopRegistration />} />
          <Route path="/request-dashboard" element={<RequestDashboardAccess />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/restaurant-verification" element={<RestaurantVerification />} />
          <Route path="/verify-restaurants" element={<Verification />} />

          {/* Checkout Flow Routes */}
          <Route path="/checkout/:orderId" element={<CheckoutPage />} />
          <Route path="/checkout/complete" element={<Complete />} />
          <Route path="/checkout/success" element={<OrderSuccess />} />

          {/* Delivery Flow Routes */}
          <Route path="/delivery/:deliveryId" element={<CustomerDeliveryTracking />} />

        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-register" element={<Register />} />
        <Route path="/online" element={<DriverLocation />} />
        <Route path="/my-deliveries" element={<DriverDeliveries />} />
        
        {/* Route with dynamic deliveryId */}
        <Route path="/start/:deliveryId" element={<DriverAcceptDelivery />} />        
          


        </Routes>
      </Elements>

      {/* Toast notifications */}
      <Toaster position="top-right" />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
