import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/DriverSite/Header';

import { 
  MapPin, 
  Package, 
  Navigation, 
  Check 
} from 'lucide-react';

export const DriverDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // For redirection

  // Fetch deliveries
  const fetchAssignedDeliveries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No token found.');
        return;
      }
      const response = await axios.get('http://localhost:8000/api/deliveries/assigned', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setDeliveries(response.data.deliveries);
    } catch (error) {
      console.error('Error fetching assigned deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedDeliveries();
  }, []);

  const acceptDelivery = async (deliveryId) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/deliveries/${deliveryId}/status`,
        { status: 'in-progress' },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } }
      );
      navigate(`/start/${deliveryId}`);
    } catch (error) {
      console.error('Error accepting delivery:', error);
    }
  };

  const cancelDelivery = async (deliveryId) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/deliveries/${deliveryId}/status`,
        { status: 'cancelled' },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } }
      );
      fetchAssignedDeliveries();
    } catch (error) {
      console.error('Error cancelling delivery:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuToggle={() => console.log('Toggle sidebar menu')} />

      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Assigned Deliveries</h2>

        {loading && <p className="text-gray-500 mb-4">Loading deliveries...</p>}

        {deliveries.length === 0 ? (
          <div className="text-center text-gray-500">No deliveries assigned yet.</div>
        ) : (
          <div className="grid gap-6">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-all">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Package className="w-4 h-4 mr-1" />
                      <span>Restaurant ID: {delivery.restaurantId}</span>
                    </div>
                    <h3 className="text-lg font-semibold mt-2 text-gray-800">
                      Delivery to Customer
                    </h3>
                  </div>
                  <div className="text-sm text-emerald-600 font-medium capitalize">
                    {delivery.status}
                  </div>
                </div>

                <div className="flex items-center mb-3 text-gray-700 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Delivery Address: {delivery?.orderDetails?.deliveryAddress || 'N/A'}</span>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => acceptDelivery(delivery._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Accept Delivery
                  </button>
                  <button
                    onClick={() => cancelDelivery(delivery._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Cancel
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
