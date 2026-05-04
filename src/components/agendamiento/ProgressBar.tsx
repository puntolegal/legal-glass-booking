// RUTA: src/components/agendamiento/ProgressBar.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { getServiceTheme } from '@/config/serviceThemes';
import { useTheme } from '@/hooks/useTheme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const { service } = useAgendamiento();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');

  const serviceTheme = useMemo(
    () => getServiceTheme(plan, service.category),
    [plan, service.category],
  );

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
    <div
      className="mb-8"
      role="navigation"
      aria-label={`Progreso del agendamiento: paso ${currentStep} de ${totalSteps}`}
    >
      <div className="flex items-center justify-between gap-3">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          const sphereSize = { width: '3.35rem', height: '3.35rem' } as const;

          const sphereStyle: React.CSSProperties = (() => {
            if (isCompleted) {
              return {
                ...sphereSize,
                border: '2px solid transparent',
                background: `linear-gradient(135deg, ${hexToRgba(serviceTheme.primary, 0.92)}, ${hexToRgba(serviceTheme.accent, 0.88)})`,
                boxShadow: `0 6px 20px ${hexToRgba(serviceTheme.primary, 0.38)}, inset 0 1px 0 rgba(255,255,255,0.35)`,
              };
            }
            if (isCurrent) {
              return {
                ...sphereSize,
                border: `2px solid ${hexToRgba(serviceTheme.accent, 0.65)}`,
                background: serviceTheme.gradient,
                boxShadow: `0 8px 26px ${hexToRgba(serviceTheme.primary, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.42)`,
              };
            }
            if (theme === 'dark') {
              return {
                ...sphereSize,
                border: `2px solid ${hexToRgba(serviceTheme.accent, 0.4)}`,
                background: `linear-gradient(160deg, ${hexToRgba(serviceTheme.primary, 0.38)} 0%, ${hexToRgba(serviceTheme.primary, 0.14)} 55%, hsla(218, 40%, 10%, 0.55) 100%)`,
                boxShadow: `0 6px 22px ${hexToRgba(serviceTheme.primary, 0.28)}, inset 0 1px 0 ${hexToRgba(serviceTheme.accent, 0.22)}`,
              };
            }
            return {
              ...sphereSize,
              border: `2px solid ${hexToRgba(serviceTheme.primary, 0.42)}`,
              background: `linear-gradient(160deg, rgba(255,255,255,0.92) 0%, ${hexToRgba(serviceTheme.primary, 0.11)} 48%, ${hexToRgba(serviceTheme.accent, 0.09)} 100%)`,
              boxShadow: `0 4px 16px ${hexToRgba(serviceTheme.primary, 0.14)}, inset 0 1px 0 rgba(255,255,255,0.8)`,
            };
          })();

          const numberColor = isCompleted
            ? undefined
            : isCurrent
              ? '#ffffff'
              : theme === 'dark'
                ? '#ffffff'
                : serviceTheme.primary;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {isCurrent && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid ${hexToRgba(serviceTheme.accent, 0.55)}` }}
                      animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.55, 0.12, 0.55],
                      }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                    />
                  )}

                  <motion.div
                    className="relative flex items-center justify-center rounded-full transition-all"
                    initial={false}
                    animate={{ scale: isCurrent ? 1.06 : 1 }}
                    style={sphereStyle}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-7 w-7 text-white drop-shadow-sm" strokeWidth={2.25} />
                    ) : (
                      <span
                        className="text-[15px] font-bold tabular-nums tracking-tight"
                        style={{
                          color: numberColor,
                          textShadow:
                            isCurrent || theme === 'dark'
                              ? `0 0 10px ${hexToRgba(serviceTheme.accent, 0.35)}`
                              : undefined,
                        }}
                      >
                        {step.number}
                      </span>
                    )}
                  </motion.div>
                </div>

                <p
                  className={`max-w-[5.5rem] text-center text-[10px] font-semibold uppercase leading-snug tracking-wide sm:max-w-none sm:text-xs ${
                    isCompleted || isCurrent
                      ? 'text-slate-800 dark:text-white/95'
                      : 'text-slate-600 dark:text-slate-400/75'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-2 h-px flex-1 overflow-hidden rounded-full bg-slate-300/90 dark:bg-slate-600/40 sm:mx-3">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        currentStep > step.number
                          ? '100%'
                          : currentStep === step.number
                            ? '65%'
                            : '0%',
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                      background: `linear-gradient(90deg, ${hexToRgba(serviceTheme.primary, 0.75)}, ${hexToRgba(serviceTheme.accent, 0.75)})`,
                      boxShadow: `0 0 12px ${hexToRgba(serviceTheme.accent, 0.25)}`,
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
