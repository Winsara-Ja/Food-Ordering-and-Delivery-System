import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm'; 
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeWrapper = ({ shippingData, backStep }) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/create-intent`);
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error('Failed to create payment intent', error);
      }
    };

    createPaymentIntent();
  }, []);

  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#635BFF',
      colorBackground: '#fafafa',
      colorText: '#32325d',
      colorDanger: '#df1b41',
      spacingUnit: '4px',
      borderRadius: '15px',
    },
    
  };

  const options = { clientSecret, appearance };

  return clientSecret ? (
   
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm shippingData={shippingData} backStep={backStep} />
    </Elements>
    
  ) : (
    <p>Loading payment form...</p>
  );
};

export default StripeWrapper;
