import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FloatingIconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  colorClass?: string;
  style?: React.CSSProperties;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  icon: Icon,
  className = '',
  size = 64,
  colorClass = 'from-pink-500/20 to-purple-500/30',
  style,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`pointer-events-none absolute ${className}`}
      style={style}
    >
      <div
        className={`rounded-[30%] bg-gradient-to-br ${colorClass} blur-sm`}
        style={{ width: size, height: size }}
      />
      <Icon
        className="absolute inset-0 m-auto text-white/70"
        style={{ width: size * 0.4, height: size * 0.4 }}
      />
    </motion.div>
  );
};

export default FloatingIcon;

