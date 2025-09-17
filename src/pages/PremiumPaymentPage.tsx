import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  Lock
} from 'lucide-react';
import SEO from '../components/SEO';

export default function PremiumPaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('paymentData');
    if (data) {
      setPaymentData(JSON.parse(data));
    } else {
      window.location.href = '/agendamiento';
    }
  }, []);


  // Redirigir automáticamente a MercadoPago
  useEffect(() => {
    if (paymentData) {
      // Pequeña pausa para mostrar la página y luego redirigir
      const timer = setTimeout(() => {
        window.location.href = '/mercadopago';
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [paymentData]);

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Cargando datos...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`Finalizar Pago - ${paymentData.service} - Punto Legal`}
        description={`Completa el pago de tu consulta de ${paymentData.service}. Métodos seguros y confiables.`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Redirigiendo al pago</h1>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Te estamos redirigiendo a MercadoPago para completar tu pago de forma segura.</p>
              
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Resumen:</h3>
                <p className="text-sm text-gray-600"><strong>Servicio:</strong> {paymentData.service}</p>
                <p className="text-sm text-gray-600"><strong>Total:</strong> <span className="text-blue-600 font-bold">${paymentData.price}</span></p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Pago 100% seguro con MercadoPago</span>
            </div>
            
            <Link 
              to="/agendamiento" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mt-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al agendamiento
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
