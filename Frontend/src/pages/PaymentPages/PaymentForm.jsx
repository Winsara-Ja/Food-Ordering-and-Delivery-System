import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ shippingData, backStep }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardHolderName, setCardHolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

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
    
    // ✅ Only send to backend if paymentIntent succeeded
    if (paymentIntent?.status === 'succeeded') {
      const payload = {
        userId: '6809d73456d9eba1c32bb819',
        orderId: '680a009256d9eba1c32bb81a',
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
          cardHolderName
        },
      };
    
      try {
        // 1. Send to payment save route
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/pay`, payload);
      
        // 2. Now send to email notification route
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/notify/email-user`, payload);
      
        const confirmed = window.confirm(`✅ ${res.data.message}\n\nPress OK to continue.`);
        if (confirmed) {
          navigate('/checkout/success');
        }
      } catch (backendErr) {
        console.error(backendErr);
        alert('❌ Backend error saving payment info.');
      }
    } else {
      alert('❌ Payment not completed.');
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

      <div className='pt-2 pb-2 bg-zinc-50'>
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
};

export default PaymentForm;
