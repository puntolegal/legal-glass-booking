import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AvailabilityCalendar from "./AvailabilityCalendar";

interface ReservationFormProps {
  onClose: () => void;
  servicePrice?: string;
  serviceName?: string;
  isModal?: boolean; // Nueva prop para determinar si es modal o embebido
}

const ReservationForm = ({ 
  onClose, 
  servicePrice = "$15.000 CLP", 
  serviceName = "Consulta Legal",
  isModal = true 
}: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
    caseDescription: "",
  });
  const [selectedDateTime, setSelectedDateTime] = useState<{date: Date, time: string} | null>(null);

  // Cerrar con tecla Escape solo si es modal
  useEffect(() => {
    if (!isModal) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isModal]);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDateTime({ date, time });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateTime) {
      alert("Por favor selecciona una fecha y hora para tu cita.");
      return;
    }
    console.log("Form submitted:", { ...formData, appointment: selectedDateTime, service: serviceName, price: servicePrice });
    alert(`✅ Reserva confirmada!\n\n📋 Servicio: ${serviceName}\n💰 Precio: ${servicePrice}\n📅 Fecha: ${selectedDateTime.date.toLocaleDateString()}\n⏰ Hora: ${selectedDateTime.time}\n\nRedirigiendo al pago...`);
  };

  const formContent = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Calendar Section */}
      <div className="order-2 lg:order-1">
        <AvailabilityCalendar onDateSelect={handleDateTimeSelect} />
      </div>

      {/* Form Section */}
      <Card className="glass-intense border-glass-border order-1 lg:order-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground font-bold text-xl">Datos de Contacto</CardTitle>
            {isModal && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/20 rounded-full w-8 h-8 p-0"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Servicio y Precio Destacado */}
          <div className="glass rounded-lg p-4 mb-4 bg-primary/5 border border-primary/20">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-primary">{serviceName}</h3>
              <div className="flex items-center justify-center space-x-3">
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-base px-3 py-1">
                  {servicePrice}
                </Badge>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  45 minutos
                </Badge>
                <Badge
                  variant="outline"
                  className="border-cyan-400/40 text-cyan-300 glass shadow-lg flex items-center gap-1 px-3 py-1 backdrop-blur-md"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#00A884" fillOpacity="0.15"/>
                    <path d="M7 7h7v3l3-3v10l-3-3v3H7V7z" fill="#00A884"/>
                  </svg>
                  Google Meet
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Nombre completo
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass border-glass-border bg-background/50 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut" className="text-foreground font-medium">
                RUT
              </Label>
              <Input
                id="rut"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                className="glass border-glass-border bg-background/50 focus:border-primary/50"
                placeholder="12.345.678-9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass border-glass-border bg-background/50 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="glass border-glass-border bg-background/50 focus:border-primary/50"
                placeholder="+56 9 XXXX XXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="case" className="text-foreground font-medium">
                Breve descripción del caso
              </Label>
              <Textarea
                id="case"
                value={formData.caseDescription}
                onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
                className="glass border-glass-border bg-background/50 resize-none focus:border-primary/50"
                rows={3}
                placeholder="Describe brevemente tu situación legal..."
                required
              />
            </div>

            {/* Contact Quick Links */}
            <div className="glass rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Contacto rápido:</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="tel:+56962321883"
                  className="text-xs px-3 py-1 glass rounded-full hover:bg-primary/20 text-primary transition-colors flex items-center"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Llamar
                </a>
                <a
                  href="mailto:puntolegalelgolf@gmail.com"
                  className="text-xs px-3 py-1 glass rounded-full hover:bg-primary/20 text-primary transition-colors flex items-center"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </a>
                <a
                  href="https://wa.me/56962321883"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1 glass rounded-full hover:bg-green-500/20 text-green-400 transition-colors flex items-center"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  WhatsApp
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
              disabled={!selectedDateTime}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Confirmar Reserva
              </span>
            </Button>

            {/* Botón Google Meet Premium Glassmorphism iOS 2025 */}
            <a
              href="https://meet.google.com/abc-defg-hij"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-white/15 via-cyan-400/20 to-white/10 backdrop-blur-2xl border border-cyan-400/40 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
            >
              {/* Efecto de brillo superior */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Contenido */}
              <div className="relative flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h7v3l3-3v10l-3-3v3H7V7z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">Unirse a Google Meet</div>
                  <div className="text-xs text-cyan-200">Consulta virtual en tiempo real</div>
                </div>
              </div>
              
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  // Si es modal, envolver en overlay
  if (isModal) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-4xl my-4 sm:my-8 mt-16 sm:mt-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {formContent}
        </div>
      </div>
    );
  }

  // Si no es modal, retornar solo el contenido
  return formContent;
};

export default ReservationForm;