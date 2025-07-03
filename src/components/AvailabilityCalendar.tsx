import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAvailableTimeSlots, type TimeSlot } from "@/services/reservationService";

interface AvailabilityCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const AvailabilityCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  onTimeSelect, 
  selectedTime 
}: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Generar fechas del mes actual
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  // Verificar si una fecha tiene horarios disponibles
  const hasAvailableSlots = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const slots = getAvailableTimeSlots(dateString);
    return slots.some(slot => slot.disponible);
  };

  // Verificar si una fecha es hoy
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar si una fecha es pasada
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Actualizar horarios disponibles cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate]);

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="space-y-6">
      {/* Navegación del mes */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button
          variant="ghost"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
        <div>Dom</div>
        <div>Lun</div>
        <div>Mar</div>
        <div>Mié</div>
        <div>Jue</div>
        <div>Vie</div>
        <div>Sáb</div>
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="h-10">
            {day ? (
              <Button
                variant={selectedDate === day.toISOString().split('T')[0] ? "default" : "ghost"}
                className={`h-full w-full p-0 text-sm ${
                  isToday(day) ? "ring-2 ring-primary" : ""
                } ${
                  isPastDate(day) ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  hasAvailableSlots(day) ? "hover:bg-primary/20" : "opacity-30"
                }`}
                disabled={isPastDate(day) || !hasAvailableSlots(day)}
                onClick={() => {
                  if (!isPastDate(day) && hasAvailableSlots(day)) {
                    onDateSelect(day.toISOString().split('T')[0]);
                  }
                }}
              >
                {day.getDate()}
                {hasAvailableSlots(day) && !isPastDate(day) && (
                  <div className="w-1 h-1 bg-primary rounded-full absolute bottom-1"></div>
                )}
              </Button>
            ) : (
              <div className="h-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Horarios disponibles para la fecha seleccionada */}
      {selectedDate && availableSlots.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">
            Horarios disponibles para {new Date(selectedDate).toLocaleDateString('es-CL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot.hora}
                variant={selectedTime === slot.hora ? "default" : "outline"}
                size="sm"
                disabled={!slot.disponible}
                onClick={() => slot.disponible && onTimeSelect(slot.hora)}
                className={`${
                  !slot.disponible ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {slot.hora === "09:00" && "09:00 AM"}
                {slot.hora === "10:00" && "10:00 AM"}
                {slot.hora === "11:00" && "11:00 AM"}
                {slot.hora === "12:00" && "12:00 PM"}
                {slot.hora === "14:00" && "02:00 PM"}
                {slot.hora === "15:00" && "03:00 PM"}
                {slot.hora === "16:00" && "04:00 PM"}
                {slot.hora === "17:00" && "05:00 PM"}
                {!slot.disponible && " - OCUPADO"}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {availableSlots.filter(slot => slot.disponible).length} de {availableSlots.length} horarios disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar; 