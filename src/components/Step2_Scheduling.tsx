import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Phone, MapPin, Calendar, Clock, CheckCircle, X, Info, ArrowLeft } from 'lucide-react';
import WeeklyDatePicker from './WeeklyDatePicker';
import BookingSummary from './BookingSummary';
import TrustBadges from './TrustBadges';
import { getReservationsByDate } from '@/services/reservationService';

interface Step2_SchedulingProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedMeetingType: string;
  setSelectedMeetingType: (type: string) => void;
  serviceColors: any;
  serviceColor: string;
  serviceName: string;
  serviceCategory: string;
  precioFinal: string;
  getAvailableDates: () => Date[];
  getAvailableTimes: () => string[];
  onBack: () => void;
  onSubmit: () => void;
  isMobile?: boolean;
  precioConConvenio?: number;
}

const Step2_Scheduling: React.FC<Step2_SchedulingProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedMeetingType,
  setSelectedMeetingType,
  serviceColors,
  serviceColor,
  serviceName,
  serviceCategory,
  precioFinal,
  getAvailableDates,
  getAvailableTimes,
  onBack,
  onSubmit,
  isMobile = false,
  precioConConvenio = 0,
}) => {
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showMeetingTypeInfo, setShowMeetingTypeInfo] = useState<string | null>(null);

  // Cargar horas ocupadas cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      loadOccupiedTimes(selectedDate);
    }
  }, [selectedDate]);

  const loadOccupiedTimes = async (date: string) => {
    if (!date) return;
    
    try {
      setLoadingAvailability(true);
      const reservations = await getReservationsByDate(date);
      const occupied = reservations
        .filter(reserva => reserva.estado !== 'cancelada')
        .map(reserva => reserva.hora);
      setOccupiedTimes(occupied);
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
      setOccupiedTimes([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const isTimeAvailable = (time: string) => {
    return !occupiedTimes.includes(time);
  };

  // Skeleton loader para horarios
  const TimeSkeleton = () => (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );

  const meetingTypes = [
    { 
      value: 'videollamada', 
      label: 'Videollamada', 
      icon: Video, 
      desc: 'Google Meet', 
      color: 'blue', 
      available: true,
      badge: 'Recomendado',
      features: ['Sin desplazarte', 'Grabación disponible', 'Compartir pantalla']
    },
    { 
      value: 'presencial', 
      label: 'Presencial', 
      icon: MapPin, 
      desc: 'Próximamente', 
      color: 'green', 
      available: false,
      address: 'Las Condes, Santiago'
    },
    { 
      value: 'telefonica', 
      label: 'Telefónica', 
      icon: Phone, 
      desc: 'Llamada directa', 
      color: 'purple', 
      available: true,
      features: ['Desde cualquier lugar', 'Sin necesidad de internet', 'Llamada directa']
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        key="step2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Meeting Type Selection - Tarjetas Visuales Mejoradas */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
              <Video className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tipo de Reunión</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {meetingTypes.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedMeetingType === option.value;
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => option.available && setSelectedMeetingType(option.value)}
                  disabled={!option.available}
                  whileHover={option.available ? { scale: 1.02 } : {}}
                  whileTap={option.available ? { scale: 0.98 } : {}}
                  className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden ${
                    !option.available
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20 shadow-lg`
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  style={isSelected && option.available ? {
                    borderColor: serviceColor,
                    backgroundColor: `${serviceColor}15`,
                    boxShadow: `0 8px 25px ${serviceColor}20`,
                  } : {}}
                >
                  {/* Badge de Recomendado */}
                  {option.badge && option.available && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                        {option.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icono Grande */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      !option.available
                        ? 'bg-gray-300 dark:bg-gray-600'
                        : isSelected
                        ? 'bg-white dark:bg-gray-800 shadow-md'
                        : 'bg-white dark:bg-gray-800'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        !option.available
                          ? 'text-gray-400 dark:text-gray-500'
                          : isSelected
                          ? `text-${option.color}-600 dark:text-${option.color}-400`
                          : 'text-gray-500 dark:text-gray-400'
                      }`} 
                      style={isSelected && option.available ? { color: serviceColor } : {}}
                      />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-lg font-bold ${
                          !option.available
                            ? 'text-gray-400 dark:text-gray-500'
                            : isSelected
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {option.label}
                        </p>
                        {isSelected && option.available && (
                          <CheckCircle className="w-5 h-5" style={{ color: serviceColor }} />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{option.desc}</p>
                      
                      {/* Features */}
                      {option.features && option.available && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {option.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Address para presencial */}
                      {option.address && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          📍 {option.address}
                        </p>
                      )}
                    </div>

                    {/* Estado */}
                    {!option.available && (
                      <div className="bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full font-medium">
                        Próximamente
                      </div>
                    )}

                    {/* Botón de Info */}
                    {option.available && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMeetingTypeInfo(option.value);
                        }}
                        className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-600/50 transition-colors"
                      >
                        <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Date Selection */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
              <Calendar className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Selecciona tu fecha</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Elige el día que mejor te convenga</p>
            </div>
          </div>
          
          <WeeklyDatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableDates={getAvailableDates()}
          />
        </div>

        {/* Time Selection con Skeleton Loader y Animaciones Stagger */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
                <Clock className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Elige tu horario</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loadingAvailability ? 'Cargando horarios...' : 'Horarios disponibles'}
                </p>
              </div>
            </div>

            {loadingAvailability ? (
              <TimeSkeleton />
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="grid grid-cols-2 gap-3"
              >
                {getAvailableTimes().map((time, index) => {
                  const isAvailable = isTimeAvailable(time);
                  const isSelected = selectedTime === time;
                  
                  return (
                    <motion.button
                      key={time}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      onClick={() => isAvailable && setSelectedTime(time)}
                      disabled={!isAvailable}
                      whileHover={isAvailable && !isSelected ? { scale: 1.05 } : {}}
                      whileTap={isAvailable ? { scale: 0.95 } : {}}
                      className={`py-4 px-4 rounded-xl font-semibold transition-all relative ${
                        isSelected
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                          : isAvailable
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-400 dark:text-red-500 cursor-not-allowed opacity-60'
                      }`}
                      style={isSelected ? {
                        backgroundColor: serviceColor,
                        boxShadow: `0 8px 25px ${serviceColor}40`,
                      } : {}}
                      title={!isAvailable ? 'Horario ocupado' : ''}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {!isAvailable && <X className="w-4 h-4" />}
                        {time}
                      </div>
                      {!isAvailable && (
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Booking Summary - Solo en desktop cuando hay info completa */}
        {!isMobile && selectedDate && selectedTime && selectedMeetingType && (
          <BookingSummary
            serviceName={serviceName}
            serviceCategory={serviceCategory}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedMeetingType={selectedMeetingType}
            precioFinal={precioFinal}
            serviceColor={serviceColor}
            isMobile={false}
          />
        )}

        {/* Trust Badges en Mobile */}
        {isMobile && (
          <TrustBadges serviceCategory={serviceCategory} />
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedDate || !selectedTime || !selectedMeetingType}
            className="flex-[2] py-5 rounded-xl font-bold text-white shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
              boxShadow: `0 8px 25px ${serviceColor}30`
            }}
          >
            {precioFinal === '0' || precioConConvenio === 0 ? 'Confirmar Reserva' : 'Proceder al Pago'}
          </button>
        </div>
      </motion.div>

      {/* Booking Summary Flotante en Mobile */}
      {isMobile && selectedDate && (
        <BookingSummary
          serviceName={serviceName}
          serviceCategory={serviceCategory}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedMeetingType={selectedMeetingType}
          precioFinal={precioFinal}
          serviceColor={serviceColor}
          isMobile={true}
        />
      )}

      {/* Modal Informativo de Tipo de Reunión */}
      <AnimatePresence>
        {showMeetingTypeInfo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowMeetingTypeInfo(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-[calc(100vw-2rem)] max-w-md
                         bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 
                         shadow-2xl z-50 overflow-hidden mx-4 my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowMeetingTypeInfo(null)}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                
                <div className="flex items-center gap-3 pr-8">
                  {showMeetingTypeInfo === 'videollamada' && (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Videollamada</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Google Meet</p>
                      </div>
                    </>
                  )}
                  {showMeetingTypeInfo === 'telefonica' && (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Llamada Telefónica</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Llamada directa</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {showMeetingTypeInfo === 'videollamada' && (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Te conectaremos mediante <strong>Google Meet</strong> en la fecha y hora seleccionadas.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-2">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">¿Qué necesitas?</p>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                        <li>Un dispositivo con cámara y micrófono</li>
                        <li>Conexión a internet estable</li>
                        <li>Recibirás el enlace de la reunión por email</li>
                      </ul>
                    </div>
                  </div>
                )}
                {showMeetingTypeInfo === 'telefonica' && (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Te llamaremos al número proporcionado en la fecha y hora seleccionadas.
                    </p>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 space-y-2">
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Importante:</p>
                      <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                        <li>Mantén tu teléfono disponible</li>
                        <li>Asegúrate de tener buena señal</li>
                        <li>Te llamaremos desde un número privado</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowMeetingTypeInfo(null)}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all"
                  style={{ 
                    background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                    boxShadow: `0 4px 15px ${serviceColor}30`
                  }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Step2_Scheduling;

