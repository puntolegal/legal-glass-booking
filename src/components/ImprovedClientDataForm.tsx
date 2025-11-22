import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface ClientData {
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
  empresa?: string;
  descripcion?: string;
}

interface ImprovedClientDataFormProps {
  onSubmit: (data: ClientData) => void;
  onBack: () => void;
  serviceName: string;
  price: string;
  initialData?: Partial<ClientData>;
  isProcessing?: boolean;
}

export default function ImprovedClientDataForm({
  onSubmit,
  onBack,
  serviceName,
  price,
  initialData,
  isProcessing = false
}: ImprovedClientDataFormProps) {
  const [formData, setFormData] = useState<ClientData>({
    nombre: initialData?.nombre || '',
    email: initialData?.email || '',
    telefono: initialData?.telefono || '',
    rut: initialData?.rut || '',
    empresa: initialData?.empresa || '',
    descripcion: initialData?.descripcion || ''
  });

  const [errors, setErrors] = useState<Partial<ClientData>>({});
  const [touched, setTouched] = useState<Set<keyof ClientData>>(new Set());
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Formatear RUT automáticamente
  const formatRut = (value: string) => {
    const rut = value.replace(/\./g, '').replace(/-/g, '');
    if (rut.length <= 1) return rut;
    const dv = rut.slice(-1);
    const num = rut.slice(0, -1);
    const formatted = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `${formatted}-${dv}`;
  };

  // Formatear teléfono automáticamente
  const formatPhone = (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.startsWith('569') && phone.length === 11) {
      return `+${phone.slice(0, 2)} ${phone.slice(2, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
    } else if (phone.startsWith('56') && phone.length === 10) {
      return `+${phone.slice(0, 2)} ${phone.slice(2, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
    } else if (phone.length === 9) {
      return `${phone.slice(0, 1)} ${phone.slice(1, 5)} ${phone.slice(5)}`;
    }
    return value;
  };

  // Validar email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validar RUT chileno
  const validateRut = (rut: string) => {
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
    if (cleanRut.length < 8) return false;
    
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedDV = 11 - (sum % 11);
    const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
    
    return dv === calculatedDV;
  };

  // Validar campo individual
  const validateField = (field: keyof ClientData, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'nombre':
        if (!value.trim()) {
          newErrors.nombre = 'El nombre es requerido';
        } else if (value.trim().length < 3) {
          newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'telefono':
        const cleanPhone = value.replace(/\D/g, '');
        if (!cleanPhone) {
          newErrors.telefono = 'El teléfono es requerido';
        } else if (cleanPhone.length < 9) {
          newErrors.telefono = 'Teléfono inválido';
        } else {
          delete newErrors.telefono;
        }
        break;
      
      case 'rut':
        if (!value.trim()) {
          newErrors.rut = 'El RUT es requerido';
        } else if (!validateRut(value)) {
          newErrors.rut = 'RUT inválido';
        } else {
          delete newErrors.rut;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los campos
  const handleChange = (field: keyof ClientData, value: string) => {
    let formattedValue = value;
    
    if (field === 'rut') {
      formattedValue = formatRut(value.toUpperCase());
    } else if (field === 'telefono') {
      formattedValue = formatPhone(value);
    }
    
    setFormData({ ...formData, [field]: formattedValue });
    
    if (touched.has(field)) {
      validateField(field, formattedValue);
    }
  };

  // Manejar blur para mostrar errores
  const handleBlur = (field: keyof ClientData) => {
    setTouched(new Set([...touched, field]));
    validateField(field, formData[field]);
  };

  // Validar todo el formulario
  const validateForm = () => {
    const requiredFields: (keyof ClientData)[] = ['nombre', 'email', 'telefono', 'rut'];
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    setTouched(new Set(requiredFields));
    return isValid;
  };

  // Manejar submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Progreso del formulario
  const getProgress = () => {
    const requiredFields = ['nombre', 'email', 'telefono', 'rut'];
    const filledFields = requiredFields.filter(field => 
      formData[field as keyof ClientData].trim() !== ''
    );
    return (filledFields.length / requiredFields.length) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header con información del servicio */}
      <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-pink-200/20 dark:border-pink-800/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {serviceName}
            </h3>
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mt-1">
              {price}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Datos protegidos</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Pago seguro</span>
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>Progreso</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-pink-500" />
            Información Personal
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  onBlur={() => handleBlur('nombre')}
                  className={`w-full px-4 py-3 pl-10 rounded-xl border ${
                    touched.has('nombre') && errors.nombre
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20'
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                  placeholder="Juan Pérez González"
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {touched.has('nombre') && errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.nombre}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 pl-10 rounded-xl border ${
                    touched.has('email') && errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20'
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                  placeholder="correo@ejemplo.com"
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {touched.has('email') && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono *
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip('telefono')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="w-4 h-4 inline" />
                </button>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  onBlur={() => handleBlur('telefono')}
                  className={`w-full px-4 py-3 pl-10 rounded-xl border ${
                    touched.has('telefono') && errors.telefono
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20'
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                  placeholder="+56 9 1234 5678"
                />
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {touched.has('telefono') && errors.telefono && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.telefono}
                </motion.p>
              )}
              <AnimatePresence>
                {showTooltip === 'telefono' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 bg-gray-800 text-white text-xs rounded-lg p-2 mt-1"
                  >
                    Formato: +56 9 XXXX XXXX o 9 XXXX XXXX
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                RUT *
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip('rut')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="w-4 h-4 inline" />
                </button>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => handleChange('rut', e.target.value)}
                  onBlur={() => handleBlur('rut')}
                  className={`w-full px-4 py-3 pl-10 rounded-xl border ${
                    touched.has('rut') && errors.rut
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20'
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`}
                  placeholder="12.345.678-9"
                />
                <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              {touched.has('rut') && errors.rut && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.rut}
                </motion.p>
              )}
              <AnimatePresence>
                {showTooltip === 'rut' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 bg-gray-800 text-white text-xs rounded-lg p-2 mt-1"
                  >
                    RUT chileno con formato XX.XXX.XXX-X
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-pink-500" />
            Información Adicional (Opcional)
          </h4>

          <div className="space-y-6">
            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empresa
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => handleChange('empresa', e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all"
                  placeholder="Nombre de la empresa (opcional)"
                />
                <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe brevemente tu caso
                <span className="ml-2 text-gray-500 text-xs">
                  (Esto nos ayudará a prepararnos mejor)
                </span>
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all resize-none"
                placeholder="Cuéntanos brevemente sobre tu situación legal..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/500 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Garantías */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-6 border border-pink-200/50 dark:border-pink-800/50">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-pink-600 dark:text-pink-400 mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Datos 100% Seguros
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Encriptación SSL
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Satisfacción Garantizada
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                O te devolvemos tu dinero
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Atención Premium
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Abogados expertos
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Volver
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all flex items-center gap-3 ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 transform hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Procesando...
              </>
            ) : (
              <>
                Continuar al Pago
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Mensaje de seguridad */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Tus datos están protegidos con encriptación de 256 bits
          </p>
        </div>
      </form>
    </motion.div>
  );
}















