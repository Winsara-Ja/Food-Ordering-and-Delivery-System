import React from "react";
import { motion } from "framer-motion";
import backgroundImage from "../assets/bg1.jpg";
import "@fontsource/manrope";
import { Link } from "react-router-dom";

const ShopRegistration = () => {
  const steps = [
    {
      number: 1,
      title: "Sign up",
      description: (
        <>
          on our platform with your email and basic information.{" "}
          <Link to="/signup" className="underline text-orange-400 hover:text-orange-500">
            Go to Signup
          </Link>
        </>
      ),
    },
    {
      number: 2,
      title: "Request access",
      description: "to the Restaurant Owner Dashboard after signing in. You’ll find a button to apply on your profile page.",
    },
    {
      number: 3,
      title: "Register your restaurant",
      description: "from your Restaurant Dashboard once your access has been approved.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative font-manrope"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-2xl border border-white/20 "
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Become a Restaurant Partner</h2>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start space-x-4">
              <div className="min-w-[48px] min-h-[48px] rounded-full bg-orange-400 flex items-center justify-center text-xl font-bold shadow-md">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-800/90 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          If you have any questions, feel free to{" "}
          <Link to="/contact" className="underline text-orange-400 hover:text-orange-500">
            contact us
          </Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default ShopRegistration;
