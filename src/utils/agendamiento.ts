// RUTA: src/utils/agendamiento.ts

import type { Service, FormData, PriceCalculation } from '@/types/agendamiento';
import { getServiceTheme } from '@/config/serviceThemes';

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
 * Colores de UI del flujo agendamiento.
 * El acento (`color`) sigue el mismo tema que las auroras / CTAs (`getServiceTheme`),
 * alineado al color del botón/tarjeta del landing cuando existe `plan` en la URL.
 */
export const getServiceColors = (category: string, plan?: string | null) => {
  const theme = getServiceTheme(plan || undefined, category);
  return {
    bg: 'slate-100',
    darkBg: 'slate-900/30',
    text: 'slate-600',
    darkText: 'slate-300',
    color: theme.accent,
  };
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

