// RUTA: src/components/agendamiento/ConversionSidebar.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, CheckCircle } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useSearchParams } from 'react-router-dom';
import { getServiceInfo } from '@/config/serviceInfo';
import { getServiceTheme } from '@/config/serviceThemes';
import { useTheme } from '@/hooks/useTheme';

interface ConversionSidebarProps {
  compact?: boolean;
}

const ConversionSidebar: React.FC<ConversionSidebarProps> = ({ compact = false }) => {
  const { service, priceCalculation } = useAgendamiento();
  const { theme } = useTheme();
  const { precioFinal, isConvenioValido, isAdminValido } = priceCalculation;
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'general';
  
  // Información contextual + tema dinámico (slug → categoría → general)
  const serviceInfo = useMemo(() => getServiceInfo(plan), [plan]);
  const serviceTheme = useMemo(
    () => getServiceTheme(plan, service.category),
    [plan, service.category],
  );

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shellGlass = theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark';
  const insetGlass = theme === 'light' ? 'glass-ios-card-light' : 'glass-ios-card-dark';

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
    <div className={`${compact ? 'space-y-4' : 'md:sticky md:top-4 space-y-6'}`}>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[1.75rem] shadow-xl ${shellGlass} ${compact ? 'p-4 space-y-4' : 'p-6 space-y-6'}`}
      >
        <header className="flex items-start gap-3">
          <div 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: serviceTheme.gradient,
              boxShadow: `0 4px 12px ${hexToRgba(serviceTheme.accent, 0.25)}`,
            }}
          >
            <ServiceIcon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {isInmobiliarioEval ? (
              <>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200">
                  <Gift className="h-3 w-3" aria-hidden />
                  Asesoría de cortesía
                </div>
                <p className="text-[13px] font-medium leading-snug text-slate-600 dark:text-slate-300">
                  Orientación jurídica y comercial previa
                </p>
                <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                  {serviceInfo.title}
                </h3>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400 leading-tight">
                  {serviceInfo.subtitle}
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{serviceInfo.title}</h3>
              </>
            )}
          </div>
        </header>
        
        <div className={`rounded-2xl ${insetGlass} ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}>
          <div className="flex flex-wrap items-baseline gap-3">
            <span
              className={`${compact ? 'text-3xl' : 'text-4xl'} font-bold text-slate-900 dark:text-white`}
            >
              {precioFinal === '0' ? 'Gratis' : `$${precioFinal}`}
            </span>
            {service.originalPrice && !isConvenioValido && precioFinal !== '0' && (
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

          {/* Footnote del servicio (note) — visible en mobile compact también */}
          {service.note && (
            <p className="mt-2 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
              {service.note}
            </p>
          )}
        </div>

        <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
          {(compact ? serviceInfo.benefits.slice(0, 3) : serviceInfo.benefits).map((item, index) => (
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

      {!compact && serviceInfo.testimonial && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className={`rounded-[1.75rem] p-6 space-y-4 shadow-xl ${shellGlass}`}
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
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{serviceInfo.testimonial.author}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{serviceInfo.testimonial.location}</p>
            </div>
            <div className="rounded-full border border-slate-200/80 bg-slate-100/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/20 dark:bg-white/10 dark:text-slate-400">
              Caso real
            </div>
          </div>
          <blockquote className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            "{serviceInfo.testimonial.quote}"
          </blockquote>
          {/* Footer del testimonial — sólo etiqueta "Gracias" (sin rating de estrellas) */}
          <div className="flex items-center justify-end" aria-hidden="true">
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              ❤️
              <span>Gracias</span>
            </div>
          </div>
      </motion.section>
      )}

      {/*
        WhatsApp del sidebar removido — se mantiene únicamente el botón
        contextual dentro del paso (Step1_ClientInfo / Step2_Scheduling)
        para evitar duplicación de CTAs en desktop step 1.
      */}
    </div>
  );
};

export default ConversionSidebar;
