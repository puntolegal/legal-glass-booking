import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, RefreshCw, Home, CreditCard, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function PaymentPendingPage() {
  return (
    <>
      <SEO 
        title="Pago Pendiente - Punto Legal"
        description="Tu pago está siendo procesado. Te notificaremos cuando esté confirmado."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header de pendiente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Pago Pendiente
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.
            </p>
          </motion.div>

          {/* Información del estado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-yellow-200/50 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-yellow-600" />
              Estado del Pago
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>Tu pago está en proceso de verificación. Esto puede tomar unos minutos.</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Procesando...</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  MercadoPago está verificando tu pago con el banco emisor.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Qué esperar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              ⏰ ¿Qué esperar?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p className="text-blue-800">El banco verificará tu pago (1-5 minutos)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <p className="text-blue-800">Recibirás un email de confirmación</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <p className="text-blue-800">Tu consulta quedará confirmada</p>
              </div>
            </div>
          </motion.div>

          {/* Tiempos de procesamiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tiempos de Procesamiento
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Tarjetas de débito:</span>
                  <span className="text-gray-600">1-3 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Tarjetas de crédito:</span>
                  <span className="text-gray-600">2-5 minutos</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Transferencias:</span>
                  <span className="text-gray-600">5-15 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Billeteras digitales:</span>
                  <span className="text-gray-600">1-2 minutos</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Tienes dudas?
            </h3>
            <p className="text-gray-700 mb-4">
              Si no recibes confirmación en 15 minutos, contáctanos para verificar el estado.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">📧 Email:</span>
                <span className="text-blue-600">contacto@puntolegal.online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📱 WhatsApp:</span>
                <span className="text-blue-600">+56 9 1234 5678</span>
              </div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar estado
            </button>
            
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