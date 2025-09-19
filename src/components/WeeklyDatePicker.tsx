import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface WeeklyDatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  availableDates: Date[];
}

export default function WeeklyDatePicker({ selectedDate, onDateSelect, availableDates }: WeeklyDatePickerProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Obtener el inicio de la semana actual
  const getWeekStart = (date: Date, offset: number = 0) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    d.setDate(diff + (offset * 7));
    return d;
  };

  // Generar días de la semana
  const generateWeekDays = (weekStart: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const today = new Date();
  const weekStart = getWeekStart(today, currentWeekOffset);
  const weekDays = generateWeekDays(weekStart);

  const formatDate = (date: Date) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    return {
      dayName: days[date.getDay()],
      dayNumber: date.getDate(),
      month: months[date.getMonth()],
      isToday: date.toDateString() === today.toDateString(),
      isPast: date < today,
      isAvailable: availableDates.some(d => d.toDateString() === date.toDateString())
    };
  };

  const getMonthYear = () => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
    } else if (firstDay.getFullYear() === lastDay.getFullYear()) {
      return `${months[firstDay.getMonth()]} - ${months[lastDay.getMonth()]} ${firstDay.getFullYear()}`;
    } else {
      return `${months[firstDay.getMonth()]} ${firstDay.getFullYear()} - ${months[lastDay.getMonth()]} ${lastDay.getFullYear()}`;
    }
  };

  return (
    <div className="w-full">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{getMonthYear()}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            disabled={currentWeekOffset <= 0}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWeekOffset}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-7 gap-2"
        >
          {weekDays.map((day, index) => {
            const dateInfo = formatDate(day);
            const isSelected = selectedDate === day.toISOString();
            const isDisabled = dateInfo.isPast || !dateInfo.isAvailable;

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => !isDisabled && onDateSelect(day.toISOString())}
                disabled={isDisabled}
                whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                className={`
                  relative p-4 rounded-2xl border transition-all duration-300
                  ${isSelected
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10 border-primary shadow-lg shadow-primary/20'
                    : isDisabled
                    ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                    : 'bg-white/5 border-white/20 hover:border-primary/50 hover:bg-primary/5'
                  }
                `}
              >
                {/* Indicador de hoy */}
                {dateInfo.isToday && (
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="text-center">
                  <p className={`text-xs font-medium mb-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {dateInfo.dayName}
                  </p>
                  <p className={`text-2xl font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {dateInfo.dayNumber}
                  </p>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {dateInfo.month}
                  </p>
                </div>

                {/* Badge de no disponible */}
                {isDisabled && !dateInfo.isPast && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-red-400 font-medium bg-red-400/20 px-2 py-1 rounded-full">
                      No disponible
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 