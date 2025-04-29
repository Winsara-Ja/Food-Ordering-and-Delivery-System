import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import { Check, MapPin, Package } from 'lucide-react';
import Header from '../../../components/DriverSite/Header';
import axios from 'axios';

export const DriverAcceptDelivery = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyABGitpdaMtJBZJQFy45rFBeKPomfd_J3M',
    libraries: ['places', 'geometry'],
  });

  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [restaurantLatLng, setRestaurantLatLng] = useState(null);
  const [customerLatLng, setCustomerLatLng] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`http://localhost:8000/api/deliveries/${deliveryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDelivery(data.delivery);

        const rest = await axios.get(`http://localhost:4000/api/restaurants/${data.delivery.restaurantId}/location`);
        setRestaurantLatLng(rest.data);

        const cust = await axios.get(`http://localhost:4000/api/user-management/${data.delivery.customerId}/location`);
        setCustomerLatLng(cust.data);
      } catch (error) {
        console.error('Error fetching delivery', error);
        setError('Failed to load delivery details');
      }
    };
    fetchDelivery();
  }, [deliveryId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setDriverLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (driverLocation && (restaurantLatLng || customerLatLng)) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: delivery?.status === 'picked-up' ? customerLatLng : restaurantLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
      );
    }
  }, [driverLocation, restaurantLatLng, customerLatLng, delivery?.status]);

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(
        `http://localhost:8000/api/deliveries/${deliveryId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (newStatus === 'completed') {
        navigate('/my-deliveries');
      } else {
        setDelivery({ ...delivery, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  // Determine which step we're on
  const currentStep = delivery?.status === 'picked-up'
    ? 3
    : delivery?.status === 'in-progress'
    ? 2
    : 1;

  const steps = [
    {
      id: 1,
      title: 'Start Delivery',
      description: 'Start heading to restaurant',
      icon: <Check className="w-5 h-5" />,
    },
    {
      id: 2,
      title: 'Pickup Order',
      description: 'Pickup food from restaurant',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: 3,
      title: 'Complete Delivery',
      description: 'Deliver to customer',
      icon: <Package className="w-5 h-5" />,
    },
  ];

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading Google Maps...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Progress</h1>
          <p className="text-gray-600 mt-1">Order #{deliveryId}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={driverLocation || { lat: 6.9271, lng: 79.8612 }}
              zoom={14}
            >
              {driverLocation && <Marker position={driverLocation} label="You" />}
              {restaurantLatLng && <Marker position={restaurantLatLng} label="Restaurant" />}
              {customerLatLng && <Marker position={customerLatLng} label="Customer" />}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>

          {/* Steps */}
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

            {/* Button below */}
            <div className="mt-8">
              {currentStep === 1 && (
                <button
                  onClick={() => updateStatus('in-progress')}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Start Delivery
                </button>
              )}
              {currentStep === 2 && (
                <button
                  onClick={() => updateStatus('picked-up')}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Pickup Order
                </button>
              )}
              {currentStep === 3 && (
                <button
                  onClick={() => updateStatus('completed')}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Complete Delivery
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
