// =====================================================
// SCRIPT DEFINITIVO: CORREGIR CREACIÓN DE RESERVAS EN EL NAVEGADOR
// =====================================================
// Este script intercepta y corrige las llamadas de creación de reservas
// para que funcionen con user_id correcto

console.log('🔧 Aplicando corrección definitiva para creación de reservas...');

// Función para interceptar fetch requests a Supabase
function interceptSupabaseRequests() {
  console.log('🔄 Interceptando requests de Supabase...');
  
  const originalFetch = window.fetch;
  
  window.fetch = async function(url, options) {
    // Verificar si es una llamada a Supabase para insertar reservas
    if (url.includes('qrgelocijmwnxcckxbdg.supabase.co') && 
        url.includes('/rest/v1/reservas') && 
        options && 
        options.method === 'POST') {
      
      console.log('🎯 Interceptando creación de reserva...');
      
      try {
        // Parsear el body para modificar user_id
        let bodyData;
        if (typeof options.body === 'string') {
          bodyData = JSON.parse(options.body);
        } else {
          bodyData = options.body;
        }
        
        // Si es un array (insert múltiple)
        if (Array.isArray(bodyData)) {
          bodyData.forEach(item => {
            if (item.user_id === 'anonymous' || !item.user_id) {
              console.log('🔧 Corrigiendo user_id de anonymous a migration_placeholder');
              item.user_id = 'migration_placeholder';
            }
          });
        } else if (bodyData.user_id === 'anonymous' || !bodyData.user_id) {
          // Si es un objeto (insert simple)
          console.log('🔧 Corrigiendo user_id de anonymous a migration_placeholder');
          bodyData.user_id = 'migration_placeholder';
        }
        
        // Actualizar el body con los datos corregidos
        options.body = JSON.stringify(bodyData);
        
        console.log('✅ Request corregido, enviando a Supabase...');
        
      } catch (error) {
        console.error('❌ Error procesando request:', error);
      }
    }
    
    // Ejecutar la llamada original
    return originalFetch.call(this, url, options);
  };
  
  console.log('✅ Interceptor de Supabase instalado');
}

// Función para reemplazar funciones específicas de creación de reservas
function replaceReservationFunctions() {
  console.log('🔄 Reemplazando funciones de creación de reservas...');
  
  // Función corregida para crear reserva
  async function createReservationFixed(reservationData) {
    console.log('🚀 Creando reserva con corrección aplicada...');
    
    try {
      const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';
      
      // Asegurar que user_id sea correcto
      const correctedData = {
        ...reservationData,
        user_id: 'migration_placeholder'
      };
      
      console.log('📋 Datos corregidos:', correctedData);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify([correctedData])
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Reserva creada exitosamente:', data[0]?.id);
        return data[0];
      } else {
        const error = await response.text();
        console.error('❌ Error creando reserva:', error);
        throw new Error(error);
      }
      
    } catch (error) {
      console.error('❌ Error en createReservationFixed:', error);
      throw error;
    }
  }
  
  // Función corregida para crear reserva con email
  async function createBookingWithRealEmailFixed(bookingData) {
    console.log('📦 Creando reserva con email real (CORREGIDA)...');
    
    try {
      // Crear reserva usando la función corregida
      const reservaData = {
        nombre: bookingData.cliente?.nombre || bookingData.nombre,
        email: bookingData.cliente?.email || bookingData.email,
        telefono: bookingData.cliente?.telefono || bookingData.telefono,
        rut: bookingData.cliente?.rut || bookingData.rut || 'No especificado',
        servicio: bookingData.servicio?.tipo || bookingData.servicio,
        precio: bookingData.servicio?.precio || bookingData.precio,
        tipo_reunion: bookingData.servicio?.tipoReunion || bookingData.tipo_reunion || 'online',
        fecha: bookingData.servicio?.fecha || bookingData.fecha,
        hora: bookingData.servicio?.hora || bookingData.hora,
        user_id: 'migration_placeholder', // CORREGIDO
        descripcion: bookingData.descripcion || bookingData.motivoConsulta || 'Consulta legal',
        estado: 'pendiente'
      };
      
      const reserva = await createReservationFixed(reservaData);
      
      console.log('✅ Reserva creada exitosamente:', reserva.id);
      
      return {
        success: true,
        reserva: {
          id: reserva.id,
          nombre: reserva.nombre,
          email: reserva.email,
          telefono: reserva.telefono,
          servicio: reserva.servicio,
          precio: reserva.precio,
          fecha: reserva.fecha,
          hora: reserva.hora,
          estado: reserva.estado,
          created_at: reserva.created_at
        },
        externalReference: reserva.id
      };
      
    } catch (error) {
      console.error('❌ Error en createBookingWithRealEmailFixed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Reemplazar funciones globales si existen
  if (typeof window !== 'undefined') {
    window.createReservationFixed = createReservationFixed;
    window.createBookingWithRealEmailFixed = createBookingWithRealEmailFixed;
    
    console.log('🛠️ Funciones corregidas disponibles:');
    console.log('• createReservationFixed() - Crear reserva CORREGIDA');
    console.log('• createBookingWithRealEmailFixed() - Crear reserva con email CORREGIDA');
  }
}

// Función principal
function applyReservationFix() {
  console.log('🔧 Aplicando corrección definitiva para reservas...');
  
  // Instalar interceptor de fetch
  interceptSupabaseRequests();
  
  // Reemplazar funciones específicas
  replaceReservationFunctions();
  
  console.log('✅ Corrección aplicada. Todas las creaciones de reservas ahora usan user_id correcto.');
  console.log('🎯 Puedes probar creando una nueva reserva desde la interfaz.');
}

// Aplicar la corrección
applyReservationFix();

console.log('✅ Script de corrección de reservas aplicado exitosamente.');
