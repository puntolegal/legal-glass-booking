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
  X
} from 'lucide-react';
import SEO from '../components/SEO';
import { MobileFloatingNav } from '../components/MobileFloatingNav';

// Definición de servicios y precios
const serviceCatalog = {
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
  
  // Penal
  'defensa-esencial': { name: 'Defensa Esencial', price: '650.000', category: 'Penal' },
  'defensa-premium': { name: 'Defensa Premium', price: '1.200.000', category: 'Penal' },
  'defensa-elite': { name: 'Defensa Elite', price: '2.500.000', category: 'Penal' },
  
  // Civil
  'cobranza-express': { name: 'Cobranza Express', price: '280.000', category: 'Civil', note: '+ 15% del monto recuperado' },
  'litigios-premium': { name: 'Litigios Premium', price: '950.000', category: 'Civil' },
  'corporativo-civil': { name: 'Corporativo Civil', price: '1.800.000', category: 'Civil', note: 'Anual con soporte' },
  
  // Digital
  'startup-legal': { name: 'Startup Legal', price: '480.000', category: 'Digital' },
  'ecommerce-pro': { name: 'E-commerce Pro', price: '850.000', category: 'Digital' },
  'ecommerce': { name: 'E-Commerce', price: '40.000', category: 'Digital' },
  'tech-enterprise': { name: 'Tech Enterprise', price: '1.650.000', category: 'Digital' },
  
  // Especializado
  'laboral': { name: 'Derecho Laboral', price: '35.000', category: 'Laboral' },
  'familia': { name: 'Derecho Familia', price: '25.000', category: 'Familia' },
  'herencias': { name: 'Herencias & Sucesiones', price: '30.000', category: 'Sucesorio' },
  'proteccion-datos': { name: 'Protección de Datos', price: '35.000', category: 'Digital' },
  
  // Express
  'contratos-express': { name: 'Contratos Express', price: '20.000', category: 'Express' },
  'sociedades-express': { name: 'Sociedades Express', price: '30.000', category: 'Express' },
  'marcas-patentes': { name: 'Marcas & Patentes', price: '40.000', category: 'Propiedad Intelectual' },
  'reclamos-sernac': { name: 'Reclamos SERNAC', price: '18.000', category: 'Consumidor' },
  
  // Emergencia
  'emergencia': { name: 'Consulta de Emergencia', price: '100.000', category: 'Emergencia', originalPrice: '200.000', discount: '50% OFF' }
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
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Envío de datos a la base de datos con notificaciones automáticas
      try {
        // Crear objeto de reserva
        const reservaData = {
          nombre: formData.nombre,
          rut: formData.rut || 'N/A',
          email: formData.email,
          telefono: formData.telefono,
          fecha: selectedDate || '',
          hora: selectedTime || '',
          descripcion: formData.descripcion || `Reunión ${service.name}`,
          servicio: service.name,
          precio: service.price,
          categoria: service.category,
          tipo_reunion: meetingTypes.find(t => t.id === selectedMeetingType)?.name || 'presencial'
        };

        console.log('📝 Creando reserva:', reservaData);
        
        // Importar dinámicamente el servicio de reservas
        const { createReservation } = await import('@/services/reservationService');
        
        // Crear la reserva (esto automáticamente envía notificación a Make)
        const nuevaReserva = await createReservation(reservaData);
        
        console.log('✅ Reserva creada exitosamente:', nuevaReserva.id);
        
        // Mostrar confirmación detallada
        alert(`🎉 ¡Cita agendada exitosamente!\n\n📋 Servicio: ${service.name}\n💰 Precio: $${service.price}\n📅 Fecha: ${formatDate(new Date(selectedDate))}\n⏰ Hora: ${selectedTime}\n🎯 Tipo: ${meetingTypes.find(t => t.id === selectedMeetingType)?.name}\n\n✅ ID de reserva: ${nuevaReserva.id}\n📧 Te enviaremos un email de confirmación\n🔔 Recibirás un recordatorio 24h antes\n💰 Comprobante de pago por email\n\n¡Gracias por confiar en Punto Legal!`);
        
        // Redirigir al inicio después de unos segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error al agendar cita:', error);
        alert(`❌ Error al agendar la cita.\n\nError: ${error.message || 'Error desconocido'}\n\nPor favor, inténtalo nuevamente o contacta a soporte.`);
      }
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
                to="/servicios" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a servicios
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
                {[1, 2, 3].map((stepNumber) => (
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
                    {stepNumber < 3 && (
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
                        {meetingTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedMeetingType(type.id)}
                            className={`
                              p-4 rounded-lg border transition-all
                              ${selectedMeetingType === type.id
                                ? 'border-primary bg-primary/10'
                                : 'border-white/20 hover:border-white/40'
                              }
                            `}
                          >
                            <type.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="font-semibold">{type.name}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Selección de Fecha */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">Selecciona una fecha</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {availableDates.map((date) => (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => setSelectedDate(date.toISOString())}
                            className={`
                              p-3 rounded-lg border text-sm transition-all
                              ${selectedDate === date.toISOString()
                                ? 'border-primary bg-primary/10'
                                : 'border-white/20 hover:border-white/40'
                              }
                            `}
                          >
                            {formatDate(date)}
                          </button>
                        ))}
                      </div>
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
                        
                        {/* Información adicional */}
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="text-blue-400 font-semibold mb-1">Información importante:</p>
                              <ul className="text-blue-300 space-y-1 text-xs">
                                <li>• Las citas deben agendarse con al menos 1 hora de anticipación</li>
                                <li>• Duración de la consulta: 45 minutos</li>
                                <li>• Recibirás confirmación por email y WhatsApp</li>
                                <li>• Puedes reprogramar hasta 2 horas antes de la cita</li>
                              </ul>
                            </div>
                          </div>
                        </div>
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
                        className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary/90 hover:to-primary/70 transition-all"
                      >
                        Confirmar Agendamiento
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