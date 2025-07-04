import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AvailabilityCalendar from "./AvailabilityCalendar";
import IndemnizationChart from "./IndemnizationChart";

interface ReservationFormProps {
  onClose: () => void;
}

const ReservationForm = ({ onClose }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
    caseDescription: "",
  });
  const [selectedDateTime, setSelectedDateTime] = useState<{date: Date, time: string} | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDateTime({ date, time });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateTime) {
      alert("Por favor selecciona una fecha y hora para tu cita.");
      return;
    }
    console.log("Form submitted:", { ...formData, appointment: selectedDateTime });
    alert(`Formulario enviado correctamente. Cita agendada para ${selectedDateTime.date.toLocaleDateString()} a las ${selectedDateTime.time}. Redirigiendo al pago de $15.000...`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-6xl my-8">
        {/* Success Story Section */}
        <div className="mb-6">
          <Card className="glass-intense border-glass-border mb-4 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-300/10">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">S</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">¡Caso de Éxito!</h3>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-neon-green/20 to-green-500/20 border border-neon-green/30">
                  <span className="text-neon-green font-bold text-xl">$13.000.000 CLP</span>
                </div>
              </div>
              
              <div className="text-center mb-6 space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  <span className="text-orange-400">Sebastián Soto</span> fue despedido y obtuvo una indemnización de{" "}
                  <span className="text-neon-green font-bold">$13.000.000</span>
                </p>
                <p className="text-muted-foreground">
                  Con nuestra asesoría legal especializada defendió sus derechos laborales exitosamente
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-intense rounded-xl p-4 text-center bg-gradient-to-br from-orange-500/10 to-red-500/5">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Tutela de Derechos Fundamentales</p>
                  <p className="font-bold text-orange-400">$110.000</p>
                </div>
                <div className="glass-intense rounded-xl p-4 text-center bg-gradient-to-br from-orange-500/10 to-red-500/5">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Nulidad del Despido</p>
                  <p className="font-bold text-orange-400">$110.000</p>
                </div>
                <div className="glass-intense rounded-xl p-4 text-center bg-gradient-to-br from-orange-500/10 to-red-500/5">
                  <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Falta de Aviso Previo</p>
                  <p className="font-bold text-orange-400">Variable</p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowCalculator(!showCalculator)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {showCalculator ? "Ocultar Gráfico" : "🧮 Calcular Ahora tu Indemnización"}
              </Button>
              
              {showCalculator && (
                <div className="mt-6 animate-calendar-pop">
                  <IndemnizationChart />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            <AvailabilityCalendar onDateSelect={handleDateTimeSelect} />
          </div>

          {/* Form Section */}
          <Card className="glass-intense border-glass-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Datos de Contacto</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground glass hover:bg-destructive/20"
              >
                ✕
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                $15.000 CLP
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                15 minutos
              </Badge>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                Google Meet
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
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
                <Label htmlFor="rut" className="text-foreground">
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
                <Label htmlFor="email" className="text-foreground">
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
                <Label htmlFor="phone" className="text-foreground">
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
                <Label htmlFor="case" className="text-foreground">
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
                <p className="text-sm font-medium text-foreground">Contacto rápido:</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:+56912345678"
                    className="text-xs px-3 py-1 glass rounded-full hover:bg-primary/20 text-primary transition-colors"
                  >
                    📞 Llamar
                  </a>
                  <a
                    href="mailto:contacto@puntolegal.cl"
                    className="text-xs px-3 py-1 glass rounded-full hover:bg-primary/20 text-primary transition-colors"
                  >
                    ✉️ Email
                  </a>
                  <a
                    href="https://wa.me/56912345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 glass rounded-full hover:bg-green-500/20 text-green-400 transition-colors"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-glow text-lg font-semibold"
                size="lg"
                disabled={!selectedDateTime}
              >
                {selectedDateTime ? "Pagar y Reservar ($15.000)" : "Selecciona fecha y hora"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;