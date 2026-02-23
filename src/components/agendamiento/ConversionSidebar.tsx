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

      {/* WhatsApp - Enlace discreto para indecisos */}
      <motion.a
        href="https://wa.me/56962321883?text=Hola%2C%20quisiera%20agendar%20en%20Punto%20Legal"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl transition-colors hover:bg-white/[0.06] group"
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
          style={{ backgroundColor: '#25D366', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">¿Tienes dudas?</p>
          <p className="text-xs text-slate-500">Habla con un abogado antes de agendar</p>
        </div>
      </motion.a>
      
    </div>
  );
};

export default ConversionSidebar;
