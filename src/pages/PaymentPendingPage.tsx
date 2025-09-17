import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, ArrowLeft, MessageCircle, FileText, MapPin, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';

export default function PaymentPendingPage() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  
  // Parámetros de MercadoPago
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');
  const merchantOrderId = searchParams.get('merchant_order_id');
  const preferenceId = searchParams.get('preference_id');
  const source = searchParams.get('source');
  
  useEffect(() => {
    const storedData = localStorage.getItem('paymentData');
    if (storedData) {
      setPaymentInfo(JSON.parse(storedData));
    }
    
    console.log('⏳ Pago pendiente - Parámetros:', {
      paymentId, status, externalReference, merchantOrderId, preferenceId, source
    });
  }, [paymentId, status, externalReference, merchantOrderId, preferenceId, source]);

  return (
    <>
      <SEO 
        title="Pago Pendiente - Punto Legal"
        description="Tu pago está siendo procesado. Te notificaremos cuando se confirme."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-8 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Header de pendiente */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/20 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Clock className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">Pago en Proceso</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Tu pago está siendo procesado. Te notificaremos cuando se confirme.
              </p>
              
              {/* Detalles del pago */}
              {paymentInfo && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-yellow-400 mb-4">Detalles de tu consulta:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-muted-foreground"><strong>Servicio:</strong> {paymentInfo.service}</p>
                      <p className="text-sm text-muted-foreground"><strong>Fecha:</strong> {paymentInfo.date}</p>
                      <p className="text-sm text-muted-foreground"><strong>Hora:</strong> {paymentInfo.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground"><strong>Monto:</strong> ${paymentInfo.price}</p>
                      <p className="text-sm text-muted-foreground"><strong>Cliente:</strong> {paymentInfo.name}</p>
                      {paymentId && <p className="text-sm text-muted-foreground"><strong>ID Pago:</strong> {paymentId}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Próximos pasos */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="font-semibold text-foreground mb-4">¿Qué sigue ahora?</h3>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Procesamiento automático</h4>
                    <p className="text-sm text-muted-foreground">
                      MercadoPago está procesando tu pago. Esto puede tomar algunos minutos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Notificación automática</h4>
                    <p className="text-sm text-muted-foreground">
                      Te enviaremos un email cuando se confirme tu pago y tu cita esté lista.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Confirmación de cita</h4>
                    <p className="text-sm text-muted-foreground">
                      Una vez confirmado el pago, tu cita se agendará automáticamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Volver al Inicio
                </Button>
                
                <Button
                  onClick={() => window.open('https://wa.me/56962321883?text=Hola, mi pago está pendiente y necesito ayuda con mi consulta legal.', '_blank')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </div>

            {/* Información de contacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="font-semibold text-foreground mb-4">¿Necesitas ayuda?</h3>
              
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-medium text-foreground">WhatsApp</h4>
                  <p className="text-sm text-muted-foreground">+56 9 6232 1883</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-medium text-foreground">Teléfono</h4>
                  <p className="text-sm text-muted-foreground">Soporte inmediato</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-medium text-foreground">Oficina</h4>
                  <p className="text-sm text-muted-foreground">El Golf, Las Condes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
