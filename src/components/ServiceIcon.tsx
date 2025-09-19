import React from 'react';

interface ServiceIconProps {
  icon: React.ComponentType<any>;
  serviceCategory: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ 
  icon: Icon, 
  serviceCategory, 
  className = "", 
  size = 'md' 
}) => {
  // Obtener colores del servicio
  const getServiceColors = () => {
    const colorMap = {
      'General': {
        primary: '#ff6b35',
        bg: 'orange-100',
        darkBg: 'orange-900/30',
        text: 'orange-600',
        darkText: 'orange-400'
      },
      'Familia': {
        primary: '#ec4899',
        bg: 'pink-100',
        darkBg: 'pink-900/30',
        text: 'pink-600',
        darkText: 'pink-400'
      },
      'Corporativo': {
        primary: '#3b82f6',
        bg: 'blue-100',
        darkBg: 'blue-900/30',
        text: 'blue-600',
        darkText: 'blue-400'
      },
      'Inmobiliario': {
        primary: '#10b981',
        bg: 'emerald-100',
        darkBg: 'emerald-900/30',
        text: 'emerald-600',
        darkText: 'emerald-400'
      },
      'Laboral': {
        primary: '#8b5cf6',
        bg: 'purple-100',
        darkBg: 'purple-900/30',
        text: 'purple-600',
        darkText: 'purple-400'
      }
    };
    return colorMap[serviceCategory as keyof typeof colorMap] || colorMap.General;
  };

  const serviceColors = getServiceColors();
  
  // Tamaños del contenedor
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  // Tamaños del icono
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-xl 
        bg-${serviceColors.bg} 
        dark:bg-${serviceColors.darkBg} 
        flex 
        items-center 
        justify-center 
        ${className}
      `}
    >
      <Icon 
        className={`
          ${iconSizeClasses[size]} 
          text-${serviceColors.text} 
          dark:text-${serviceColors.darkText}
        `} 
      />
    </div>
  );
};

export default ServiceIcon;
