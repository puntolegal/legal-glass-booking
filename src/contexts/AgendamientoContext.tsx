// RUTA: src/contexts/AgendamientoContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, UseFormReturn } from 'react-hook-form';
import { createBookingWithRealEmail, type BookingData } from '@/services/supabaseBooking';
import { supabase } from '@/integrations/supabase/client';
import { createOfflineBookingWithEmail, type OfflineBookingData } from '@/services/offlineBooking';
import { checkSupabaseConnection } from '@/integrations/supabase/client';
import type { PendingPaymentData } from '@/types/payments';
import type { Service, FormData, BookingState } from '@/types/agendamiento';
import { calculatePrice, formatRUT, getServiceColors } from '@/utils/agendamiento';
import { serviceCatalog } from '@/constants/services';
import { validationRules } from '@/hooks/useFormValidation';

interface AgendamientoContextType extends BookingState {
  service: Service;
  serviceColors: ReturnType<typeof getServiceColors>;
  serviceColor: string;
  priceCalculation: ReturnType<typeof calculatePrice>;
  form: UseFormReturn<FormData>;
  setStep: (step: number) => void;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  updateFormField: (field: keyof FormData, value: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setSelectedMeetingType: (type: 'videollamada' | 'telefonica' | 'presencial') => void;
  handleBookingAndPayment: () => Promise<void>;
  formatRUT: (value: string) => string;
  goToPayment: () => void;
}

const AgendamientoContext = createContext<AgendamientoContextType | undefined>(undefined);

interface AgendamientoProviderProps {
  children: ReactNode;
  initialService?: Service;
}

// Componente interno para manejar useSearchParams
const AgendamientoProviderInner: React.FC<{ children: ReactNode; initialService?: Service }> = ({ 
  children, 
  initialService 
}) => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'general';
  const debug = searchParams.get('debug');
  const isDebugStep2 = debug === 'step2';
  const service = initialService || serviceCatalog[plan as keyof typeof serviceCatalog] || serviceCatalog.general;
  
  const [step, setStep] = useState(isDebugStep2 ? 2 : 1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState<'videollamada' | 'telefonica' | 'presencial'>('videollamada');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // React Hook Form para manejo optimizado del formulario
  const form = useForm<FormData>({
    mode: 'onChange', // Validación en tiempo real
    defaultValues: isDebugStep2
      ? {
          nombre: 'Cliente Test',
          email: 'cliente-test@puntolegal.cl',
          telefono: '+56 9 1234 5678',
          rut: '12345678-9',
          empresa: 'Empresa Test SpA',
          descripcion: 'Caso de prueba para el flujo de agendamiento.',
          codigoConvenio: ''
        }
      : {
          nombre: '',
          email: '',
          telefono: '',
          rut: '',
          empresa: '',
          descripcion: '',
          codigoConvenio: ''
        }
  });
  
  // Sincronizar formData con react-hook-form
  const formData = form.watch();
  
  // Calcular precio
  const priceCalculation = calculatePrice(service, formData);
  const serviceColors = getServiceColors(service.category);
  
  // Actualizar campo específico del formulario (compatible con react-hook-form)
  const updateFormField = useCallback((field: keyof FormData, value: string) => {
    form.setValue(field, value, { shouldValidate: true, shouldDirty: true });
  }, [form]);
  
  // Compatibilidad con código legacy
  const setFormData = useCallback((data: FormData | ((prev: FormData) => FormData)) => {
    const newData = typeof data === 'function' ? data(formData) : data;
    Object.entries(newData).forEach(([key, value]) => {
      form.setValue(key as keyof FormData, value);
    });
  }, [form, formData]);
  
  // Manejar booking y pago
  const handleBookingAndPayment = useCallback(async () => {
    if (!selectedDate || !selectedTime) {
      setError('Por favor selecciona fecha y hora');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { precioFinal, precioConConvenio, isAdminValido, isConvenioValido, precioOriginal } = priceCalculation;
      
      const originalPriceValue = typeof service.price === 'number'
        ? service.price
        : Number(service.price) || null;
      
      const externalReference = `PL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const normalizePrice = (value: unknown) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          const numeric = Number(value.replace(/[^0-9.-]/g, ''));
          return Number.isFinite(numeric) ? numeric : 0;
        }
        return 0;
      };
      const normalizedPriceForPayment = isAdminValido
        ? 1000
        : isConvenioValido
          ? Math.round(precioConConvenio)
          : normalizePrice(precioOriginal);
      
      const paymentData: PendingPaymentData = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        service: service.name,
        category: service.category,
        description: formData.descripcion,
        price: normalizedPriceForPayment,
        priceFormatted: precioFinal,
        originalPrice: originalPriceValue,
        fecha: selectedDate,
        hora: selectedTime,
        date: selectedDate,
        time: selectedTime,
        tipo_reunion: selectedMeetingType,
        codigoConvenio: formData.codigoConvenio || null,
        descuentoConvenio: isConvenioValido,
        porcentajeDescuento: isConvenioValido ? '80%' : (service.discount || null),
        method: null,
        preferenceId: null,
        timestamp: Date.now()
      };
      
      // Si el precio es 0, crear reserva directamente (sin pasar por MercadoPago)
      if (precioFinal === '0' || precioConConvenio === 0) {
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
            await supabase
              .from('reservas')
              .update({ external_reference: externalReference })
              .eq('id', result.reserva.id);

            // Ir directo a la página de éxito para reservas gratuitas (marcando como aprobadas)
            window.location.href = `/payment-success?status=approved&external_reference=${encodeURIComponent(
              externalReference
            )}`;
          } else {
            setError('Error al crear la consulta. Por favor intenta nuevamente.');
          }
        } else {
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
          console.log('💾 Reserva offline creada para consulta gratuita:', offlineResult);

          // Preparar datos mínimos para PaymentSuccessPage usando el fallback de localStorage
          const now = Date.now();
          const precioNumber = Number(String(precioFinal).replace(/[^0-9]/g, '')) || 0;
          const paymentDataOffline = {
            id: offlineResult.id,
            reservationId: offlineResult.id,
            external_reference: offlineResult.id,
            nombre: offlineResult.nombre,
            email: offlineResult.email,
            telefono: offlineResult.telefono,
            service: offlineResult.servicio,
            category: offlineResult.categoria || service.category || 'General',
            description: offlineResult.descripcion,
            price: precioNumber || 0,
            priceFormatted: new Intl.NumberFormat('es-CL').format(precioNumber || 0),
            originalPrice: precioNumber || 0,
            fecha: offlineResult.fecha,
            hora: offlineResult.hora,
            date: offlineResult.fecha,
            time: offlineResult.hora,
            tipo_reunion: offlineResult.tipo_reunion || 'online',
            codigoConvenio: null,
            descuentoConvenio: false,
            porcentajeDescuento: null,
            method: 'offline',
            preferenceId: null,
            timestamp: now
          };

          localStorage.setItem('paymentData', JSON.stringify(paymentDataOffline));

          window.location.href = `/payment-success?status=approved&external_reference=${encodeURIComponent(
            offlineResult.id
          )}`;
        }
      } else {
        // Crear reserva primero para obtener el ID y luego abrir directamente MercadoPago
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
          await supabase
            .from('reservas')
            .update({ external_reference: externalReference })
            .eq('id', result.reserva.id);

          const backendUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1';

          const response = await fetch(`${backendUrl}/create-mercadopago-preference`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI'
            },
            body: JSON.stringify({
              paymentData: {
                service: service.name,
                description: `${service.name} - Punto Legal`,
                price: normalizedPriceForPayment,
                name: formData.nombre,
                email: formData.email,
                phone: formData.telefono || '',
                date: selectedDate,
                time: selectedTime,
                external_reference: externalReference || result.reserva.id
              }
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            const friendly = `No pudimos iniciar el pago (HTTP ${response.status}).`;
            console.error('❌ Error backend al crear preferencia:', response.status, errorText);
            setError(`${friendly} Detalle: ${errorText}`);
            throw new Error(`Error creando preferencia de pago: ${errorText}`);
          }

          const preferenceResult = await response.json();

          if (!preferenceResult.success || !preferenceResult.preference_id) {
            console.error('❌ Error en respuesta de preferencia:', preferenceResult);
            setError('Recibimos una respuesta inválida de Mercado Pago. Intenta nuevamente en unos segundos.');
            throw new Error(`Error creando preferencia: ${preferenceResult.error || 'Respuesta inválida'}`);
          }

          try {
            const { updateReservation } = await import('@/services/supabaseBooking');
            await updateReservation(result.reserva.id, {
              preference_id: preferenceResult.preference_id
            });
            console.log('✅ Reserva actualizada con preference_id:', preferenceResult.preference_id);
          } catch (updateError) {
            console.warn('⚠️ No se pudo actualizar la reserva con preference_id:', updateError);
          }

          const isSandboxToken = preferenceResult.live_mode === false;
          const redirectUrl = isSandboxToken ? preferenceResult.sandbox_init_point : preferenceResult.init_point;

          if (!redirectUrl) {
            console.error('❌ No se recibió URL de redirección válida desde la preferencia:', preferenceResult);
            setError('Mercado Pago no entregó un enlace de pago válido. Por favor reintenta.');
            throw new Error('No se recibió URL de pago desde MercadoPago');
          }

          console.log('🚀 Redirigiendo directo a Checkout Pro de MercadoPago...');
          window.location.assign(redirectUrl);
        } else {
          setError('Error al crear la reserva. Por favor intenta nuevamente.');
        }
      }
    } catch (err) {
      console.error('Error en proceso:', err);
      setError(
        `Error al procesar. ${err instanceof Error ? err.message : 'Por favor intenta nuevamente.'}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedTime, selectedMeetingType, formData, service, priceCalculation]);
  
  // Función para ir al paso de pago
  const goToPayment = useCallback(() => {
    if (!selectedDate || !selectedTime || !selectedMeetingType) {
      setError('Por favor completa la selección de fecha y hora');
      return;
    }
    setStep(3);
  }, [selectedDate, selectedTime, selectedMeetingType]);
  
  const value: AgendamientoContextType = {
    step,
    selectedDate,
    selectedTime,
    selectedMeetingType,
    formData,
    isLoading,
    error,
    service,
    serviceColors,
    serviceColor: serviceColors.color,
    priceCalculation,
    form,
    setStep,
    setFormData,
    updateFormField,
    setSelectedDate,
    setSelectedTime,
    setSelectedMeetingType,
    handleBookingAndPayment,
    formatRUT,
    goToPayment,
  };
  
  return (
    <AgendamientoContext.Provider value={value}>
      {children}
    </AgendamientoContext.Provider>
  );
};

export const AgendamientoProvider: React.FC<AgendamientoProviderProps> = (props) => {
  return <AgendamientoProviderInner {...props} />;
};

export const useAgendamiento = (): AgendamientoContextType => {
  const context = useContext(AgendamientoContext);
  if (!context) {
    throw new Error('useAgendamiento debe ser usado dentro de un AgendamientoProvider');
  }
  return context;
};
