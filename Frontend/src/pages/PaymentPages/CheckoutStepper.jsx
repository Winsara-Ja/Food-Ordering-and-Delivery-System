import React, { useState, useEffect } from 'react';
import ShippingForm from './ShippingForm';
import StripeWrapper from './StripeWrapper';
import Stepper from './Stepper';
import { jwtDecode } from 'jwt-decode';

const steps = ['Delivery Info', 'Payment Info'];

const CheckoutStepper = ({ orderId }) => {  // <-- Accept orderId as prop
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setUserId(decoded.userId); // make sure your token payload has "userId"
    }
  }, []);

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const backStep = () => setActiveStep((prev) => prev - 1);

  const handleShippingData = (data) => {
    setShippingData(data);
    nextStep();
  };

  const FormDisplay = () => {
    switch (activeStep) {
      case 0:
        return <ShippingForm nextStep={handleShippingData} />;
      case 1:
        return (
          <StripeWrapper
            shippingData={shippingData}
            backStep={backStep}
            userId={userId}
            token={token}
            orderId={orderId} // <-- Pass orderId here
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex justify-center mt-8 ">
      <div className="w-full">
        <p className="text-3xl font-bold mb-3 text-center">Checkout</p>
        <div className="mt-0 mb-6 pt-8">
          <Stepper steps={steps} activeStep={activeStep} />
        </div>
        <div className="w-full">{FormDisplay()}</div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
