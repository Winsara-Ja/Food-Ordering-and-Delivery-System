import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Menu from "./pages/Menu.jsx";
import Cart from "./pages/Cart.jsx";
import Order from "./pages/Order.jsx";

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />}></Route> */}
      <Route path="/menu" element={<Menu />}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/order" element={<Order />}></Route>
    </Routes>
  );
}

export default App;
