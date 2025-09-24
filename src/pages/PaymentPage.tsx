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

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 3000);
  };

  const copyAllBankData = () => {
    const bankData = `Titular: Benjamin Soza
Banco: Banco Estado
Tipo: Cuenta Vista
Número: 123456789
RUT: 12.345.678-9
Email: benjamin@puntolegal.online`;
    
    navigator.clipboard.writeText(bankData);
    setCopiedText('Titular: Benjamin Soza');
    setTimeout(() => setCopiedText(''), 3000);
  };

  const handlePaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Pago Seguro - Punto Legal"
        description="Completa tu pago de forma segura para confirmar tu cita legal. Múltiples métodos de pago disponibles."
        keywords="pago seguro, abogado, cita legal, transferencia bancaria, mercadopago"
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent"></div>
        </div>

        {/* Header */}
        <section className="relative py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-8">
              <Link 
                to="/agendamiento"
                className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mr-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al agendamiento
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-400/20 via-cyan-500/15 to-blue-600/10 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-5xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Pago Seguro
                  </span>
                </h1>
              </div>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Confirma tu cita completando el pago. Protegemos tu información con encriptación de nivel bancario.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>SSL Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span>Datos Protegidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Pago Verificado</span>
                </div>
              </div>
            </motion.div>
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
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="sticky top-8"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                      {/* Badge Premium */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Crown className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-sm">RESERVA CONFIRMADA</span>
                        </div>
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                          ACTIVA
                        </div>
                      </div>

                      {/* Servicio */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {paymentData.serviceName}
                        </h3>
                        <p className="text-blue-200 text-sm">
                          Consultoría jurídica profesional
                        </p>
                      </div>

                      {/* Detalles de la cita */}
                      <div className="space-y-6 mb-8">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{formatDate(paymentData.date)}</p>
                            <p className="text-blue-200 text-sm">{formatTime(paymentData.time)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{paymentData.clientName}</p>
                            <p className="text-blue-200 text-sm">{paymentData.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{paymentData.phone}</p>
                            <p className="text-blue-200 text-sm">Teléfono de contacto</p>
                          </div>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200">Total a pagar:</span>
                          <span className="text-3xl font-bold text-white">{paymentData.price}</span>
                        </div>
                        <p className="text-xs text-blue-300 mt-2">
                          * Incluye IVA y tasas de procesamiento
                        </p>
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
                          <CreditCard className="w-6 h-6 text-blue-400" />
                          <h2 className="text-2xl font-bold text-white">Métodos de Pago</h2>
                          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold ml-auto">
                            SEGURO
                          </div>
                        </div>

                        <div className="grid gap-6">
                          {/* MercadoPago */}
                          <motion.div 
                            className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group ${
                              selectedPaymentMethod === 'mercadopago' ? 'border-primary/50 bg-primary/10' : 'border-white/20'
                            }`}
                            onClick={() => handlePaymentMethod('mercadopago')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                  MercadoPago
                                </h3>
                                <p className="text-sm text-blue-200">
                                  Tarjetas de crédito/débito, transferencias y más
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                                  POPULAR
                                </div>
                                <ExternalLink className="w-4 h-4 text-blue-400" />
                              </div>
                            </div>
                          </motion.div>

                          {/* Mostrar detalles si está seleccionado */}
                          {selectedPaymentMethod === 'mercadopago' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-primary/30"
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
                          )}

                          {/* Transferencia Bancaria */}
                          <motion.div 
                            className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group ${
                              selectedPaymentMethod === 'bank' ? 'border-primary/50 bg-primary/10' : 'border-white/20'
                            }`}
                            onClick={() => handlePaymentMethod('bank')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center">
                                <Banknote className="w-6 h-6 text-green-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                                  Transferencia Bancaria
                                </h3>
                                <p className="text-sm text-blue-200">
                                  Transfiere desde tu banco directamente
                                </p>
                              </div>
                              <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-semibold">
                                SIN COMISIÓN
                              </div>
                            </div>
                          </motion.div>

                          {/* Mostrar datos bancarios si está seleccionado */}
                          {selectedPaymentMethod === 'bank' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-primary/30"
                            >
                              <div>
                                <div className="flex items-center gap-3 mb-6">
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
                                      <span className="text-sm text-muted-foreground">Banco:</span>
                                      <div className="flex items-center gap-3">
                                        <span className="font-semibold text-foreground">Banco Estado</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('Banco Estado')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === 'Banco Estado' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={copiedText === 'Banco Estado' ? '¡Copiado!' : 'Copiar banco'}
                                        >
                                          {copiedText === 'Banco Estado' ? 
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
                                        <span className="font-semibold text-foreground">123456789 (Cuenta Vista)</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('123456789')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === '123456789' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={copiedText === '123456789' ? '¡Copiado!' : 'Copiar número de cuenta'}
                                        >
                                          {copiedText === '123456789' ? 
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
                                        <span className="font-semibold text-foreground">12.345.678-9</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('12.345.678-9')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === '12.345.678-9' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={copiedText === '12.345.678-9' ? '¡Copiado!' : 'Copiar RUT'}
                                        >
                                          {copiedText === '12.345.678-9' ? 
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
                                        <span className="font-semibold text-foreground">benjamin@puntolegal.online</span>
                                        <motion.button 
                                          onClick={() => copyToClipboard('benjamin@puntolegal.online')}
                                          className={`p-2 rounded-lg transition-all duration-300 ${
                                            copiedText === 'benjamin@puntolegal.online' 
                                              ? 'bg-green-500/20 text-green-400' 
                                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                                          }`}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          title={copiedText === 'benjamin@puntolegal.online' ? '¡Copiado!' : 'Copiar email'}
                                        >
                                          {copiedText === 'benjamin@puntolegal.online' ? 
                                            <CheckCircle className="w-4 h-4" /> : 
                                            <Copy className="w-4 h-4" />
                                          }
                                        </motion.button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Botón para copiar todos los datos */}
                                  <motion.button
                                    onClick={copyAllBankData}
                                    className="w-full bg-gradient-to-r from-primary/20 to-primary/30 hover:from-primary/30 hover:to-primary/40 text-primary border border-primary/30 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
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

                                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                      <p className="flex items-start gap-2">
                                        <span className="w-5 h-5 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                        <span>Realiza la transferencia por el monto exacto: <strong className="text-foreground">{paymentData.price}</strong></span>
                                      </p>
                                      <p className="flex items-start gap-2">
                                        <span className="w-5 h-5 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                        <span>En el concepto, incluye: "<strong className="text-foreground">Cita {paymentData.clientName}</strong>"</span>
                                      </p>
                                      <p className="flex items-start gap-2">
                                        <span className="w-5 h-5 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                        <span>Envía el comprobante por WhatsApp al número que aparece abajo</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* WhatsApp para enviar comprobante */}
                                  <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                      <MessageCircle className="w-5 h-5 text-green-400" />
                                      <span className="font-semibold text-green-400">Envía tu comprobante</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      Una vez realizada la transferencia, envía el comprobante por WhatsApp para confirmar tu cita.
                                    </p>
                                    <motion.a
                                      href="https://wa.me/56912345678?text=Hola,%20adjunto%20comprobante%20de%20pago%20para%20la%20cita%20legal"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <MessageCircle className="w-5 h-5" />
                                      Enviar comprobante por WhatsApp
                                    </motion.a>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Otros métodos (próximamente) */}
                          <motion.div 
                            className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 opacity-50"
                            initial={{ opacity: 0.3 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-400">
                                  Billeteras Digitales
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Apple Pay, Google Pay y más opciones
                                </p>
                              </div>
                              <div className="text-orange-400 text-xs font-semibold bg-orange-400/20 px-2 py-1 rounded-full">
                                Próximamente
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Loading State */}
                        {isProcessing && (
                          <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-muted-foreground">Procesando pago...</p>
                            </div>
                          </div>
                        )}

                        {/* Información de seguridad */}
                        <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div className="text-sm">
                              <h6 className="font-semibold text-foreground mb-2">Pago 100% Seguro</h6>
                              <p className="text-muted-foreground leading-relaxed">
                                Todos los pagos son procesados de forma segura. No almacenamos información de tarjetas de crédito. 
                                Tu información personal está protegida con encriptación SSL de 256 bits.
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