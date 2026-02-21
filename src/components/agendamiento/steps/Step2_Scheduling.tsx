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
import { serviceThemes } from '@/config/serviceThemes';

// Color de prestigio (amber/gold) - usado para elementos especiales como "Último del día"
const prestigeAccent = 'rgba(250, 204, 21, 0.85)'; // amber-500 con opacidad

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
  
  // Obtener tema del servicio actual (usa el color del servicio dinámicamente)
  const serviceTheme = useMemo(() => {
    const themeKey = service.category.toLowerCase() as keyof typeof serviceThemes;
    return serviceThemes[themeKey] || serviceThemes.general;
  }, [service.category]);
  
  // Generar colores dinámicos basados en el servicio
  const primaryGradient = useMemo(() => 
    `linear-gradient(135deg, ${serviceTheme.primary}, ${serviceTheme.accent})`,
    [serviceTheme]
  );
  
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

  const toISODate = (date: Date) => date.toISOString().split('T')[0];

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
    const iso = toISODate(date);
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
        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
          isSelected 
            ? 'text-white shadow-lg' 
            : variant === 'recommended'
            ? 'bg-slate-800/50 border-slate-700/50 text-slate-200'
            : 'bg-slate-900/40 border-slate-800/40 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700/50'
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
          <h2 className="text-2xl font-semibold text-white">Selecciona el día</h2>
          <p className="text-sm text-white/40 mt-1">Elige la fecha que más te acomoda</p>
        </header>

        <section className="grid grid-cols-2 md:flex md:gap-3 md:overflow-x-auto pb-1 gap-2">
          {displayedDates.map((date) => {
            const iso = toISODate(date);
            const isSelected = selectedDate === iso;
              
            return (
              <motion.button
                key={iso}
                onClick={() => handleSelectDate(date)}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl border px-3 py-3 md:min-w-[140px] md:px-4 md:py-4 text-left transition ${
                  isSelected 
                    ? 'text-white shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/50'
                }`}
                style={isSelected ? {
                  backgroundColor: hexToRgba(serviceTheme.primary, 0.15),
                  borderColor: hexToRgba(serviceTheme.accent, 0.4),
                  boxShadow: `0 4px 16px ${hexToRgba(serviceTheme.primary, 0.25)}`,
                } : {}}
              >
                <p className={`text-xs md:text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                  {date.toLocaleDateString('es-CL', { weekday: 'short' })}
                </p>
                <p className={`text-xl md:text-2xl font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{date.getDate()}</p>
                <p className={`text-[10px] md:text-xs mt-1 hidden md:flex items-center gap-2 text-slate-500`}>
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
        <h2 className="text-2xl font-semibold text-white">Selecciona tu horario</h2>
        <p className="text-sm text-slate-400">
          {loadingAvailability ? 'Consultando disponibilidad…' : 'Elige el horario que prefieras'}
        </p>
      </header>

      {!loadingAvailability && freeTimes.length === 0 && (
        <div className="rounded-3xl border border-slate-800/70 bg-slate-900/60 px-4 py-6 text-center space-y-3">
          <p className="text-sm text-slate-300">No quedan cupos para este día.</p>
          <button
            onClick={() => setSchedulingStep('day')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
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
              <p className="text-sm text-slate-400 mb-4">No quedan cupos para este día</p>
              <button
                onClick={() => {
                  setSelectedDate('');
                  setSchedulingStep('day');
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Elegir otra fecha
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modalidad - Estilo iOS Minimalista */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modalidad</h3>
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
                    ? 'text-white shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800/40 text-slate-300 hover:bg-slate-800/50'
                }`}
                style={selected ? {
                  backgroundColor: hexToRgba(serviceTheme.primary, 0.15),
                  borderColor: hexToRgba(serviceTheme.accent, 0.4),
                  boxShadow: `0 4px 16px ${hexToRgba(serviceTheme.primary, 0.25)}`,
                } : {}}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selected ? 'bg-pink-500/20' : 'bg-slate-800/50'}`}>
                    <Icon className={`w-5 h-5 ${selected ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selected ? 'text-white' : 'text-slate-300'}`}>
                      {type.label.replace(' Privada', '').replace(' Telefónica', '').replace(' Boutique', '')}
                    </p>
                  </div>
                  {selected && <CheckCircle className="w-4 h-4 text-pink-400 flex-shrink-0" />}
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
          className="w-full py-4 rounded-2xl text-base font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: primaryGradient,
            boxShadow: `0 8px 24px ${hexToRgba(serviceTheme.primary, 0.4)}`,
          }}
        >
          {isLoading ? 'Procesando...' : 'Continuar al pago'}
        </motion.button>
      )}
      
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            setSelectedDate('');
            setSchedulingStep('day');
          }}
          className="text-xs uppercase tracking-wide font-semibold text-slate-400 border border-slate-700/50 rounded-full px-3 py-1 hover:bg-slate-800/50 transition"
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
      <motion.div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
        <button
          onClick={() => setStep(1)}
          className="w-full md:w-auto px-5 py-3 rounded-full text-sm font-semibold text-white/65 border border-white/10 hover:bg-white/10 transition"
        >
          Volver al paso anterior
        </button>

      </div>
    </motion.div>
  );
};

export default Step2_Scheduling;
