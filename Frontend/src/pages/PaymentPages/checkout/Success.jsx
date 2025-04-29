import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const OrderSuccess = () => {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Retrieve order and restaurant details from localStorage
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    const restaurantID = localStorage.getItem("restaurantID");

    if (orderDetails && restaurantID) {
      // Use fallback coordinates directly
      const fallbackCoords = { lat: 6.924767, lng: 79.971790 }; // Replace with your fallback coordinates

      // Store the fallback coordinates in localStorage as shippingData
      localStorage.setItem("shippingData", JSON.stringify(fallbackCoords));

      // Step 2: Call the API to assign a driver with the order details and fallback coordinates
      axios
        .post("http://localhost:8000/api/deliveries/assign-driver", {
          restaurantLocation: fallbackCoords,
          orderDetails: {
            userID: orderDetails.userID,
            totalAmount: orderDetails.totalAmount,
            cartItems: orderDetails.cartItems,
          },
          restaurantId: restaurantID,
        })
        .then((deliveryResponse) => {
          console.log("Driver assigned successfully with fallback coordinates:", deliveryResponse.data);
          console.log("Full delivery response with fallback:", deliveryResponse);

          // Access the delivery ID correctly from the response
          const deliveryId = deliveryResponse.data.delivery._id;

          if (deliveryId) {
            // Redirect to the delivery details page with the correct delivery ID
            navigate(`/delivery/${deliveryId}`);
          } else {
            console.error("Delivery ID not found in the fallback response.");
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error assigning driver with fallback coordinates:", error);
          setLoading(false);
        });
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar at top */}
      <Navbar role="customer" />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center pt-30">
        <div className="px-10 py-10 rounded-lg shadow-md border text-center">
          {loading ? (
            <h2 className="text-gray-600 text-2xl font-bold mb-2">Processing your order...</h2>
          ) : (
            <>
              <h2 className="text-green-600 text-2xl font-bold mb-2">Thank you for your order!</h2>
              <p className="text-gray-600">Your payment was successful and your order is being processed.</p>
            </>
          )}
        </div>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default OrderSuccess;
