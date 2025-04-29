import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import { Check, MapPin, Package } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const GOOGLE_MAPS_API_KEY = 'AIzaSyABGitpdaMtJBZJQFy45rFBeKPomfd_J3M';

export const CustomerTrackingDelivery = () => {
  const { deliveryId } = useParams();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });

  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`http://localhost:8000/api/deliveries/${deliveryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDelivery(data.delivery);
        setDeliveryStatus(data.delivery.status);

        const restaurant = await axios.get(`http://localhost:4000/api/restaurants/${data.delivery.restaurantId}/location`);
        setRestaurantLocation(restaurant.data);

        const customer = await axios.get(`http://localhost:4000/api/user-management/${data.delivery.customerId}/location`);
        setCustomerLocation(customer.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load delivery information.');
      }
    };
    fetchDelivery();
  }, [deliveryId]);

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socket.on('connect', () => {
      socket.emit('joinDelivery', deliveryId);
    });
    socket.on('driverLocationUpdated', (location) => {
      console.log('Driver Location Update Received:', location); // ADD THIS

      if (location?.lat && location?.lng) {
        setDriverLocation({ lat: location.lat, lng: location.lng });
      }
      if (location?.status) {
        setDeliveryStatus(location.status);
      }
    });
    socket.on('deliveryStatusUpdated', (status) => setDeliveryStatus(status));
    socket.on('disconnect', () => console.log('Socket disconnected'));
    return () => socket.disconnect();
  }, [deliveryId]);

  useEffect(() => {
    if (isLoaded && driverLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      const destination = deliveryStatus === 'picked-up' ? customerLocation : restaurantLocation;
      if (!destination) return;
      directionsService.route(
        {
          origin: driverLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
      );
    }
  }, [driverLocation, restaurantLocation, customerLocation, deliveryStatus, isLoaded]);

  const steps = [
    { id: 1, title: 'Order Confirmed', description: 'Restaurant accepted your order', icon: <Check className="w-5 h-5" /> },
    { id: 2, title: 'Driver Assigned', description: 'Driver is heading to restaurant', icon: <MapPin className="w-5 h-5" /> },
    { id: 3, title: 'Order Picked Up', description: 'Driver has your food', icon: <Package className="w-5 h-5" /> },
    { id: 4, title: 'Delivered', description: 'Enjoy your meal!', icon: <Check className="w-5 h-5" /> },
  ];

  const currentStep = 
    deliveryStatus === 'completed' ? 4 :
    deliveryStatus === 'picked-up' ? 3 :
    deliveryStatus === 'assigned' ? 2 : 1;

  if (!isLoaded) return <div className="flex justify-center items-center h-screen">Loading map...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
            <Navbar role="customer"/>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Delivery</h1>
          <p className="text-gray-600 mt-1">Order #{deliveryId}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={driverLocation || customerLocation || restaurantLocation || { lat: 6.9271, lng: 79.8612 }}
              zoom={14}
            >
              {driverLocation && <Marker position={driverLocation} label="Driver" />}
              {restaurantLocation && <Marker position={restaurantLocation} label="Restaurant" />}
              {customerLocation && <Marker position={customerLocation} label="You" />}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-6">Delivery Status</h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-6 top-10 w-0.5 h-16 -ml-px ${
                        currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div className="relative flex items-start">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        currentStep > step.id
                          ? 'bg-emerald-500 text-white'
                          : currentStep === step.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.icon}
                    </div>

                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{step.title}</h3>
                      <p className="text-gray-500">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

    </div>
  );
};

export default CustomerTrackingDelivery;
