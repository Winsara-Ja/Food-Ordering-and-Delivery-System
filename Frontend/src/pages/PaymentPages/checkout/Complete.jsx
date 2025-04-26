import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';

const Complete = () => {
  const stripe = useStripe();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');

    const checkPaymentStatus = async () => {
      if (!stripe || !clientSecret) {
        setStatus('error');
        setMessage('Missing Stripe client secret.');
        return;
      }

      const result = await stripe.retrievePaymentIntent(clientSecret);

      switch (result.paymentIntent.status) {
        case 'succeeded':
          setStatus('success');
          setMessage('🎉 Payment succeeded!');
          break;
        case 'processing':
          setStatus('processing');
          setMessage('⏳ Payment processing. Please wait.');
          break;
        case 'requires_payment_method':
          setStatus('error');
          setMessage('❌ Payment failed. Please try again.');
          break;
        default:
          setStatus('error');
          setMessage('⚠️ Something went wrong.');
          break;
      }
    };

    checkPaymentStatus();
  }, [stripe, searchParams]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-4">Payment Status</h2>
      <p className={`text-lg ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>
    </div>
  );
};

export default Complete;
