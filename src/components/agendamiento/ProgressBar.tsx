// RUTA: src/components/agendamiento/ProgressBar.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { serviceThemes } from '@/config/serviceThemes';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const { service } = useAgendamiento();
  
  // Obtener tema del servicio para colores dinámicos
  const serviceTheme = useMemo(() => {
    const category = service.category.toLowerCase();
    return serviceThemes[category as keyof typeof serviceThemes] || serviceThemes.general;
  }, [service.category]);
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
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
                      style={{ border: `2px solid ${hexToRgba(serviceTheme.accent, 0.4)}` }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.15, 0.5],
                      }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                  )}

                <motion.div
                    className="relative flex items-center justify-center rounded-full border-2 transition-all"
                  initial={false}
                  animate={{
                      scale: isCurrent ? 1.05 : 1,
                    }}
                    style={{
                      width: '3.25rem',
                      height: '3.25rem',
                      borderColor: isCurrent
                        ? hexToRgba(serviceTheme.accent, 0.5)
                        : isCompleted
                        ? 'transparent'
                        : 'rgba(148, 163, 184, 0.3)',
                      background: isCompleted
                        ? `linear-gradient(135deg, ${hexToRgba(serviceTheme.primary, 0.2)}, ${hexToRgba(serviceTheme.secondary, 0.2)})`
                        : isCurrent
                        ? hexToRgba(serviceTheme.primary, 0.15)
                        : 'rgba(148, 163, 184, 0.1)',
                      boxShadow: isCompleted
                        ? `0 4px 12px ${hexToRgba(serviceTheme.accent, 0.3)}`
                        : isCurrent
                        ? `0 2px 8px ${hexToRgba(serviceTheme.accent, 0.25)}`
                        : 'none',
                    }}
                >
                  {isCompleted ? (
                      <CheckCircle className="w-6 h-6" style={{ color: serviceTheme.accent }} />
                  ) : (
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: isCurrent ? 'rgba(255, 255, 255, 0.9)' : 'rgba(148, 163, 184, 0.6)',
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
                      isCompleted || isCurrent ? 'rgba(255, 255, 255, 0.9)' : 'rgba(148, 163, 184, 0.5)',
                  }}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-px mx-3 bg-slate-700/50 overflow-hidden">
                    <motion.div
                    className="h-full"
                      initial={{ width: 0 }}
                      animate={{
                      width: currentStep > step.number ? '100%' : currentStep === step.number ? '65%' : '0%',
                      }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                      background: `linear-gradient(90deg, ${hexToRgba(serviceTheme.primary, 0.6)}, ${hexToRgba(serviceTheme.accent, 0.6)})`,
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

