import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AdminHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar role="admin" />
      <main className="flex-grow">
        <div className="text-center pt-32 text-3xl">Welcome, Admin!</div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHome;

