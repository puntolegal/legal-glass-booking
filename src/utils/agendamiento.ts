// RUTA: src/utils/agendamiento.ts

import type { Service, FormData, PriceCalculation } from '@/types/agendamiento';

const CODIGO_CONVENIO_VALIDO = "PUNTOLEGAL!";
const CODIGO_ADMIN_VALIDO = "PUNTOLEGALADMIN";
const DESCUENTO_CONVENIO = 0.8; // 80% de descuento
const PRECIO_ADMIN = 1000; // Precio fijo para código admin

/**
 * Formatea un RUT chileno automáticamente
 */
export const formatRUT = (value: string): string => {
  const cleanValue = value.replace(/[^0-9kK]/g, '');
  
  if (!cleanValue) return '';
  
  if (cleanValue.length <= 8) {
    return cleanValue;
  }
  
  if (cleanValue.length >= 9) {
    const rut = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1).toUpperCase();
    const formattedRut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedRut}-${dv}`;
  }
  
  return cleanValue;
};

/**
 * Valida un código de convenio
 */
export const validateConvenioCode = (codigo: string): { isConvenio: boolean; isAdmin: boolean } => {
  return {
    isConvenio: codigo === CODIGO_CONVENIO_VALIDO,
    isAdmin: codigo === CODIGO_ADMIN_VALIDO,
  };
};

/**
 * Calcula el precio final basado en el servicio y códigos de convenio
 */
export const calculatePrice = (service: Service, formData: FormData): PriceCalculation => {
  const { isConvenio, isAdmin } = validateConvenioCode(formData.codigoConvenio);
  const precioOriginal = parseFloat(service.price?.replace(/\./g, '') || '0');
  
  let precioConConvenio = 0;
  let precioFinal: string;
  
  if (isAdmin) {
    precioFinal = PRECIO_ADMIN.toLocaleString('es-CL');
  } else if (isConvenio) {
    precioConConvenio = precioOriginal * (1 - DESCUENTO_CONVENIO);
    precioFinal = Math.round(precioConConvenio).toLocaleString('es-CL');
  } else {
    precioFinal = precioOriginal.toLocaleString('es-CL');
  }
  
  return {
    precioOriginal,
    precioConConvenio,
    precioFinal,
    isConvenioValido: isConvenio,
    isAdminValido: isAdmin,
  };
};

/**
 * Obtiene los colores del servicio según su categoría
 */
export const getServiceColors = (category: string) => {
  const colorMap: Record<string, { bg: string; darkBg: string; text: string; darkText: string; color: string }> = {
    'General': {
      bg: 'bg-blue-100',
      darkBg: 'dark:bg-blue-900/30',
      text: 'text-blue-600',
      darkText: 'dark:text-blue-400',
      color: '#3b82f6',
    },
    'Familia': {
      bg: 'bg-pink-100',
      darkBg: 'dark:bg-pink-900/30',
      text: 'text-pink-600',
      darkText: 'dark:text-pink-400',
      color: '#ec4899',
    },
    'Corporativo': {
      bg: 'bg-indigo-100',
      darkBg: 'dark:bg-indigo-900/30',
      text: 'text-indigo-600',
      darkText: 'dark:text-indigo-400',
      color: '#6366f1',
    },
    'Laboral': {
      bg: 'bg-orange-100',
      darkBg: 'dark:bg-orange-900/30',
      text: 'text-orange-600',
      darkText: 'dark:text-orange-400',
      color: '#f97316',
    },
    'Inmobiliario': {
      bg: 'bg-green-100',
      darkBg: 'dark:bg-green-900/30',
      text: 'text-green-600',
      darkText: 'dark:text-green-400',
      color: '#22c55e',
    },
  };
  
  return colorMap[category] || colorMap['General'];
};

/**
 * Genera fechas disponibles (próximos 30 días)
 */
export const getAvailableDates = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

/**
 * Genera horarios disponibles
 */
export const getAvailableTimes = (): string[] => {
  return [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30'
  ];
};

