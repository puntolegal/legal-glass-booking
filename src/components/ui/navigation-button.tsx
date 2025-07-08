import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface NavigationButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  to,
  children,
  variant = 'default',
  size = 'md',
  external = false,
  className = '',
  icon,
  onClick
}) => {
  const { navigateWithTransition } = useNavigation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    if (external) {
      window.open(to, '_blank', 'noopener,noreferrer');
    } else if (to.startsWith('#')) {
      // Para enlaces internos, usar scroll suave
      const element = document.getElementById(to.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigateWithTransition(to);
    }
  };

  const baseClasses = 'relative overflow-hidden transition-all duration-300 group';
  
  const variantClasses = {
    default: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50',
    premium: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60 backdrop-blur-sm border border-white/20',
    outline: 'bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <Button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} hover:scale-105 hover:-translate-y-1`}
    >
      {/* Efecto de resplandor de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-md" />
      
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
        {external ? (
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        ) : (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </span>
    </Button>
  );
};

export default NavigationButton; 