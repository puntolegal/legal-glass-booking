// RUTA: src/components/agendamiento/ui/TimeSlotPicker.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';

interface TimeSlotPickerProps {
  times: string[];
  occupiedTimes: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  isLoading: boolean;
  serviceColor: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  times,
  occupiedTimes,
  selectedTime,
  onSelectTime,
  isLoading,
  serviceColor,
}) => {
  const isTimeAvailable = (time: string) => !occupiedTimes.includes(time);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      className="grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Selecciona un horario disponible"
    >
      {times.map((time, index) => {
        const isAvailable = isTimeAvailable(time);
        const isSelected = selectedTime === time;
        
        return (
          <motion.button
            key={time}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            onClick={() => isAvailable && onSelectTime(time)}
            disabled={!isAvailable}
            whileHover={isAvailable && !isSelected ? { scale: 1.05 } : {}}
            whileTap={isAvailable ? { scale: 0.95 } : {}}
            className={`py-4 px-4 rounded-xl font-semibold transition-all relative ${
              isSelected
                ? 'text-white shadow-lg scale-105'
                : isAvailable
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-red-100 dark:bg-red-900/20 text-red-400 dark:text-red-500 cursor-not-allowed opacity-60'
            }`}
            style={isSelected ? {
              backgroundColor: serviceColor,
              boxShadow: `0 8px 25px ${serviceColor}40`,
            } : {}}
            title={!isAvailable ? 'Horario ocupado' : ''}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${isAvailable ? 'Agendar para' : 'Horario ocupado'} las ${time}`}
          >
            <div className="flex items-center justify-center gap-2">
              {!isAvailable && <X className="w-4 h-4" />}
              {time}
            </div>
            {!isAvailable && (
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default TimeSlotPicker;

