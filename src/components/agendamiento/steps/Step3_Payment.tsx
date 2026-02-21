// RUTA: src/components/agendamiento/steps/Step3_Payment.tsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { serviceThemes } from '@/config/serviceThemes';

const Step3_Payment: React.FC = () => {
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
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-7">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">Resumen</h3>
        </div>
        
        <div className="space-y-4">
          {/* Resumen compacto */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">{service.name}</span>
              <span 
                className="text-xl font-bold text-transparent bg-clip-text"
                style={{ backgroundImage: primaryGradient }}
              >
                ${precioFinal}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              <p className="text-white capitalize">{formatDate(selectedDate)} · {selectedTime} hrs</p>
              <p className="text-xs mt-1">{getMeetingTypeLabel()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Información de Pago - Simplificada */}
      {!isFree && (
        <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
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
      
      {/* Botones de navegación */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={isLoading}
          className="flex-1 py-4 px-6 rounded-xl font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>
        
        <button
          type="button"
          onClick={handleBookingAndPayment}
          disabled={isLoading}
          className="flex-[2] py-5 px-8 rounded-xl font-semibold text-white shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg transform hover:scale-105 active:scale-100 bg-[#009EE3] hover:bg-[#0084C7]"
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



