import React from 'react';
import { motion } from 'framer-motion';

export interface GlassCardProps
  extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  ...motionProps
}) => {
  return (
    <motion.div
      className={`
        relative rounded-3xl p-8 border border-white/10 
        bg-white/5 backdrop-blur-lg shadow-2xl
        ${className}
      `}
      {...motionProps}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px 
                   bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      {children}
    </motion.div>
  );
};

export default GlassCard;

