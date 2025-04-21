import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import CustomerHome from "./pages/CustomerPages/CustomerHome";
import Item from "./pages/CustomerPages/Item";
import Shops from "./pages/CustomerPages/Shops";
import RestaurantMenus from "./pages/CustomerPages/RestaurantMenus";

import AdminHome from "./pages/AdminPages/AdminHome";
import ManageUsers from "./pages/AdminPages/ManageUsers";

import RestaurantHome from "./pages/RestaurantOwnerPages/RestaurantHome";
import ManageMenus from "./pages/RestaurantOwnerPages/ManageMenus"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;