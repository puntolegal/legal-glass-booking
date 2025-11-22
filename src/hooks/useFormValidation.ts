// RUTA: src/hooks/useFormValidation.ts

/**
 * Reglas de validación personalizadas para react-hook-form
 */

export const validationRules = {
  nombre: {
    required: 'El nombre es requerido',
    minLength: {
      value: 3,
      message: 'El nombre debe tener al menos 3 caracteres'
    },
    pattern: {
      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      message: 'El nombre solo puede contener letras'
    }
  },
  
  email: {
    required: 'El email es requerido',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Por favor ingresa un email válido'
    }
  },
  
  telefono: {
    required: 'El teléfono es requerido',
    pattern: {
      value: /^[\d\s\+\-\(\)]+$/,
      message: 'Por favor ingresa un teléfono válido'
    },
    validate: (value: string) => {
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 8 || 'El teléfono debe tener al menos 8 dígitos';
    }
  },
  
  rut: {
    required: 'El RUT es requerido',
    pattern: {
      value: /^[\d\.]+-?[0-9kK]?$/,
      message: 'Formato de RUT inválido (ej: 12345678-9)'
    },
    validate: (value: string) => {
      const rutClean = value.replace(/\./g, '').replace(/-/g, '');
      return (rutClean.length >= 8 && rutClean.length <= 10) 
        || 'Ingresa un RUT válido';
    }
  },
  
  descripcion: {
    maxLength: {
      value: 500,
      message: 'La descripción no puede exceder 500 caracteres'
    }
  }
};








