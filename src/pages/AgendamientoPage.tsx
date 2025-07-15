import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Info
} from 'lucide-react';
import SEO from '../components/SEO';
import { MobileFloatingNav } from '../components/MobileFloatingNav';
import WeeklyDatePicker from '../components/WeeklyDatePicker';
import BankTransferCard3D from '../components/BankTransferCard3D';

// Definición de servicios y precios
const serviceCatalog = {
  // Plan Gratis - Prueba de automatización
  'gratis': { name: 'Consulta Gratis - Prueba', price: '0', category: 'Gratis', note: 'Solo para probar la automatización' },
  
  // Corporativo
  'basico': { name: 'Corporativo Básico', price: '350.000', category: 'Corporativo' },
  'premium': { name: 'Corporativo Premium', price: '750.000', category: 'Corporativo' },
  'enterprise': { name: 'Corporativo Enterprise', price: '1.500.000', category: 'Corporativo' },
  'corporativo': { name: 'Escudo Legal Mensual', price: '800.000', category: 'Corporativo', note: 'Mensual' },
  'ma-express': { name: 'M&A Express', price: '2.500.000', category: 'Corporativo' },
  'compliance': { name: 'Compliance & Protección Datos', price: '1.500.000', category: 'Corporativo' },
  'fiscalizacion': { name: 'Defensa Fiscalizaciones & DT', price: '900.000', category: 'Corporativo' },
  
  // Inmobiliario
  'comprador-seguro': { name: 'Comprador Seguro', price: '450.000', category: 'Inmobiliario' },
  'inversionista-pro': { name: 'Inversionista Pro', price: '850.000', category: 'Inmobiliario' },
  'desarrollador-elite': { name: 'Desarrollador Elite', price: '2.500.000', category: 'Inmobiliario' },
  'inmobiliario': { name: 'Punto Legal Inmobiliario', price: '27.500', category: 'Inmobiliario', originalPrice: '55.000', discount: '50% OFF' },
  
  // Penal
  'defensa-esencial': { name: 'Defensa Esencial', price: '650.000', category: 'Penal' },
  'defensa-premium': { name: 'Defensa Premium', price: '1.200.000', category: 'Penal' },
  'defensa-elite': { name: 'Defensa Elite', price: '2.500.000', category: 'Penal' },
  'penal-economico': { name: 'Punto Legal Penal Económico', price: '45.000', category: 'Penal Económico', originalPrice: '90.000', discount: '50% OFF' },
  
  // Civil
  'cobranza-express': { name: 'Cobranza Express', price: '280.000', category: 'Civil', note: '+ 15% del monto recuperado' },
  'litigios-premium': { name: 'Litigios Premium', price: '950.000', category: 'Civil' },
  'corporativo-civil': { name: 'Corporativo Civil', price: '1.800.000', category: 'Civil', note: 'Anual con soporte' },
  
  // Digital
  'startup-legal': { name: 'Startup Legal', price: '480.000', category: 'Digital' },
  'ecommerce-pro': { name: 'E-commerce Pro', price: '850.000', category: 'Digital' },
  'ecommerce': { name: 'E-Commerce', price: '40.000', category: 'Digital' },
  'tech-enterprise': { name: 'Tech Enterprise', price: '1.650.000', category: 'Digital' },
  
  // Especializado - Servicios de la página principal
  'laboral': { name: 'Punto Legal Laboral', price: '35.000', category: 'Laboral', originalPrice: '70.000', discount: '50% OFF' },
  'familia': { name: 'Punto Legal Familia', price: '30.000', category: 'Familia', originalPrice: '60.000', discount: '50% OFF' },
  'herencias': { name: 'Punto Legal Sucesorio', price: '30.000', category: 'Sucesorio', originalPrice: '60.000', discount: '50% OFF' },
  'empresarial': { name: 'Punto Legal Empresarial', price: '45.000', category: 'Empresarial', originalPrice: '90.000', discount: '50% OFF' },
  'tributario': { name: 'Punto Legal Tributario', price: '30.000', category: 'Tributario', originalPrice: '60.000', discount: '50% OFF' },
  'administracion-publica': { name: 'Punto Legal Administración Pública', price: '25.000', category: 'Administración Pública', originalPrice: '50.000', discount: '50% OFF' },
  'migratorio': { name: 'Punto Legal Migratorio', price: '27.500', category: 'Migratorio', originalPrice: '55.000', discount: '50% OFF' },
  'compliance-riesgo': { name: 'Punto Legal Compliance', price: '40.000', category: 'Compliance', originalPrice: '80.000', discount: '50% OFF' },
  
  // Protección y Propiedad
  'proteccion-datos': { name: 'Protección de Datos', price: '35.000', category: 'Digital' },
  'marcas-patentes': { name: 'Punto Legal Propiedad Intelectual', price: '32.500', category: 'Propiedad Intelectual', originalPrice: '65.000', discount: '50% OFF' },
  
  // Express
  'contratos-express': { name: 'Punto Legal Contratos', price: '15.000', category: 'Express', originalPrice: '30.000', discount: '50% OFF' },
  'sociedades-express': { name: 'Sociedades Express', price: '30.000', category: 'Express' },
  'reclamos-sernac': { name: 'Punto Legal Consumidor', price: '22.500', category: 'Consumidor', originalPrice: '45.000', discount: '50% OFF' },
  
  // Emergencia
  'emergencia': { name: 'Consulta de Emergencia', price: '100.000', category: 'Emergencia', originalPrice: '200.000', discount: '50% OFF' },
  
  // Consulta General
  'general': { name: 'Consulta General', price: '35.000', category: 'General' }
};

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const meetingTypes = [
  { id: 'presencial', name: 'Presencial', icon: MapPin, description: 'En nuestras oficinas' },
  { id: 'videollamada', name: 'Videollamada', icon: Video, description: 'Reunión virtual' },
  { id: 'telefonica', name: 'Telefónica', icon: Phone, description: 'Llamada tradicional' }
];

export default function AgendamientoPage() {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState('videollamada');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    empresa: '',
    descripcion: ''
  });
  const [step, setStep] = useState(1);
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  const plan = searchParams.get('plan') || 'premium';
  const service = serviceCatalog[plan] || serviceCatalog['premium'];
  const isEmergency = plan === 'emergencia';

  // Scroll automático al top cuando se carga la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Generar fechas disponibles (próximos 14 días, excluyendo fines de semana)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i <= 21; i++) { // Incluir hoy (i=0) y próximos 21 días
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Excluir fines de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  // Función para verificar si un horario está disponible
  const isTimeSlotAvailable = (date: Date, time: string) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    // Si es el día de hoy, verificar que la hora no haya pasado
    if (date.toDateString() === now.toDateString()) {
      // Agregar 1 hora de buffer para dar tiempo de confirmar la cita
      const nowPlusBuffer = new Date(now.getTime() + 60 * 60 * 1000); // +1 hora
      if (selectedDateTime <= nowPlusBuffer) {
        return false;
      }
    }

    // Simular algunas horas ocupadas (en un caso real, esto vendría de la base de datos)
    const unavailableSlots = getUnavailableSlots(date);
    return !unavailableSlots.includes(time);
  };

  // Simular horarios ocupados para demostración
  const getUnavailableSlots = (date: Date) => {
    const dateKey = date.toDateString();
    const seed = date.getTime();
    const randomCount = Math.floor((seed % 1000) / 250); // 0-3 slots ocupados
    const unavailable = [];
    
    for (let i = 0; i < randomCount; i++) {
      const randomIndex = Math.floor((seed * (i + 1)) % timeSlots.length);
      unavailable.push(timeSlots[randomIndex]);
    }
    
    return unavailable;
  };

  // Función mejorada para formatear fecha
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy, ' + date.toLocaleDateString('es-CL', {
        month: 'long',
        day: 'numeric'
      });
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana, ' + date.toLocaleDateString('es-CL', {
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // Obtener mensaje explicativo para horarios no disponibles
  const getTimeSlotMessage = (date: Date, time: string) => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    if (date.toDateString() === now.toDateString()) {
      const nowPlusBuffer = new Date(now.getTime() + 60 * 60 * 1000);
      if (selectedDateTime <= nowPlusBuffer) {
        return 'Hora ya pasada';
      }
    }

    return 'Horario ocupado';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Este flujo ya no se usará aquí, se manejará en PaymentPage
      console.log('Flujo de pago completado');
    }
  };

  return (
    <>
      <SEO 
        title={`Agendar ${service.name} - Punto Legal`}
        description={`Agenda tu consulta de ${service.name} con nuestros expertos. Precio: $${service.price}. Respuesta rápida garantizada.`}
      />
      
      {/* Navegación Flotante Móvil */}
      <MobileFloatingNav />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-20">
        {/* Header */}
        <section className="py-12 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al inicio
              </Link>
            </div>
            
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {isEmergency && (
                  <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full mb-4">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">CONSULTA DE EMERGENCIA 24/7</span>
                  </div>
                )}
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Agendar {service.name}
                </h1>
                
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      ${service.price}
                      {service.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through ml-2">
                          ${service.originalPrice}
                        </span>
                      )}
                    </div>
                    {service.note && (
                      <p className="text-sm text-muted-foreground">{service.note}</p>
                    )}
                    {service.discount && (
                      <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full mt-1">
                        {service.discount}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-px h-16 bg-white/20" />
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">{service.category}</div>
                    <p className="text-sm text-muted-foreground">Área de especialización</p>
                  </div>
                </div>
                
                {isEmergency && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-w-md mx-auto">
                    <p className="text-red-400 font-semibold">⚡ Respuesta inmediata</p>
                    <p className="text-sm text-muted-foreground">Te contactaremos en menos de 1 hora</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Formulario de Agendamiento */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-12">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${step >= stepNumber 
                        ? 'bg-primary text-white' 
                        : 'bg-white/10 text-muted-foreground'
                      }
                    `}>
                      {step > stepNumber ? <CheckCircle className="w-6 h-6" /> : stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`
                        w-16 h-1 mx-4
                        ${step > stepNumber ? 'bg-primary' : 'bg-white/10'}
                      `} />
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Paso 1: Información Personal */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                      <User className="w-6 h-6 text-primary" />
                      Información Personal
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-primary outline-none transition-colors"
                          placeholder="Juan Pérez"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">Teléfono *</label>
                        <input
                          type="tel"
                          required
                          value={formData.telefono}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-primary outline-none transition-colors"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-primary outline-none transition-colors"
                          placeholder="juan@empresa.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-foreground">Empresa (opcional)</label>
                        <input
                          type="text"
                          value={formData.empresa}
                          onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-primary outline-none transition-colors"
                          placeholder="Mi Empresa SpA"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-semibold mb-2 text-foreground">Descripción del caso</label>
                      <textarea
                        rows={4}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-primary outline-none transition-colors"
                        placeholder="Describe brevemente tu situación legal..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="mt-8 w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Continuar
                    </button>
                  </motion.div>
                )}

                {/* Paso 2: Fecha y Hora */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                      <Calendar className="w-6 h-6 text-primary" />
                      Fecha y Hora
                    </h2>
                    
                    {/* Tipo de Reunión */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Tipo de reunión</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {meetingTypes.map((type) => {
                          const isDisabled = type.id === 'presencial';
                          return (
                          <button
                            key={type.id}
                            type="button"
                              onClick={() => !isDisabled && setSelectedMeetingType(type.id)}
                              disabled={isDisabled}
                            className={`
                                p-4 rounded-lg border transition-all relative
                                ${isDisabled 
                                  ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed' 
                                  : selectedMeetingType === type.id
                                ? 'border-primary bg-primary/10'
                                : 'border-white/20 hover:border-white/40'
                              }
                            `}
                          >
                              <type.icon className={`w-6 h-6 mx-auto mb-2 ${isDisabled ? 'text-muted-foreground' : 'text-primary'}`} />
                            <div className="font-semibold">{type.name}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                              {isDisabled && (
                                <div className="absolute top-2 right-2 text-xs font-semibold bg-orange-400/20 text-orange-400 px-2 py-1 rounded-full">
                                  Próximamente
                                </div>
                              )}
                          </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Selección de Fecha con vista semanal */}
                    <div className="mb-6">
                      <WeeklyDatePicker
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        availableDates={availableDates}
                      />
                    </div>
                    
                    {/* Selección de Hora */}
                    {selectedDate && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Horarios disponibles para {formatDate(new Date(selectedDate))}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {timeSlots.map((time) => {
                            const dateObj = new Date(selectedDate);
                            const available = isTimeSlotAvailable(dateObj, time);
                            const message = !available ? getTimeSlotMessage(dateObj, time) : '';
                            
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => available && setSelectedTime(time)}
                                disabled={!available}
                                title={message}
                                className={`
                                  p-3 rounded-lg border font-medium transition-all relative group
                                  ${selectedTime === time
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : available
                                    ? 'border-white/20 hover:border-primary/50 hover:bg-primary/5'
                                    : 'border-red-500/30 bg-red-500/10 text-red-400 cursor-not-allowed opacity-60'
                                  }
                                `}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  {!available && <X className="w-3 h-3" />}
                                  {time}
                                </div>
                                {!available && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {message}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Información adicional - Estilo glassmorphism negro */}
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-6 relative overflow-hidden"
                        >
                          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            {/* Efecto de brillo sutil */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
                            
                            <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                  <Info className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-white font-semibold text-lg">Información importante</h4>
                              </div>
                              
                              <ul className="space-y-3 text-white/90">
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>Las citas deben agendarse con al menos 1 hora de anticipación</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>Duración de la consulta: 45 minutos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>Recibirás confirmación por email y WhatsApp</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>Puedes reprogramar hasta 2 horas antes de la cita</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        type="submit"
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Paso 3: Confirmación */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      Confirmar Agendamiento
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Resumen del Servicio */}
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-primary">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-foreground">
                              ${service.price}
                              {service.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through ml-2">
                                  ${service.originalPrice}
                                </span>
                              )}
                            </div>
                            {service.note && (
                              <p className="text-sm text-muted-foreground mt-1">{service.note}</p>
                            )}
                          </div>
                          
                          {service.discount && (
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                              {service.discount}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Resumen de la Cita */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Detalles de la cita</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Fecha:</strong> {selectedDate && formatDate(new Date(selectedDate))}</div>
                            <div><strong>Hora:</strong> {selectedTime}</div>
                            <div><strong>Tipo:</strong> {meetingTypes.find(t => t.id === selectedMeetingType)?.name}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Información personal</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Nombre:</strong> {formData.nombre}</div>
                            <div><strong>Email:</strong> {formData.email}</div>
                            <div><strong>Teléfono:</strong> {formData.telefono}</div>
                            {formData.empresa && <div><strong>Empresa:</strong> {formData.empresa}</div>}
                          </div>
                        </div>
                      </div>
                      
                      {formData.descripcion && (
                        <div>
                          <h4 className="font-semibold mb-2">Descripción del caso</h4>
                          <p className="text-sm text-muted-foreground bg-white/5 p-4 rounded-lg">
                            {formData.descripcion}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        type="submit"
                        onClick={() => {
                          // Guardar datos en localStorage para la página de pago
                          const paymentData = {
                            service: service.name,
                            category: service.category,
                            price: service.price,
                            fecha: selectedDate,
                            hora: selectedTime,
                            tipo_reunion: selectedMeetingType,
                            cliente: {
                              nombre: formData.nombre,
                              email: formData.email,
                              telefono: formData.telefono,
                              empresa: formData.empresa
                            },
                            descripcion: formData.descripcion,
                            id: Date.now().toString()
                          };
                          localStorage.setItem('paymentData', JSON.stringify(paymentData));
                          window.location.href = '/pago';
                        }}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary/90 hover:to-primary/70 transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Proceder al Pago
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Paso 4: Pago */}
                {step === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                      <CreditCard className="w-6 h-6 text-primary" />
                      Método de Pago
                    </h2>
                    
                    {/* Resumen del Servicio */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6 mb-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-primary">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                          <div className="text-2xl font-bold text-foreground mt-2">
                            ${service.price}
                            {service.originalPrice && (
                              <span className="text-lg text-muted-foreground line-through ml-2">
                                ${service.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        {service.discount && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                            {service.discount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Opciones de Pago */}
                    <div className="space-y-4 mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Selecciona tu método de pago</h3>
                      
                      {/* Transferencia Electrónica - Tarjeta Premium */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowBankTransfer(true)}
                        className="relative bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-amber-700/10 border border-amber-500/30 rounded-xl p-6 cursor-pointer group overflow-hidden"
                      >
                        {/* Efecto de brillo premium */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:translate-x-full" />
                        
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-amber-400 transition-colors">Transferencia Electrónica</h4>
                            <p className="text-sm text-muted-foreground">Pago directo desde tu banco • Inmediato</p>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/30"
                          >
                            Recomendado
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Transbank */}
                      <div className="bg-white/5 border border-white/20 rounded-xl p-6 opacity-60 cursor-not-allowed group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">Transbank</h4>
                            <p className="text-sm text-muted-foreground">Tarjetas de crédito y débito • Seguro</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/visa.svg" alt="Visa" className="h-6" />
                            <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                          </div>
                          <div className="text-orange-400 text-xs font-semibold bg-orange-400/20 px-2 py-1 rounded-full">
                            Próximamente
                          </div>
                        </div>
                      </div>

                      {/* MercadoPago */}
                      <div className="bg-white/5 border border-white/20 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">MercadoPago</h4>
                            <p className="text-sm text-muted-foreground">Pago en cuotas disponible • Flexible</p>
                          </div>
                          <div className="text-blue-400 text-xs font-semibold bg-blue-400/20 px-2 py-1 rounded-full">
                            Hasta 12 cuotas
                          </div>
                        </div>
                      </div>

                      {/* Bitcoin */}
                      <div className="bg-white/5 border border-white/20 rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer group opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">Bitcoin</h4>
                            <p className="text-sm text-muted-foreground">Pago con criptomonedas</p>
                          </div>
                          <div className="text-orange-400 text-xs font-semibold bg-orange-400/20 px-2 py-1 rounded-full">
                            Próximamente
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal de Transferencia Bancaria 3D */}
                    {showBankTransfer && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowBankTransfer(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                          className="relative max-w-4xl w-full"
                        >
                          <button
                            onClick={() => setShowBankTransfer(false)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                          <BankTransferCard3D
                            onTransferComplete={() => {
                              setShowBankTransfer(false);
                              // Aquí puedes agregar lógica adicional para el pago
                              window.location.href = '/pago';
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const paymentData = {
                            ...formData,
                            service: service.name,
                            price: service.price,
                            category: service.category,
                            fecha: selectedDate,
                            hora: selectedTime,
                            tipo_reunion: selectedMeetingType,
                            descripcion: formData.descripcion,
                            id: Date.now().toString()
                          };
                          
                          // Si el precio es 0, guardar directamente sin pago
                          if (service.price === '0') {
                            // Guardar en localStorage para simular el flujo
                            localStorage.setItem('paymentData', JSON.stringify({
                              ...paymentData,
                              paymentMethod: 'gratis',
                              paymentStatus: 'completed'
                            }));
                            // Ir directamente a la página de éxito
                            window.location.href = '/payment-success';
                          } else {
                            // Flujo normal de pago
                          localStorage.setItem('paymentData', JSON.stringify(paymentData));
                          window.location.href = '/pago';
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary/90 hover:to-primary/70 transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        {service.price === '0' ? 'Confirmar Reserva Gratis' : 'Proceder al Pago'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 