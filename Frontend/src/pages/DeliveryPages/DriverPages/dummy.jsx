import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, Polyline, useLoadScript } from '@react-google-maps/api';
import { DirectionsRenderer } from '@react-google-maps/api';

import { io } from 'socket.io-client';

import { jwtDecode } from 'jwt-decode';


export const DriverAcceptDelivery = () => {
  const { deliveryId } = useParams();  // Extract deliveryId from the URL
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyABGitpdaMtJBZJQFy45rFBeKPomfd_J3M',
    libraries: ['places', 'geometry'],
  });

  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickedUp, setPickedUp] = useState(false);
  const [restaurantLatLng, setRestaurantLatLng] = useState(null);
  const [customerLatLng, setCustomerLatLng] = useState(null);
  const [error, setError] = useState(null);
  const [restaurantId, setRestaurantId] = useState('restaurant123'); // Default mock ID
  const [customerId, setCustomerId] = useState('customer123'); // Default mock ID
  const [directDistanceKm, setDirectDistanceKm] = useState(null);
  const [directions, setDirections] = useState(null);


  // Fetch the delivery details using the deliveryId
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/deliveries/${deliveryId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setDelivery(response.data.delivery);
        
        // If the delivery has restaurant and customer IDs, store them
        if (response.data.delivery.restaurantId) {
          setRestaurantId(response.data.delivery.restaurantId);
        }
        
        if (response.data.delivery.customerId) {
          setCustomerId(response.data.delivery.customerId);
        }
      } catch (error) {
        console.error('Error fetching delivery details:', error);
        setError('Failed to load delivery details');
      }
    };
    fetchDeliveryDetails();
  }, [deliveryId]);

  // Fetch restaurant location from mock API
  useEffect(() => {
    const fetchRestaurantLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/restaurant/${restaurantId}`);
        setRestaurantLatLng(response.data);
      } catch (error) {
        console.error('Error fetching restaurant location:', error);
        setError('Failed to load restaurant location');
      }
    };
    
    if (restaurantId) {
      fetchRestaurantLocation();
    }
  }, [restaurantId]);

  // Fetch customer location from mock API
  useEffect(() => {
    const fetchCustomerLocation = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/customer/${customerId}`);
        setCustomerLatLng(response.data);
      } catch (error) {
        console.error('Error fetching customer location:', error);
        setError('Failed to load customer location');
      }
    };
    
    if (customerId) {
      fetchCustomerLocation();
    }
  }, [customerId]);


useEffect(() => {
  const getDriverLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setDriverLocation(currentLocation);

          const token = localStorage.getItem('token');
          let driverId = 'driver123';
          if (token) {
            try {
              const decoded = jwtDecode(token);
              driverId = decoded.driverID;
            } catch (err) {
              console.error("Failed to decode token", err);
            }
          }

          const socket = io('http://localhost:8000');
          if (driverId && deliveryId) {
            socket.emit('updateDriverLocation', deliveryId, {
              driverId,
              lat: currentLocation.lat,
              lng: currentLocation.lng
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError('Failed to get your current location. Please enable location services.');
          setDriverLocation({ lat: 6.9270, lng: 79.8600 });
        }
      );

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const updatedLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setDriverLocation(updatedLocation);

          const token = localStorage.getItem('authToken');
          let driverId = 'driver123';
          if (token) {
            try {
              const decoded = jwtDecode(token);

              driverId = decoded.driverID;
            } catch (err) {
              console.error("Failed to decode token", err);
            }
          }


          const socket = io('http://localhost:8000');
          if (driverId && deliveryId) {
            socket.emit('updateDriverLocation', deliveryId, {
              driverId,
              lat: updatedLocation.lat,
              lng: updatedLocation.lng
            });
          }
        },
        (error) => {
          console.error("Error tracking location:", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError('Geolocation is not supported by this browser');
      setDriverLocation({ lat: 6.9270, lng: 79.8600 });
    }
  };

  getDriverLocation();
}, [deliveryId]);

  // Handle real-time driver location updates
  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('connect', () => {
      console.log('Socket connected:', socket.connected);
      socket.emit('join', deliveryId);
    });

    socket.on('driverLocationUpdated', (updatedLocation) => {
      console.log('Received driver location update:', updatedLocation);
      setDriverLocation({
        lat: updatedLocation.lat,
        lng: updatedLocation.lng
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [deliveryId]);

  // Calculate straight-line distance instead of using Directions API
  useEffect(() => {
    if (!isLoaded || !driverLocation) return;
  
    const destination = pickedUp ? customerLatLng : restaurantLatLng;
    if (!destination) return;
  
    const directionsService = new window.google.maps.DirectionsService();
  
    directionsService.route(
      {
        origin: driverLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [driverLocation, restaurantLatLng, customerLatLng, pickedUp, isLoaded]);
useEffect(() => {
  if (!isLoaded || !driverLocation) return;

  const destination = pickedUp ? customerLatLng : restaurantLatLng;
  if (!destination) return;

  const directionsService = new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin: driverLocation,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(result);
      } else {
        console.error("Error fetching directions", result);
      }
    }
  );
}, [driverLocation, restaurantLatLng, customerLatLng, pickedUp, isLoaded]);
  

  const handlePickup = async () => {
    try {
      // Update delivery status in the backend
      await axios.patch(
        `http://localhost:8000/api/deliveries/${deliveryId}/status`,
        { status: 'picked-up' },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } }
      );
      
      // Update local state
      setPickedUp(true);
      
      // If we have delivery object, update it too
      if (delivery) {
        setDelivery({ ...delivery, status: 'picked-up' });
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      setError('Failed to update pickup status');
      // Still set picked up to true for demo purposes
      setPickedUp(true);
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      // Update delivery status in the backend
      await axios.patch(
        `http://localhost:8000/api/deliveries/${deliveryId}/status`,
        { status: 'completed' },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } }
      );
      
      // Update local state
      if (delivery) {
        setDelivery({ ...delivery, status: 'completed' });
      }
      
      // Redirect to deliveries page or show completion message
      alert('Delivery completed successfully!');
      window.location.href = '/my-deliveries';
    } catch (error) {
      console.error('Error completing delivery:', error);
      setError('Failed to complete delivery');
    }
  };

  // Draw a straight line between points (since DirectionsRenderer is not available)
  const getPolylinePath = () => {
    if (!driverLocation || !isLoaded) return null;
    
    let destinationLatLng = pickedUp ? customerLatLng : restaurantLatLng;
    if (!destinationLatLng) return null;
    
    return [
      { lat: driverLocation.lat, lng: driverLocation.lng },
      { lat: destinationLatLng.lat, lng: destinationLatLng.lng }
    ];
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading Google Maps...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <p><strong>Restaurant ID:</strong> {restaurantId}</p>
        <p><strong>Customer ID:</strong> {customerId}</p>
        <p><strong>Status:</strong> {delivery?.status || (pickedUp ? 'picked-up' : 'in-progress')}</p>
        {directDistanceKm && (
          <p>
            <strong>Distance to {pickedUp ? 'customer' : 'restaurant'}:</strong> {directDistanceKm} km 
            <span className="text-gray-500 text-sm ml-1">(direct line)</span>
          </p>
        )}
      </div>

      <div className="mb-4">
        {!pickedUp ? (
          <button 
            onClick={handlePickup} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Mark as Picked Up
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="bg-green-100 p-2 rounded">
              <p>Food picked up! Delivering to customer...</p>
            </div>
            <button 
              onClick={handleCompleteDelivery} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Complete Delivery
            </button>
          </div>
        )}
      </div>

      {isLoaded && (
        <div className="h-96 w-full border rounded overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={driverLocation || restaurantLatLng || customerLatLng}
            zoom={14}
          >
            {/* Driver Location Marker */}
            {driverLocation && (
              <Marker 
                position={driverLocation} 
                label={{ text: "You", color: "white" }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }}
              />
            )}
            
            {/* Restaurant Location Marker */}
            {restaurantLatLng && (
              <Marker 
                position={restaurantLatLng} 
                label={{ text: "R", color: "white" }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                }}
              />
            )}
            
            {/* Customer Location Marker */}
            {customerLatLng && (
              <Marker 
                position={customerLatLng} 
                label={{ text: "C", color: "white" }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                }}
              />
            )}
            
            {directions && (
  <DirectionsRenderer
    directions={directions}
    options={{
      polylineOptions: {
        strokeColor: pickedUp ? '#4CAF50' : '#2196F3',
        strokeOpacity: 0.8,
        strokeWeight: 4,
      },
      suppressMarkers: false, // Set true if you're adding custom markers
    }}
  />
)}

          </GoogleMap>
        </div>
      )}
      
      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h3 className="font-bold">Legend:</h3>
        <ul className="mt-2">
          <li className="flex items-center"><div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div> Driver location</li>
          <li className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div> Restaurant location</li>
          <li className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div> Customer location</li>
          <li className="flex items-center mt-2"><div className="w-4 h-1 bg-blue-500 mr-2"></div> Route to restaurant (straight line)</li>
          <li className="flex items-center"><div className="w-4 h-1 bg-green-500 mr-2"></div> Route to customer (straight line)</li>
        </ul>
      </div>
      
      <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This app is showing direct straight-line distances instead of driving routes. 
          To enable actual driving directions, please enable the Directions API in your Google Cloud Console.
        </p>
      </div>
    </div>
  );
};