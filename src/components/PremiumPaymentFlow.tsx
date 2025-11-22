import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Building2,
  Globe,
  Smartphone,
  ArrowRight,
  Info,
  Star
} from 'lucide-react';
import MercadoPagoButton from './MercadoPagoButton';

interface PaymentFlowProps {
  amount: number;
  description: string;
  customerData: {
    name: string;
    email: string;
    phone: string;
    rut: string;
  };
  reservationId: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export default function PremiumPaymentFlow({
  amount,
  description,
  customerData,
  reservationId,
  onSuccess,
  onError,
  onBack
}: PaymentFlowProps) {
  const [selectedMethod, setSelectedMethod] = useState<'mercadopago' | 'transfer' | null>(null);
  const [showTransferInfo, setShowTransferInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos

  // Contador de tiempo
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const paymentMethods = [
    {
      id: 'mercadopago',
      name: 'Pago Inmediato',
      description: 'Débito, Crédito, MercadoPago',
      icon: CreditCard,
      benefits: ['Confirmación instantánea', 'Todos los medios de pago', 'Pago en cuotas disponible'],
      recommended: true,
      processingTime: 'Instantáneo'
    },
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'Transferencia manual',
      icon: Building2,
      benefits: ['Sin comisiones', 'Pago directo', 'Comprobante bancario'],
      recommended: false,
      processingTime: '24-48 horas'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header con resumen */}
      <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-pink-200/20 dark:border-pink-800/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Finaliza tu reserva
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              ${amount.toLocaleString('es-CL')}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
              <Clock className="w-4 h-4" />
              <span>Tiempo restante: {formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Alerta de tiempo */}
        {timeLeft < 180 && timeLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Tu reserva expira en {formatTime(timeLeft)}. Completa el pago para asegurarla.
            </p>
          </motion.div>
        )}
      </div>

      {/* Métodos de pago */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Selecciona tu método de pago
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                selectedMethod === method.id
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-pink-300 dark:hover:border-pink-700'
              }`}
            >
              {method.recommended && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  selectedMethod === method.id
                    ? 'bg-pink-100 dark:bg-pink-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <method.icon className={`w-6 h-6 ${
                    selectedMethod === method.id
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>

                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {method.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {method.description}
                  </p>

                  <div className="space-y-1">
                    {method.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <Zap className="w-4 h-4" />
                    <span>Procesamiento: {method.processingTime}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contenido según método seleccionado */}
      <AnimatePresence mode="wait">
        {selectedMethod === 'mercadopago' && (
          <motion.div
            key="mercadopago"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
          >
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pago Seguro con MercadoPago
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Serás redirigido a la plataforma segura de MercadoPago
              </p>
            </div>

            {/* Medios de pago disponibles */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <CreditCard className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Tarjetas</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Building2 className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Transferencia</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Smartphone className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Digital</p>
              </div>
            </div>

            <MercadoPagoButton
              amount={amount}
              description={description}
              externalReference={reservationId}
              customer={{
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                identification: {
                  type: 'RUT',
                  number: customerData.rut
                }
              }}
              onSuccess={onSuccess}
              onError={onError}
            >
              <button
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-3"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pagar ${amount.toLocaleString('es-CL')} Ahora
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </MercadoPagoButton>

            {/* Garantías de seguridad */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-6 h-6 text-green-600 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pago 100% Seguro
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Lock className="w-6 h-6 text-blue-600 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  SSL Encriptado
                </p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-6 h-6 text-purple-600 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Garantía Total
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {selectedMethod === 'transfer' && (
          <motion.div
            key="transfer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
          >
            <div className="text-center mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Transferencia Bancaria
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transfiere directamente a nuestra cuenta
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-4">
                Datos para transferencia:
              </h5>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Banco</p>
                  <p className="font-medium text-gray-900 dark:text-white">Banco de Chile</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de cuenta</p>
                  <p className="font-medium text-gray-900 dark:text-white">Cuenta Corriente</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Número de cuenta</p>
                  <p className="font-medium text-gray-900 dark:text-white">0123456789</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">RUT</p>
                  <p className="font-medium text-gray-900 dark:text-white">76.123.456-7</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                  <p className="font-medium text-gray-900 dark:text-white">Punto Legal SpA</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">puntolegalelgolf@gmail.com</p>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monto a transferir</p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    ${amount.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-semibold mb-1">Importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Envía el comprobante a puntolegalelgolf@gmail.com</li>
                    <li>Tu reserva se confirmará en 24-48 horas hábiles</li>
                    <li>Incluye tu nombre y número de reserva en el mensaje</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTransferInfo(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-pink-500/25"
            >
              He realizado la transferencia
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonios de confianza */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-6 border border-pink-200/50 dark:border-pink-800/50">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Más de 2,400 clientes confían en nosotros
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "Excelente servicio, muy profesionales"
              </p>
              <p className="text-xs text-gray-500 mt-2">- Cliente verificado</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de volver */}
      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
        >
          ← Volver a los datos
        </button>
      </div>
    </motion.div>
  );
}






