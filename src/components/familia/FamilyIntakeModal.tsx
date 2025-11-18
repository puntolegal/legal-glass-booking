import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ChevronLeft, Heart, Users, Home, Briefcase, FileText, Calendar, Shield, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface FamilyIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'integral' | 'premium' | 'elite';
  planName: string;
  planPrice: string;
}

const FamilyIntakeModal: React.FC<FamilyIntakeModalProps> = ({ 
  isOpen, 
  onClose, 
  planType,
  planName,
  planPrice
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(-1);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    bienes: '',
    empresa: '',
    internacional: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const servicioOptions = [
    { value: 'divorcio-mutuo', label: 'Divorcio de mutuo acuerdo', icon: Heart },
    { value: 'divorcio-contencioso', label: 'Divorcio contencioso', icon: Shield },
    { value: 'pension-alimentos', label: 'Pensión de alimentos', icon: Home },
    { value: 'cuidado-personal', label: 'Cuidado personal y visitas', icon: Users },
    { value: 'liquidacion-bienes', label: 'Liquidación de bienes', icon: Briefcase },
    { value: 'otro', label: 'Otro asunto familiar', icon: FileText }
  ];

  const bienesOptions = [
    { value: 'sin-bienes', label: 'Sin bienes importantes que dividir', icon: CheckCircle },
    { value: 'bienes-simples', label: 'Bienes simples (auto, muebles)', icon: Home },
    { value: 'inmuebles', label: 'Propiedad inmobiliaria', icon: Briefcase },
    { value: 'empresa-acciones', label: 'Empresa o acciones', icon: Shield }
  ];

  const empresaOptions = [
    { value: 'no', label: 'No hay empresas involucradas', icon: CheckCircle },
    { value: 'si-simple', label: 'Sí, negocio familiar simple', icon: Briefcase },
    { value: 'si-complejo', label: 'Sí, empresa con socios o compleja', icon: Shield }
  ];

  const internacionalOptions = [
    { value: 'no', label: 'No, todo es en Chile', icon: CheckCircle },
    { value: 'si-bienes', label: 'Sí, tengo bienes en el extranjero', icon: Briefcase },
    { value: 'si-residencia', label: 'Sí, vivo o mi pareja vive fuera de Chile', icon: Users }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setClickedButton(`${field}-${value}`);
    
    setTimeout(() => {
      setClickedButton(null);
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        // Último paso, guardar y continuar
        handleSubmit();
      }
    }, 200);
  };

  const handleSubmit = async () => {
    // Validar datos básicos
    if (!formData.nombre || !formData.email) {
      toast.error('Por favor completa nombre y email antes de continuar');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      // Guardar en Supabase
      const { error } = await supabase
        .from('family_quiz_responses')
        .insert([{
          nombre: formData.nombre,
          email: formData.email,
          servicio: formData.servicio,
          bienes: formData.bienes,
          empresa: formData.empresa,
          internacional: formData.internacional,
          recommended_plan: planType,
          status: 'pendiente'
        }]);

      if (error) throw error;

      toast.success('¡Perfecto! Tus antecedentes han sido guardados. Te redirigimos al agendamiento.');
      
      // Redirigir al agendamiento con el plan correcto
      const planSlug = `familia-${planType}`;
      setTimeout(() => {
        navigate(`/agendamiento?plan=${planSlug}`);
      }, 1000);

    } catch (error) {
      console.error('Error guardando datos:', error);
      toast.error('Hubo un problema. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanColor = () => {
    switch (planType) {
      case 'integral': return 'from-emerald-500 to-teal-600';
      case 'premium': return 'from-purple-500 to-pink-600';
      case 'elite': return 'from-amber-500 to-orange-600';
      default: return 'from-pink-500 to-rose-600';
    }
  };

  const getPlanAccent = () => {
    switch (planType) {
      case 'integral': return 'emerald';
      case 'premium': return 'purple';
      case 'elite': return 'amber';
      default: return 'pink';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-2xl min-h-[600px] sm:min-h-[500px] max-h-[90vh] my-auto
                         bg-slate-900 border border-slate-700 
                         shadow-2xl flex flex-col overflow-hidden relative rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-slate-700 flex-shrink-0 bg-slate-800/50">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 
                           transition-colors duration-200 z-10 border border-slate-700"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="pr-8"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPlanColor()} text-white text-xs font-bold shadow-lg`}>
                      {planName}
                    </div>
                    <span className="text-slate-500 text-sm">• {planPrice}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">
                    Cuéntanos más sobre tu situación
                  </h2>
                  <p className="text-slate-400">
                    Esto nos ayuda a preparar mejor tu consulta estratégica
                  </p>
                </motion.div>
              </div>

              {/* Progress bar */}
              {currentStep >= 0 && currentStep <= 5 && (
                <div className="h-1 bg-slate-800/50 flex-shrink-0 border-b border-slate-700">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getPlanColor()} shadow-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / 6) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {/* PASO CERO - Intro */}
                  {currentStep === -1 && (
                    <motion.div
                      key="intro"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center text-center py-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-slate-800 border-2 border-pink-500/30 rounded-full 
                                   flex items-center justify-center mb-6 shadow-xl"
                      >
                        <Shield className="w-12 h-12 text-pink-400" />
                      </motion.div>

                      <h3 className="text-3xl font-bold text-slate-100 mb-4 max-w-lg">
                        Antes de agendar, recopilemos algunos datos
                      </h3>
                      <p className="text-xl text-slate-400 mb-8 max-w-md leading-relaxed">
                        Esto nos permite <span className="text-pink-400 font-semibold">preparar tu consulta</span> y 
                        <span className="text-pink-400 font-semibold"> maximizar el valor</span> de tu primera sesión.
                      </p>

                      <div className="grid gap-3 mb-8 text-left max-w-md">
                        {[
                          "Solo 2 minutos para completar",
                          "Información 100% confidencial",
                          "Mejor preparación = mejores resultados"
                        ].map((benefit, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-pink-400" />
                            <span className="text-slate-400">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.button
                        onClick={() => setCurrentStep(0)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full max-w-md py-5 px-8 rounded-xl font-bold text-lg text-white 
                                   bg-gradient-to-r from-pink-500 to-rose-600 
                                   hover:from-pink-600 hover:to-rose-700
                                   shadow-xl transition-all duration-200
                                   flex items-center justify-center gap-3"
                      >
                        Comenzar
                        <ArrowRight className="w-6 h-6" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* PASO 0 - Datos básicos */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-slate-100 mb-6">
                        Primero, tus datos de contacto
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Nombre completo *</label>
                          <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            placeholder="Juan Pérez González"
                            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 
                                     text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500
                                     hover:border-slate-600 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Email *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="juan@email.com"
                            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 
                                     text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500
                                     hover:border-slate-600 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Teléfono (opcional)</label>
                          <input
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) => handleInputChange('telefono', e.target.value)}
                            placeholder="+56 9 1234 5678"
                            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 
                                     text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500
                                     hover:border-slate-600 transition-all"
                          />
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          if (!formData.nombre || !formData.email) {
                            toast.error('Por favor completa nombre y email');
                            return;
                          }
                          setCurrentStep(1);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 px-6 rounded-xl font-semibold text-white 
                                   bg-gradient-to-r from-pink-500 to-rose-600 
                                   hover:from-pink-600 hover:to-rose-700
                                   shadow-lg transition-all duration-200"
                      >
                        Continuar
                      </motion.button>
                    </motion.div>
                  )}

                  {/* PASO 1 - Tipo de servicio */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-100 mb-6">
                        ¿Qué servicio necesitas principalmente?
                      </h3>
                      
                      <div className="grid gap-3">
                        {servicioOptions.map((option, index) => {
                          const Icon = option.icon;
                          const optionKey = `servicio-${option.value}`;
                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              whileHover={{ scale: 1.02, x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionSelect('servicio', option.value)}
                              className={`w-full p-4 rounded-xl border transition-all duration-200 
                                       text-left flex items-center gap-4 group relative overflow-hidden
                                       ${clickedButton === optionKey 
                                         ? 'border-pink-500 bg-slate-800/80 shadow-lg' 
                                         : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
                                       }`}
                            >
                              {clickedButton === optionKey && (
                                <motion.div
                                  initial={{ x: '-120%' }}
                                  animate={{ x: '120%' }}
                                  transition={{ duration: 0.6 }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/15 to-transparent"
                                />
                              )}
                              
                              <div className="p-3 rounded-full bg-pink-500/10 border border-pink-500/20 transition-colors relative">
                                <Icon className="w-6 h-6 text-pink-400" />
                              </div>
                              <span className="text-slate-200 font-medium relative">{option.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentStep(0)}
                        className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                      </button>
                    </motion.div>
                  )}

                  {/* PASO 2 - Bienes */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-100 mb-6">
                        ¿Qué tipo de bienes están involucrados?
                      </h3>
                      
                      <div className="grid gap-3">
                        {bienesOptions.map((option, index) => {
                          const Icon = option.icon;
                          const optionKey = `bienes-${option.value}`;
                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              whileHover={{ scale: 1.02, x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionSelect('bienes', option.value)}
                              className={`w-full p-4 rounded-2xl border transition-all duration-200 
                                       text-left flex items-center gap-4 group relative overflow-hidden
                                       ${clickedButton === optionKey 
                                         ? `border-${getPlanAccent()}-500 shadow-lg` 
                                         : 'bg-slate-800/50 border-slate-700/50'
                                       }`}
                            >
                              {clickedButton === optionKey && (
                                <motion.div
                                  initial={{ x: '-120%' }}
                                  animate={{ x: '120%' }}
                                  transition={{ duration: 0.6 }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/15 to-transparent"
                                />
                              )}
                              
                              <div className={`p-3 rounded-full bg-gradient-to-br ${getPlanColor()}/20 transition-colors relative`}>
                                <Icon className={`w-6 h-6 text-${getPlanAccent()}-400`} />
                              </div>
                              <span className="text-white font-medium relative">{option.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentStep(1)}
                        className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                      </button>
                    </motion.div>
                  )}

                  {/* PASO 3 - Empresa */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-100 mb-6">
                        ¿Hay alguna empresa involucrada?
                      </h3>
                      
                      <div className="grid gap-3">
                        {empresaOptions.map((option, index) => {
                          const Icon = option.icon;
                          const optionKey = `empresa-${option.value}`;
                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              whileHover={{ scale: 1.02, x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionSelect('empresa', option.value)}
                              className={`w-full p-4 rounded-2xl border transition-all duration-200 
                                       text-left flex items-center gap-4 group relative overflow-hidden
                                       ${clickedButton === optionKey 
                                         ? `border-${getPlanAccent()}-500 shadow-lg` 
                                         : 'bg-slate-800/50 border-slate-700/50'
                                       }`}
                            >
                              {clickedButton === optionKey && (
                                <motion.div
                                  initial={{ x: '-120%' }}
                                  animate={{ x: '120%' }}
                                  transition={{ duration: 0.6 }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/15 to-transparent"
                                />
                              )}
                              
                              <div className={`p-3 rounded-full bg-gradient-to-br ${getPlanColor()}/20 transition-colors relative`}>
                                <Icon className={`w-6 h-6 text-${getPlanAccent()}-400`} />
                              </div>
                              <span className="text-white font-medium relative">{option.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentStep(2)}
                        className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                      </button>
                    </motion.div>
                  )}

                  {/* PASO 4 - Internacional */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xl font-semibold text-slate-100 mb-6">
                        ¿Hay elementos internacionales en tu caso?
                      </h3>
                      
                      <div className="grid gap-3">
                        {internacionalOptions.map((option, index) => {
                          const Icon = option.icon;
                          const optionKey = `internacional-${option.value}`;
                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              whileHover={{ scale: 1.02, x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionSelect('internacional', option.value)}
                              className={`w-full p-4 rounded-2xl border transition-all duration-200 
                                       text-left flex items-center gap-4 group relative overflow-hidden
                                       ${clickedButton === optionKey 
                                         ? `border-${getPlanAccent()}-500 shadow-lg` 
                                         : 'bg-slate-800/50 border-slate-700/50'
                                       }`}
                            >
                              {clickedButton === optionKey && (
                                <motion.div
                                  initial={{ x: '-120%' }}
                                  animate={{ x: '120%' }}
                                  transition={{ duration: 0.6 }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/15 to-transparent"
                                />
                              )}
                              
                              <div className={`p-3 rounded-full bg-gradient-to-br ${getPlanColor()}/20 transition-colors relative`}>
                                <Icon className={`w-6 h-6 text-${getPlanAccent()}-400`} />
                              </div>
                              <span className="text-white font-medium relative">{option.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentStep(3)}
                        className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                      </button>
                    </motion.div>
                  )}

                  {/* PASO 5 - Confirmación */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-6"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-slate-800 border-2 border-pink-500/30 rounded-full 
                                   flex items-center justify-center mx-auto shadow-xl"
                      >
                        <Sparkles className="w-10 h-10 text-pink-400" />
                      </motion.div>

                      <div>
                        <h3 className="text-2xl font-bold text-slate-100 mb-3">
                          ¡Perfecto! Ya tenemos todo listo
                        </h3>
                        <p className="text-slate-400">
                          Procederemos a agendar tu {planName} por {planPrice}
                        </p>
                      </div>

                      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h4 className="font-semibold text-slate-100 mb-4">Resumen de tu caso:</h4>
                        <div className="space-y-2 text-sm text-left">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Servicio:</span>
                            <span className="text-slate-200">{servicioOptions.find(o => o.value === formData.servicio)?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Bienes:</span>
                            <span className="text-slate-200">{bienesOptions.find(o => o.value === formData.bienes)?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Empresa:</span>
                            <span className="text-slate-200">{empresaOptions.find(o => o.value === formData.empresa)?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Internacional:</span>
                            <span className="text-slate-200">{internacionalOptions.find(o => o.value === formData.internacional)?.label}</span>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className="w-full py-5 px-6 rounded-xl font-bold text-lg text-white 
                                   bg-gradient-to-r from-pink-500 to-rose-600 
                                   hover:from-pink-600 hover:to-rose-700
                                   shadow-xl transition-all duration-200 
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-3"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            Continuar al Agendamiento
                            <ArrowRight className="w-6 h-6" />
                          </>
                        )}
                      </motion.button>

                      <button
                        onClick={() => setCurrentStep(4)}
                        className="text-slate-500 hover:text-slate-300 transition-colors text-sm flex items-center gap-2 mx-auto"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Volver
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default React.memo(FamilyIntakeModal);
