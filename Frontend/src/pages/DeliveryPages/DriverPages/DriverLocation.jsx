import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Power, MapPin, AlertCircle, Globe } from "lucide-react";
import Header from "../../../components/DriverSite/Header"; // Adjust path if needed

export const DriverLocation = () => {
  const [location, setLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const navigate = useNavigate();

  // Initialize Google Maps
  useEffect(() => {
    if (window.google) {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          zoom: 12,
          center: { lat: 6.9271, lng: 79.8612 }, // Default to Colombo if location not fetched
        }
      );

      const mapMarker = new window.google.maps.Marker({
        position: { lat: 6.9271, lng: 79.8612 },
        map: mapInstance,
        title: "Driver's Location",
      });

      setMap(mapInstance);
      setMarker(mapMarker);
    }
  }, []);

  // Get location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);

          if (marker && map) {
            marker.setPosition(newLocation);
            map.setCenter(newLocation);
          }

          updateDriverStatusAndLocation("active", [longitude, latitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Update backend
  const updateDriverStatusAndLocation = async (status, coordinates) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const backendURL = "http://localhost:8000/api/drivers/update-status";

      await axios.post(
        backendURL,
        { status: status, coordinates: coordinates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Handle Go Online button
  const handleGoOnline = () => {
    setIsOnline(true);
    getLocation();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Driver Availability & Location
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your online status and track your real-time location
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-colors ${
                  isOnline ? "bg-emerald-100" : "bg-gray-100"
                }`}
              >
                <Power
                  className={`w-16 h-16 ${
                    isOnline ? "text-emerald-500" : "text-gray-400"
                  }`}
                />
              </div>

              <h2 className="text-xl font-semibold mb-2">
                {isOnline ? "You're Online" : "You're Offline"}
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                {isOnline
                  ? "Tracking your location and receiving requests"
                  : "Go online to start working"}
              </p>

              {/* Go Online Button */}
              {!isOnline && (
                <button
                  onClick={handleGoOnline}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                  Go Online
                </button>
              )}

              {/* After going online, show both buttons */}
              {isOnline && (
                <div className="flex flex-col w-full gap-4">
                  <button
                    className="w-full py-3 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Online
                  </button>

                  <button
                    onClick={() => navigate("/my-deliveries")}
                    className="w-full py-3 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Go to Deliveries
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Live Location</h2>

            <div id="map" className="w-full h-64 rounded-lg shadow-md mb-4"></div>

            {location ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Coordinates</p>
                    <p className="text-lg font-semibold">
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                    <Globe className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold">
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Location not available. Click "Go Online" to fetch.
              </div>
            )}

            {isOnline && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Keep the app open to continue tracking your location and receiving jobs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
