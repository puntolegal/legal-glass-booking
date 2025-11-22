// RUTA: src/types/agendamiento.ts

export interface Service {
  name: string;
  price: string;
  category: string;
  originalPrice?: string;
  discount?: string;
  note?: string;
}

export interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  rut: string;
  empresa: string;
  descripcion: string;
  codigoConvenio: string;
}

export interface BookingState {
  step: number;
  selectedDate: string;
  selectedTime: string;
  selectedMeetingType: 'videollamada' | 'telefonica' | 'presencial';
  formData: FormData;
  isLoading: boolean;
  error: string | null;
}

export interface PriceCalculation {
  precioOriginal: number;
  precioConConvenio: number;
  precioFinal: string;
  isConvenioValido: boolean;
  isAdminValido: boolean;
}

