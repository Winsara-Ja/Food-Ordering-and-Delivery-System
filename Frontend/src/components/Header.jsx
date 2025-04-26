import React, { useState } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { FiHome } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { MdStore } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BiTime } from "react-icons/bi";

const Header = ({ no_items }) => {
  const [currentPage, setCurrentPage] = useState("home");
  return (
    <div className="" style={{ height: "80px" }}>
      <nav className="bg-white border-b border-slate-200 fixed w-full top-0 z-50">
        <div className="mx-auto pt-4 pb-4 pl-12 pr-12 flex items-center justify-between">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 text-transparent bg-clip-text">
            FoodExpress
          </h1>

          <div className="flex items-center gap-[100px]">
            <div className="hidden md:flex gap-1">
              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentPage === "home"
                    ? "bg-amber-50 text-amber-600"
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                }`}
              >
                <FiHome size={20} />
                <span className="text-xs font-medium">Home</span>
              </button>

              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentPage === "shops"
                    ? "bg-amber-50 text-amber-600"
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                }`}
              >
                <MdStore size={20} />
                <span className="text-xs font-medium">Shops</span>
              </button>

              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentPage === "favorite"
                    ? "bg-amber-50 text-amber-600"
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                }`}
              >
                <AiOutlineHeart size={20} />
                <span className="text-xs font-medium">Favorite</span>
              </button>

              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentPage === "orders"
                    ? "bg-amber-50 text-amber-600"
                    : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                }`}
              >
                <BiTime size={20} />
                <span className="text-xs font-medium">Orders</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-600 hover:text-slate-900">
                <LuShoppingCart size={22} />
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {no_items}
                </span>
              </button>

              <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-600 hover:text-slate-900">
                <FaUserCircle size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
