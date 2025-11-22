// RUTA: src/components/agendamiento/steps/Step2_Scheduling.tsx

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Info,
  MapPin,
  Phone,
  Sparkles,
  Sun,
  Sunset,
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
  const [urgencyOption, setUrgencyOption] = useState<'asap' | 'next_week' | 'specific' | null>(null);
  const [schedulingStep, setSchedulingStep] = useState<'urgency' | 'day' | 'time' | 'confirmation'>(() => {
    if (selectedDate && selectedTime) return 'confirmation';
    if (selectedDate) return 'time';
    return 'urgency';
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

  const urgencyDrivenDates = useMemo(() => {
    const option = urgencyOption ?? 'specific';

    if (option === 'asap') {
      return availableDates.slice(0, 3);
    }

    if (option === 'next_week') {
      const nextWeekStart = availableDates.find((date) => date.getDay() === 1) || availableDates[0];
      const idx = availableDates.indexOf(nextWeekStart);
      return availableDates.slice(Math.max(idx, 0), Math.max(idx, 0) + 7);
    }

    return availableDates.slice(0, 14);
  }, [availableDates, urgencyOption]);

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

  const handleUrgencySelection = (option: 'asap' | 'next_week' | 'specific') => {
    setUrgencyOption(option);
    setSchedulingStep('day');
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleSelectDate = (date: Date) => {
    const iso = toISODate(date);
    setSelectedDate(iso);
    setSelectedTime('');
    setSchedulingStep('time');
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setSchedulingStep('confirmation');
  };

  const summaryDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const summaryTime = selectedTime ? `${selectedTime} hrs` : '';

  const urgencyOptions = [
    {
      key: 'asap' as const,
      title: 'Necesito prioridad',
      description: 'Mostramos los cupos reservados para casos urgentes.',
      icon: Flame,
    },
    {
      key: 'next_week' as const,
      title: 'La próxima semana',
      description: 'Encuentra un espacio entre lunes y viernes próximos.',
      icon: Sun,
    },
    {
      key: 'specific' as const,
      title: 'Elegir con calma',
      description: 'Revisa el calendario completo y selecciona la fecha exacta.',
      icon: Calendar,
    },
  ];

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

  const renderUrgencyStep = () => (
    <motion.div key="urgency" variants={fieldsetVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">¿Cómo organizamos tu agenda?</h2>
        <p className="text-sm text-slate-400">Selecciona la alternativa que mejor se ajuste a tu disponibilidad.</p>
      </header>

      <section className="grid gap-4">
        {urgencyOptions.map((option) => (
          <motion.button
            key={option.key}
            onClick={() => handleUrgencySelection(option.key)}
            whileTap={{ scale: 0.97 }}
            className="rounded-3xl border px-5 py-5 text-left transition"
            style={{
              background: primarySoft,
              borderColor: primaryBorder,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: primaryGradient }}
              >
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-white">{option.title}</p>
                <p className="text-sm text-slate-300 mt-1">{option.description}</p>
              </div>
              <Sparkles className="w-5 h-5 text-white/60" />
            </div>
          </motion.button>
        ))}
      </section>
    </motion.div>
  );

  const renderDayStep = () => (
    <motion.div key="day" variants={fieldsetVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <header className="flex items-center justify-between">
            <div>
          <h2 className="text-2xl font-semibold text-white">Selecciona el día perfecto</h2>
          <p className="text-sm text-slate-400">Visualiza disponibilidad real y escoge la fecha que más te acomoda.</p>
            </div>
        <button
          onClick={() => setSchedulingStep('urgency')}
          className="text-xs uppercase tracking-wide font-semibold text-white/60 border border-white/10 rounded-full px-3 py-1 hover:bg-white/10 transition"
        >
          Ajustar preferencia
        </button>
      </header>

      <section className="flex gap-3 overflow-x-auto pb-1">
        {urgencyDrivenDates.map((date) => {
          const iso = toISODate(date);
          const isSelected = selectedDate === iso;
          const signal = availabilitySignal(date);
              
              return (
                <motion.button
              key={iso}
              onClick={() => handleSelectDate(date)}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[160px] rounded-3xl border px-4 py-4 text-left transition ${
                isSelected ? 'shadow-xl' : 'opacity-90 hover:opacity-100'
              }`}
              style={{
                background: isSelected ? primaryGradient : primarySoft,
                borderColor: isSelected ? 'transparent' : primaryBorder,
                boxShadow: isSelected ? `0 14px 36px ${primaryStrong}35` : 'none',
              }}
            >
              <p className={`text-sm font-semibold ${isSelected ? 'text-white/85' : 'text-white/80'}`}>
                {date.toLocaleDateString('es-CL', { weekday: 'long' })}
              </p>
              <p className={`text-2xl font-bold mt-2 ${isSelected ? 'text-white' : 'text-white'}`}>{date.getDate()}</p>
              <p className={`text-xs mt-2 flex items-center gap-2 ${isSelected ? 'text-white/75' : 'text-white/65'}`}>
                <span className="inline-flex h-2 w-2 rounded-full" style={{ background: signal.tone }} />
                {signal.label}
              </p>
            </motion.button>
          );
        })}
      </section>
    </motion.div>
  );

  const TimePill: React.FC<{ time: string; variant?: 'recommended' | 'standard'; note?: string }> = ({
    time,
    variant = 'standard',
    note,
  }) => {
    const isSelected = selectedTime === time;
    
    // Estilo base unificado para todos los botones
    const baseStyle = {
      background: isSelected ? primaryGradient : primarySoft,
      borderColor: isSelected ? 'transparent' : primaryBorder,
      color: isSelected ? '#fff' : primaryStrong,
      boxShadow: isSelected && schedulingStep === 'time' ? `0 12px 30px ${primaryStrong}30` : 'none',
    };

    // Variante "recommended" usa borde más grueso pero mantiene colores del servicio
    const recommendedStyle = variant === 'recommended' && !isSelected ? {
      borderWidth: '2px',
      borderColor: hexToRgba(serviceTheme.primary, 0.6),
      background: hexToRgba(serviceTheme.primary, 0.18),
    } : {};

    return (
      <motion.button
        key={time}
        onClick={() => handleSelectTime(time)}
        className="px-4 py-3 rounded-full text-sm font-medium border transition"
        style={{
          ...baseStyle,
          ...recommendedStyle,
        }}
      >
        <span className="flex items-center gap-2">
          {time}
          {variant === 'recommended' && <Sparkles className="w-4 h-4" />}
        </span>
        {note && (
          <span className="block text-[11px] mt-1 tracking-wide" style={{ color: prestigeAccent }}>
            {note}
          </span>
        )}
      </motion.button>
    );
  };

  const renderTimeStep = () => (
    <motion.div key="time" variants={fieldsetVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Selecciona tu horario</h2>
        <p className="text-sm text-slate-400">
          {loadingAvailability
            ? 'Estamos consultando disponibilidad en tiempo real…'
            : 'Sugerimos opciones que se adaptan a agendas exigentes.'}
        </p>
      </header>

      {!loadingAvailability && freeTimes.length === 0 && (
        <div className="rounded-3xl border border-white/5 bg-white/5 px-4 py-6 text-center space-y-3">
          <p className="text-sm text-white/70">No quedan cupos para este día.</p>
          <button
            onClick={() => setSchedulingStep('day')}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
            style={{
              background: primarySoft,
              borderColor: primaryBorder,
              color: primaryStrong,
            }}
          >
            Elegir otra fecha
          </button>
                    </div>
                  )}

      {recommendedTimes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/70" />
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Horarios recomendados por el equipo</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedTimes.slice(0, 3).map((time) => (
              <TimePill key={time} time={time} variant="recommended" />
            ))}
          </div>
        </section>
      )}

      {lastSlotOfDay && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: prestigeAccent }} />
            <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: prestigeAccent }}>
              Último horario disponible
            </h3>
          </div>
          <TimePill time={lastSlotOfDay} note="Último del día" />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-white/70" />
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Mañana</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {morningTimes.length ? (
            morningTimes.map((time) => <TimePill key={time} time={time} />)
          ) : (
            <span className="text-xs text-slate-500">Sin cupos matutinos para este día.</span>
                        )}
                      </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sunset className="w-4 h-4 text-white/70" />
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Tarde</h3>
                        </div>
        <div className="flex flex-wrap gap-2">
          {afternoonTimes.length ? (
            afternoonTimes.map((time) => <TimePill key={time} time={time} />)
          ) : (
            <span className="text-xs text-slate-500">Sin cupos vespertinos para este día.</span>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-widest">Modalidad</h3>
        <div className="grid gap-3">
          {meetingTypes.map((type) => {
            const Icon = type.icon;
            const selected = selectedMeetingType === type.value;
            return (
              <motion.button
                key={type.value}
                onClick={() => type.available && setSelectedMeetingType(type.value)}
                whileTap={type.available ? { scale: 0.97 } : {}}
                className={`rounded-3xl border px-4 py-4 text-left transition ${
                  type.available ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
                style={{
                  background: selected ? primaryGradient : 'rgba(15, 23, 42, 0.4)',
                  borderColor: selected ? 'transparent' : 'rgba(148, 163, 184, 0.25)',
                  boxShadow: selected ? `0 16px 40px ${primaryStrong}25` : 'none',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/10">
                    <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-white/80'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-base font-semibold ${selected ? 'text-white' : 'text-white/85'}`}>
                        {type.label}
                        </p>
                      {selected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <p className={`text-xs ${selected ? 'text-white/75' : 'text-white/60'}`}>{type.description}</p>
                    {type.highlights && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {type.highlights.map((highlight) => (
                          <span key={highlight} className="text-[11px] px-2 py-1 rounded-full bg-black/20 text-white/70">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
      </section>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            setSelectedDate('');
            setSelectedTime('');
            setSchedulingStep('day');
          }}
          className="text-xs uppercase tracking-wide font-semibold text-white/60 border border-white/10 rounded-full px-3 py-1 hover:bg-white/10 transition"
        >
          Ajustar fecha
        </button>
            </div>
    </motion.div>
  );

  const renderConfirmationStep = () => (
    <motion.div key="confirmation" variants={fieldsetVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <motion.div
        className="rounded-3xl p-6 text-center"
        style={{
          background: primarySoft,
          border: `1px solid ${primaryBorder}`,
          boxShadow: `0 24px 48px ${primaryStrong}30`,
        }}
      >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: primaryGradient }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-sm uppercase tracking-[0.4em] text-white/60"
            >
              Confirmación
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="text-3xl font-semibold text-white"
            >
              ¿Confirmamos tu consulta para
              <span className="block text-white/90 mt-1">{summaryDate} · {summaryTime}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="text-sm text-white/65 max-w-md mx-auto"
            >
              Al confirmar, recibirás un correo con los detalles y el enlace seguro de tu reunión.
            </motion.p>
          </motion.div>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-3xl border border-white/5 bg-white/5 px-5 py-4 flex items-start gap-3"
          >
        <Award className="w-5 h-5 text-white/70 mt-0.5" />
        <p className="text-xs text-white/70 leading-relaxed">
          Estás a un paso de unirte al <strong className="text-white">92% de nuestros clientes</strong> que resuelven su caso con una 
          estrategia clara desde la primera consulta.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        whileTap={{ scale: 0.96 }}
        onClick={goToPayment}
        disabled={isLoading}
        className="w-full py-5 rounded-3xl text-lg font-semibold text-white shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: primaryGradient,
          boxShadow: `0 26px 52px ${primaryStrong}35`,
        }}
      >
        {isLoading ? 'Confirmando…' : 'Confirmar y continuar al pago'}
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
        onClick={() => setSchedulingStep('time')}
        className="text-xs uppercase tracking-wide font-semibold text-white/60 border border-white/10 rounded-full px-3 py-1 hover:bg-white/10 transition w-full"
                >
        Ajustar horario
      </motion.button>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (schedulingStep) {
      case 'urgency':
        return renderUrgencyStep();
      case 'day':
        return renderDayStep();
      case 'time':
        return renderTimeStep();
      case 'confirmation':
        return renderConfirmationStep();
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
      <motion.div className="bg-[rgba(15,23,42,0.75)] backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_32px_65px_rgba(15,23,42,0.55)] space-y-8">
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

        {schedulingStep !== 'confirmation' && (
          <p className="text-xs text-white/50 md:text-right">
            Selecciona tus preferencias para coordinar tu consulta estratégica.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Step2_Scheduling;
