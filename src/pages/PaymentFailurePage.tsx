import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw, MessageCircle, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  
  // Parámetros que envía MercadoPago en la URL de retorno
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');
  const merchantOrderId = searchParams.get('merchant_order_id');
  const preferenceId = searchParams.get('preference_id');
  const source = searchParams.get('source');
  
  useEffect(() => {
    // Recuperar datos del pago desde localStorage
    const storedData = localStorage.getItem('paymentData');
    if (storedData) {
      setPaymentInfo(JSON.parse(storedData));
    }
    
    console.log('❌ Pago rechazado - Parámetros recibidos:', {
      paymentId,
      status,
      externalReference,
      merchantOrderId,
      preferenceId,
      source
    });
  }, [paymentId, status, externalReference, merchantOrderId, preferenceId, source]);
  
  const getErrorMessage = (status: string | null) => {
    switch (status) {
      case 'rejected':
        return 'Tu pago fue rechazado. Esto puede deberse a fondos insuficientes o problemas con la tarjeta.';
      case 'cancelled':
        return 'El pago fue cancelado. Puedes intentar nuevamente cuando desees.';
      default:
        return 'Hubo un problema procesando tu pago. Por favor, inténtalo nuevamente.';
    }
  };
  
  const getErrorSuggestion = (status: string | null) => {
    switch (status) {
      case 'rejected':
        return 'Verifica que tu tarjeta tenga fondos suficientes o intenta con otra tarjeta.';
      case 'cancelled':
        return 'Si cambiaste de opinión, puedes agendar una nueva cita cuando gustes.';
      default:
        return 'Revisa los datos de tu tarjeta o intenta con otro método de pago.';
    }
  };

  return (
    <>
      <SEO 
        title="Pago No Completado - Punto Legal"
        description="Tu pago no pudo ser procesado. Intenta nuevamente o contacta con nosotros."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-8 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Header de error */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-red-500/20 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <AlertCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">Pago No Completado</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {getErrorMessage(status)}
              </p>
              
              {/* Detalles del error */}
              {paymentInfo && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-red-400 mb-4">Detalles de la transacción:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-muted-foreground"><strong>Servicio:</strong> {paymentInfo.service}</p>
                      <p className="text-sm text-muted-foreground"><strong>Monto:</strong> ${paymentInfo.price}</p>
                      <p className="text-sm text-muted-foreground"><strong>Fecha:</strong> {paymentInfo.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground"><strong>Estado:</strong> {status || 'Error'}</p>
                      {paymentId && <p className="text-sm text-muted-foreground"><strong>ID Pago:</strong> {paymentId}</p>}
                      {source && <p className="text-sm text-muted-foreground"><strong>Método:</strong> {source}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-muted-foreground">
                {getErrorSuggestion(status)}
              </p>
            </div>

            {/* Acciones disponibles */}
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Intentar nuevamente */}
                <Button
                  onClick={() => window.location.href = '/pago'}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Intentar Nuevamente
                </Button>
                
                {/* Contactar soporte */}
                <Button
                  onClick={() => window.open('https://wa.me/56962321883?text=Hola, tuve problemas con el pago de mi consulta legal. ¿Pueden ayudarme?', '_blank')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar Soporte
                </Button>
              </div>
              
              {/* Volver al inicio */}
              <Link 
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </div>

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="font-semibold text-foreground mb-4">Otras opciones de pago:</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-red-400" />
                    <h4 className="font-medium text-foreground">Transbank</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Usa tu tarjeta chilena con Webpay</p>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <h4 className="font-medium text-foreground">WhatsApp</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Contáctanos para ayuda personalizada</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
