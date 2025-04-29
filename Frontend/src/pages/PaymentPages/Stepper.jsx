import { Check } from 'lucide-react'; // You can install lucide-react for icons
import { motion } from 'framer-motion'; // For animation

const Stepper = ({ steps, activeStep }) => {
  return (
    <div className="bg-zinc-50 border-2 border-zinc-300 rounded-xl pt-0 pb-0">
      <div className="flex items-center justify-between relative pt-3 pb-3">
        {steps.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 left-1/2 w-full z-0">
                <div
                  className={`h-0.5 w-full ${
                    index < activeStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              </div>
            )}

            {/* Circle with number or check */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                index < activeStep
                  ? 'bg-blue-600 text-white border-blue-600'
                  : index === activeStep
                  ? 'bg-white text-blue-600 border-blue-600'
                  : 'bg-gray-200 text-gray-500 border-gray-300'
              }`}
            >
              {index < activeStep ? <Check className="w-5 h-5" /> : index + 1}
            </motion.div>

            {/* Label */}
            <div className="text-xs text-center mt-2 text-gray-700">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;