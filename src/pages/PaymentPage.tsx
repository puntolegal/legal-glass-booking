import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, CheckCircle, ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import { getServicePricing, formatPrice, type ServicePricing } from '@/config/pricing';
import { MobileLayout } from '@/components/MobileLayout';

export default function PaymentPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServicePricing | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rut: '',
    acceptTerms: false,
    acceptPrivacy: false
  });

  useEffect(() => {
    if (serviceId) {
      const serviceData = getServicePricing(serviceId);
      if (serviceData) {
        setService(serviceData);
      } else {
        navigate('/');
      }
    }
  }, [serviceId, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Debes aceptar los términos y condiciones y la política de privacidad');
      return;
    }

    setLoading(true);
    
    try {
      // Aquí iría la integración con la pasarela de pago
      console.log('Procesando pago:', {
        service,
        customer: formData
      });
      
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirigir a página de confirmación
      navigate(`/payment-success/${serviceId}`);
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando servicio...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 group hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Button>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Resumen del Servicio */}
              <div className="space-y-6">
                <Card className="glass-card border-primary/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Duración</span>
                      </div>
                      <span className="font-semibold">{service.duration}</span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary">Incluye:</h4>
                      {service.features?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Información de Seguridad */}
                <Card className="glass-card border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <CardTitle className="text-lg">Pago Seguro</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Transacción encriptada SSL</p>
                      <p>• Datos protegidos por ley</p>
                      <p>• Sin almacenamiento de datos bancarios</p>
                      <p>• Garantía de satisfacción</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Formulario de Pago */}
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <CardTitle>Información de Pago</CardTitle>
                    </div>
                    <CardDescription>
                      Completa tus datos para procesar el pago de {formatPrice(service.price)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Datos Personales */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                            className="glass"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                            className="glass"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="glass"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="glass"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rut">RUT *</Label>
                        <Input
                          id="rut"
                          value={formData.rut}
                          onChange={(e) => handleInputChange('rut', e.target.value)}
                          placeholder="12.345.678-9"
                          required
                          className="glass"
                        />
                      </div>

                      {/* Checkboxes */}
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                          />
                          <Label htmlFor="acceptTerms" className="text-sm">
                            Acepto los <a href="#" className="text-primary hover:underline">términos y condiciones</a> *
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acceptPrivacy"
                            checked={formData.acceptPrivacy}
                            onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked as boolean)}
                          />
                          <Label htmlFor="acceptPrivacy" className="text-sm">
                            Acepto la <a href="#" className="text-primary hover:underline">política de privacidad</a> *
                          </Label>
                        </div>
                      </div>

                      {/* Botón de Pago */}
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full cta-button-premium text-white py-4 text-lg font-semibold"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Procesando pago...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <CreditCard className="w-5 h-5" />
                            <span>Pagar {formatPrice(service.price)}</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
} 