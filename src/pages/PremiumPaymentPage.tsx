import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, Lock } from 'lucide-react';
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

  useEffect(() => {
    if (paymentData) {
      const timer = setTimeout(() => {
        window.location.href = '/mercadopago';
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentData]);

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-pink-500/30 border-t-pink-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Cargando datos...</h2>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md mx-auto p-6"
        >
          <div
            className="rounded-3xl p-8 overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                <CreditCard className="w-6 h-6 text-pink-400" />
              </div>
              <h1 className="text-xl font-bold text-white">Redirigiendo al pago</h1>
            </div>

            <div className="space-y-4 mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500/30 border-t-pink-500 mx-auto"></div>
              <p className="text-sm text-slate-400 text-center">
                Te llevamos a MercadoPago para completar tu pago de forma segura.
              </p>

              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Servicio</p>
                <p className="text-sm font-semibold text-white">{paymentData.service}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-3 mb-1">Total</p>
                <p className="text-xl font-bold text-pink-400">
                  ${new Intl.NumberFormat('es-CL').format(paymentData.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>Pago 100% seguro con MercadoPago</span>
            </div>

            <Link
              to="/agendamiento"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
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
