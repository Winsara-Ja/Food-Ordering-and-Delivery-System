import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaUsers, FaStore, FaUserShield } from "react-icons/fa"; // Icons
import { AiOutlineTeam } from "react-icons/ai"; // Pending Requests icon

const AdminHome = () => {
  const [activeUsersCustomer, setActiveUsersCustomer] = useState(0);
  const [activeUsersRestaurantOwner, setActiveUsersRestaurantOwner] = useState(0);
  const [activeUsersAdmin, setActiveUsersAdmin] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const [usersRes, requestsRes] = await Promise.all([
          fetch("http://localhost:4000/api/user-management/overview", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:4000/api/dashboard-requests/count", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!usersRes.ok || !requestsRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const usersData = await usersRes.json();
        const requestsData = await requestsRes.json();

        setActiveUsersCustomer(usersData.activeUsersCustomer);
        setActiveUsersRestaurantOwner(usersData.activeUsersRestaurantOwner);
        setActiveUsersAdmin(usersData.activeUsersAdmin);
        setPendingRequests(requestsData.pendingRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="admin" />
      <main className="flex-grow px-12 py-6 pt-20">
        {/* Welcome Message */}
        <div className="text-center mt-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, Admin!</h1>
          <p className="text-lg text-gray-600">Here’s a quick overview of your platform's activity.</p>
        </div>

        {/* Dashboard Overview */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Dashboard Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Customers */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
              <FaUsers className="text-5xl text-yellow-600 mb-4" />
              <h3 className="text-xl font-medium">Customers</h3>
              <p className="text-3xl font-bold mt-2">{activeUsersCustomer}</p>
            </div>

            {/* Total Restaurant Owners */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
              <FaStore className="text-5xl text-yellow-600 mb-4" />
              <h3 className="text-xl font-medium">Restaurant Owners</h3>
              <p className="text-3xl font-bold mt-2">{activeUsersRestaurantOwner}</p>
            </div>

            {/* Total Admins */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
              <FaUserShield className="text-5xl text-yellow-600 mb-4" />
              <h3 className="text-xl font-medium">Admins</h3>
              <p className="text-3xl font-bold mt-2">{activeUsersAdmin}</p>
            </div>

            {/* Pending Requests */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
              <AiOutlineTeam className="text-5xl text-yellow-600 mb-4" />
              <h3 className="text-xl font-medium">Pending Requests</h3>
              <p className="text-3xl font-bold mt-2">{pendingRequests}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHome;
