import type { PendingPaymentData } from '@/types/payments';

const currencyFormatter = new Intl.NumberFormat('es-CL');

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      return null;
    }
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (value && typeof value === 'object' && 'amount' in (value as Record<string, unknown>)) {
    return toNumber((value as Record<string, unknown>).amount);
  }
  return null;
};

const toStringValue = (value: unknown, fallback?: string): string | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return fallback;
};

export const ensurePriceFormatted = (data: PendingPaymentData): string => {
  return data.priceFormatted || currencyFormatter.format(Math.max(0, Math.round(data.price)));
};

export const parsePendingPaymentData = (rawData: string): PendingPaymentData => {
  const parsed = JSON.parse(rawData) as Record<string, unknown>;
  const cliente = typeof parsed.cliente === 'object' && parsed.cliente !== null
    ? (parsed.cliente as Record<string, unknown>)
    : undefined;

  const nombre = toStringValue(parsed.nombre) ?? toStringValue(cliente?.nombre) ?? 'Cliente';
  const email = toStringValue(parsed.email) ?? toStringValue(cliente?.email) ?? 'cliente@ejemplo.com';
  const telefono = toStringValue(parsed.telefono) ?? toStringValue(cliente?.telefono) ?? 'No especificado';

  const priceValue = toNumber(parsed.price);
  
  // Validación más flexible para localStorage (solo fallback)
  if (!parsed.id || priceValue === null) {
    console.warn('⚠️ localStorage data incomplete - using fallback values');
    // Usar valores por defecto en lugar de fallar
    return {
      id: String(parsed.id || 'fallback'),
      reservationId: String(parsed.reservationId || parsed.id || 'fallback'),
      external_reference: parsed.external_reference ? String(parsed.external_reference) : undefined,
      nombre: nombre,
      email: email,
      telefono: telefono,
      service: toStringValue(parsed.service) ?? 'Consulta Legal',
      category: toStringValue(parsed.category) ?? 'General',
      description: toStringValue(parsed.description),
      price: priceValue || 35000, // Valor por defecto
      priceFormatted: currencyFormatter.format(priceValue || 35000),
      originalPrice: originalPrice || 35000,
      fecha: toStringValue(parsed.fecha) ?? new Date().toISOString().split('T')[0],
      hora: toStringValue(parsed.hora) ?? '10:00',
      date: toStringValue(parsed.fecha) ?? new Date().toISOString().split('T')[0],
      time: toStringValue(parsed.hora) ?? '10:00',
      tipo_reunion: toStringValue(parsed.tipo_reunion) ?? 'online',
      codigoConvenio: parsed.codigoConvenio ? String(parsed.codigoConvenio) : null,
      descuentoConvenio: typeof parsed.descuentoConvenio === 'boolean' ? parsed.descuentoConvenio : false,
      porcentajeDescuento: toStringValue(parsed.porcentajeDescuento) ?? null,
      method: toStringValue(parsed.method) ?? null,
      preferenceId: parsed.preferenceId ? String(parsed.preferenceId) : null,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now()
    };
  }

  const priceFormatted = toStringValue(parsed.priceFormatted)
    ?? currencyFormatter.format(Math.max(0, Math.round(priceValue)));

  const originalPrice = toNumber(parsed.originalPrice);

  return {
    id: String(parsed.id),
    reservationId: parsed.reservationId ? String(parsed.reservationId) : undefined,
    external_reference: parsed.external_reference ? String(parsed.external_reference) : undefined,
    nombre,
    email,
    telefono,
    service: toStringValue(parsed.service) ?? 'Consulta Legal',
    category: toStringValue(parsed.category) ?? 'General',
    description: toStringValue(parsed.description),
    price: priceValue,
    priceFormatted,
    originalPrice,
    fecha: toStringValue(parsed.fecha) ?? new Date().toISOString().split('T')[0],
    hora: toStringValue(parsed.hora) ?? '10:00',
    date: toStringValue(parsed.fecha) ?? new Date().toISOString().split('T')[0], // For compatibility
    time: toStringValue(parsed.hora) ?? '10:00', // For compatibility
    tipo_reunion: toStringValue(parsed.tipo_reunion) ?? 'online',
    codigoConvenio: parsed.codigoConvenio ? String(parsed.codigoConvenio) : null,
    descuentoConvenio: typeof parsed.descuentoConvenio === 'boolean' ? parsed.descuentoConvenio : false,
    porcentajeDescuento: toStringValue(parsed.porcentajeDescuento) ?? null,
    method: toStringValue(parsed.method) ?? null,
    preferenceId: parsed.preferenceId ? String(parsed.preferenceId) : null,
    timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : Date.now()
  };
};
