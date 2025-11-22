import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, User, Calendar, CreditCard } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  serviceColor: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, serviceColor }) => {
  const steps = [
    { id: 1, label: 'Tus Datos', icon: User },
    { id: 2, label: 'Tu Agenda', icon: Calendar },
    { id: 3, label: 'Tu Pago', icon: CreditCard },
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Línea de conexión */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r"
            style={{ 
              background: `linear-gradient(to right, ${serviceColor}, ${serviceColor}dd)`,
            }}
            initial={{ width: '0%' }}
            animate={{ 
              width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' 
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Círculo del paso */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted || isCurrent 
                    ? serviceColor 
                    : 'rgb(229, 231, 235)',
                }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isUpcoming 
                    ? 'bg-gray-200 dark:bg-gray-700' 
                    : ''
                }`}
                style={isCompleted || isCurrent ? {
                  background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                  boxShadow: `0 4px 15px ${serviceColor}40`,
                } : {}}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Icon className={`w-6 h-6 ${
                    isCurrent ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                )}
              </motion.div>

              {/* Etiqueta */}
              <motion.span
                initial={false}
                animate={{
                  color: isCompleted || isCurrent 
                    ? serviceColor 
                    : 'rgb(156, 163, 175)',
                  fontWeight: isCurrent ? 700 : 500,
                }}
                className={`text-xs mt-2 text-center font-medium transition-all ${
                  isCurrent ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                }`}
                style={isCompleted || isCurrent ? {
                  color: serviceColor,
                } : {}}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;

