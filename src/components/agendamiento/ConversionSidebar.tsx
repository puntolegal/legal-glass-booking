// RUTA: src/components/agendamiento/ConversionSidebar.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, Sparkles, Star, CheckCircle } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useSearchParams } from 'react-router-dom';
import { getServiceInfo } from '@/config/serviceInfo';
import { serviceThemes } from '@/config/serviceThemes';

const ConversionSidebar: React.FC = () => {
  const { service, priceCalculation } = useAgendamiento();
  const { precioFinal, isConvenioValido, isAdminValido } = priceCalculation;
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'general';
  
  // Obtener información contextual del servicio
  const serviceInfo = useMemo(() => getServiceInfo(plan), [plan]);
  const serviceTheme = useMemo(() => {
    const category = service.category.toLowerCase();
    return serviceThemes[category as keyof typeof serviceThemes] || serviceThemes.general;
  }, [service.category]);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const DiscountBadge = ({ label }: { label: string }) => (
    <span 
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
      style={{
        color: `${serviceTheme.accent}cc`,
        backgroundColor: hexToRgba(serviceTheme.accent, 0.08),
        borderColor: hexToRgba(serviceTheme.accent, 0.25),
      }}
    >
      <Sparkles className="w-3 h-3" />
      {label}
    </span>
  );
  
  const ServiceIcon = serviceInfo.icon;
  
  return (
    <div className="sticky top-4 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl space-y-6"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}
      >
        <header className="flex items-center gap-3">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: serviceTheme.gradient,
              boxShadow: `0 4px 12px ${hexToRgba(serviceTheme.accent, 0.25)}`,
            }}
          >
            <ServiceIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 leading-tight">{serviceInfo.subtitle}</p>
            <h3 className="text-lg font-semibold text-white">{serviceInfo.title}</h3>
          </div>
        </header>
        
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span 
              className="text-4xl font-bold text-white"
            >
              ${precioFinal}
            </span>
            {service.originalPrice && !isConvenioValido && (
              <span className="text-base text-slate-500 line-through">${service.originalPrice}</span>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {isAdminValido && <DiscountBadge label="Admin aplicado · $1.000" />}
            {isConvenioValido && !isAdminValido && <DiscountBadge label="Convenio corporativo 80% OFF" />}
            {service.discount && !isConvenioValido && !isAdminValido && (
              <DiscountBadge label={service.discount} />
            )}
          </div>
        </div>

        <ul className="space-y-2.5 text-sm text-slate-300">
          {serviceInfo.benefits.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle 
                className="h-5 w-5 flex-shrink-0 mt-0.5" 
                style={{ color: serviceTheme.accent }}
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {serviceInfo.testimonial && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl space-y-4 shadow-xl"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: serviceTheme.gradient,
              }}
            >
              <span className="text-base font-semibold text-white">{serviceInfo.testimonial.initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white leading-tight">{serviceInfo.testimonial.author}</p>
              <p className="text-xs text-slate-400">{serviceInfo.testimonial.location}</p>
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Caso real
            </div>
          </div>
          <blockquote className="text-sm text-slate-300 leading-relaxed">
            "{serviceInfo.testimonial.quote}"
          </blockquote>
          <div className="flex items-center justify-between text-sm text-slate-400" aria-hidden="true">
            <div 
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1"
              style={{
                borderColor: hexToRgba(serviceTheme.accent, 0.3),
                backgroundColor: hexToRgba(serviceTheme.accent, 0.08),
                color: `${serviceTheme.accent}dd`,
              }}
            >
              <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              5.0 / 5
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-300">
              ❤️
              <span>Gracias</span>
            </div>
          </div>
        </motion.section>
      )}
      
    </div>
  );
};

export default ConversionSidebar;
