// RUTA: src/components/agendamiento/steps/Step3_Payment.tsx

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { serviceThemes } from '@/config/serviceThemes';
import { trackMetaEvent } from '@/services/metaConversionsService';
import { useTheme } from '@/hooks/useTheme';

const Step3_Payment: React.FC = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const {
    service,
    serviceColor,
    priceCalculation,
    selectedDate,
    selectedTime,
    selectedMeetingType,
    formData,
    setStep,
    handleBookingAndPayment,
    isLoading,
    error,
  } = useAgendamiento();

  // Meta AddPaymentInfo — se dispara una vez al montar el Step3.
  // Indica que el usuario ha llegado al paso de confirmación/pago:
  // datos completos + agenda elegida + revisando monto final.
  // Es uno de los eventos con mayor correlación con Purchase en Meta Ads.
  useEffect(() => {
    void trackMetaEvent({
      event_name: 'AddPaymentInfo',
      user_data: {
        em: formData.email,
        ph: formData.telefono,
        fn: formData.nombre,
      },
      custom_data: {
        content_type: 'service_plan',
        content_name: service.name,
        content_category: service.category,
        value: priceCalculation?.precioFinal ?? service.price,
        currency: 'CLP',
        source: 'agendamiento_step3',
      },
    });
    // Se dispara sólo al montar el paso de pago, no en cada re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const { precioFinal, precioConConvenio } = priceCalculation;
  
  // Obtener tema del servicio para colores dinámicos
  const serviceTheme = useMemo(() => {
    const themeKey = service.category.toLowerCase() as keyof typeof serviceThemes;
    return serviceThemes[themeKey] || serviceThemes.general;
  }, [service.category]);
  
  // Convertir hex a rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const primaryGradient = useMemo(() => 
    `linear-gradient(135deg, ${serviceTheme.primary}, ${serviceTheme.accent})`,
    [serviceTheme]
  );
  
  const primaryStrong = useMemo(() => hexToRgba(serviceTheme.accent, 0.9), [serviceTheme]);
  
  // Formatear fecha en español chileno
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'America/Santiago',
    }).format(date);
  };
  
  const getMeetingTypeLabel = () => {
    switch (selectedMeetingType) {
      case 'videollamada': return 'Videollamada (Google Meet)';
      case 'telefonica': return 'Llamada Telefónica';
      case 'presencial': return 'Presencial';
      default: return '';
    }
  };
  
  const isFree = precioFinal === '0' || precioConConvenio === 0;
  
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Resumen de la Reserva - Estilo iOS */}
      <div className={`rounded-[1.75rem] p-6 shadow-xl md:p-7 ${
        theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark'
      }`}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Resumen</h3>
        </div>
        
        <div className="space-y-4">
          {/* Resumen compacto */}
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">{service.name}</span>
                {plan === 'inmobiliario-eval' ? (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Orientación jurídica y comercial previa · videollamada Google Meet · sin costo en esta sesión
                  </p>
                ) : null}
              </div>
              <span
                className={`shrink-0 text-xl font-bold ${
                  isFree
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-transparent bg-clip-text'
                }`}
                style={isFree ? undefined : { backgroundImage: primaryGradient }}
              >
                {isFree ? 'Gratis' : `$${precioFinal}`}
              </span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p className="text-slate-900 capitalize dark:text-white">{formatDate(selectedDate)} · {selectedTime} hrs</p>
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">{getMeetingTypeLabel()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Información de Pago - Simplificada */}
      {!isFree && (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Lock className="w-4 h-4 shrink-0 text-emerald-400" aria-hidden />
            <span>Pago seguro procesado por Mercado Pago</span>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          aria-live="assertive"
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
        >
          <p className="text-sm text-red-400 font-medium">{error}</p>
          <p className="text-xs text-red-300/70 mt-1">
            Si el problema persiste, contáctanos directamente.
          </p>
        </motion.div>
      )}
      
      {/* Botones: en móvil el pago queda arriba (flex-col-reverse) */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={isLoading}
          className="w-full sm:flex-1 min-h-[48px] py-4 px-6 rounded-xl font-semibold border transition-all flex items-center justify-center gap-2 disabled:opacity-50 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>
        
        <button
          type="button"
          onClick={handleBookingAndPayment}
          disabled={isLoading}
          className="w-full sm:flex-[2] min-h-[48px] py-5 px-8 rounded-xl font-semibold text-white shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg active:scale-[0.99] md:transform md:hover:scale-[1.02] bg-[#009EE3] hover:bg-[#0084C7]"
          style={{
            boxShadow: '0 26px 52px rgba(0, 158, 227, 0.35)',
          }}
          aria-label={
            isLoading
              ? 'Procesando pago...'
              : isFree
              ? 'Confirmar reserva gratuita'
              : `Pagar ${precioFinal} con Mercado Pago`
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : isFree ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Confirmar Reserva
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar ${precioFinal} con Mercado Pago
            </>
          )}
        </button>
      </div>
      
    </motion.div>
  );
};

export default Step3_Payment;



