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
import { MobileFloatingNav } from '../components/MobileFloatingNav';

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
      
      <MobileFloatingNav />
      
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

                        {/* Transbank Webpay - Método Principal */}
                        {selectedPaymentMethod === 'transbank' && !isProcessing ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                          >
                            {/* Header de Transbank */}
                            <div className="bg-gradient-to-r from-red-500/15 to-red-600/10 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-50" />
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-red-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-xl font-bold text-red-400">Transbank Webpay</h4>
                                    <p className="text-red-300/80 text-sm">Método seguro y confiable - Tarjetas chilenas</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Información de Transbank */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                              <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                  <CreditCard className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Pago con Transbank</h3>
                                <p className="text-muted-foreground">Usa tu tarjeta de crédito o débito chilena de forma segura</p>
                              </div>

                              {/* Tarjetas aceptadas */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-blue-400 mb-1">VISA</div>
                                  <p className="text-xs text-muted-foreground">Crédito/Débito</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-orange-400 mb-1">MC</div>
                                  <p className="text-xs text-muted-foreground">Mastercard</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-green-400 mb-1">MAGNA</div>
                                  <p className="text-xs text-muted-foreground">Redbanc</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-purple-400 mb-1">DINERS</div>
                                  <p className="text-xs text-muted-foreground">Club</p>
                                </div>
                              </div>

                              {/* Proceso simplificado */}
                              <div className="space-y-4 mb-8">
                                <h4 className="font-semibold text-foreground mb-4">Proceso rápido y seguro:</h4>
                                
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                  <div>
                                    <p className="font-medium text-foreground">Serás redirigido a Transbank</p>
                                    <p className="text-sm text-muted-foreground">Ingresa los datos de tu tarjeta de forma segura</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl border border-green-500/20">
                                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                  <div>
                                    <p className="font-medium text-foreground">Confirmación inmediata</p>
                                    <p className="text-sm text-muted-foreground">Recibes confirmación al instante</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
                                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                  <div>
                                    <p className="font-medium text-foreground">Cita confirmada automáticamente</p>
                                    <p className="text-sm text-muted-foreground">Te enviaremos los detalles por email</p>
                                  </div>
                                </div>
                              </div>

                              {/* Botón de pago principal */}
                              <motion.button
                                onClick={() => {
                                  // Proceder con Transbank
                                  const transbankData = {
                                    amount: paymentData.price.replace(/\./g, ''),
                                    orderId: `PL-${Date.now()}`,
                                    description: paymentData.service,
                                    returnUrl: `${window.location.origin}/payment-success?method=transbank`
                                  };
                                  localStorage.setItem('transbankData', JSON.stringify(transbankData));
                                  // En producción, redirigir a Transbank
                                  window.location.href = '/payment-success?method=transbank';
                                }}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Lock className="w-5 h-5" />
                                Pagar con Transbank - ${paymentData.price}
                              </motion.button>

                              {/* Indicadores de seguridad */}
                              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-green-500" />
                                  <span>Protegido por Transbank</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Lock className="w-4 h-4 text-blue-500" />
                                  <span>Encriptación SSL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-purple-500" />
                                  <span>Certificado PCI</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : selectedPaymentMethod === 'mercadopago' && !isProcessing ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                          >
                            {/* Redirigir a página específica de MercadoPago */}
                            <div className="text-center">
                              <p className="text-muted-foreground mb-4">Serás redirigido a MercadoPago para completar tu pago</p>
                              <motion.button
                                onClick={() => window.location.href = '/mercadopago'}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold"
                                whileHover={{ scale: 1.05 }}
                              >
                                Continuar con MercadoPago
                              </motion.button>
                            </div>
                          </motion.div>
                        ) : (
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <h5 className="text-lg font-semibold text-foreground">Datos bancarios</h5>
                      </div>

                                <div className="space-y-4">
                                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Titular:</span>
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-foreground">Benjamin Soza</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('Benjamin Soza')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === 'Benjamin Soza' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={copiedText === 'Benjamin Soza' ? '¡Copiado!' : 'Copiar titular'}
                                        >
                                          {copiedText === 'Benjamin Soza' ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <Copy className="w-4 h-4" />
                                          }
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">RUT:</span>
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-foreground">20.162.555-6</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('20.162.555-6')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === '20.162.555-6' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          {copiedText === '20.162.555-6' ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <Copy className="w-4 h-4" />
                                          }
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Banco:</span>
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-foreground">Banco de Chile</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('Banco de Chile')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === 'Banco de Chile' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          {copiedText === 'Banco de Chile' ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <Copy className="w-4 h-4" />
                                          }
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Cuenta:</span>
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-foreground">07-154-00711-07</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('07-154-00711-07')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === '07-154-00711-07' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          {copiedText === '07-154-00711-07' ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <Copy className="w-4 h-4" />
                                          }
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-primary/30 transition-all duration-300">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm text-muted-foreground">Email:</span>
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-foreground">benja.soza@gmail.com</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('benja.soza@gmail.com')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === 'benja.soza@gmail.com' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          {copiedText === 'benja.soza@gmail.com' ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <Copy className="w-4 h-4" />
                                          }
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Botón copiar todo */}
                                <motion.button
                                  onClick={() => {
                                    const allData = `Titular: Benjamin Soza\nRUT: 20.162.555-6\nBanco: Banco de Chile\nCuenta: 07-154-00711-07\nEmail: benja.soza@gmail.com`;
                                    copyToClipboard(allData);
                                  }}
                                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                                    copiedText.includes('Titular: Benjamin Soza') 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                      : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {copiedText.includes('Titular: Benjamin Soza') ? 
                                    <CheckCircle className="w-5 h-5" /> : 
                                    <Copy className="w-5 h-5" />
                                  }
                                  {copiedText.includes('Titular: Benjamin Soza') ? '¡Datos copiados!' : 'Copiar todos los datos'}
                                </motion.button>
                              </div>

                              {/* Instrucciones */}
                              <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-amber-400" />
                                  </div>
                                  <h5 className="text-lg font-semibold text-foreground">Instrucciones</h5>
                      </div>

                                <div className="space-y-4">
                                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-amber-400 text-xs font-bold">1</span>
                                      </div>
                                      <div>
                                        <p className="text-amber-300 font-medium mb-1">Realiza la transferencia</p>
                                        <p className="text-amber-200/80 text-sm">
                                          Usa los datos bancarios proporcionados para realizar la transferencia por el monto exacto.
                                        </p>
                                      </div>
                                    </div>
                      </div>

                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-400 text-xs font-bold">2</span>
                                      </div>
                                      <div>
                                        <p className="text-blue-300 font-medium mb-1">Envía el comprobante</p>
                                        <p className="text-blue-200/80 text-sm">
                                          Envía el comprobante de transferencia por WhatsApp para confirmar tu pago.
                                        </p>
                                      </div>
                                    </div>
                        </div>

                                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-green-400 text-xs font-bold">3</span>
                                      </div>
                                      <div>
                                        <p className="text-green-300 font-medium mb-1">Confirma tu cita</p>
                                        <p className="text-green-200/80 text-sm">
                                          Recibirás confirmación inmediata y los detalles de tu consulta por email.
                                        </p>
                                      </div>
                                    </div>
                        </div>
                      </div>

                                {/* WhatsApp Button */}
                                <motion.a
                                  href={`https://wa.me/56962321883?text=${encodeURIComponent(
                                    `Hola, acabo de realizar la transferencia por ${paymentData.service} - $${paymentData.price}. Adjunto comprobante.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  Enviar comprobante por WhatsApp
                                </motion.a>
                              </div>
                          </div>
                          </motion.div>
                        ) : (
                          <div className="space-y-6">
                            {/* Transferencia Electrónica */}
                            <motion.div 
                              className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group ${
                                selectedPaymentMethod === 'transfer' ? 'border-primary/50 bg-primary/10' : 'border-white/20'
                              }`}
                              onClick={() => handlePaymentMethod('transfer')}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                                  <Banknote className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    Transferencia Electrónica
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Pago directo desde tu banco • Sin comisiones • Inmediato
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-green-400 text-xs font-semibold bg-green-400/20 px-3 py-1 rounded-full">
                                    Recomendado
                                  </div>
                                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </motion.div>

                            {/* Transbank */}
                            <motion.div 
                              className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group ${
                                selectedPaymentMethod === 'transbank' ? 'border-primary/50 bg-primary/10' : 'border-white/20'
                              }`}
                              onClick={() => handlePaymentMethod('transbank')}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                                  <CreditCard className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    Transbank
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Tarjetas de crédito y débito • Pago seguro • Instantáneo
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                      VISA
                                    </div>
                                    <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                                      MC
                                    </div>
                                  </div>
                                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </motion.div>

                            {/* MercadoPago - Disponible */}
                            <motion.div 
                              className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 hover:bg-white/10 cursor-pointer transition-all duration-300"
                              onClick={() => {
                                // Redirigir a página específica de MercadoPago
                                window.location.href = '/mercadopago';
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-400/20 rounded-2xl flex items-center justify-center">
                                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">MercadoPago</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Pago en cuotas disponible • Seguro y flexible
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-green-400 text-xs font-semibold bg-green-400/20 px-2 py-1 rounded-full">
                                    Disponible
                                  </div>
                                  <div className="text-blue-400 text-xs font-semibold bg-blue-400/20 px-2 py-1 rounded-full">
                                    Hasta 12 cuotas
                                  </div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Bitcoin - Próximamente */}
                            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 opacity-60 cursor-not-allowed">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground">Bitcoin</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Pago con criptomonedas • Sin intermediarios
                                  </p>
                                </div>
                                <div className="text-orange-400 text-xs font-semibold bg-orange-400/20 px-2 py-1 rounded-full">
                                  Próximamente
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Loading State */}
                        {isProcessing && (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-muted-foreground">Procesando método de pago...</p>
                            </div>
                          </div>
                        )}

                        {/* Security Info */}
                        <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-green-400 font-semibold mb-1">Pago 100% Seguro</p>
                              <p className="text-green-300 text-xs">
                                Todos los métodos de pago cuentan con certificación SSL y encriptación de extremo a extremo. 
                                Tu información financiera está completamente protegida.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                          <h4 className="text-lg font-bold mb-4 text-foreground">Preguntas Frecuentes</h4>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">¿Cuánto tiempo tengo para realizar el pago?</h5>
                              <p className="text-sm text-muted-foreground">
                                Tu reserva se mantiene por 2 horas. Después de este tiempo, la cita se libera automáticamente.
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">¿Puedo cancelar o reprogramar mi cita?</h5>
                              <p className="text-sm text-muted-foreground">
                                Sí, puedes cancelar o reprogramar hasta 4 horas antes de la cita sin costo adicional. 
                                Contáctanos por WhatsApp para hacer cambios.
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">¿Qué pasa si no puedo asistir a la cita?</h5>
                              <p className="text-sm text-muted-foreground">
                                Si no puedes asistir, puedes reprogramar sin costo hasta 4 horas antes. 
                                Las inasistencias sin aviso no son reembolsables.
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-foreground mb-2">¿Necesito tener documentos preparados?</h5>
                              <p className="text-sm text-muted-foreground">
                                Sí, te recomendamos tener todos los documentos relacionados con tu caso listos en formato digital. 
                                Te enviaremos una lista específica según tu tipo de consulta.
                              </p>
                            </div>
                          </div>
                        </div>
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