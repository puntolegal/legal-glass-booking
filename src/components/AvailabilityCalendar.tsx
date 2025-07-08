import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";

interface AvailabilityCalendarProps {
  onDateSelect?: (date: Date, time: string) => void;
}

const AvailabilityCalendar = ({ onDateSelect }: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // Generate unavailable hours for each day (consistent for the same day)
  const unavailableHours = useMemo(() => {
    const unavailable: Record<string, string> = {};
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const dateKey = date.toDateString();
        // Use the date as seed for consistent random generation
        const seed = date.getTime();
        const randomIndex = Math.floor((seed % 1000) / 1000 * timeSlots.length);
        unavailable[dateKey] = timeSlots[randomIndex];
      }
    }
    
    return unavailable;
  }, []);

  // Simulate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.toDateString() === date.toDateString()
    );
  };

  const getUnavailableHourForDate = (date: Date) => {
    return unavailableHours[date.toDateString()];
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onDateSelect?.(selectedDate, time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isTimeUnavailable = (date: Date, time: string) => {
    return getUnavailableHourForDate(date) === time;
  };

  return (
    <Card className="glass-intense border-glass-border animate-calendar-pop">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Agenda tu Cita</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="btn-glow"
            >
              Mes
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="btn-glow"
            >
              Semana
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar */}
        <div className="glass rounded-lg p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              return date < new Date() || !isDateAvailable(date);
            }}
            modifiers={{
              available: availableDates,
            }}
            modifiersClassNames={{
              available: "bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30",
            }}
            className="rounded-md border-0 pointer-events-auto"
          />
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="glass rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">
              Fecha seleccionada:
            </h3>
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              {formatDate(selectedDate)}
            </Badge>
          </div>
        )}

        {/* Time Slots */}
        {selectedDate && (
          <div className="glass rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Horarios disponibles:
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => {
                const isUnavailable = isTimeUnavailable(selectedDate, time);
                return (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => !isUnavailable && handleTimeSelect(time)}
                    disabled={isUnavailable}
                    className={`transition-all duration-300 ${
                      isUnavailable
                        ? "bg-red-500/20 text-red-400 border-red-500/30 cursor-not-allowed opacity-60"
                        : selectedTime === time
                        ? "btn-neon animate-pulse-neon"
                        : "glass hover:bg-primary/20 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isUnavailable && <X className="w-3 h-3" />}
                      {time}
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {/* Unavailable time indicator */}
            {selectedDate && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong>Hora no disponible:</strong> {getUnavailableHourForDate(selectedDate)}
                  </span>
                </div>
                <p className="text-xs text-red-300 mt-1">
                  Esta hora está reservada.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Confirmation */}
        {selectedDate && selectedTime && (
          <div className="glass-intense rounded-lg p-4 border border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cita agendada para:</p>
                <p className="font-semibold text-foreground">
                  {formatDate(selectedDate)} a las {selectedTime}
                </p>
                <p className="text-sm text-primary font-medium">Valor: $35.000 CLP</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✓ Confirmado
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;