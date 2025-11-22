// RUTA: src/components/agendamiento/ServiceSummaryCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Building2, MapPin, Shield, Sparkles } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';

const ServiceSummaryCard: React.FC = () => {
  const { service, serviceColor, priceCalculation } = useAgendamiento();
  const { precioFinal, isConvenioValido, isAdminValido } = priceCalculation;
  
  const getCategoryIcon = () => {
    switch (service.category) {
      case 'General':
        return FileText;
      case 'Familia':
        return User;
      case 'Corporativo':
        return Building2;
      case 'Inmobiliario':
        return MapPin;
      case 'Laboral':
        return Shield;
      default:
        return FileText;
    }
  };
  
  const Icon = getCategoryIcon();

  const DiscountBadge = ({ label }: { label: string }) => (
    <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold text-pink-200 bg-pink-500/10 border-pink-500/30">
      <Sparkles className="w-3.5 h-3.5" />
      {label}
    </span>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-3xl border border-white/10 bg-[rgba(15,23,42,0.75)] p-6 shadow-[0_28px_60px_rgba(15,23,42,0.55)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-4">
        <div 
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10"
          style={{ color: serviceColor }}
        >
          <Icon className="w-7 h-7" />
        </div>
        
        <div className="flex flex-1 flex-col">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">{service.category}</p>
          <h2 className="text-2xl font-semibold text-white">{service.name}</h2>
        </div>
        </div>
        
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-sky-400">
              ${precioFinal}
            </span>
            {service.originalPrice && !isConvenioValido && (
            <span className="text-base text-slate-500 line-through">${service.originalPrice}</span>
            )}
          </div>
          
        {(isAdminValido || isConvenioValido || (service.discount && !isAdminValido && !isConvenioValido)) && (
          <div className="flex flex-wrap items-center gap-2">
            {isAdminValido && <DiscountBadge label="Admin aplicado · $1.000" />}
            {isConvenioValido && !isAdminValido && <DiscountBadge label="Convenio corporativo 80% OFF" />}
            {service.discount && !isConvenioValido && !isAdminValido && <DiscountBadge label={service.discount} />}
            </div>
          )}
      </div>
    </motion.div>
  );
};

export default ServiceSummaryCard;

