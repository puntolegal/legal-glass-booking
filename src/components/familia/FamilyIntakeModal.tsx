import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, ArrowRight, ChevronLeft, Heart, Users, Home, Briefcase, FileText, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    situacion: '',
    descripcion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const situationOptions = [
    { value: 'divorcio', label: 'Divorcio o separación', icon: Heart },
    { value: 'pension', label: 'Pensión de alimentos', icon: Home },
    { value: 'custodia', label: 'Custodia o cuidado personal', icon: Users },
    { value: 'liquidacion', label: 'Liquidación de bienes', icon: Briefcase },
    { value: 'vif', label: 'Violencia intrafamiliar', icon: Shield },
    { value: 'otro', label: 'Otro asunto familiar', icon: FileText }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSituacionSelect = (value: string) => {
    setFormData(prev => ({ ...prev, situacion: value }));
    setClickedButton(value);
    
    setTimeout(() => {
      setClickedButton(null);
    }, 300);
  };

  const handleNext = () => {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setCurrentStep(1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.situacion) {
      toast.error('Por favor selecciona tu situación principal');
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
          servicio: formData.situacion,
          recommended_plan: planType,
          status: 'nuevo'
        }]);

      if (error) throw error;

      setShowSuccess(true);
      toast.success('Información guardada exitosamente');

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        const planParam = `familia-${planType}`;
        navigate(`/agendamiento?plan=${planParam}`);
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error guardando datos:', error);
      toast.error('Hubo un error. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-2xl min-h-[600px] sm:min-h-[500px] max-h-[90vh] my-auto
                         bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 
                         shadow-2xl shadow-pink-500/20
                         flex flex-col overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-slate-700/50 flex-shrink-0 bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-transparent">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 
                           transition-colors duration-200 z-10 border border-slate-700/50"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5 text-slate-300 hover:text-white" />
                </button>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="pr-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Plan {planName}
                  </h2>
                  <p className="text-slate-300">
                    Completa estos datos para continuar con tu reserva
                  </p>
                </motion.div>
              </div>

              {/* Progress Bar */}
              {!showSuccess && (
                <div className="h-1 bg-slate-800 flex-shrink-0">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / 2) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  <form onSubmit={handleSubmit}>
                    {!showSuccess && currentStep === 0 && (
                      <motion.div
                        key="step-contact"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full 
                                     flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30 border border-pink-500/20"
                          >
                            <Heart className="w-10 h-10 text-pink-400" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Cuéntanos sobre ti
                          </h3>
                          <p className="text-slate-300">
                            Necesitamos algunos datos para poder ayudarte mejor
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="nombre" className="text-slate-200 mb-2 block font-medium">
                              Nombre Completo
                            </Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleInputChange}
                              placeholder="Ej: María González"
                              className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 
                                       focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                                       transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="email" className="text-slate-200 mb-2 block font-medium">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="tu@email.com"
                              className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 
                                       focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                                       transition-all duration-200"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="telefono" className="text-slate-200 mb-2 block font-medium">
                              Teléfono
                            </Label>
                            <Input
                              id="telefono"
                              name="telefono"
                              type="tel"
                              value={formData.telefono}
                              onChange={handleInputChange}
                              placeholder="+56 9 1234 5678"
                              className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 
                                       focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                                       transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          onClick={handleNext}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 px-6 rounded-xl font-semibold text-white 
                                   bg-gradient-to-r from-pink-500 to-rose-600 
                                   hover:from-pink-600 hover:to-rose-700 
                                   shadow-xl shadow-pink-500/40 transition-all duration-200
                                   flex items-center justify-center gap-2"
                        >
                          Continuar
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    )}

                    {!showSuccess && currentStep === 1 && (
                      <motion.div
                        key="step-situation"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-2xl font-semibold text-white mb-6">
                          ¿Cuál es tu situación principal?
                        </h3>

                        <div className="space-y-3 mb-6">
                          {situationOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isSelected = formData.situacion === option.value;
                            return (
                              <motion.button
                                key={option.value}
                                type="button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleSituacionSelect(option.value)}
                                whileHover={{ scale: 1.02, x: 3 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-5 rounded-2xl border transition-all duration-200 
                                         text-left flex items-center gap-4 group relative overflow-hidden
                                         ${isSelected 
                                           ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/30' 
                                           : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/60 hover:border-pink-500/30'
                                         }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                                  />
                                )}
                                
                                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 
                                              group-hover:from-pink-500/30 group-hover:to-rose-500/30 
                                              transition-all relative border border-pink-500/20">
                                  <Icon className="w-6 h-6 text-pink-400" />
                                </div>
                                <span className="text-slate-100 font-medium relative">{option.label}</span>
                              </motion.button>
                            )
                          })}
                        </div>

                        <div className="mb-6">
                          <Label htmlFor="descripcion" className="text-slate-200 mb-2 block font-medium">
                            Cuéntanos más sobre tu caso (opcional)
                          </Label>
                          <Textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            placeholder="Describe brevemente tu situación..."
                            rows={4}
                            className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 
                                     focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                                     resize-none transition-all duration-200"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white 
                                     bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700
                                     transition-all duration-200 flex items-center gap-2"
                          >
                            <ChevronLeft className="w-5 h-5" />
                            Volver
                          </button>
                          
                          <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                            className="flex-1 py-4 px-6 rounded-xl font-semibold text-white 
                                     bg-gradient-to-r from-pink-500 to-rose-600 
                                     hover:from-pink-600 hover:to-rose-700 
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     shadow-xl shadow-pink-500/40 transition-all duration-200
                                     flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                Continuar al Agendamiento
                                <ArrowRight className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {showSuccess && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
                          className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full 
                                   flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 
                                   border border-green-500/20"
                        >
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                          ¡Información Recibida!
                        </h3>
                        <p className="text-slate-300 mb-6">
                          Redirigiendo al agendamiento...
                        </p>
                        
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />
                          <span className="text-slate-200">Un momento...</span>
                        </div>
                      </motion.div>
                    )}
                  </form>
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
