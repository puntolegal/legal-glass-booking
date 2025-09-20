import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail, Phone, ArrowRight, Home, CreditCard } from 'lucide-react';
import SEO from '../components/SEO';
import { createReservation } from '../services/reservationService';
import { sendBookingEmailsWorking } from '../services/workingEmailService';

export default function PaymentSuccessPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  useEffect(() => {
    processPaymentSuccess();
  }, []);

  const processPaymentSuccess = async () => {
    try {
      setIsProcessing(true);
      setProcessingStatus('Procesando datos del pago...');

      // Extraer parámetros de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const mercadopagoData = {
        collection_id: urlParams.get('collection_id'),
        collection_status: urlParams.get('collection_status'),
        payment_id: urlParams.get('payment_id'),
        status: urlParams.get('status'),
        external_reference: urlParams.get('external_reference'),
        payment_type: urlParams.get('payment_type'),
        merchant_order_id: urlParams.get('merchant_order_id'),
        preference_id: urlParams.get('preference_id'),
        site_id: urlParams.get('site_id'),
        processing_mode: urlParams.get('processing_mode')
      };

      console.log('💳 Datos de MercadoPago:', mercadopagoData);

      // Recuperar datos del pago desde localStorage
      const storedData = localStorage.getItem('paymentData');
      if (!storedData) {
        throw new Error('No se encontraron datos de pago');
      }

      const paymentInfo = JSON.parse(storedData);
      console.log('📋 Datos de pago almacenados:', paymentInfo);

      // Crear reserva en la base de datos
      setProcessingStatus('Guardando reserva en la base de datos...');
      
      const reservationData = {
        nombre: paymentInfo.cliente?.nombre || paymentInfo.name || 'Cliente',
        rut: paymentInfo.cliente?.rut || paymentInfo.rut || 'No especificado',
        email: paymentInfo.cliente?.email || paymentInfo.email || 'No especificado',
        telefono: paymentInfo.cliente?.telefono || paymentInfo.phone || 'No especificado',
        fecha: paymentInfo.fecha || paymentInfo.date || new Date().toISOString().split('T')[0],
        hora: paymentInfo.hora || paymentInfo.time || '10:00',
        descripcion: `Consulta ${paymentInfo.service} - Pago confirmado via MercadoPago`,
        servicio: paymentInfo.service || 'Consulta General',
        precio: paymentInfo.price || '35000',
        categoria: paymentInfo.category || 'General',
        tipo_reunion: paymentInfo.tipo_reunion || 'online',
        estado: 'confirmada' as const,
        webhook_sent: false
      };

      const reservation = await createReservation(reservationData);
      console.log('✅ Reserva creada:', reservation);

      // Enviar emails de confirmación
      setProcessingStatus('Enviando emails de confirmación...');
      
      const emailData = {
        id: reservation.id,
        cliente_nombre: reservation.nombre,
        cliente_email: reservation.email,
        cliente_telefono: reservation.telefono,
        servicio_tipo: reservation.servicio || 'Consulta General',
        servicio_precio: reservation.precio || '35000',
        fecha: reservation.fecha,
        hora: reservation.hora,
        pago_metodo: 'MercadoPago',
        pago_estado: mercadopagoData.status === 'approved' ? 'Aprobado' : 'Pendiente',
        created_at: reservation.created_at || new Date().toISOString()
      };

      const emailResult = await sendBookingEmailsWorking(emailData);
      console.log('📧 Resultado de emails:', emailResult);

      // Actualizar estado
      setPaymentData({
        ...paymentInfo,
        reservation,
        mercadopagoData,
        emailResult
      });

      setProcessingStatus('¡Proceso completado exitosamente!');

    } catch (error) {
      console.error('❌ Error procesando pago exitoso:', error);
      setProcessingStatus(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {isProcessing ? 'Procesando pago...' : 'Cargando confirmación...'}
          </h2>
          {processingStatus && (
            <p className="text-sm text-gray-600 mb-4">{processingStatus}</p>
          )}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Verificando datos de MercadoPago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Guardando reserva en la base de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Enviando emails de confirmación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Pago Exitoso - Punto Legal"
        description="Tu pago ha sido procesado exitosamente. Tu consulta legal está confirmada."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header de éxito */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tu consulta legal ha sido confirmada y el pago procesado correctamente.
            </p>
          </motion.div>

          {/* Resumen de la consulta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-green-600" />
              Resumen de tu consulta
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.cliente?.nombre || paymentData?.name || 'No especificado'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.cliente?.email || paymentData?.email || 'No especificado'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.cliente?.telefono || paymentData?.phone || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.fecha || paymentData?.date || 'No especificada'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.hora || paymentData?.time || '10:00'} hrs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Servicio</p>
                    <p className="font-semibold text-gray-900">
                      {paymentData?.service || 'Consulta Legal'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total pagado</span>
                <span className="text-2xl font-bold text-green-600">
                  ${paymentData?.price || '0'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Estado del procesamiento */}
          {paymentData?.emailResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                📧 Estado de confirmación
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-blue-800">Reserva guardada en la base de datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-blue-800">Pago confirmado via MercadoPago</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-blue-800">Emails de confirmación enviados</span>
                </div>
                {paymentData.reservation && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>ID de Reserva:</strong> {paymentData.reservation.id}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Estado:</strong> {paymentData.reservation.estado}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Información importante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              📧 Confirmación por email
            </h3>
            <p className="text-green-800 mb-4">
              Hemos enviado un email de confirmación a tu dirección de correo con todos los detalles de tu consulta.
            </p>
            <div className="text-sm text-green-700 space-y-2">
              <p>• Revisa tu bandeja de entrada y carpeta de spam</p>
              <p>• Guarda este email como comprobante</p>
              <p>• Si no recibes el email en 10 minutos, contáctanos</p>
            </div>
          </motion.div>

          {/* Próximos pasos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos pasos
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <p className="text-gray-700">Recibirás un email de confirmación con los detalles de tu consulta</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <p className="text-gray-700">Te contactaremos 24 horas antes de tu consulta para confirmar</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <p className="text-gray-700">Te enviaremos el link de la videollamada o la dirección de la oficina</p>
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
              to="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
            
            <Link
              to="/servicios"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-300 transition-all duration-200 hover:scale-105"
            >
              Ver más servicios
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}