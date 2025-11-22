import React from 'react';
import { motion } from 'framer-motion';
import { Pin } from 'lucide-react';

interface PostItProps {
  children: React.ReactNode;
  color?: 'yellow' | 'blue' | 'rose';
  rotate?: number;
}

export const PremiumPostIt = ({ children, color = 'yellow', rotate = 1 }: PostItProps) => {
  const colors = {
    yellow: 'bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E]', // Yellow 50/200/800
    blue: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0C4A6E]',   // Sky 50/200/900
    rose: 'bg-[#FFF1F2] border-[#FECDD3] text-[#881337]',   // Rose 50/200/900
  };

  return (
    <motion.div
      initial={{ rotate: 0, scale: 0.95 }}
      whileInView={{ rotate: rotate, scale: 1 }}
      viewport={{ once: true }}
      className={`relative p-6 ${colors[color]} border shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] shadow-black/5 max-w-sm mx-auto my-8 font-mono text-sm leading-relaxed`}
      style={{ 
        borderRadius: '2px', // Bordes casi rectos como papel
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' // Pequeño doblez en esquina
      }}
    >
      {/* Chincheta/Pin opcional para más realismo */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/40">
        <Pin className="w-4 h-4 opacity-50 fill-current" />
      </div>
      
      {children}
      
      {/* Doblez de esquina visual (efecto CSS simple) */}
      <div 
        className={`absolute bottom-0 right-0 w-5 h-5 border-l border-t ${colors[color].split(' ')[1]} bg-white/40`} 
        style={{ borderRadius: '0 0 0 2px' }}
      />
    </motion.div>
  );
};


