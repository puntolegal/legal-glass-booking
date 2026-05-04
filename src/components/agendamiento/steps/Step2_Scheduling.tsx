// RUTA: src/components/agendamiento/steps/Step2_Scheduling.tsx

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  Info,
  MapPin,
  Phone,
  Sparkles,
  Video,
} from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { useAvailability } from '@/hooks/useAvailability';
import { getAvailableDates, getAvailableTimes } from '@/utils/agendamiento';
import { getServiceTheme } from '@/config/serviceThemes';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

// Color de prestigio (slate frío) — sin amber/gold fluor que rompía la
// estética masculina dark-navy. Usado para elementos especiales como "Último del día".
const prestigeAccent = 'rgba(186, 230, 253, 0.85)'; // sky-200 sobrio

const Step2_Scheduling: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedMeetingType,
    setSelectedMeetingType,
    service,
    serviceColor,
    priceCalculation,
    goToPayment,
    setStep,
    isLoading,
  } = useAgendamiento();
  
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const { theme } = useTheme();

  // Tema dinámico — alineado con el accent del servicio (Plan PDF de la card)
  const serviceTheme = useMemo(
    () => getServiceTheme(plan, service.category),
    [plan, service.category],
  );
  
  // Generar colores dinámicos basados en el servicio
  const primaryGradient = useMemo(() => 
    `linear-gradient(135deg, ${serviceTheme.primary}, ${serviceTheme.accent})`,
    [serviceTheme]
  );

  const lightPrimaryCtaRgb = '51 65 85';
  
  // Convertir hex a rgba para efectos soft
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const primarySoft = useMemo(() => hexToRgba(serviceTheme.primary, 0.12), [serviceTheme]);
  const primaryBorder = useMemo(() => hexToRgba(serviceTheme.primary, 0.35), [serviceTheme]);
  const primaryStrong = useMemo(() => hexToRgba(serviceTheme.accent, 0.9), [serviceTheme]);
  
  const availableDates = useMemo(() => getAvailableDates(), []);
  const [schedulingStep, setSchedulingStep] = useState<'day' | 'time'>(() => {
    if (selectedDate) return 'time';
    return 'day';
  });

  const { occupiedTimes, isLoading: loadingAvailability } = useAvailability(selectedDate || '');
  const availableTimes = useMemo(() => getAvailableTimes(), []);

  const meetingTypes = useMemo(
    () => [
    { 
      value: 'videollamada' as const, 
        label: 'Videollamada Privada',
        description: 'Enlace Google Meet protegido y grabación opcional.',
      icon: Video, 
        highlights: ['Sin desplazarte', 'Pantalla compartida', 'Ambiente privado'],
        available: true,
      },
      {
        value: 'telefonica' as const,
        label: 'Llamada Telefónica',
        description: 'Habla con tu abogado desde cualquier lugar del mundo.',
        icon: Phone,
        highlights: ['Sin conexión a internet', 'Ideal en movimiento'],
      available: true,
    },
    { 
      value: 'presencial' as const, 
        label: 'Presencial Boutique',
        description: 'Disponibilidad exclusiva en Las Condes (próximamente).',
      icon: MapPin, 
        highlights: ['Experiencia personalizada', 'Atención integral'],
      available: false,
      },
    ],
    []
  );

  /** Fecha civil local (evita desfase UTC de `toISOString()` al cambiar de día). */
  const toLocalYmd = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Mostrar próximos 14 días disponibles
  const displayedDates = useMemo(() => availableDates.slice(0, 14), [availableDates]);

  const freeTimes = useMemo(
    () => availableTimes.filter((time) => !occupiedTimes.includes(time)),
    [availableTimes, occupiedTimes]
  );

  const recommendedTimes = useMemo(() => freeTimes.slice(0, 3), [freeTimes]);

  const remainingTimes = useMemo(
    () => freeTimes.filter((time) => !recommendedTimes.includes(time)),
    [freeTimes, recommendedTimes]
  );

  const lastSlotOfDay = freeTimes[freeTimes.length - 1];

  const morningTimes = remainingTimes.filter((time) => Number(time.split(':')[0]) < 13);
  const afternoonTimes = remainingTimes.filter((time) => Number(time.split(':')[0]) >= 13);

  const handleSelectDate = (date: Date) => {
    const iso = toLocalYmd(date);
    setSelectedDate(iso);
    setSelectedTime('');
    setSchedulingStep('time');
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    // Solo avanzar si tenemos fecha, hora y modalidad seleccionadas
    if (selectedDate && time && selectedMeetingType) {
      // Pasar el time fresco para evitar stale closure
      goToPayment(time);
    }
  };

  const summaryDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const summaryTime = selectedTime ? `${selectedTime} hrs` : '';


  const availabilitySignal = (date: Date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return { label: 'Disponibilidad acotada', tone: 'rgba(148, 163, 184, 0.8)' };
    if (day === 1 || day === 2) return { label: 'Excelente disponibilidad', tone: 'rgba(244, 114, 182, 0.8)' };
    return { label: 'Disponibilidad moderada', tone: 'rgba(148, 163, 184, 0.7)' };
  };

  const fieldsetVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
  };

  // Componente TimePill para los horarios
  const TimePill: React.FC<{ time: string; variant?: 'recommended' | 'standard'; note?: string }> = ({
    time,
    variant = 'standard',
    note,
  }) => {
    const isSelected = selectedTime === time;
    
    return (
      <motion.button
        onClick={() => handleSelectTime(time)}
        whileTap={{ scale: 0.97 }}
        className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-medium border transition flex items-center justify-center ${
          isSelected 
            ? 'text-slate-900 dark:text-white shadow-lg' 
            : variant === 'recommended'
            ? 'bg-slate-200/80 border-slate-300/80 text-slate-800 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-200'
            : 'bg-white/90 border-slate-200/90 text-slate-600 hover:bg-slate-100 dark:bg-slate-900/40 dark:border-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:border-slate-700/50'
        }`}
        style={isSelected ? {
          backgroundColor: hexToRgba(serviceTheme.primary, 0.15),
          borderColor: hexToRgba(serviceTheme.accent, 0.4),
          boxShadow: `0 4px 16px ${hexToRgba(serviceTheme.primary, 0.25)}`,
        } : {}}
      >
        {time}
      </motion.button>
    );
  };

  const renderDayStep = () => {
    return (
      <motion.div key="day" variants={fieldsetVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Selecciona el día</h2>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
            {displayedDates.length > 0 && (
              <>Elige la fecha que más te acomoda · {displayedDates[0].toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</>
            )}
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3 pb-1">
          {displayedDates.map((date) => {
            const iso = toLocalYmd(date);
            const isSelected = selectedDate === iso;
              
            return (
              <motion.button
                key={iso}
                onClick={() => handleSelectDate(date)}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl border px-3 py-3 md:px-4 md:py-4 text-left transition ${
                  isSelected 
                    ? 'text-slate-900 dark:text-white shadow-lg' 
                    : 'bg-white/90 border-slate-200/90 hover:bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/40 dark:hover:bg-slate-800/50'
                }`}
                style={isSelected ? {
                  backgroundColor: hexToRgba(serviceTheme.primary, 0.15),
                  borderColor: hexToRgba(serviceTheme.accent, 0.4),
                  boxShadow: `0 4px 16px ${hexToRgba(serviceTheme.primary, 0.25)}`,
                } : {}}
              >
                <p className={`text-xs md:text-sm font-semibold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {date.toLocaleDateString('es-CL', { weekday: 'short' })}
                </p>
                <p className={`text-xl md:text-2xl font-bold mt-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{date.getDate()}</p>
                <p className={`text-[10px] md:text-xs mt-1 flex items-center gap-2 ${isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                  {date.toLocaleDateString('es-CL', { month: 'short' })}
                </p>
              </motion.button>
            );
          })}
        </section>
      </motion.div>
    );
  };


  const renderTimeStep = () => (
      <motion.div key="time" variants={fieldsetVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Selecciona tu horario</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {loadingAvailability ? 'Consultando disponibilidad…' : 'Elige el horario que prefieras'}
        </p>
      </header>

      {!loadingAvailability && freeTimes.length === 0 && (
        <div className="rounded-3xl border border-slate-200/90 bg-slate-50/90 px-4 py-6 text-center space-y-3 dark:border-slate-800/70 dark:bg-slate-900/60">
          <p className="text-sm text-slate-700 dark:text-slate-300">No quedan cupos para este día.</p>
          <button
            type="button"
            onClick={() => setSchedulingStep('day')}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Elegir otra fecha
          </button>
                    </div>
                  )}

      {/* Lista unificada de horarios disponibles - Minimalista */}
      <section className="space-y-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {freeTimes.length > 0 ? (
            freeTimes.map((time) => (
              <TimePill 
                key={time} 
                time={time} 
                variant={recommendedTimes.includes(time) ? 'recommended' : 'standard'} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">No quedan cupos para este día</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate('');
                  setSchedulingStep('day');
                }}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Elegir otra fecha
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modalidad - Estilo iOS Minimalista */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Modalidad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {meetingTypes.filter(type => type.available).map((type) => {
            const Icon = type.icon;
            const selected = selectedMeetingType === type.value;
            
            return (
              <motion.button
                key={type.value}
                onClick={() => setSelectedMeetingType(type.value)}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  selected 
                    ? 'text-slate-900 dark:text-white shadow-lg' 
                    : 'bg-white/90 border-slate-200/90 text-slate-700 hover:bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/50'
                }`}
                style={selected ? {
                  backgroundColor: hexToRgba(serviceTheme.primary, 0.15),
                  borderColor: hexToRgba(serviceTheme.accent, 0.4),
                  boxShadow: `0 4px 16px ${hexToRgba(serviceTheme.primary, 0.25)}`,
                } : {}}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      selected
                        ? ''
                        : 'bg-slate-200/90 dark:bg-slate-700/50'
                    }`}
                    style={
                      selected
                        ? { backgroundColor: hexToRgba(serviceTheme.primary, 0.20) }
                        : undefined
                    }
                  >
                    <Icon
                      className={`w-5 h-5 ${selected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {type.label.replace(' Privada', '').replace(' Telefónica', '').replace(' Boutique', '')}
                    </p>
                  </div>
                  {selected && (
                    <CheckCircle
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: serviceTheme.primary }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Botón para continuar al pago - Estilo con gradiente */}
      {selectedTime && selectedMeetingType && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => goToPayment()}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl text-base font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
            theme === 'light' && !isLoading ? 'agendamiento-primary-cta cta-shimmer' : ''
          }`}
          style={
            isLoading
              ? { background: primaryGradient }
              : theme === 'light'
                ? ({ ['--agenda-card-accent']: lightPrimaryCtaRgb } as React.CSSProperties)
                : {
                    background: primaryGradient,
                    boxShadow: `0 8px 24px ${hexToRgba(serviceTheme.primary, 0.4)}`,
                  }
          }
        >
          {isLoading ? 'Procesando...' : 'Continuar al pago'}
        </motion.button>
      )}
      
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            setSelectedDate('');
            setSchedulingStep('day');
          }}
          className="min-h-[44px] inline-flex items-center justify-center text-xs uppercase tracking-wide font-semibold text-slate-600 border border-slate-300/90 rounded-full px-4 py-2 hover:bg-slate-100 transition dark:text-slate-400 dark:border-slate-700/50 dark:hover:bg-slate-800/50"
        >
          Cambiar fecha
        </button>
      </div>
    </motion.div>
  );


  const renderStepContent = () => {
    switch (schedulingStep) {
      case 'day':
        return renderDayStep();
      case 'time':
        return renderTimeStep();
      default:
        return null;
    }
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <motion.div className={`rounded-[1.75rem] p-6 md:p-8 space-y-8 shadow-xl ${
        theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark'
      }`}>
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
        {/* Botón "Tienes dudas" — usa helper centralizado de WhatsApp */}
        <a
          href={buildWhatsAppUrl('agendando')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 px-5 py-3 backdrop-blur-xl transition-colors hover:bg-slate-100/90 group dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
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
            <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors dark:text-slate-300 dark:group-hover:text-white">¿Tienes dudas?</p>
            <p className="text-xs text-slate-500">Habla con un abogado antes de agendar</p>
          </div>
        </a>
        
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full md:w-auto min-h-[44px] px-5 py-3 rounded-full text-sm font-semibold text-slate-600 border border-slate-200/90 hover:bg-slate-100 transition inline-flex items-center justify-center dark:text-white/65 dark:border-white/10 dark:hover:bg-white/10"
        >
          Volver al paso anterior
        </button>
      </div>
    </motion.div>
  );
};

export default Step2_Scheduling;
