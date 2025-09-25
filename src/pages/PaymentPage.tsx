import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  Shield,
  Copy,
  Clock,
  AlertCircle,
  Info,
  ExternalLink,
  Sparkles,
  Crown,
  Lock,
  Banknote,
  Smartphone,
  Monitor,
  Phone,
  User,
  MessageCircle
} from 'lucide-react';
import SEO from '../components/SEO';

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedText, setCopiedText] = useState<string>('');

  useEffect(() => {
    // Recuperar datos del localStorage
    const data = localStorage.getItem('paymentData');
    if (data) {
      setPaymentData(JSON.parse(data));
    } else {
      // Si no hay datos, redirigir al agendamiento
      window.location.href = '/agendamiento';
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePaymentMethod = async (method: string) => {
    setSelectedPaymentMethod(method);
    setIsProcessing(true);

    // Simular procesamiento
    setTimeout(async () => {
      if (method === 'transfer') {
        // Mostrar datos de transferencia
        setIsProcessing(false);
      } else if (method === 'transbank') {
        // Preparar datos para Transbank
        const transbankData = {
          amount: paymentData.price.replace(/\./g, ''),
          orderId: `PL-${Date.now()}`,
          sessionId: paymentData.id || Date.now().toString(),
          returnUrl: `${window.location.origin}/payment-success?method=transbank`,
          cancelUrl: `${window.location.origin}/pago`
        };
        
        // Guardar datos en localStorage para recuperar después
        localStorage.setItem('transbankPayment', JSON.stringify({
          ...paymentData,
          transbankData
        }));
        
        // En producción, aquí se haría la integración real con Transbank
        // Por ahora simulamos el flujo
        setIsProcessing(false);
        
        // Mostrar modal de Transbank simulado
        setSelectedPaymentMethod('transbank-process');
      }
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    // Limpiar el estado después de 2 segundos
    setTimeout(() => setCopiedText(''), 2000);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center relative overflow-hidden">
        {/* Partículas de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.div 
              className="w-24 h-24 border-4 border-primary/30 rounded-full mx-auto mb-6 relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full backdrop-blur-sm" />
              <div className="absolute inset-0 rounded-full border border-primary/50" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(255, 107, 53, 0.3)",
                  "0 0 40px rgba(255, 107, 53, 0.6)",
                  "0 0 20px rgba(255, 107, 53, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="text-muted-foreground text-lg">Cargando información de pago...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`Pago - ${paymentData.service} - Punto Legal`}
        description={`Completa el pago para tu consulta de ${paymentData.service}. Múltiples métodos de pago disponibles.`}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-20 relative overflow-hidden">
        {/* Partículas de fondo elegantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/10 rounded-full"
              animate={{
                x: [0, 200, 0],
                y: [0, -200, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 8}%`,
              }}
            />
          ))}
        </div>

        {/* Header Premium */}
        <section className="py-16 border-b border-white/10 relative">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                to="/agendamiento" 
                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300"
              >
                <motion.div
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  Volver al agendamiento
                </span>
              </Link>
            </motion.div>
            
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Efecto de brillo premium */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl" />
                
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 relative">
                  <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                    Finalizar Pago
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Completa tu pago para confirmar la consulta legal con nuestros expertos
                </p>

                {/* Indicadores de seguridad mejorados */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 px-6 py-3 rounded-full border border-green-500/20 backdrop-blur-xl shadow-lg shadow-green-500/10"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-semibold">Pago 100% Seguro</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 px-6 py-3 rounded-full border border-blue-500/20 backdrop-blur-xl shadow-lg shadow-blue-500/10"
                  >
                    <Lock className="w-5 h-5" />
                    <span className="text-sm font-semibold">SSL Encriptado</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 px-6 py-3 rounded-full border border-purple-500/20 backdrop-blur-xl shadow-lg shadow-purple-500/10"
                  >
                    <Crown className="w-5 h-5" />
                    <span className="text-sm font-semibold">Garantía Legal</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contenido Principal */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Panel Izquierdo - Resumen Premium */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 sticky top-24 shadow-2xl">
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground">Resumen de tu consulta</h3>
                        </div>

                        {/* Servicio Premium */}
                        <div className="bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                          <div className="relative z-10">
                            <h4 className="font-bold text-primary text-lg mb-2">{paymentData.service}</h4>
                            <p className="text-sm text-muted-foreground mb-4">{paymentData.category}</p>
                            <div className="text-3xl font-bold text-foreground">
                              ${paymentData.price}
                            </div>
                          </div>
                        </div>

                        {/* Detalles de la cita */}
                        <div className="space-y-6 mb-8">
                          <div>
                            <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              Detalles de la cita
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Fecha:</span>
                                <span className="text-foreground font-medium">{formatDate(paymentData.fecha)}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Hora:</span>
                                <span className="text-foreground font-medium">{paymentData.hora}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground">Modalidad:</span>
                                <span className="text-foreground font-medium flex items-center gap-1">
                                  {paymentData.tipo_reunion === 'presencial' ? (
                                    <>
                                      <Monitor className="w-3 h-3" />
                                      Presencial
                                    </>
                                  ) : paymentData.tipo_reunion === 'videollamada' ? (
                                    <>
                                      <Smartphone className="w-3 h-3" />
                                      Videollamada
                                    </>
                                  ) : (
                                    <>
                                      <Phone className="w-3 h-3" />
                                      Telefónica
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              Cliente
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="text-muted-foreground">{paymentData.cliente.nombre}</div>
                              <div className="text-muted-foreground">{paymentData.cliente.email}</div>
                              <div className="text-muted-foreground">{paymentData.cliente.telefono}</div>
                            </div>
                          </div>
                        </div>

                        {/* Información adicional */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-blue-300 font-medium mb-1">Información importante</p>
                              <p className="text-blue-200/80">
                                Tu consulta será confirmada una vez completado el pago. Recibirás un email con los detalles de la cita.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Panel Derecho - Métodos de Pago */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-3xl font-bold text-foreground">Métodos de Pago</h3>
                        </div>

                        {/* Métodos de pago disponibles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePaymentMethod('transbank')}
                            className="group bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6 text-left hover:border-red-500/40 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                                <CreditCard className="w-6 h-6 text-red-400" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-red-400">Transbank</h4>
                                <p className="text-red-300/80 text-sm">Tarjetas de crédito y débito</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Pago seguro con tarjetas chilenas a través de Webpay
                            </p>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePaymentMethod('transfer')}
                            className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 text-left hover:border-blue-500/40 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <Banknote className="w-6 h-6 text-blue-400" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-blue-400">Transferencia</h4>
                                <p className="text-blue-300/80 text-sm">Banco o app móvil</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              Transferencia directa a nuestra cuenta bancaria
                            </p>
                          </motion.button>
                        </div>

                        {/* Información de transferencia */}
                        {selectedPaymentMethod === 'transfer' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
                          >
                            <h4 className="text-lg font-bold text-blue-400 mb-4">Datos para transferencia</h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                                <span className="text-muted-foreground">Banco:</span>
                                <span className="text-foreground font-medium">Banco de Chile</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                                <span className="text-muted-foreground">Cuenta Corriente:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground font-medium">123-456789-01</span>
                                  <button
                                    onClick={() => copyToClipboard('123-456789-01')}
                                    className="p-1 hover:bg-blue-500/20 rounded"
                                  >
                                    <Copy className="w-4 h-4 text-blue-400" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                                <span className="text-muted-foreground">RUT:</span>
                                <span className="text-foreground font-medium">12.345.678-9</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                                <span className="text-muted-foreground">Titular:</span>
                                <span className="text-foreground font-medium">Punto Legal SpA</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                                <span className="text-muted-foreground">Monto:</span>
                                <span className="text-foreground font-bold text-lg">${paymentData.price}</span>
                              </div>
                            </div>
                            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                              <p className="text-amber-400 text-sm">
                                <strong>Importante:</strong> Envía el comprobante de transferencia a WhatsApp +56 9 6232 1883 para confirmar tu pago.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {isProcessing && (
                          <div className="mt-6 flex items-center justify-center p-8">
                            <div className="flex items-center gap-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              <span className="text-muted-foreground">Procesando pago...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}