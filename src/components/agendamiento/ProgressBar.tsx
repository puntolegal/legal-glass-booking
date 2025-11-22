// RUTA: src/components/agendamiento/ProgressBar.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Tus Datos' },
    { number: 2, label: 'Elige Horario' },
    { number: 3, label: 'Confirma Pago' },
  ];
  
  return (
    <div className="mb-8" role="navigation" aria-label="Progreso del agendamiento">
      <div className="flex items-center justify-between gap-3">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {isCurrent && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ border: '2.5px solid rgba(244, 114, 182, 0.35)' }}
                      animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.7, 0.25, 0.7],
                      }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    />
                  )}

                <motion.div
                    className="relative flex items-center justify-center rounded-full border-2 transition-all"
                  initial={false}
                  animate={{
                      scale: isCurrent ? 1.08 : 1,
                    }}
                    style={{
                      width: '3.25rem',
                      height: '3.25rem',
                      borderColor: isCurrent
                        ? 'rgba(244, 114, 182, 1)'
                        : isCompleted
                        ? 'transparent'
                        : 'rgba(71, 85, 105, 1)',
                      background: isCompleted
                        ? 'linear-gradient(135deg, rgba(244, 114, 182, 1), rgba(225, 29, 72, 1))'
                        : 'rgba(15, 23, 42, 0.85)',
                      boxShadow: isCompleted
                        ? '0 12px 30px rgba(236, 72, 153, 0.35)'
                        : isCurrent
                        ? '0 8px 22px rgba(236, 72, 153, 0.25)'
                        : 'none',
                  }}
                >
                  {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: isCurrent ? 'rgba(244, 114, 182, 1)' : 'rgba(148, 163, 184, 1)',
                        }}
                      >
                        {step.number}
                      </span>
                  )}
                </motion.div>
                </div>

                <p
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{
                    color:
                      isCompleted || isCurrent ? 'rgba(203, 213, 225, 1)' : 'rgba(100, 116, 139, 1)',
                  }}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-3 bg-slate-800/80 overflow-hidden">
                    <motion.div
                    className="h-full"
                      initial={{ width: 0 }}
                      animate={{
                      width: currentStep > step.number ? '100%' : currentStep === step.number ? '65%' : '0%',
                      }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                      background: 'linear-gradient(90deg, rgba(244,114,182,0.15), rgba(236,72,153,0.65))',
                    }}
                    />
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;

