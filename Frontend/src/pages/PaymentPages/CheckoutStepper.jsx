import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import StripeWrapper from './StripeWrapper';
import Stepper from './Stepper';


const steps = ['Delivery Info', 'Payment Info'];

const CheckoutStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});

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
        return <StripeWrapper shippingData={shippingData} backStep={backStep} />;
     
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="flex justify-center mt-8 ">
      <div className="w-full">
      <p className="text-3xl font-bold mb-3 text-center">Checkout</p>
  
        {/* Stepper UI */}
<div className="mt-0 mb-6 pt-8">
  <Stepper steps={steps} activeStep={activeStep} />
</div>

  
        {/* Step Content */}
        <div className="w-full">{FormDisplay()}</div>
      </div>
    </div>
  );
  
};

export default CheckoutStepper;
