import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, Home, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '@/integrations/supabase/client';

export default function PaymentFailurePage() {
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Auto-redirect si el pago realmente fue aprobado
    const checkPaymentStatus = async () => {
      try {
        const externalRef = searchParams.get('external_reference');
        const status = searchParams.get('status');
        
        // Si el status dice que fue aprobado, redirigir
        if (status === 'approved' && externalRef) {
          console.log('🔄 Pago aprobado detectado, redirigiendo a success...');
          window.location.href = `/payment-success?external_reference=${externalRef}`;
          return;
        }
        
        // Verificar en la base de datos si la reserva fue confirmada
        if (externalRef) {
          const { data: reserva } = await supabase
            .from('reservas')
            .select('estado, pago_estado')
            .eq('external_reference', externalRef)
            .maybeSingle();
          
          if (reserva && (reserva.estado === 'confirmada' || reserva.pago_estado === 'approved')) {
            console.log('🔄 Reserva confirmada detectada en BD, redirigiendo...');
            window.location.href = `/payment-success?external_reference=${externalRef}`;
            return;
          }
        }
      } catch (error) {
        console.error('Error verificando estado:', error);
      } finally {
        setChecking(false);
      }
    };
    
    checkPaymentStatus();
  }, [searchParams]);
  
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando estado del pago...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <SEO 
        title="Error en el Pago - Punto Legal"
        description="Hubo un problema procesando tu pago. Intenta nuevamente o contacta con nosotros."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header de error */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Error en el Pago
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hubo un problema procesando tu pago. No te preocupes, no se ha cobrado nada.
            </p>
          </motion.div>

          {/* Información del error */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-red-200/50 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-red-600" />
              ¿Qué pasó?
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>El pago no pudo ser procesado por alguna de las siguientes razones:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Datos de la tarjeta incorrectos o expirada</li>
                <li>Fondos insuficientes en la cuenta</li>
                <li>Problema temporal con el banco</li>
                <li>Error de conexión con MercadoPago</li>
                <li>Tarjeta bloqueada o restringida</li>
              </ul>
            </div>
          </motion.div>

          {/* Soluciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              💡 Soluciones
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p className="text-blue-800">Verifica que los datos de tu tarjeta sean correctos</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <p className="text-blue-800">Asegúrate de tener fondos suficientes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <p className="text-blue-800">Intenta con otra tarjeta o método de pago</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">4</span>
                </div>
                <p className="text-blue-800">Contacta a tu banco si el problema persiste</p>
              </div>
            </div>
          </motion.div>

          {/* Información importante - Reserva registrada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              ✅ Tu consulta fue registrada
            </h3>
            <p className="text-green-800">
              Aunque hubo un problema con el pago, <strong>tu consulta se registró exitosamente en nuestro sistema</strong>. 
              Nuestro equipo revisará tu caso y se pondrá en contacto contigo a la brevedad para coordinar el pago y confirmar tu cita.
            </p>
          </motion.div>

          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-700 mb-4">
              Si el problema persiste, no dudes en contactarnos. Estamos aquí para ayudarte.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">📧 Email:</span>
                <a 
                  href="mailto:puntolegalelgolf@gmail.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  puntolegalelgolf@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📱 WhatsApp:</span>
                <a 
                  href="tel:+56962321883"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  +569 6232 1883
                </a>
              </div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/agendamiento"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Intentar nuevamente
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-300 transition-all duration-200 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}