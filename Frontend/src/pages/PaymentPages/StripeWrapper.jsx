import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm'; 
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeWrapper = ({ shippingData, backStep, userId, token, orderId }) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    console.log("StripeWrapper orderId prop:", orderId);
  
    const createPaymentIntent = async () => {
      try {
        console.log("Attempting to create payment intent with orderId:", orderId);
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/payment/create-intent`,
          { orderId }
        );
        console.log("Payment intent response from backend:", res.data);
        setClientSecret(res.data.clientSecret);
        console.log("Stripe clientSecret set:", res.data.clientSecret);
      } catch (error) {
        console.error(
          'Failed to create payment intent:',
          error.response ? error.response.data : error.message
        );
      }
    };
  
    if (orderId) {
      createPaymentIntent();
    } else {
      console.error("orderId is missing in StripeWrapper!");
    }
  }, [orderId]);
  

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
      <PaymentForm 
        shippingData={shippingData} 
        backStep={backStep}
        userId={userId}
        token={token}
        orderId={orderId} 
      />
    </Elements>
  ) : (
    <p>Loading payment form...</p>
  );
};

export default StripeWrapper;
