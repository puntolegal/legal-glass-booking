import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, CreditCard, Lock, User, Calendar, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import MercadoPagoOfficialButton from '../components/MercadoPagoOfficialButton';
import MobileMercadoPagoButton from '../components/MobileMercadoPagoButton';
import ServiceIcon from '../components/ServiceIcon';
import { PaymentData } from '../services/mercadopagoEdgeFunction';

export default function MercadoPagoPaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Obtener categoría del servicio para los colores
  const getServiceCategory = () => {
    if (!paymentData?.category) return 'General';
    return paymentData.category;
  };

  useEffect(() => {
    // Detectar si estamos en móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Recuperar datos del localStorage
    const data = localStorage.getItem('paymentData');
    if (data) {
      const parsedData = JSON.parse(data);
      setPaymentData(parsedData);
      console.log('💳 Datos de pago cargados:', parsedData);
    } else {
      // Si no hay datos, redirigir al agendamiento
      window.location.href = '/agendamiento';
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Manejar pago exitoso
  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      console.log('✅ Pago exitoso con MercadoPago:', paymentResponse);
      
      // Guardar información del pago
      const paymentInfo = {
        ...paymentData,
        paymentMethod: 'mercadopago',
        paymentId: paymentResponse.id,
        paymentStatus: paymentResponse.status,
        transactionAmount: paymentResponse.transaction_amount,
        paymentDate: new Date().toISOString()
      };

      localStorage.setItem('paymentSuccess', JSON.stringify(paymentInfo));
      
      // Redirigir a página de éxito
      window.location.href = '/payment-success';
    } catch (error) {
      console.error('Error procesando pago exitoso:', error);
      setPaymentError('Error procesando el pago exitoso');
    }
  };

  // Manejar error de pago
  const handlePaymentError = (error: string) => {
    console.error('❌ Error en pago MercadoPago:', error);
    setPaymentError(error);
    setIsProcessing(false);
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Cargando datos de pago...</h2>
          <Link to="/agendamiento" className="text-blue-600 hover:underline mt-2 inline-block">
            Volver al agendamiento
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`Pago MercadoPago - ${paymentData.service} - Punto Legal`}
        description={`Completa el pago de tu consulta de ${paymentData.service} con MercadoPago. Pago seguro y en cuotas.`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header minimalista */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/agendamiento" 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Volver al agendamiento</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Paso 2 de 2</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Finalizar Pago</h1>
            </div>
            <p className="text-gray-600 text-lg">Pago seguro con MercadoPago • Hasta 12 cuotas sin interés</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Resumen de la consulta */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Resumen de tu consulta
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ServiceIcon 
                      icon={User} 
                      serviceCategory={getServiceCategory()}
                      size="sm"
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Servicio</p>
                      <p className="font-medium text-gray-900">{paymentData.service}</p>
                      {paymentData.descuentoConvenio && paymentData.codigoConvenio && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            🏷️ Convenio: {paymentData.codigoConvenio}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ServiceIcon 
                      icon={Calendar} 
                      serviceCategory={getServiceCategory()}
                      size="sm"
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium text-gray-900">{formatDate(paymentData.fecha || paymentData.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ServiceIcon 
                      icon={Clock} 
                      serviceCategory={getServiceCategory()}
                      size="sm"
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Hora</p>
                      <p className="font-medium text-gray-900">{paymentData.hora || paymentData.time || '10:00'} hrs</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    {/* Mostrar descuento de convenio si aplica */}
                    {paymentData.descuentoConvenio && paymentData.originalPrice && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-700 font-medium">🏷️ Convenio aplicado</span>
                          <span className="text-green-600 font-bold">{paymentData.porcentajeDescuento} OFF</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600">Precio original:</span>
                          <span className="text-gray-500 line-through">${paymentData.originalPrice}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">
                          ${typeof paymentData.price === 'string' && !paymentData.price.includes('.') && paymentData.price.length >= 4 
                            ? parseInt(paymentData.price).toLocaleString('es-CL') 
                            : paymentData.price}
                        </span>
                        {paymentData.descuentoConvenio && (
                          <div className="text-xs text-green-600 font-medium">Con descuento de convenio</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {paymentData.descuentoConvenio ? 'Precio con descuento aplicado' : 'Precio final'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Botón de pago MercadoPago */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Proceder con el pago</h3>
                
                {isMobile ? (
                  <MobileMercadoPagoButton
                    paymentData={{
                      amount: typeof paymentData.price === 'string' 
                        ? parseInt(paymentData.price.replace(/\./g, '')) 
                        : paymentData.price,
                      description: `${paymentData.service} - Punto Legal`,
                      payer: {
                        name: paymentData.cliente?.nombre || paymentData.name,
                        email: paymentData.cliente?.email || paymentData.email,
                        phone: paymentData.cliente?.telefono || paymentData.phone
                      },
                      metadata: {
                        reservation_id: paymentData.id,
                        service_name: paymentData.service,
                        appointment_date: paymentData.fecha || paymentData.date,
                        appointment_time: paymentData.hora || paymentData.time,
                        client_name: paymentData.cliente?.nombre || paymentData.name,
                        client_email: paymentData.cliente?.email || paymentData.email,
                        codigo_convenio: paymentData.codigoConvenio || null,
                        descuento_convenio: paymentData.descuentoConvenio || false,
                        precio_original: paymentData.originalPrice || null,
                        porcentaje_descuento: paymentData.porcentajeDescuento || null
                      }
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <MercadoPagoOfficialButton
                    paymentData={{
                      amount: typeof paymentData.price === 'string' 
                        ? parseInt(paymentData.price.replace(/\./g, '')) 
                        : paymentData.price,
                      description: `${paymentData.service} - Punto Legal`,
                      payer: {
                        name: paymentData.cliente?.nombre || paymentData.name,
                        email: paymentData.cliente?.email || paymentData.email,
                        phone: paymentData.cliente?.telefono || paymentData.phone
                      },
                      metadata: {
                        reservation_id: paymentData.id,
                        service_name: paymentData.service,
                        appointment_date: paymentData.fecha || paymentData.date,
                        appointment_time: paymentData.hora || paymentData.time,
                        client_name: paymentData.cliente?.nombre || paymentData.name,
                        client_email: paymentData.cliente?.email || paymentData.email,
                        codigo_convenio: paymentData.codigoConvenio || null,
                        descuento_convenio: paymentData.descuentoConvenio || false,
                        precio_original: paymentData.originalPrice || null,
                        porcentaje_descuento: paymentData.porcentajeDescuento || null
                      }
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}

                {/* Información de seguridad */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900">Pago 100% seguro</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span>Encriptación SSL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span>Certificado PCI DSS</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Mostrar errores si los hay */}
          {paymentError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Error en el pago</h4>
                <p className="text-red-700 text-sm">{paymentError}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}