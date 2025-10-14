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
import ServiceIcon from '../components/ServiceIcon';
import { createBookingWithRealEmail, type BookingData } from '@/services/supabaseBooking';
import { supabase } from '@/integrations/supabase/client';
import { createOfflineBookingWithEmail, type OfflineBookingData } from '@/services/offlineBooking';
import { sendRealBookingEmails, type BookingEmailData } from '@/services/realEmailService';
import { getReservationsByDate, isTimeSlotAvailable } from '@/services/reservationService';
import type { PendingPaymentData } from '@/types/payments';
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
  'familia': { name: 'Punto Legal Familia', price: '35.000', category: 'Familia', originalPrice: '70.000', discount: '50% OFF' },
  
  // Laboral
  'laboral': { name: 'Punto Legal Laboral', price: '30.000', category: 'Laboral', originalPrice: '60.000', discount: '50% OFF' },
  
  // General
  'general': { name: 'Consulta General', price: '35.000', category: 'General', originalPrice: '70.000', discount: '50% OFF' },
  
  // Sucesorio
  'sucesorio': { name: 'Punto Legal Sucesorio', price: '30.000', category: 'Sucesorio', originalPrice: '60.000', discount: '50% OFF' },
  
  // Empresarial
  'empresarial': { name: 'Punto Legal Empresarial', price: '45.000', category: 'Empresarial', originalPrice: '90.000', discount: '50% OFF' },
  
  // Contratos
  'contratos': { name: 'Punto Legal Contratos', price: '15.000', category: 'Contratos', originalPrice: '30.000', discount: '50% OFF' },
  
  // Administración Pública
  'administracion-publica': { name: 'Punto Legal Administración Pública', price: '25.000', category: 'Administración Pública', originalPrice: '50.000', discount: '50% OFF' },
  
  // Tributario
  'tributario': { name: 'Punto Legal Tributario', price: '30.000', category: 'Tributario', originalPrice: '60.000', discount: '50% OFF' },
  
  // Compliance
  'compliance': { name: 'Punto Legal Compliance', price: '40.000', category: 'Compliance', originalPrice: '80.000', discount: '50% OFF' },
  
  // Migratorio
  'migratorio': { name: 'Punto Legal Migratorio', price: '32.500', category: 'Migratorio', originalPrice: '65.000', discount: '50% OFF' },
  
  // Propiedad Intelectual
  'propiedad-intelectual': { name: 'Punto Legal Propiedad Intelectual', price: '22.500', category: 'Propiedad Intelectual', originalPrice: '45.000', discount: '50% OFF' },
  
  // Consumidor
  'consumidor': { name: 'Punto Legal Consumidor', price: '45.000', category: 'Consumidor', originalPrice: '90.000', discount: '50% OFF' },
  
  // Penal Económico
  'penal-economico': { name: 'Punto Legal Penal Económico', price: '45.000', category: 'Penal Económico', originalPrice: '90.000', discount: '50% OFF' },
  
  // Otros servicios
  'civil': { name: 'Derecho Civil', price: '45.000', category: 'Civil' },
  'penal': { name: 'Derecho Penal', price: '65.000', category: 'Penal' },
};

const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";
const CODIGO_ADMIN_VALIDO = "PUNTOLEGALADMIN";

export default function AgendamientoPage() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'general';
  const service = serviceCatalog[plan as keyof typeof serviceCatalog] || serviceCatalog.general;
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState('videollamada');
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rut: '',
    empresa: '',
    descripcion: '',
    codigoConvenio: ''
  });

  // Función para formatear RUT automáticamente
  const formatRUT = (value: string) => {
    // Eliminar todo excepto números y letras
    const cleanValue = value.replace(/[^0-9kK]/g, '');
    
    // Si está vacío, retornar vacío
    if (!cleanValue) return '';
    
    // Si solo tiene números (sin dígito verificador)
    if (cleanValue.length <= 8) {
      return cleanValue;
    }
    
    // Si tiene 9 caracteres o más, formatear
    if (cleanValue.length >= 9) {
      const rut = cleanValue.slice(0, -1); // Todos excepto el último
      const dv = cleanValue.slice(-1).toUpperCase(); // Último carácter (dígito verificador)
      
      // Formatear con puntos
      const formattedRut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      // Retornar con guión
      return `${formattedRut}-${dv}`;
    }
    
    return cleanValue;
  };

  // Función para manejar cambios en el RUT
  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedRUT = formatRUT(e.target.value);
    setFormData({...formData, rut: formattedRUT});
  };

  // Verificar si es emergencia
  const isEmergency = plan === 'emergencia';

  // Cargar horas ocupadas cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      loadOccupiedTimes(selectedDate);
    }
  }, [selectedDate]);

  // Lógica del código de convenio y admin
  const isConvenioValido = formData.codigoConvenio === CODIGO_CONVENIO_VALIDO;
  const isAdminValido = formData.codigoConvenio === CODIGO_ADMIN_VALIDO;
  const descuentoConvenio = 0.8; // 80% de descuento
  const precioAdmin = 1000; // Precio fijo para código admin
  const precioOriginal = parseFloat((service as any).price?.replace(/\./g, '') || '0');
  
  let precioFinal;
  let precioConConvenio = 0;
  if (isAdminValido) {
    precioFinal = precioAdmin.toLocaleString('es-CL');
  } else if (isConvenioValido) {
    precioConConvenio = precioOriginal * (1 - descuentoConvenio);
    precioFinal = Math.round(precioConConvenio).toLocaleString('es-CL');
  } else {
    precioFinal = precioOriginal.toLocaleString('es-CL');
  }

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

  // Función para cargar las horas ocupadas
  const loadOccupiedTimes = async (date: string) => {
    if (!date) return;
    
    try {
      setLoadingAvailability(true);
      const reservations = await getReservationsByDate(date);
      const occupied = reservations
        .filter(reserva => reserva.estado !== 'cancelada')
        .map(reserva => reserva.hora);
      setOccupiedTimes(occupied);
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
      setOccupiedTimes([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Función para verificar si una hora está disponible
  const isTimeAvailable = (time: string) => {
    return !occupiedTimes.includes(time);
  };

  // Obtener colores del servicio
  const getServiceColors = () => {
    const colorMap = {
      'General': {
        primary: '#ff6b35',
        bg: 'orange-100',
        darkBg: 'orange-900/30',
        text: 'orange-600',
        darkText: 'orange-400'
      },
      'Familia': {
        primary: '#ec4899',
        bg: 'pink-100',
        darkBg: 'pink-900/30',
        text: 'pink-600',
        darkText: 'pink-400'
      },
      'Corporativo': {
        primary: '#3b82f6',
        bg: 'blue-100',
        darkBg: 'blue-900/30',
        text: 'blue-600',
        darkText: 'blue-400'
      },
      'Inmobiliario': {
        primary: '#10b981',
        bg: 'emerald-100',
        darkBg: 'emerald-900/30',
        text: 'emerald-600',
        darkText: 'emerald-400'
      },
      'Laboral': {
        primary: '#8b5cf6',
        bg: 'purple-100',
        darkBg: 'purple-900/30',
        text: 'purple-600',
        darkText: 'purple-400'
      }
    };
    return colorMap[service.category as keyof typeof colorMap] || colorMap.General;
  };

  const serviceColors = getServiceColors();
  const serviceColor = serviceColors.primary;


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
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Agendamiento</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paso {step} de 2
                  </p>
                </div>
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
                    {isAdminValido && (
                      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 text-purple-800 dark:text-purple-200 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-700/50 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        ADMIN - $1.000
                      </div>
                    )}
                    {isConvenioValido && !isAdminValido && (
                      <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        80% OFF
                      </div>
                    )}
                    {(service as any).discount && !isConvenioValido && !isAdminValido && (
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
                      <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
                        <User className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
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
                          RUT *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.rut}
                          onChange={handleRUTChange}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base"
                          placeholder="12345678-9"
                          maxLength={12}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Ingresa solo números y K, el formato se aplicará automáticamente
                        </p>
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
                            isAdminValido
                              ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20'
                              : isConvenioValido 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 focus:border-green-500 focus:ring-green-500/20' 
                              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                          }`}
                          placeholder="Código especial"
                        />
                        {isConvenioValido && !isAdminValido && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Código válido - Descuento del 80% aplicado</span>
                          </motion.div>
                        )}
                        {isAdminValido && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Código admin válido - Precio especial $1.000 aplicado</span>
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
                      <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
                        <Video className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Tipo de Reunión</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: 'videollamada', label: 'Videollamada', icon: Video, desc: 'Google Meet', color: 'blue', available: true },
                        { value: 'presencial', label: 'Presencial', icon: MapPin, desc: 'Próximamente', color: 'green', available: false },
                        { value: 'telefonica', label: 'Telefónica', icon: Phone, desc: 'Llamada directa', color: 'purple', available: true }
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => option.available && setSelectedMeetingType(option.value)}
                          disabled={!option.available}
                          className={`p-4 rounded-xl border-2 transition-all relative ${
                            !option.available
                              ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-60 cursor-not-allowed'
                              : selectedMeetingType === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                          whileTap={option.available ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <option.icon className={`w-5 h-5 ${
                              !option.available
                                ? 'text-gray-400 dark:text-gray-500'
                                : selectedMeetingType === option.value 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`} />
                            <div className="text-left flex-1">
                              <p className={`font-semibold ${
                                !option.available
                                  ? 'text-gray-400 dark:text-gray-500'
                                  : selectedMeetingType === option.value 
                                  ? 'text-blue-900 dark:text-blue-100' 
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {option.label}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                            </div>
                            {selectedMeetingType === option.value && option.available && (
                              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                            {!option.available && (
                              <div className="bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-full font-medium">
                                Próximamente
                            </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                        </div>
                      </div>
                      
                  {/* Date Selection - Elegant */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
                          <Calendar className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Selecciona tu fecha</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Elige el día que mejor te convenga</p>
                        </div>
                    </div>
                    
                    <WeeklyDatePicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      availableDates={getAvailableDates()}
                    />
                    </div>

                  {/* Time Selection - Appears after date selection */}
                  {selectedDate && (
                      <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/40 dark:border-gray-700/40 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-12 h-12 rounded-xl bg-${serviceColors.bg} dark:bg-${serviceColors.darkBg} flex items-center justify-center`}>
                            <Clock className={`w-6 h-6 text-${serviceColors.text} dark:text-${serviceColors.darkText}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Elige tu horario</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {loadingAvailability ? 'Cargando horarios...' : 'Horarios disponibles'}
                            </p>
                        </div>
                      </div>

                      {loadingAvailability ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="ml-3 text-gray-600 dark:text-gray-400">Verificando disponibilidad...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {getAvailableTimes().map((time) => {
                            const isAvailable = isTimeAvailable(time);
                            const isSelected = selectedTime === time;
                            
                            return (
                              <button
                                key={time}
                                onClick={() => isAvailable && setSelectedTime(time)}
                                disabled={!isAvailable}
                                className={`py-4 px-4 rounded-xl font-semibold transition-all relative ${
                                  isSelected
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                                    : isAvailable
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-102'
                                    : 'bg-red-100 dark:bg-red-900/20 text-red-400 dark:text-red-500 cursor-not-allowed opacity-60'
                                }`}
                                title={!isAvailable ? 'Horario ocupado' : ''}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  {!isAvailable && <X className="w-4 h-4" />}
                                  {time}
                                </div>
                                {!isAvailable && (
                                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      </motion.div>
                    )}

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

                          // Calcular el precio numérico real
                          let precioNumerico;
                          if (isAdminValido) {
                            precioNumerico = precioAdmin;
                          } else if (isConvenioValido) {
                            precioNumerico = Math.round(precioConConvenio);
                          } else {
                            precioNumerico = precioOriginal;
                          }

                          const originalPriceValue = typeof (service as any).price === 'number'
                            ? (service as any).price
                            : Number((service as any).price) || null;

                          // Generar external_reference con formato MercadoPago
                          const externalReference = `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                          const paymentData: PendingPaymentData = {
                            id: Date.now().toString(),
                            nombre: formData.nombre,
                            email: formData.email,
                            telefono: formData.telefono,
                            service: service.name,
                            category: service.category,
                            description: formData.descripcion,
                            price: precioNumerico,
                            priceFormatted: precioFinal,
                            originalPrice: originalPriceValue,
                            fecha: selectedDate,
                            hora: selectedTime,
                            date: selectedDate, // For compatibility
                            time: selectedTime, // For compatibility
                            tipo_reunion: selectedMeetingType,
                            codigoConvenio: formData.codigoConvenio || null,
                            descuentoConvenio: isConvenioValido,
                            porcentajeDescuento: isConvenioValido
                              ? '80%'
                              : ((service as any).discount || null),
                            method: null,
                            preferenceId: null,
                            timestamp: Date.now()
                          };
                          
                        // Si el precio final es 0, crear reserva directamente
                        if (precioFinal === '0' || precioConConvenio === 0) {
                          try {
                            const bookingData: BookingData = {
                              cliente: {
                                nombre: formData.nombre,
                                email: formData.email,
                                telefono: formData.telefono,
                                rut: formData.rut
                              },
                              servicio: {
                                tipo: service.name,
                                precio: precioFinal,
                                descripcion: `${service.category}${isAdminValido ? ' - ADMIN $1.000' : isConvenioValido ? ' - CONVENIO 80% OFF' : ''}`,
                                fecha: selectedDate,
                                hora: selectedTime
                              },
                              pago: {
                                metodo: 'gratis',
                                estado: 'approved'
                              },
                              motivoConsulta: formData.descripcion,
                              notas: `Tipo de reunión: ${selectedMeetingType}${isAdminValido ? ` | Código admin aplicado: ${formData.codigoConvenio} (Precio especial $1.000)` : isConvenioValido ? ` | Código de convenio aplicado: ${formData.codigoConvenio} (80% descuento)` : ''}`
                            };
                            
                            const isSupabaseAvailable = await checkSupabaseConnection();
                            
                            if (isSupabaseAvailable) {
                              const result = await createBookingWithRealEmail(bookingData);
                              if (result.success && result.reserva) {
                                // CRÍTICO: Actualizar external_reference con formato MercadoPago
                                await supabase
                                  .from('reservas')
                                  .update({ external_reference: externalReference })
                                  .eq('id', result.reserva.id);
                                
                                localStorage.setItem('paymentData', JSON.stringify({
                                  ...paymentData,
                                  reservaId: result.reserva.id,
                                  external_reference: externalReference
                                }));
                                window.location.href = '/mercadopago';
                              } else {
                                alert('Error al crear la consulta. Por favor intenta nuevamente.');
                              }
                            } else {
                              // Sistema offline
                              const offlineBookingData: Omit<OfflineBookingData, 'id' | 'created_at' | 'updated_at'> = {
                                nombre: formData.nombre,
                                email: formData.email,
                                telefono: formData.telefono,
                                cliente_empresa: formData.empresa,
                                servicio: service.name,
                                precio: precioFinal,
                                categoria: `${service.category}${isAdminValido ? ' - ADMIN $1.000' : isConvenioValido ? ' - CONVENIO 80% OFF' : ''}`,
                                fecha: selectedDate,
                                hora: selectedTime,
                                tipo_reunion: selectedMeetingType,
                                descripcion: `${formData.descripcion}${isAdminValido ? ` | Código admin: ${formData.codigoConvenio} (Precio especial $1.000)` : isConvenioValido ? ` | Código de convenio: ${formData.codigoConvenio} (80% descuento)` : ''}`,
                                estado: 'pendiente'
                              };
                              
                              const offlineResult = await createOfflineBookingWithEmail(offlineBookingData);
                              
                              // Los emails ya se envían automáticamente en createOfflineBookingWithEmail
                              // No es necesario enviarlos manualmente aquí

                              localStorage.setItem('paymentData', JSON.stringify({
                                ...paymentData,
                                reservaId: offlineResult.id
                              }));
                              window.location.href = '/mercadopago';
                            }
                          } catch (error) {
                            console.error('Error en proceso:', error);
                            alert('Error al procesar la consulta. Por favor intenta nuevamente.');
                          }
                        } else {
                          // Crear reserva primero para obtener el ID
                          try {
                            const bookingData: BookingData = {
                              cliente: {
                                nombre: formData.nombre,
                                email: formData.email,
                                telefono: formData.telefono,
                                rut: formData.rut
                              },
                              servicio: {
                                tipo: service.name,
                                precio: precioFinal,
                                categoria: service.category,
                                tipoReunion: selectedMeetingType,
                                fecha: selectedDate,
                                hora: selectedTime,
                                descripcion: formData.descripcion
                              }
                            };
                            
                            const result = await createBookingWithRealEmail(bookingData);
                            
                            if (result.success && result.reserva) {
                              // CRÍTICO: Actualizar external_reference con formato MercadoPago
                              await supabase
                                .from('reservas')
                                .update({ external_reference: externalReference })
                                .eq('id', result.reserva.id);
                              
                              // Proceder al pago con external_reference
                              localStorage.setItem('paymentData', JSON.stringify({
                                ...paymentData,
                                reservaId: result.reserva.id,
                                external_reference: externalReference
                              }));
                              window.location.href = '/mercadopago';
                            } else {
                              alert('Error al crear la reserva. Por favor intenta nuevamente.');
                            }
                          } catch (error) {
                            console.error('Error creando reserva:', error);
                            alert('Error al procesar. Por favor intenta nuevamente.');
                          }
                        }
                      }}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-[2] py-5 rounded-xl font-bold text-white shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
                        boxShadow: `0 8px 25px ${serviceColor}30`
                      }}
                    >
                      {precioFinal === '0' || precioConConvenio === 0 ? 'Confirmar Reserva' : 'Proceder al Pago'}
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
