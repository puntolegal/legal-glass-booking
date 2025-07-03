import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { validateRUT } from "@/lib/utils";
import { 
  getAvailableTimeSlots, 
  createReservation,
  type TimeSlot 
} from "@/services/reservationService";
import AvailabilityCalendar from "./AvailabilityCalendar";

interface ReservationFormProps {
  onClose: () => void;
}

const ReservationForm = ({ onClose }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    descripcion: "",
    fecha: "",
    hora: ""
  });
  const [rutError, setRutError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.fecha) {
      getAvailableTimeSlots(formData.fecha).then(slots => {
        setAvailableSlots(slots);
        if (formData.hora && !slots.find(slot => slot.hora === formData.hora)?.disponible) {
          setFormData(prev => ({ ...prev, hora: "" }));
        }
      });
    }
  }, [formData.fecha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRUT(formData.rut)) {
      setRutError("RUT inválido. Por favor ingresa un RUT válido.");
      return;
    } else {
      setRutError("");
    }
    if (Object.values(formData).some(value => !value)) {
      alert("Por favor completa todos los campos");
      return;
    }
    const selectedSlot = availableSlots.find(slot => slot.hora === formData.hora);
    if (!selectedSlot?.disponible) {
      alert("El horario seleccionado ya no está disponible. Por favor selecciona otro horario.");
      return;
    }
    setLoading(true);
    try {
      await createReservation(formData);
      alert("¡Reserva exitosa! Te enviaremos un correo de confirmación con los detalles de tu consulta.");
      onClose();
    } catch (error) {
      alert("Error al guardar la reserva. Por favor intenta nuevamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateSelect = (date: string) => {
    setFormData(prev => ({ ...prev, fecha: date }));
    setShowCalendar(false);
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, hora: time }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-strong rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Reservar Consulta Legal</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="glass border-white/20"
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                className="glass border-white/20"
                placeholder="12.345.678-9"
                required
              />
              {rutError && <p className="text-red-500 text-xs mt-1">{rutError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="glass border-white/20"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="glass border-white/20"
                placeholder="+569 6232 1883"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Caso *</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="glass border-white/20 min-h-[100px]"
              placeholder="Describe brevemente tu situación laboral y el motivo de despido..."
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Seleccionar Fecha y Hora *</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    id="fecha"
                    name="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="glass border-white/20"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4"
                >
                  {showCalendar ? "Ocultar Calendario" : "Ver Calendario"}
                </Button>
              </div>
            </div>

            {showCalendar && (
              <div className="glass rounded-2xl p-6 border border-primary/30">
                <AvailabilityCalendar
                  selectedDate={formData.fecha}
                  onDateSelect={handleDateSelect}
                  onTimeSelect={handleTimeSelect}
                  selectedTime={formData.hora}
                />
              </div>
            )}

            {formData.fecha && (
              <div className="space-y-2">
                <Label htmlFor="hora">Hora Preferida *</Label>
                <select
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="glass border-white/20 rounded-md px-3 py-2 w-full bg-input text-foreground"
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {availableSlots.map((slot) => (
                    <option 
                      key={slot.hora} 
                      value={slot.hora}
                      disabled={!slot.disponible}
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
                    </option>
                  ))}
                </select>
                {availableSlots.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {availableSlots.filter(slot => slot.disponible).length} de {availableSlots.length} horarios disponibles
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-6 border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Resumen de Pago</h3>
              <span className="text-2xl font-bold text-primary">
                <span className="line-through mr-2">$15.000 CLP</span>
                <span className="text-green-500 font-bold">Oferta de Lanzamiento: Consulta Gratis</span>
              </span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Consulta legal especializada (45 min)
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enlace de Google Meet incluido
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Informe legal por escrito
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="button" 
              variant="glass" 
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1"
              disabled={loading}
            >
              Agendar Consulta
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;