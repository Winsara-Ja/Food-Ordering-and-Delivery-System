import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PaymentForm = ({ shippingData, backStep, userId: initialUserId, token, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(initialUserId || '');

  useEffect(() => {
    if (!initialUserId && token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.id) {
          setUserId(decoded.id);
          console.log('Decoded userId from token:', decoded.id);
        } else {
          console.error('Token does not contain user ID');
        }
      } catch (error) {
        console.error('Invalid token:', error.message);
      }
    }
  }, [initialUserId, token]);

  console.log('Final userId:', userId);
  console.log('Token prop:', token);

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!isValidObjectId(userId)) {
      alert('Invalid or missing user ID.');
      return;
    }

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/checkout/complete',
        payment_method_data: {
          billing_details: {
            name: cardHolderName,
            phone: shippingData.phone,
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        const payload = {
          userId,
          orderId, // use the passed orderId prop
          address: {
            houseNumber: shippingData.houseNumber,
            street: shippingData.street,
            city: shippingData.city,
            district: shippingData.district,
            province: shippingData.province,
            postalCode: shippingData.postalCode,
          },
          phoneNumber: shippingData.phone,
          cardDetails: {
            paymentMethodId: paymentIntent.payment_method,
            cardHolderName,
          },
        };

        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/pay`, payload);

        //await axios.post(`${import.meta.env.VITE_API_BASE_URL}/notify/email-user`, payload);

        const confirmed = window.confirm(`✅ ${res.data.message}\n\nPress OK to continue.`);
        if (confirmed) {
          navigate(`/checkout/success/${orderId}`);
        }
      } catch (backendErr) {
        console.error('Backend error:', backendErr.response || backendErr);
        alert('❌ Error processing payment.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('❌ Payment not completed.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="p-4 space-y-4 rounded-xl bg-zinc-50 border-zinc-300 border-2 px-15 pb-8">
      <h2 className="text-2xl text-gray-800 font-semibold pt-6">Card Information</h2>

      <div>
        <label className="block mb-1 pt-2 pb-1">Cardholder Name</label>
        <input
          type="text"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          required
          className="border border-zinc-300 rounded-xl p-2 w-full"
        />
      </div>

      <div className="pt-2 pb-2 bg-zinc-50">
        <PaymentElement />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={backStep}
          style={{ backgroundColor: '#3859BC' }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{ backgroundColor: '#06B12B' }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

PaymentForm.propTypes = {
  shippingData: PropTypes.shape({
    phone: PropTypes.string.isRequired,
    houseNumber: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    province: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
  }).isRequired,
  backStep: PropTypes.func.isRequired,
  userId: PropTypes.string,
  token: PropTypes.string,
  orderId: PropTypes.string.isRequired,
};

export default PaymentForm;
