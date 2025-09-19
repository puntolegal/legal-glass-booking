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
  'ma-express': { name: 'M&A Express', price: '2.500.000', category: 'Corporativo' },
  'compliance': { name: 'Compliance & Protección Datos', price: '1.500.000', category: 'Corporativo' },
  'fiscalizacion': { name: 'Defensa Fiscalizaciones & DT', price: '900.000', category: 'Corporativo' },
  
  // Inmobiliario
  'comprador-seguro': { name: 'Comprador Seguro', price: '450.000', category: 'Inmobiliario' },
  'inversionista-pro': { name: 'Inversionista Pro', price: '850.000', category: 'Inmobiliario' },
  'desarrollador-elite': { name: 'Desarrollador Elite', price: '2.500.000', category: 'Inmobiliario' },
  'inmobiliario': { name: 'Punto Legal Inmobiliario', price: '27.500', category: 'Inmobiliario', originalPrice: '55.000', discount: '50% OFF' },
  
  // Familia
  'familia-basico': { name: 'Familia Básico', price: '180.000', category: 'Familia' },
  'familia-completo': { name: 'Familia Completo', price: '450.000', category: 'Familia' },
  'familia-premium': { name: 'Familia Premium', price: '750.000', category: 'Familia' },
  'familia': { name: 'Consulta Familia', price: '35.000', category: 'Familia', originalPrice: '70.000', discount: '50% OFF' },
  
  // Laboral
  'laboral': { name: 'Punto Legal Laboral', price: '35.000', category: 'Laboral', originalPrice: '70.000', discount: '50% OFF' },
  'laboral-basico': { name: 'Laboral Básico', price: '150.000', category: 'Laboral' },
  'laboral-completo': { name: 'Laboral Completo', price: '350.000', category: 'Laboral' },
  'laboral-premium': { name: 'Laboral Premium', price: '650.000', category: 'Laboral' },
  'finiquito-express': { name: 'Finiquito Express', price: '85.000', category: 'Laboral' },
  'despido-injustificado': { name: 'Despido Injustificado', price: '450.000', category: 'Laboral' },
  'acoso-laboral': { name: 'Acoso Laboral', price: '650.000', category: 'Laboral' },
  
  // General
  'general': { name: 'Consulta General', price: '35.000', category: 'General', originalPrice: '70.000', discount: '50% OFF' },
  
  // Otros servicios
  'civil': { name: 'Derecho Civil', price: '45.000', category: 'Civil' },
  'penal': { name: 'Derecho Penal', price: '65.000', category: 'Penal' },
  'tributario': { name: 'Derecho Tributario', price: '55.000', category: 'Tributario' },
  'penal-economico': { name: 'Derecho Penal Económico', price: '85.000', category: 'Penal Económico' },
  'digital': { name: 'Derecho Digital', price: '45.000', category: 'Digital' },
  'herencias': { name: 'Herencias', price: '65.000', category: 'Sucesorio' },
};

const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";

export default function AgendamientoPage() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'general';
  const service = serviceCatalog[plan as keyof typeof serviceCatalog] || serviceCatalog.general;
  
  const [step, setStep] = useState(1);
  
  // Debug logging
  useEffect(() => {
    console.log('Current step:', step);
  }, [step]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState('videollamada');
  const [showBankTransfer, setShowBankTransfer] = useState(false);
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
  const precioOriginal = parseFloat(service.price);
  const precioConConvenio = isConvenioValido ? precioOriginal * (1 - descuentoConvenio) : precioOriginal;
  const precioFinal = Math.round(precioConConvenio).toString();

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Incluir sábados y domingos
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const dateString = date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
      
      dates.push({
        value: dateString,
        label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dateString}`,
        date: date
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar campos requeridos
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    setStep(2);
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
        description={`Agenda tu consulta de ${service.name} con nuestros expertos. Precio: $${service.price}. Respuesta rápida garantizada.`}
      />
      
      {/* iOS Style Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        
        {/* iOS Header */}
        <div className="relative pt-12 pb-6 px-4">
          {/* Background blur effect */}
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50" />
          
          <div className="relative max-w-md mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-medium">Inicio</span>
              </Link>
              
              <div className="text-center">
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Agendamiento</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paso {step} de 2 • {step === 1 ? 'Datos personales' : 'Fecha y hora'}
                </p>
              </div>
              
              <div className="w-8 h-8" /> {/* Spacer */}
            </div>

            {/* Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: serviceColor + '20' }}
                >
                  {service.category === 'General' && <FileText className="w-6 h-6" style={{ color: serviceColor }} />}
                  {service.category === 'Familia' && <User className="w-6 h-6" style={{ color: serviceColor }} />}
                  {service.category === 'Corporativo' && <Building2 className="w-6 h-6" style={{ color: serviceColor }} />}
                  {service.category === 'Inmobiliario' && <MapPin className="w-6 h-6" style={{ color: serviceColor }} />}
                  {service.category === 'Laboral' && <Shield className="w-6 h-6" style={{ color: serviceColor }} />}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{service.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: serviceColor }}>
                      ${precioFinal}
                    </span>
                    {(service as any).originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${(service as any).originalPrice}
                      </span>
                    )}
                    {(service as any).discount && (
                      <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <span className="text-xs font-medium" style={{ color: serviceColor }}>
                          {(service as any).discount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-24">
          <div className="max-w-md mx-auto space-y-6">
            
            <AnimatePresence mode="wait">
              {/* Step 1: Información Personal */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Información Personal</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100"
                        placeholder="juan@empresa.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Empresa (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100"
                        placeholder="Mi Empresa SpA"
                      />
                    </div>

                    {/* Código de Convenio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Código de Convenio (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.codigoConvenio}
                        onChange={(e) => setFormData({...formData, codigoConvenio: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-gray-900 dark:text-gray-100 ${
                          isConvenioValido 
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 focus:border-green-500 focus:ring-green-500/20' 
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                        placeholder="Código especial"
                      />
                      {isConvenioValido && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Código válido - Descuento del 80% aplicado</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción del caso
                      </label>
                      <textarea
                        rows={4}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 resize-none"
                        placeholder="Describe brevemente tu situación legal..."
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        // Validar campos requeridos
                        if (!formData.nombre || !formData.email || !formData.telefono) {
                          alert('Por favor completa todos los campos requeridos');
                          return;
                        }
                        console.log('Avanzando al paso 2...');
                        setStep(2);
                      }}
                      className="w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all"
                      style={{ 
                        background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                        boxShadow: `0 4px 20px ${serviceColor}30`
                      }}
                    >
                      Continuar
                    </button>
                  </form>
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
                  className="space-y-4"
                >
                {/* Tipo de Reunión */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tipo de reunión</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'videollamada', label: 'Videollamada', icon: Video, desc: 'Google Meet' },
                      { value: 'presencial', label: 'Presencial', icon: MapPin, desc: 'En oficina' },
                      { value: 'telefonica', label: 'Telefónica', icon: Phone, desc: 'Llamada directa' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setSelectedMeetingType(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMeetingType === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className={`w-5 h-5 ${
                            selectedMeetingType === option.value 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <div className="text-left">
                            <p className={`font-medium ${
                              selectedMeetingType === option.value 
                                ? 'text-blue-900 dark:text-blue-100' 
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {option.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                          </div>
                          {selectedMeetingType === option.value && (
                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Selección de Fecha */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Fecha y Hora</h3>
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
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Horarios disponibles</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableTimes().map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                              selectedTime === time
                                ? 'bg-blue-500 text-white shadow-lg'
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

                {/* Botones de navegación */}
                <div className="flex gap-3">
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
                        originalPrice: service.price,
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
                      
                      // Si el precio final es 0, crear reserva directamente con Supabase
                      if (precioFinal === '0' || precioConConvenio === 0) {
                        try {
                          console.log('📧 Creando consulta gratuita con Supabase...');
                          
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
                          
                          // Verificar si Supabase está disponible
                          const isSupabaseAvailable = await checkSupabaseConnection();
                          
                          if (isSupabaseAvailable) {
                            // Usar Supabase si está disponible
                            console.log('🌐 Usando Supabase para crear reserva...');
                            const result = await createBookingWithEmails(bookingData);
                            
                            if (result.success) {
                              console.log('✅ Consulta gratuita creada y emails enviados');
                              localStorage.setItem('paymentData', JSON.stringify({
                                ...paymentData,
                                paymentMethod: 'gratis',
                                paymentStatus: 'completed',
                                reservaId: result.reserva?.id
                              }));
                              window.location.href = '/payment-success';
                            } else {
                              console.error('❌ Error creando consulta:', result.error);
                              alert('Error al crear la consulta. Por favor intenta nuevamente.');
                            }
                          } else {
                            // Usar sistema offline si Supabase no está disponible
                            console.log('💾 Supabase no disponible, usando sistema offline...');
                            
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
                            
                            // Enviar emails reales incluso en modo offline
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

                            try {
                              await sendRealBookingEmails(emailData);
                              console.log('✅ Emails enviados exitosamente');
                            } catch (emailError) {
                              console.error('❌ Error enviando emails:', emailError);
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
                          console.error('❌ Error en proceso de consulta gratuita:', error);
                          alert('Error al procesar la consulta. Por favor intenta nuevamente.');
                        }
                      } else {
                        // Guardar datos y proceder al pago
                        localStorage.setItem('paymentData', JSON.stringify(paymentData));
                        console.log('💾 Datos guardados en localStorage:', paymentData);
                        window.location.href = '/mercadopago';
                      }
                    }}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-2 py-4 rounded-xl font-semibold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                      boxShadow: `0 4px 20px ${serviceColor}30`
                    }}
                  >
                    {precioFinal === '0' || precioConConvenio === 0 ? 'Confirmar Reserva Gratis' : 'Proceder al Pago'}
                  </button>
                </div>
              </motion.div>
              )}
            </AnimatePresence>

            {/* Supabase Status */}
            <div className="flex justify-center">
              <SupabaseStatusIndicator 
                showDetails={false} 
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/30 dark:border-gray-700/30 text-xs" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}