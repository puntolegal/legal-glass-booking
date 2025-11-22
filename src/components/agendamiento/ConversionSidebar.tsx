// RUTA: src/components/agendamiento/ConversionSidebar.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, Sparkles, Star, CheckCircle } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';

const ConversionSidebar: React.FC = () => {
  const { service, priceCalculation } = useAgendamiento();
  const { precioFinal, isConvenioValido, isAdminValido } = priceCalculation;

  const DiscountBadge = ({ label }: { label: string }) => (
    <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold text-pink-200 bg-pink-500/10 border-pink-500/30">
      <Sparkles className="w-3.5 h-3.5" />
      {label}
    </span>
  );
  
  return (
    <div className="sticky top-4 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-[rgba(15,23,42,0.78)] p-6 shadow-[0_28px_65px_rgba(15,23,42,0.6)] backdrop-blur-xl space-y-6"
      >
        <header className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50 leading-tight">Consulta estratégica</p>
            <h3 className="text-lg font-semibold text-white">Pack de Inicio Premium</h3>
          </div>
        </header>
        
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-sky-400">
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

        <ul className="space-y-2 text-sm text-white/75">
          {[
            '1 hora de trabajo directo con tu abogado especialista.',
            'Plan de acción detallado en PDF ejecutivo.',
            'El 100% del valor se abona a tu plan contratado.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-pink-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="rounded-3xl border border-white/12 bg-white/6 px-5 py-5 backdrop-blur-xl shadow-[0_24px_52px_rgba(15,23,42,0.5)]"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-base font-semibold text-white">Garantía de satisfacción total</h4>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          Si no quedas conforme con tu plan de acción, <span className="text-white font-medium">te devolvemos el 100%</span>.
          No hacemos preguntas: nuestra reputación depende de cada resultado.
        </p>
      </motion.section>
      
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl space-y-4 shadow-[0_25px_55px_rgba(15,23,42,0.6)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 ring-2 ring-white/15">
            <span className="text-base font-semibold text-white">CM</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white leading-tight">Carlos Mendoza</p>
            <p className="text-xs text-white/70">Las Condes, Santiago</p>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
            Caso real
          </div>
        </div>
        <blockquote className="text-sm text-white/80 leading-relaxed">
          “En 1 hora me dio más claridad que meses de incertidumbre. Valió cada peso.”
        </blockquote>
        <div className="flex items-center justify-between text-sm text-pink-200/90" aria-hidden="true">
          <div className="inline-flex items-center gap-1 rounded-full border border-pink-400/40 bg-pink-500/10 px-3 py-1">
            <Star className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            5.0 / 5
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-pink-500 shadow-md">
            ❤️
            <span>Gracias</span>
          </div>
        </div>
      </motion.section>
      
    </div>
  );
};

export default ConversionSidebar;
