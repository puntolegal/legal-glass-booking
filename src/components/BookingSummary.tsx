import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Phone, MapPin, CreditCard } from 'lucide-react';

interface BookingSummaryProps {
  serviceName: string;
  serviceCategory: string;
  selectedDate: string;
  selectedTime: string;
  selectedMeetingType: string;
  precioFinal: string;
  serviceColor: string;
  isMobile?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  serviceName,
  serviceCategory,
  selectedDate,
  selectedTime,
  selectedMeetingType,
  precioFinal,
  serviceColor,
  isMobile = false,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No seleccionada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMeetingTypeIcon = () => {
    switch (selectedMeetingType) {
      case 'videollamada':
        return Video;
      case 'telefonica':
        return Phone;
      case 'presencial':
        return MapPin;
      default:
        return Calendar;
    }
  };

  const getMeetingTypeLabel = () => {
    switch (selectedMeetingType) {
      case 'videollamada':
        return 'Videollamada (Google Meet)';
      case 'telefonica':
        return 'Llamada Telefónica';
      case 'presencial':
        return 'Presencial';
      default:
        return 'No seleccionado';
    }
  };

  const MeetingIcon = getMeetingTypeIcon();
  const hasCompleteInfo = selectedDate && selectedTime && selectedMeetingType;

  if (!hasCompleteInfo && !isMobile) {
    return null; // No mostrar en desktop hasta que esté completo
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        isMobile 
          ? 'fixed bottom-0 left-0 right-0 z-40' 
          : 'sticky top-4'
      }`}
    >
      <div 
        className={`${
          isMobile 
            ? 'bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl rounded-t-3xl p-6' 
            : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/40 dark:border-gray-700/40 shadow-xl p-6'
        }`}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" style={{ color: serviceColor }} />
          Resumen de tu Reserva
        </h3>

        <div className="space-y-3">
          {/* Servicio */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: `${serviceColor}20` }}>
              <CreditCard className="w-5 h-5" style={{ color: serviceColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Servicio</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {serviceName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{serviceCategory}</p>
            </div>
          </div>

          {/* Fecha */}
          {selectedDate && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Fecha</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>
          )}

          {/* Hora */}
          {selectedTime && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 dark:bg-green-900/30">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Hora</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedTime}
                </p>
              </div>
            </div>
          )}

          {/* Tipo de Reunión */}
          {selectedMeetingType && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-100 dark:bg-purple-900/30">
                <MeetingIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Modalidad</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {getMeetingTypeLabel()}
                </p>
              </div>
            </div>
          )}

          {/* Precio */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</p>
              <p 
                className="text-2xl font-bold"
                style={{ color: serviceColor }}
              >
                ${precioFinal}
              </p>
            </div>
          </div>
        </div>

        {hasCompleteInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <p className="text-xs text-green-700 dark:text-green-300 text-center">
              ✓ Tu reserva está lista para confirmar
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BookingSummary;

