export interface PendingPaymentData {
  id: string;
  reservationId?: string;
  external_reference?: string;
  nombre: string;
  email: string;
  telefono: string;
  service: string;
  category: string;
  description?: string;
  price: number;
  priceFormatted: string;
  originalPrice?: number | null;
  fecha: string;
  hora: string;
  tipo_reunion: string;
  codigoConvenio?: string | null;
  descuentoConvenio?: boolean;
  porcentajeDescuento?: string | null;
  method?: string | null;
  preferenceId?: string | null;
  timestamp: number;
}

export interface MercadoPagoMetadata {
  reservation_id?: string;
  service_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  codigo_convenio?: string | null;
  descuento_convenio?: boolean;
  precio_original?: number | null;
  porcentaje_descuento?: string | null;
}
