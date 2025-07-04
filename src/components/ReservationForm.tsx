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
          <Card className="glass-intense border-glass-border mb-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Sebastián Soto</h3>
                    <p className="text-sm text-muted-foreground">Caso de éxito reciente</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-neon-green/20 text-neon-green border-neon-green/30">
                  $13.000.000 CLP
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                <strong>Sebastián fue despedido injustificadamente</strong> y con nuestra asesoría legal especializada 
                obtuvo una indemnización de <strong>$13.000.000 CLP</strong> por violación a sus derechos laborales.
              </p>
              <Button
                variant="outline" 
                onClick={() => setShowCalculator(!showCalculator)}
                className="btn-glow w-full mb-4"
              >
                {showCalculator ? "Ocultar Calculadora" : "Calcular mi Indemnización"}
              </Button>
              {showCalculator && (
                <div className="mt-4">
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