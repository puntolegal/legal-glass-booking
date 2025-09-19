import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  Shield,
  Lock,
  Smartphone,
  User,
  Clock,
  AlertCircle,
  Star,
  Award,
  Zap
} from 'lucide-react';
import SEO from '../components/SEO';

export default function ImprovedPaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Selección, 2: Procesamiento, 3: Confirmación

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
    setStep(2);

    // Simular procesamiento
    setTimeout(() => {
      if (method === 'transbank') {
        // Preparar datos para Transbank
        const transbankData = {
          amount: paymentData.price.replace(/\./g, ''),
          orderId: `PL-${Date.now()}`,
          sessionId: paymentData.id || Date.now().toString(),
          description: paymentData.service,
          returnUrl: `${window.location.origin}/payment-success?method=transbank`,
          cancelUrl: `${window.location.origin}/pago`
        };
        
        localStorage.setItem('transbankPayment', JSON.stringify({
          ...paymentData,
          transbankData
        }));
        
        // En producción, redirigir a Transbank real
        window.location.href = '/payment-success?method=transbank';
      } else if (method === 'mercadopago') {
        // Redirigir a página específica de MercadoPago
        window.location.href = '/mercadopago';
      }
    }, 2000);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Cargando...</h2>
          <Link to="/agendamiento" className="text-primary hover:underline">
            Volver al agendamiento
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`Pago Seguro - ${paymentData.service} - Punto Legal`}
        description={`Completa el pago de tu consulta de ${paymentData.service} de forma segura con Transbank o MercadoPago.`}
      />
      
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-8 relative overflow-hidden">
        {/* Efectos de fondo mejorados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Header con continuidad visual */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link 
              to="/agendamiento" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver al agendamiento
            </Link>
            
            {/* Resumen de la cita con continuidad visual */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-foreground">Finalizar Pago</h1>
                  <p className="text-muted-foreground">Último paso para confirmar tu cita</p>
                </div>
              </div>
              
              {/* Detalles de la cita con mejor jerarquía visual */}
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">Fecha y Hora</h3>
                  <p className="text-sm text-muted-foreground">{formatDate(paymentData.date)}</p>
                  <p className="text-sm text-primary font-semibold">{paymentData.time} hrs</p>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">Servicio</h3>
                  <p className="text-sm text-muted-foreground">{paymentData.service}</p>
                  <p className="text-sm text-primary font-semibold">{paymentData.category}</p>
                </div>
                
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">Total</h3>
                  <p className="text-2xl font-bold text-primary">${paymentData.price}</p>
                  <p className="text-xs text-muted-foreground">Precio final</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progreso visual */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </div>
                <span className="text-sm text-foreground font-medium">Agendamiento</span>
              </div>
              
              <div className="w-12 h-1 bg-primary rounded-full" />
              
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-white/20 text-muted-foreground'
                }`}>
                  {step >= 2 ? '✓' : '2'}
                </div>
                <span className="text-sm text-foreground font-medium">Pago</span>
              </div>
              
              <div className={`w-12 h-1 rounded-full transition-all ${
                step >= 3 ? 'bg-primary' : 'bg-white/20'
              }`} />
              
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= 3 ? 'bg-primary text-white' : 'bg-white/20 text-muted-foreground'
                }`}>
                  3
                </div>
                <span className="text-sm text-foreground font-medium">Confirmación</span>
              </div>
            </div>
          </div>

          {/* Métodos de pago mejorados */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="payment-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Elige tu método de pago</h2>
                  <p className="text-muted-foreground">Todos nuestros métodos son 100% seguros</p>
                </div>

                <div className="space-y-4">
                  {/* Transbank - Método Principal */}
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-red-400/50 hover:bg-red-500/5 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                    onClick={() => handlePaymentMethod('transbank')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Badge destacado */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Más usado
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-red-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-red-400 transition-colors mb-2">
                          Transbank Webpay
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          Paga con tu tarjeta de crédito o débito chilena
                        </p>
                        
                        {/* Tarjetas aceptadas */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold">VISA</div>
                          <div className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-bold">MC</div>
                          <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">MAGNA</div>
                          <div className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded font-bold">DINERS</div>
                        </div>
                        
                        {/* Características */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>100% Seguro</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <span>Inmediato</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-purple-500" />
                            <span>Confiable</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${paymentData.price}</div>
                        <div className="text-sm text-muted-foreground">Pago único</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* MercadoPago - Alternativa */}
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 hover:bg-blue-500/5 cursor-pointer transition-all duration-300 group"
                    onClick={() => handlePaymentMethod('mercadopago')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-blue-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors mb-2">
                          MercadoPago
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          Paga en cuotas sin interés o al contado
                        </p>
                        
                        {/* Características */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>Hasta 12 cuotas</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Protección al comprador</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">Desde ${Math.ceil(parseInt(paymentData.price.replace(/\./g, '')) / 12).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">por mes</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Garantías de seguridad */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-500/20"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4 text-center flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Tu pago está 100% protegido
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-green-500" />
                      </div>
                      <h4 className="font-semibold text-foreground">Encriptación SSL</h4>
                      <p className="text-sm text-muted-foreground">Tus datos están cifrados</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-foreground">Certificado PCI DSS</h4>
                      <p className="text-sm text-muted-foreground">Estándar de seguridad</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-purple-500" />
                      </div>
                      <h4 className="font-semibold text-foreground">Garantía de Servicio</h4>
                      <p className="text-sm text-muted-foreground">100% satisfacción</p>
                    </div>
                  </div>
                </motion.div>

                {/* Testimonios de confianza */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <span>+500 clientes satisfechos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Más de 10 años de experiencia</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Paso 2: Procesamiento */}
            {step === 2 && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CreditCard className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {selectedPaymentMethod === 'transbank' ? 'Conectando con Transbank...' : 'Preparando MercadoPago...'}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Serás redirigido en unos segundos para completar tu pago de forma segura
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Conexión segura</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-500" />
                      <span>Datos protegidos</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
