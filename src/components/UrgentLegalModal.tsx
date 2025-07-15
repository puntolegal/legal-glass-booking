import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';

interface UrgentLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  emergencyType: string;
  description: string;
  name: string;
  phone: string;
}

const UrgentLegalModal: React.FC<UrgentLegalModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    emergencyType: '',
    description: '',
    name: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyTypes = [
    { value: 'laboral', label: 'Emergencia Laboral', icon: '👔' },
    { value: 'penal', label: 'Emergencia Penal', icon: '⚖️' },
    { value: 'familiar', label: 'Emergencia Familiar', icon: '👨‍👩‍👧‍👦' },
    { value: 'otro', label: 'Otra Emergencia', icon: '🚨' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto cerrar después de 5 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ emergencyType: '', description: '', name: '', phone: '' });
    }, 5000);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({ emergencyType: '', description: '', name: '', phone: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-lg bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 border-b border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-red-300">¡Ayuda Legal Urgente!</h2>
                        <p className="text-sm text-red-200/80">Respuesta en menos de 30 minutos</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-foreground/70" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Tipo de Emergencia */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-foreground">
                      Tipo de emergencia legal *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {emergencyTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, emergencyType: type.value })}
                          className={`p-3 rounded-xl border transition-all text-left ${
                            formData.emergencyType === type.value
                              ? 'border-red-500/50 bg-red-500/10 text-red-300'
                              : 'border-white/20 hover:border-white/40 text-foreground/80'
                          }`}
                        >
                          <div className="text-lg mb-1">{type.icon}</div>
                          <div className="text-sm font-medium">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Cuéntanos brevemente tu caso *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500/50 outline-none transition-colors text-foreground placeholder:text-foreground/50"
                      placeholder="Describe tu situación legal urgente..."
                    />
                  </div>

                  {/* Información Personal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground">
                        Nombre completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500/50 outline-none transition-colors text-foreground placeholder:text-foreground/50"
                          placeholder="Juan Pérez"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-red-500/50 outline-none transition-colors text-foreground placeholder:text-foreground/50"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-300 font-semibold">Consulta de Emergencia</p>
                        <p className="text-xs text-red-200/80">Atención inmediata 24/7</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-300">$80.000</p>
                        <p className="text-xs text-red-200/80">Pago después de la consulta</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.emergencyType || !formData.description || !formData.name || !formData.phone}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5" />
                        Conectar ahora con un abogado
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-foreground/60">
                    Al enviar este formulario, aceptas que un abogado te contacte para brindar asistencia inmediata.
                  </p>
                </form>
              </>
            ) : (
              /* Mensaje de Confirmación */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  ¡Solicitud Enviada!
                </h3>
                
                <p className="text-foreground/80 mb-4">
                  Gracias por contactarnos. Un abogado se comunicará contigo en menos de 30 minutos.
                </p>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-300 font-semibold">
                    📞 Mantén tu teléfono disponible
                  </p>
                  <p className="text-xs text-green-200/80 mt-1">
                    Te llamaremos al {formData.phone}
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UrgentLegalModal; 