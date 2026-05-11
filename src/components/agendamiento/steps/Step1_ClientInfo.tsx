// RUTA: src/components/agendamiento/steps/Step1_ClientInfo.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAgendamiento } from '@/contexts/AgendamientoContext';
import { validationRules } from '@/hooks/useFormValidation';
import { getServiceTheme } from '@/config/serviceThemes';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { saveAgendamientoIntake } from '@/services/agendamientoIntakeService';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import type { FormData } from '@/types/agendamiento';

const Step1_ClientInfo: React.FC = () => {
  const {
    form,
    service,
    serviceColor,
    setStep,
    formatRUT,
    priceCalculation,
    setAgendamientoIntakeId,
  } = useAgendamiento();

  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const { theme } = useTheme();

  // Tema dinámico — alineado con el accent del Plan PDF de la card
  const serviceTheme = useMemo(
    () => getServiceTheme(plan, service.category),
    [plan, service.category],
  );
  
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

  /** Mismo acento neutro que ACCENT_DEPTH en ServicesSection (slate-700) — CTA modo claro */
  const lightPrimaryCtaRgb = '51 65 85';
  
  const {
    register,
    trigger,
    setFocus,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Prellenar email desde URL params (viene del Quiz)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    
    if (emailFromUrl) {
      setValue('email', emailFromUrl, { shouldValidate: true, shouldDirty: true });
    }
  }, [setValue]);

  const watchedValues = watch();
  const { isConvenioValido, isAdminValido } = priceCalculation;
  const [isSavingIntake, setIsSavingIntake] = useState(false);
  
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
      autoComplete: 'off',
      rules: validationRules.rut,
          },
    {
      name: 'empresa',
      question: '¿Representas a alguna empresa o proyecto? (opcional)',
      placeholder: 'Mi Empresa SpA',
      type: 'text',
      summaryLabel: 'Empresa',
      autoComplete: 'organization',
      optional: true,
    },
    {
      name: 'codigoConvenio',
      question: '¿Tienes un código de convenio o invitación? (opcional)',
      placeholder: 'Código especial',
      type: 'text',
      summaryLabel: 'Convenio',
      autoComplete: 'off',
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
      autoComplete: 'off',
      helper: 'Puedes usar Shift + Enter para añadir saltos de línea.',
      rules: validationRules.descripcion,
          },
  ], [watchedValues.nombre]);

  // Verificar si todos los campos requeridos están completos
  const requiredFieldsComplete = useMemo(() => {
    const requiredFields = fieldsConfig.filter(f => !f.optional);
    return requiredFields.every(field => {
      const value = watchedValues[field.name];
      return value && value.toString().trim().length > 0 && !errors[field.name];
    });
  }, [fieldsConfig, watchedValues, errors]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validar todos los campos requeridos
    const requiredFields = fieldsConfig.filter(f => !f.optional);
    let allValid = true;
    
    for (const field of requiredFields) {
      const isValid = await trigger(field.name);
      if (!isValid) {
        allValid = false;
      }
    }
    
    if (allValid) {
      const vals = form.getValues();
      setIsSavingIntake(true);
      try {
        const saved = await saveAgendamientoIntake({
          form: vals,
          planSlug: plan || 'general',
          serviceName: service.name,
          category: service.category,
          precioIndicativo: priceCalculation.precioFinal,
        });
        if (saved.success && saved.id) {
          setAgendamientoIntakeId(saved.id);
          setStep(2);
        } else {
          // No bloquear el embudo: el comentario del servicio indica degradación si Supabase falla
          console.warn('[Step1] agendamiento_intakes insert falló:', saved.error);
          toast.warning(
            'No pudimos guardar tus datos ahora. Puedes seguir con la reserva; si esto se repite, escríbenos por WhatsApp.',
            { duration: 6500 },
          );
          setAgendamientoIntakeId(null);
          setStep(2);
        }
      } finally {
        setIsSavingIntake(false);
      }
    }
  };

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

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6 pb-20 md:pb-6 relative z-10"
    >
      <div 
        className={`rounded-[1.75rem] p-4 md:p-8 relative z-10 shadow-xl ${
          theme === 'light' ? 'glass-ios-panel-light' : 'glass-ios-panel-dark'
        }`}
        style={{
          boxShadow: `0 32px 65px ${hexToRgba(serviceTheme.primary, 0.08)}`
        }}
        role="region"
        aria-label="Formulario de información del cliente"
      >
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-6">
          <div 
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ 
              background: serviceTheme.gradient,
              boxShadow: `0 8px 24px ${hexToRgba(serviceTheme.accent, 0.3)}`
            }}
            aria-hidden="true"
          >
            <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            {plan === 'inmobiliario-eval' ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                  Asesoría de cortesía · orientación previa
                </p>
                <h3 className="text-base font-bold text-slate-900 dark:text-white md:text-xl">
                  Completa tus datos para agendar por Google Meet
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 md:text-xs md:text-sm">
                  Evaluación inmobiliaria Sector Oriente — sin costo en esta primera sesión orientativa. No reemplaza estudio
                  de títulos completo.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white">Asistente de Bienvenida</h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 hidden md:block">
                  Te guiamos paso a paso para preparar tu consulta estratégica
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-4 md:space-y-6">
          {/* Encabezado */}
          <div>
            <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">
              Información de contacto
            </h4>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
              Completa todos los campos para continuar. Tu navegador puede autocompletar esta información automáticamente.
            </p>
          </div>

          {/* Formulario con todos los campos visibles - Optimizado para autocompletar del navegador */}
          <form 
            onSubmit={handleFormSubmit} 
            className="space-y-3 md:space-y-4"
            autoComplete="on"
            name="agendamiento-form"
            id="agendamiento-form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {fieldsConfig.map((field) => {
                const isFieldValid = watchedValues[field.name] && !errors[field.name];
                const fieldSpan = field.isTextArea ? 'md:col-span-2' : '';
                
                return (
                  <div key={field.name} className={fieldSpan}>
                    <label 
                      htmlFor={`input-${field.name}`}
                      className="block text-sm font-semibold text-slate-800 dark:text-white mb-2"
                    >
                      {field.summaryLabel}
                      {!field.optional && <span className="text-rose-400 ml-1">*</span>}
                    </label>
                    
                    {field.isTextArea ? (
                      <textarea
                        {...getRegisterProps(field)}
                        id={`input-${field.name}`}
                        name={field.name}
                        rows={4}
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete || 'off'}
                        aria-label={field.question}
                        aria-describedby={field.helper ? `helper-${field.name}` : errors[field.name] ? `error-${field.name}` : undefined}
                        aria-invalid={!!errors[field.name]}
                        aria-required={!field.optional}
                        className="w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:ring-2 transition-all resize-none dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500"
                        style={{
                          borderColor: errors[field.name] 
                            ? '#f43f5e' 
                            : isFieldValid
                            ? '#10b981'
                            : 'rgba(148, 163, 184, 0.3)',
                        }}
                        onFocus={(e) => {
                          if (!errors[field.name]) {
                            e.target.style.borderColor = serviceTheme.primary;
                            e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(serviceTheme.primary, 0.2)}`;
                          }
                        }}
                        onBlur={async (e) => {
                          if (field.rules) {
                            await trigger(field.name);
                          }
                          e.target.style.borderColor = errors[field.name] 
                            ? '#f43f5e' 
                            : isFieldValid
                            ? '#10b981'
                            : 'rgba(148, 163, 184, 0.3)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    ) : (
                      <div className="relative">
                        <input
                          {...getRegisterProps(field)}
                          id={`input-${field.name}`}
                          name={field.name}
                          type={field.type || 'text'}
                          inputMode={field.name === 'telefono' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                          placeholder={field.placeholder}
                          autoComplete={field.autoComplete || 'off'}
                          aria-label={field.question}
                          aria-describedby={field.helper ? `helper-${field.name}` : errors[field.name] ? `error-${field.name}` : undefined}
                          aria-invalid={!!errors[field.name]}
                          aria-required={!field.optional}
                          className="w-full rounded-xl border bg-white px-4 py-3 pr-12 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:ring-2 transition-all dark:bg-slate-900/60 dark:text-white dark:placeholder-slate-500"
                          style={{
                            borderColor: errors[field.name] 
                              ? '#f43f5e' 
                              : isFieldValid
                              ? '#10b981'
                              : 'rgba(148, 163, 184, 0.3)',
                          }}
                          onFocus={(e) => {
                            if (!errors[field.name]) {
                              e.target.style.borderColor = serviceTheme.primary;
                              e.target.style.boxShadow = `0 0 0 2px ${hexToRgba(serviceTheme.primary, 0.2)}`;
                            }
                          }}
                          onBlur={async (e) => {
                            if (field.rules) {
                              await trigger(field.name);
                            }
                            e.target.style.borderColor = errors[field.name] 
                              ? '#f43f5e' 
                              : isFieldValid
                              ? '#10b981'
                              : 'rgba(148, 163, 184, 0.3)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                        {isFieldValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {field.helper && !errors[field.name] && (
                      <p 
                        id={`helper-${field.name}`}
                        className="text-xs text-slate-600 dark:text-slate-400 mt-1"
                      >
                        {field.helper}
                      </p>
                    )}
                    
                    {errors[field.name] && (
                      <p
                        id={`error-${field.name}`}
                        className="text-sm text-rose-400 mt-1"
                        role="alert"
                        aria-live="polite"
                      >
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botón Continuar - Optimizado para móvil */}
            <motion.button
              type="submit"
              disabled={!requiredFieldsComplete || isSavingIntake}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full min-h-[56px] md:min-h-[52px] rounded-xl font-bold text-base md:text-base flex items-center justify-center gap-2 transition-all duration-200 mt-4 md:mt-6 ${
                requiredFieldsComplete
                  ? theme === 'light'
                    ? 'agendamiento-primary-cta cta-shimmer shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    : 'shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={
                requiredFieldsComplete
                  ? theme === 'light'
                    ? ({ ['--agenda-card-accent']: lightPrimaryCtaRgb } as React.CSSProperties)
                    : {
                        background: primaryGradient,
                        boxShadow: `0 12px 32px ${hexToRgba(serviceTheme.primary, 0.5)}`,
                      }
                  : {
                      background: 'rgba(148, 163, 184, 0.2)',
                      color: 'rgba(148, 163, 184, 0.5)',
                    }
              }
            >
              {isSavingIntake ? (
                <span className="text-white text-base font-bold">Guardando…</span>
              ) : requiredFieldsComplete ? (
                <>
                  <span className="text-white text-base md:text-base font-bold">Continuar a seleccionar fecha</span>
                  <ArrowRight className="w-5 h-5 md:w-5 md:h-5 text-white flex-shrink-0" />
                </>
              ) : (
                <span className="text-sm md:text-base">Completa los campos requeridos para continuar</span>
              )}
            </motion.button>
          </form>

          {/* Botón "Tienes dudas" — usa helper centralizado de WhatsApp */}
          <a
            href={buildWhatsAppUrl('agendando')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 px-5 py-3 backdrop-blur-xl transition-colors hover:bg-slate-100/90 group mt-4 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style={{ backgroundColor: '#25D366', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)' }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors dark:text-slate-300 dark:group-hover:text-white">¿Tienes dudas?</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Habla con un abogado antes de agendar</p>
            </div>
          </a>

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

export default Step1_ClientInfo;
