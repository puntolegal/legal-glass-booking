#!/usr/bin/env node

/**
 * Script para debuggear el problema del teléfono en el frontend
 */

import { createClient } from '@supabase/supabase-js';

// Usar las mismas credenciales que el frontend
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1iozmO5fKALjbI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugFrontendTelefono() {
  try {
    console.log('🔍 Debuggeando problema del teléfono en el frontend...');
    
    // Simular exactamente lo que hace el frontend
    const bookingData = {
      cliente: {
        nombre: 'Test Frontend Debug',
        email: 'test@puntolegal.cl',
        telefono: '+569123456789', // 13 caracteres
        rut: '12345678-9'
      },
      servicio: {
        tipo: 'Consulta General',
        precio: '35000',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00:00',
        tipoReunion: 'online'
      },
      descripcion: 'Prueba de debug frontend'
    };
    
    // Aplicar la misma validación que el frontend
    const telefonoValidado = bookingData.cliente.telefono?.trim() || '';
    if (telefonoValidado.length > 50) {
      console.warn('⚠️ Teléfono demasiado largo, truncando a 50 caracteres');
    }
    
    const reservaData = {
      nombre: bookingData.cliente.nombre,
      email: bookingData.cliente.email,
      telefono: telefonoValidado.substring(0, 50), // Limitar a 50 caracteres
      rut: bookingData.cliente.rut || 'No especificado',
      servicio: bookingData.servicio.tipo,
      precio: bookingData.servicio.precio,
      tipo_reunion: bookingData.servicio.tipoReunion || null,
      fecha: bookingData.servicio.fecha,
      hora: bookingData.servicio.hora,
      descripcion: bookingData.descripcion || 'Consulta legal',
      estado: 'pendiente'
    };
    
    console.log('📊 Datos a insertar:', reservaData);
    console.log('📱 Teléfono validado:', telefonoValidado);
    console.log('📏 Longitud del teléfono:', telefonoValidado.length);
    
    // Intentar inserción
    const { data, error } = await supabase
      .from('reservas')
      .insert(reservaData)
      .select();
    
    if (error) {
      console.error('❌ Error insertando:', error);
      
      if (error.message.includes('character varying(12)')) {
        console.log('\\n🔍 CONFIRMADO: El campo telefono está limitado a 12 caracteres');
        console.log('🔧 Aplicando corrección con clave de servicio...');
        
        // Usar clave de servicio para corregir
        const supabaseService = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg');
        
        // Intentar corrección directa
        try {
          const { error: alterError } = await supabaseService
            .rpc('exec_sql', { 
              sql: 'ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);' 
            });
          
          if (alterError) {
            console.error('❌ Error aplicando corrección:', alterError);
            console.log('\\n📝 Ejecuta manualmente en Supabase SQL Editor:');
            console.log('   ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);');
          } else {
            console.log('✅ Corrección aplicada exitosamente');
            
            // Probar nuevamente
            console.log('\\n🧪 Probando nuevamente después de corrección...');
            const { data: testData2, error: testError2 } = await supabase
              .from('reservas')
              .insert(reservaData)
              .select();
            
            if (testError2) {
              console.error('❌ Error después de corrección:', testError2);
            } else {
              console.log('✅ Teléfono largo insertado exitosamente');
              console.log('📱 Datos:', testData2[0]);
              
              // Limpiar
              await supabase
                .from('reservas')
                .delete()
                .eq('nombre', 'Test Frontend Debug');
              console.log('🧹 Datos de prueba eliminados');
            }
          }
        } catch (sqlError) {
          console.error('❌ Error ejecutando SQL:', sqlError);
          console.log('\\n📝 Ejecuta manualmente en Supabase SQL Editor:');
          console.log('   ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);');
        }
      }
    } else {
      console.log('✅ Teléfono largo insertado exitosamente');
      console.log('📱 Datos:', data[0]);
      
      // Limpiar
      await supabase
        .from('reservas')
        .delete()
        .eq('nombre', 'Test Frontend Debug');
      console.log('🧹 Datos de prueba eliminados');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

debugFrontendTelefono();
