// RUTA: src/components/agendamiento/steps/Step1_ClientInfo.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, User } from 'lucide-react';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { validationRules } from '@/hooks/useFormValidation';
import { serviceThemes } from '@/config/serviceThemes';
import type { FormData } from '@/types/agendamiento';

const Step1_ClientInfo: React.FC = () => {
  const {
    form,
    service,
    serviceColor,
    setStep,
    formatRUT,
    priceCalculation,
  } = useAgendamiento();
  
  // Obtener tema del servicio para colores dinámicos
  const serviceTheme = useMemo(() => {
    const themeKey = service.category.toLowerCase() as keyof typeof serviceThemes;
    return serviceThemes[themeKey] || serviceThemes.general;
  }, [service.category]);
  
  // Convertir hex a rgba para efectos soft
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const primaryGradient = useMemo(() => 
    `linear-gradient(135deg, ${serviceTheme.primary}, ${serviceTheme.accent})`,
    [serviceTheme]
  );
  
  const {
    register,
    trigger,
    setFocus,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchedValues = watch();
  const [currentField, setCurrentField] = useState(0);
  const { isConvenioValido, isAdminValido } = priceCalculation;
  
  type FieldKey = keyof FormData;

  interface FieldConfig {
    name: FieldKey;
    question: string;
    placeholder: string;
    type?: string;
    summaryLabel: string;
    autoComplete?: string;
    optional?: boolean;
    isTextArea?: boolean;
    helper?: string;
    rules?: typeof validationRules[FieldKey];
  }

  const fieldsConfig: FieldConfig[] = useMemo(() => [
    {
      name: 'nombre',
      question: 'Para comenzar, ¿cuál es tu nombre completo?',
      placeholder: 'Juan Pérez González',
      type: 'text',
      summaryLabel: 'Nombre',
      autoComplete: 'name',
      rules: validationRules.nombre,
    },
    {
      name: 'email',
      question: watchedValues.nombre
        ? `¡Un placer, ${watchedValues.nombre.split(' ')[0]}! ¿Cuál es tu correo electrónico?`
        : '¿Cuál es tu correo electrónico?',
      placeholder: 'juan@empresa.com',
      type: 'email',
      summaryLabel: 'Email',
      autoComplete: 'email',
      rules: validationRules.email,
    },
    {
      name: 'telefono',
      question: '¿Cuál es tu número de teléfono para coordinar la consulta?',
      placeholder: '+56 9 1234 5678',
      type: 'tel',
      summaryLabel: 'Teléfono',
      autoComplete: 'tel',
      rules: validationRules.telefono,
    },
    {
      name: 'rut',
      question: 'Perfecto. ¿Cuál es tu RUT?',
      placeholder: '12345678-9',
      type: 'text',
      summaryLabel: 'RUT',
      helper: 'Formato: 12345678-9',
      rules: validationRules.rut,
          },
    {
      name: 'empresa',
      question: '¿Representas a alguna empresa o proyecto? (opcional)',
      placeholder: 'Mi Empresa SpA',
      type: 'text',
      summaryLabel: 'Empresa',
      optional: true,
    },
    {
      name: 'codigoConvenio',
      question: '¿Tienes un código de convenio o invitación? (opcional)',
      placeholder: 'Código especial',
      type: 'text',
      summaryLabel: 'Convenio',
      optional: true,
    },
    {
      name: 'descripcion',
      question: watchedValues.nombre
        ? `Gracias, ${watchedValues.nombre.split(' ')[0]}. Describe brevemente tu situación legal:`
        : 'Describe brevemente tu situación legal:',
      placeholder: 'Cuéntanos qué necesitas resolver...',
      summaryLabel: 'Descripción',
      optional: true,
      isTextArea: true,
      helper: 'Puedes usar Shift + Enter para añadir saltos de línea.',
      rules: validationRules.descripcion,
          },
  ], [watchedValues.nombre]);

  useEffect(() => {
    const field = fieldsConfig[currentField];
    if (!field) return;

    const focusTimeout = setTimeout(() => {
      setFocus(field.name);
    }, 120);

    return () => clearTimeout(focusTimeout);
  }, [currentField, fieldsConfig, setFocus]);

  const handleAdvance = useCallback(async () => {
    const field = fieldsConfig[currentField];
    if (!field) return;

    let isValid = true;
    if (field.rules) {
      isValid = await trigger(field.name);
    }

    if (!isValid) {
      return;
    }

    if (currentField === fieldsConfig.length - 1) {
      setStep(2);
    } else {
      setCurrentField((prev) => Math.min(prev + 1, fieldsConfig.length - 1));
    }
  }, [currentField, fieldsConfig, trigger, setStep]);

  const handleSubmitField = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleAdvance();
  };

  const descriptionIndex = useMemo(
    () => fieldsConfig.findIndex((field) => field.name === 'descripcion'),
    [fieldsConfig]
  );

  const handleDescriptionKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (currentField === descriptionIndex && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleAdvance();
    }
  };

  const completedFields = fieldsConfig
    .slice(0, currentField)
    .filter((field) => {
      const value = watchedValues[field.name];
      return value && value.toString().trim().length > 0;
    });

  const progressPercent = Math.min((currentField / fieldsConfig.length) * 100, 100);

  const getRegisterProps = (field: FieldConfig) => {
    if (field.name === 'rut') {
      return register(field.name, {
        ...field.rules,
        onChange: (event) => {
          const formatted = formatRUT(event.target.value);
          setValue('rut', formatted, { shouldValidate: false, shouldDirty: true });
        },
      });
    }

    return register(field.name, field.rules);
  };

  const activeField = fieldsConfig[currentField];

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div 
        className="bg-slate-900/70 backdrop-blur-md border border-slate-800/70 rounded-3xl p-6 md:p-8 shadow-2xl"
        style={{
          boxShadow: `0 32px 65px ${hexToRgba(serviceTheme.primary, 0.1)}`
        }}
        role="region"
        aria-label="Formulario de información del cliente"
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{ 
              background: primaryGradient,
              boxShadow: `0 8px 24px ${hexToRgba(serviceTheme.primary, 0.4)}`
            }}
            aria-hidden="true"
          >
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Asistente de Bienvenida</h3>
            <p className="text-sm text-slate-400">
              Te guiamos paso a paso para preparar tu consulta estratégica
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Progreso {currentField}/{fieldsConfig.length}
              </span>
              <span className="text-xs text-slate-500">{Math.round(progressPercent)}%</span>
            </div>
            <div 
              className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progreso del formulario: ${Math.round(progressPercent)}% completado`}
            >
              <motion.div
                className="h-full"
                style={{ background: primaryGradient }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          {completedFields.length > 0 && (
            <div className="space-y-2">
              {completedFields.map((field) => (
              <motion.div 
                  key={field.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-slate-500">{field.summaryLabel}</span>
                    <span className="text-slate-200 mt-1">{watchedValues[field.name]}</span>
                  </div>
                  <CheckCircle 
                    className="w-4 h-4" 
                    style={{ color: serviceTheme.primary }}
                    aria-hidden="true"
                  />
                </motion.div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitField} className="space-y-4">
            <AnimatePresence mode="wait">
              {activeField && (
                <motion.div
                  key={activeField.name}
                  variants={stepContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-3"
                >
                  <motion.h4 
                    className="text-xl font-bold text-white" 
                    variants={stepItemVariants}
                    id={`question-${activeField.name}`}
                  >
                    {activeField.question}
                  </motion.h4>

                  {activeField.helper && (
                    <motion.p className="text-xs text-slate-400" variants={stepItemVariants}>
                      {activeField.helper}
                    </motion.p>
                  )}

                  <motion.div variants={stepItemVariants}>
                    <label 
                      htmlFor={`input-${activeField.name}`}
                      className="sr-only"
                    >
                      {activeField.question}
                    </label>
                    {activeField.isTextArea ? (
                      <textarea
                        {...getRegisterProps(activeField)}
                        id={`input-${activeField.name}`}
                        rows={4}
                        onKeyDown={handleDescriptionKeyDown}
                        placeholder={activeField.placeholder}
                        aria-label={activeField.question}
                        aria-describedby={activeField.helper ? `helper-${activeField.name}` : errors[activeField.name] ? `error-${activeField.name}` : undefined}
                        aria-invalid={!!errors[activeField.name]}
                        aria-required={!activeField.optional}
                        className="w-full rounded-2xl border bg-slate-900/60 px-4 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 transition-all"
                        style={{
                          borderColor: errors[activeField.name] 
                            ? '#f43f5e' 
                            : 'rgba(148, 163, 184, 0.3)',
                          '--focus-ring-color': hexToRgba(serviceTheme.primary, 0.4),
                        } as React.CSSProperties & { '--focus-ring-color': string }}
                        onFocus={(e) => {
                          if (!errors[activeField.name]) {
                            e.target.style.borderColor = serviceTheme.primary;
                            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(serviceTheme.primary, 0.2)}`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors[activeField.name] 
                            ? '#f43f5e' 
                            : 'rgba(148, 163, 184, 0.3)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    ) : (
                      <input
                        {...getRegisterProps(activeField)}
                        id={`input-${activeField.name}`}
                        type={activeField.type || 'text'}
                        placeholder={activeField.placeholder}
                        autoComplete={activeField.autoComplete}
                        aria-label={activeField.question}
                        aria-describedby={activeField.helper ? `helper-${activeField.name}` : errors[activeField.name] ? `error-${activeField.name}` : undefined}
                        aria-invalid={!!errors[activeField.name]}
                        aria-required={!activeField.optional}
                        className="w-full rounded-2xl border bg-slate-900/60 px-4 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 transition-all"
                        style={{
                          borderColor: errors[activeField.name] 
                            ? '#f43f5e' 
                            : 'rgba(148, 163, 184, 0.3)',
                          '--focus-ring-color': hexToRgba(serviceTheme.primary, 0.4),
                        } as React.CSSProperties & { '--focus-ring-color': string }}
                        onFocus={(e) => {
                          if (!errors[activeField.name]) {
                            e.target.style.borderColor = serviceTheme.primary;
                            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(serviceTheme.primary, 0.2)}`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors[activeField.name] 
                            ? '#f43f5e' 
                            : 'rgba(148, 163, 184, 0.3)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    )}
                    {activeField.helper && !errors[activeField.name] && (
                      <p 
                        id={`helper-${activeField.name}`}
                        className="text-xs text-slate-400 mt-1"
                      >
                        {activeField.helper}
                      </p>
                    )}
                  </motion.div>

                  {errors[activeField.name] && (
                    <motion.p
                      id={`error-${activeField.name}`}
                      className="text-sm text-rose-400"
                      variants={stepItemVariants}
                      role="alert"
                      aria-live="polite"
                    >
                      {errors[activeField.name]?.message as string}
                    </motion.p>
                  )}

                  <motion.p className="text-xs text-slate-500" variants={stepItemVariants}>
                    Presiona <span className="text-slate-200 font-semibold">Enter</span> para continuar
                    {activeField.isTextArea && ' · Usa Shift + Enter para saltos de línea'}
                  </motion.p>
              </motion.div>
            )}
            </AnimatePresence>
          </form>

          {(isConvenioValido || isAdminValido) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
              className="flex items-start gap-2 rounded-2xl border px-4 py-3 text-xs"
              style={{
                borderColor: hexToRgba(serviceTheme.primary, 0.3),
                background: hexToRgba(serviceTheme.primary, 0.1),
                color: hexToRgba(serviceTheme.primary, 0.95),
              }}
            >
              <Sparkles className="w-4 h-4 mt-0.5" aria-hidden="true" />
              <div>
                {isAdminValido ? (
                  <span className="font-medium">Código admin válido · Precio especial $1.000 aplicado.</span>
                ) : (
                  <span className="font-medium">Código de convenio válido · Descuento del 80% aplicado.</span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const stepContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

const stepItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

export default Step1_ClientInfo;
