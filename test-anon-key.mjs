#!/usr/bin/env node

/**
 * Script para probar con la clave anónima correcta
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔑 Supabase URL:', supabaseUrl ? 'Configurado' : 'No configurado');
console.log('🔑 Supabase Anon Key:', supabaseAnonKey ? 'Configurado' : 'No configurado');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithAnonKey() {
  try {
    console.log('🔍 Probando con clave anónima (como el frontend)...');
    
    // Probar inserción con teléfono largo usando clave anónima
    const { data, error } = await supabase
      .from('reservas')
      .insert({
        nombre: 'Test Anon Key',
        email: 'test@puntolegal.cl',
        telefono: '+569123456789', // 13 caracteres
        rut: '12345678-9',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00:00',
        descripcion: 'Prueba con clave anónima',
        servicio: 'Consulta General',
        precio: '35000',
        estado: 'pendiente'
      })
      .select();
    
    if (error) {
      console.error('❌ Error con clave anónima:', error);
      
      if (error.message.includes('character varying(12)')) {
        console.log('\\n🔍 CONFIRMADO: El campo telefono sigue limitado a 12 caracteres para clave anónima');
        console.log('🔧 Aplicando corrección con clave de servicio...');
        
        // Usar clave de servicio para corregir
        const supabaseService = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnYg');
        
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
          
          // Probar nuevamente con clave anónima
          console.log('\\n🧪 Probando nuevamente con clave anónima...');
          const { data: testData2, error: testError2 } = await supabase
            .from('reservas')
            .insert({
              nombre: 'Test Anon Key Corregido',
              email: 'test2@puntolegal.cl',
              telefono: '+569123456789', // 13 caracteres
              rut: '12345678-9',
              fecha: new Date().toISOString().split('T')[0],
              hora: '10:00:00',
              descripcion: 'Prueba después de corrección',
              servicio: 'Consulta General',
              precio: '35000',
              estado: 'pendiente'
            })
            .select();
          
          if (testError2) {
            console.error('❌ Error después de corrección:', testError2);
          } else {
            console.log('✅ Teléfono largo insertado exitosamente con clave anónima');
            console.log('📱 Datos:', testData2[0]);
            
            // Limpiar
            await supabase
              .from('reservas')
              .delete()
              .eq('nombre', 'Test Anon Key Corregido');
            console.log('🧹 Datos de prueba eliminados');
          }
        }
      }
    } else {
      console.log('✅ Teléfono largo insertado exitosamente con clave anónima');
      console.log('📱 Datos:', data[0]);
      
      // Limpiar
      await supabase
        .from('reservas')
        .delete()
        .eq('nombre', 'Test Anon Key');
      console.log('🧹 Datos de prueba eliminados');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testWithAnonKey();
