import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        seconds--;
        
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        
        if (hours < 0) {
          // Reset to 48 hours
          hours = 47;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] shadow-lg"
      >
        <div className="text-2xl md:text-3xl font-bold tabular-nums">
          {String(value).padStart(2, '0')}
        </div>
      </motion.div>
      <div className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <div className="text-2xl md:text-3xl font-bold text-pink-500">:</div>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <div className="text-2xl md:text-3xl font-bold text-pink-500">:</div>
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
};

export default CountdownTimer;
