import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  Video,
  MessageSquare,
  MapPin,
  X,
  Info,
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';
import WeeklyDatePicker from '../components/WeeklyDatePicker';
import BankTransferCard3D from '../components/BankTransferCard3D';
import { createBookingWithEmails, type BookingData } from '@/services/supabaseBooking';
import { createOfflineBookingWithEmail, type OfflineBookingData } from '@/services/offlineBooking';
import { sendRealBookingEmails, type BookingEmailData } from '@/services/realEmailService';
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import SupabaseStatusIndicator from '@/components/SupabaseStatusIndicator';

// Definición de servicios y precios
const serviceCatalog = {
  // Plan Gratis - Prueba de automatización
  'gratis': { name: 'Consulta Gratis - Prueba', price: '0', category: 'Gratis', note: 'Solo para probar la automatización' },
  
  // Corporativo
  'basico': { name: 'Corporativo Básico', price: '350.000', category: 'Corporativo' },
  'premium': { name: 'Corporativo Premium', price: '800.000', category: 'Corporativo' },
  'enterprise': { name: 'Corporativo Enterprise', price: '1.500.000', category: 'Corporativo' },
  'corporativo': { name: 'Asesoría Corporativa', price: '35.000', category: 'Corporativo', note: 'Consulta especializada' },
  
  // Inmobiliario
  'inmobiliario': { name: 'Punto Legal Inmobiliario', price: '27.500', category: 'Inmobiliario', originalPrice: '55.000', discount: '50% OFF' },
  
  // Familia
  'familia': { name: 'Consulta Familia', price: '35.000', category: 'Familia', originalPrice: '70.000', discount: '50% OFF' },
  
  // Laboral
  'laboral': { name: 'Punto Legal Laboral', price: '35.000', category: 'Laboral', originalPrice: '70.000', discount: '50% OFF' },
  
  // General
  'general': { name: 'Consulta General', price: '35.000', category: 'General', originalPrice: '70.000', discount: '50% OFF' },
  
  // Otros servicios
  'civil': { name: 'Derecho Civil', price: '45.000', category: 'Civil' },
  'penal': { name: 'Derecho Penal', price: '65.000', category: 'Penal' },
  'tributario': { name: 'Derecho Tributario', price: '55.000', category: 'Tributario' },
};

const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";

export default function AgendamientoPage() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'general';
  const service = serviceCatalog[plan as keyof typeof serviceCatalog] || serviceCatalog.general;
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState('videollamada');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    descripcion: '',
    codigoConvenio: ''
  });

  // Verificar si es emergencia
  const isEmergency = plan === 'emergencia';

  // Lógica del código de convenio
  const isConvenioValido = formData.codigoConvenio === CODIGO_CONVENIO_VALIDO;
  const descuentoConvenio = 0.8; // 80% de descuento
  const precioOriginal = parseFloat((service as any).price?.replace(/\./g, '') || '0');
  const precioConConvenio = isConvenioValido ? precioOriginal * (1 - descuentoConvenio) : precioOriginal;
  const precioFinal = Math.round(precioConConvenio).toString();

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  // Obtener color del servicio
  const getServiceColor = () => {
    const colorMap = {
      'General': '#ff6b35',
      'Familia': '#ec4899', 
      'Corporativo': '#3b82f6',
      'Inmobiliario': '#10b981',
      'Laboral': '#8b5cf6'
    };
    return colorMap[service.category as keyof typeof colorMap] || '#ff6b35';
  };

  const serviceColor = getServiceColor();

  return (
    <>
      <SEO 
        title={`Agendar ${service.name} - Punto Legal`}
        description={`Agenda tu consulta de ${service.name} con nuestros expertos. Precio: $${(service as any).price}. Respuesta rápida garantizada.`}
      />
      
      {/* Premium iOS Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        
        {/* iOS Header with Blur */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30" />
          
          <div className="relative pt-14 pb-6 px-4">
            <div className="max-w-md mx-auto">
              {/* Navigation Bar */}
              <div className="flex items-center justify-between mb-6">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Inicio</span>
                </Link>
                
                <div className="text-center">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Agendamiento</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paso {step} de 2
                  </p>
                </div>
                
                <div className="w-9 h-9" /> {/* Spacer */}
              </div>

              {/* Service Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/40 dark:border-gray-700/40 shadow-xl mb-6"
              >
                <div className="flex items-center gap-4">
                  {/* Service Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: serviceColor + '20' }}
                  >
                    {service.category === 'General' && <FileText className="w-8 h-8" style={{ color: serviceColor }} />}
                    {service.category === 'Familia' && <User className="w-8 h-8" style={{ color: serviceColor }} />}
                    {service.category === 'Corporativo' && <Building2 className="w-8 h-8" style={{ color: serviceColor }} />}
                    {service.category === 'Inmobiliario' && <MapPin className="w-8 h-8" style={{ color: serviceColor }} />}
                    {service.category === 'Laboral' && <Shield className="w-8 h-8" style={{ color: serviceColor }} />}
                    {!['General', 'Familia', 'Corporativo', 'Inmobiliario', 'Laboral'].includes(service.category) && <FileText className="w-8 h-8" style={{ color: serviceColor }} />}
                  </div>
                  
                  {/* Service Info */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {service.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.category}</p>
                  </div>
                  
                  {/* Price Display */}
                  <div className="text-right">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold" style={{ color: serviceColor }}>
                        ${precioFinal}
                      </span>
                      {(service as any).originalPrice && !isConvenioValido && (
                        <span className="text-lg text-gray-400 line-through">
                          ${(service as any).originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Discount Badge */}
                    {isConvenioValido && (
                      <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        80% OFF
                      </div>
                    )}
                    {(service as any).discount && !isConvenioValido && (
                      <div className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        {(service as any).discount}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-32">
          <div className="max-w-md mx-auto">
            
            <AnimatePresence mode="wait">
              {/* Step 1: Información Personal */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Personal Info Card */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Información Personal</h3>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base"
                          placeholder="Juan Pérez González"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base"
                          placeholder="juan@empresa.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.telefono}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Empresa (opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.empresa}
                          onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base"
                          placeholder="Mi Empresa SpA"
                        />
                      </div>

                      {/* Código de Convenio */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Código de Convenio (opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.codigoConvenio}
                          onChange={(e) => setFormData({...formData, codigoConvenio: e.target.value})}
                          className={`w-full px-4 py-4 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 dark:text-gray-100 text-base ${
                            isConvenioValido 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 focus:border-green-500 focus:ring-green-500/20' 
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                          }`}
                          placeholder="Código especial"
                        />
                        {isConvenioValido && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Código válido - Descuento del 80% aplicado</span>
                          </motion.div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Descripción del caso
                        </label>
                        <textarea
                          rows={4}
                          value={formData.descripcion}
                          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 resize-none text-base"
                          placeholder="Describe brevemente tu situación legal..."
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.nombre || !formData.email || !formData.telefono) {
                          alert('Por favor completa todos los campos requeridos');
                          return;
                        }
                        setStep(2);
                      }}
                      className="w-full mt-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all"
                      style={{ 
                        background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                        boxShadow: `0 8px 25px ${serviceColor}30`
                      }}
                    >
                      Continuar a Fecha y Hora
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Fecha y Hora */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Meeting Type Selection */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tipo de Reunión</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: 'videollamada', label: 'Videollamada', icon: Video, desc: 'Google Meet', color: 'blue' },
                        { value: 'presencial', label: 'Presencial', icon: MapPin, desc: 'En oficina', color: 'green' },
                        { value: 'telefonica', label: 'Telefónica', icon: Phone, desc: 'Llamada directa', color: 'purple' }
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setSelectedMeetingType(option.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedMeetingType === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                              : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <option.icon className={`w-5 h-5 ${
                              selectedMeetingType === option.value 
                                ? `text-${option.color}-600 dark:text-${option.color}-400` 
                                : 'text-gray-500 dark:text-gray-400'
                            }`} />
                            <div className="text-left flex-1">
                              <p className={`font-semibold ${
                                selectedMeetingType === option.value 
                                  ? `text-${option.color}-900 dark:text-${option.color}-100` 
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {option.label}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                            </div>
                            {selectedMeetingType === option.value && (
                              <CheckCircle className={`w-5 h-5 text-${option.color}-600 dark:text-${option.color}-400`} />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Fecha y Hora</h3>
                    </div>
                    
                    <WeeklyDatePicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      availableDates={getAvailableDates()}
                    />
                    
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                      >
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Horarios disponibles</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {getAvailableTimes().map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all ${
                                selectedTime === time
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!selectedDate || !selectedTime) {
                          alert('Por favor selecciona fecha y hora');
                          return;
                        }

                        const paymentData = {
                          ...formData,
                          service: service.name,
                          price: precioFinal,
                          originalPrice: (service as any).price,
                          category: service.category,
                          fecha: selectedDate,
                          hora: selectedTime,
                          tipo_reunion: selectedMeetingType,
                          descripcion: formData.descripcion,
                          codigoConvenio: formData.codigoConvenio,
                          descuentoConvenio: isConvenioValido,
                          porcentajeDescuento: isConvenioValido ? '80%' : ((service as any).discount || null),
                          id: Date.now().toString()
                        };
                        
                        // Si el precio final es 0, crear reserva directamente
                        if (precioFinal === '0' || precioConConvenio === 0) {
                          try {
                            const bookingData: BookingData = {
                              cliente: {
                                nombre: formData.nombre,
                                email: formData.email,
                                telefono: formData.telefono
                              },
                              servicio: {
                                tipo: service.name,
                                precio: precioFinal,
                                descripcion: `${service.category}${isConvenioValido ? ' - CONVENIO 80% OFF' : ''}`,
                                fecha: selectedDate,
                                hora: selectedTime
                              },
                              pago: {
                                metodo: 'gratis',
                                estado: 'approved'
                              },
                              motivoConsulta: formData.descripcion,
                              notas: `Tipo de reunión: ${selectedMeetingType}${isConvenioValido ? ` | Código de convenio aplicado: ${formData.codigoConvenio} (80% descuento)` : ''}`
                            };
                            
                            const isSupabaseAvailable = await checkSupabaseConnection();
                            
                            if (isSupabaseAvailable) {
                              const result = await createBookingWithEmails(bookingData);
                              if (result.success) {
                                localStorage.setItem('paymentData', JSON.stringify({
                                  ...paymentData,
                                  paymentMethod: 'gratis',
                                  paymentStatus: 'completed',
                                  reservaId: result.reserva?.id
                                }));
                                window.location.href = '/payment-success';
                              } else {
                                alert('Error al crear la consulta. Por favor intenta nuevamente.');
                              }
                            } else {
                              // Sistema offline
                              const offlineBookingData: Omit<OfflineBookingData, 'id' | 'created_at' | 'updated_at'> = {
                                cliente_nombre: formData.nombre,
                                cliente_email: formData.email,
                                cliente_telefono: formData.telefono,
                                cliente_empresa: formData.empresa,
                                servicio_tipo: service.name,
                                servicio_precio: precioFinal,
                                servicio_categoria: `${service.category}${isConvenioValido ? ' - CONVENIO 80% OFF' : ''}`,
                                fecha: selectedDate,
                                hora: selectedTime,
                                tipo_reunion: selectedMeetingType,
                                descripcion: `${formData.descripcion}${isConvenioValido ? ` | Código de convenio: ${formData.codigoConvenio} (80% descuento)` : ''}`,
                                estado: 'pendiente'
                              };
                              
                              const offlineResult = await createOfflineBookingWithEmail(offlineBookingData);
                              
                              try {
                                const emailData: BookingEmailData = {
                                  id: offlineResult.id,
                                  cliente_nombre: offlineResult.cliente_nombre,
                                  cliente_email: offlineResult.cliente_email,
                                  cliente_telefono: offlineResult.cliente_telefono,
                                  cliente_empresa: offlineResult.cliente_empresa,
                                  servicio_tipo: offlineResult.servicio_tipo,
                                  servicio_precio: offlineResult.servicio_precio,
                                  fecha: offlineResult.fecha,
                                  hora: offlineResult.hora,
                                  tipo_reunion: offlineResult.tipo_reunion,
                                  descripcion: offlineResult.descripcion,
                                  created_at: offlineResult.created_at
                                };
                                await sendRealBookingEmails(emailData);
                              } catch (emailError) {
                                console.error('Error enviando emails:', emailError);
                              }

                              localStorage.setItem('paymentData', JSON.stringify({
                                ...paymentData,
                                paymentMethod: 'gratis',
                                paymentStatus: 'completed',
                                reservaId: offlineResult.id
                              }));
                              window.location.href = '/payment-success';
                            }
                          } catch (error) {
                            console.error('Error en proceso:', error);
                            alert('Error al procesar la consulta. Por favor intenta nuevamente.');
                          }
                        } else {
                          // Proceder al pago
                          localStorage.setItem('paymentData', JSON.stringify(paymentData));
                          window.location.href = '/mercadopago';
                        }
                      }}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-2 py-4 rounded-xl font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                        boxShadow: `0 8px 25px ${serviceColor}30`
                      }}
                    >
                      {precioFinal === '0' || precioConConvenio === 0 ? 'Confirmar Reserva Gratis' : 'Proceder al Pago'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Supabase Status */}
            <div className="flex justify-center mt-8">
              <SupabaseStatusIndicator 
                showDetails={false} 
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/30 dark:border-gray-700/30 text-xs shadow-sm" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}