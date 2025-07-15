import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { getServicePricing, formatPrice } from '@/config/pricing';
import { MobileLayout } from '@/components/MobileLayout';

export default function PaymentSuccessPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (serviceId) {
      const serviceData = getServicePricing(serviceId);
      setService(serviceData);
    }
  }, [serviceId]);

  if (!service) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-500/5 via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icono de Éxito */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-float">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Mensaje Principal */}
            <Card className="glass-card border-green-500/20 mb-8">
              <CardHeader>
                <CardTitle className="text-3xl text-green-600 mb-2">
                  ¡Pago Exitoso!
                </CardTitle>
                <CardDescription className="text-lg">
                  Tu consulta de <strong>{service.title}</strong> ha sido confirmada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700">
                        {formatPrice(service.price)} pagados
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">
                    Hemos recibido tu pago y nos pondremos en contacto contigo en las próximas 24 horas para coordinar tu consulta.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Próximos Pasos */}
            <Card className="glass-card border-primary/20 mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Confirmación por Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibirás un email con los detalles de tu consulta y documentación necesaria.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Contacto del Abogado</h4>
                      <p className="text-sm text-muted-foreground">
                        Un abogado especializado se pondrá en contacto contigo para coordinar la consulta.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Consulta Legal</h4>
                      <p className="text-sm text-muted-foreground">
                        Realizarás tu consulta según la modalidad contratada ({service.duration}).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card className="glass-card border-blue-500/20 mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a
                    href="mailto:puntolegalelgolf@gmail.com"
                    className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200 group"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 group-hover:text-blue-800">puntolegalelgolf@gmail.com</span>
                  </a>
                  

                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-105"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/blog')}
                className="flex-1 border-primary/20 hover:bg-primary/5 hover:border-primary/30 text-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Ver Blog Legal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 