import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
  empresa: string;
  descripcion: string;
  codigoConvenio: string;
}

interface Step1_ClientInfoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  serviceColors: any;
  serviceColor: string;
  isConvenioValido: boolean;
  isAdminValido: boolean;
  formatRUT: (value: string) => string;
}

const Step1_ClientInfo: React.FC<Step1_ClientInfoProps> = ({
  formData,
  setFormData,
  onNext,
  serviceColors,
  serviceColor,
  isConvenioValido,
  isAdminValido,
  formatRUT,
}) => {
  const [validation, setValidation] = useState<{
    nombre: { isValid: boolean; message: string };
    email: { isValid: boolean; message: string };
    telefono: { isValid: boolean; message: string };
    rut: { isValid: boolean; message: string };
  }>({
    nombre: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    telefono: { isValid: false, message: '' },
    rut: { isValid: false, message: '' },
  });

  // Validación en tiempo real
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'nombre':
        const nombreValid = value.trim().length >= 3;
        setValidation(prev => ({
          ...prev,
          nombre: {
            isValid: nombreValid,
            message: nombreValid ? '' : 'El nombre debe tener al menos 3 caracteres',
          },
        }));
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValid = emailRegex.test(value);
        setValidation(prev => ({
          ...prev,
          email: {
            isValid: emailValid,
            message: emailValid ? '' : 'Por favor ingresa un email válido',
          },
        }));
        break;

      case 'telefono':
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        const phoneValid = phoneRegex.test(value) && value.replace(/\D/g, '').length >= 8;
        setValidation(prev => ({
          ...prev,
          telefono: {
            isValid: phoneValid,
            message: phoneValid ? '' : 'Ingresa un número de teléfono válido',
          },
        }));
        break;

      case 'rut':
        const rutRegex = /^[\d\.]+-?[0-9kK]?$/;
        const rutClean = value.replace(/\./g, '').replace(/-/g, '');
        const rutValid = rutRegex.test(value) && rutClean.length >= 8 && rutClean.length <= 10;
        setValidation(prev => ({
          ...prev,
          rut: {
            isValid: rutValid,
            message: rutValid ? '' : 'Ingresa un RUT válido (ej: 12345678-9)',
          },
        }));
        break;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'rut') {
      const formatted = formatRUT(value);
      setFormData({ ...formData, [field]: formatted });
      validateField('rut', formatted);
    } else {
      setFormData({ ...formData, [field]: value });
      validateField(field, value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, field: string) => {
    if (field === 'rut') {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const formatted = formatRUT(pastedText);
      setFormData({ ...formData, rut: formatted });
      validateField('rut', formatted);
    }
  };

  const canProceed = 
    validation.nombre.isValid &&
    validation.email.isValid &&
    validation.telefono.isValid &&
    validation.rut.isValid &&
    formData.nombre.trim() &&
    formData.email.trim() &&
    formData.telefono.trim() &&
    formData.rut.trim();

  return (
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
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                onBlur={() => validateField('nombre', formData.nombre)}
                className={`w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base ${
                  validation.nombre.isValid && formData.nombre
                    ? 'border-green-500 focus:border-green-500'
                    : formData.nombre && !validation.nombre.isValid
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Juan Pérez González"
              />
              {formData.nombre && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validation.nombre.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {formData.nombre && !validation.nombre.isValid && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {validation.nombre.message}
              </motion.p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => validateField('email', formData.email)}
                className={`w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base ${
                  validation.email.isValid && formData.email
                    ? 'border-green-500 focus:border-green-500'
                    : formData.email && !validation.email.isValid
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="juan@empresa.com"
              />
              {formData.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validation.email.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {formData.email && !validation.email.isValid && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {validation.email.message}
              </motion.p>
            )}
          </div>
          
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Teléfono *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                onBlur={() => validateField('telefono', formData.telefono)}
                className={`w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base ${
                  validation.telefono.isValid && formData.telefono
                    ? 'border-green-500 focus:border-green-500'
                    : formData.telefono && !validation.telefono.isValid
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="+56 9 1234 5678"
              />
              {formData.telefono && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validation.telefono.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {formData.telefono && !validation.telefono.isValid && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {validation.telefono.message}
              </motion.p>
            )}
          </div>
          
          {/* RUT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              RUT *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.rut}
                onChange={(e) => handleInputChange('rut', e.target.value)}
                onPaste={(e) => handlePaste(e, 'rut')}
                onBlur={() => validateField('rut', formData.rut)}
                maxLength={12}
                className={`w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base ${
                  validation.rut.isValid && formData.rut
                    ? 'border-green-500 focus:border-green-500'
                    : formData.rut && !validation.rut.isValid
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="12345678-9"
              />
              {formData.rut && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validation.rut.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ingresa solo números y K, el formato se aplicará automáticamente
            </p>
            {formData.rut && !validation.rut.isValid && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                {validation.rut.message}
              </motion.p>
            )}
          </div>
          
          {/* Empresa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Empresa (opcional)
            </label>
            <input
              type="text"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, codigoConvenio: e.target.value })}
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
          
          {/* Descripción del caso con tooltip */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              Descripción del caso
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl w-64">
                    <p className="font-semibold mb-1">Consejo:</p>
                    <p>Sé lo más específico posible. Menciona fechas clave, personas involucradas y el resultado que buscas. Esto nos ayuda a prepararnos mejor para tu consulta.</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            </label>
            <textarea
              rows={4}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 resize-none text-base"
              placeholder="Describe brevemente tu situación legal..."
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full mt-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${
            canProceed ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
          }`}
          style={canProceed ? { 
            background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}dd)`,
            boxShadow: `0 8px 25px ${serviceColor}30`
          } : {
            background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
          }}
        >
          {canProceed ? 'Continuar a Fecha y Hora' : 'Completa todos los campos requeridos'}
        </button>
      </div>
    </motion.div>
  );
};

export default Step1_ClientInfo;

