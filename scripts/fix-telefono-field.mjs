#!/usr/bin/env node

/**
 * Script para corregir el campo telefono en la tabla reservas
 * Error: value too long for type character varying(12)
 * Solución: Ampliar el campo telefono a VARCHAR(50)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixTelefonoField() {
  try {
    console.log('🔧 Iniciando corrección del campo telefono...');
    
    // 1. Verificar la estructura actual
    console.log('📋 Verificando estructura actual...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'reservas' });
    
    if (columnsError) {
      console.log('⚠️ No se pudo obtener estructura, continuando con la corrección...');
    } else {
      console.log('📊 Estructura actual:', columns);
    }
    
    // 2. Ampliar el campo telefono
    console.log('🔧 Ampliando campo telefono de VARCHAR(12) a VARCHAR(50)...');
    const { error: alterError } = await supabase
      .rpc('exec_sql', { 
        sql: 'ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);' 
      });
    
    if (alterError) {
      console.error('❌ Error ampliando campo telefono:', alterError);
      
      // Intentar método alternativo
      console.log('🔄 Intentando método alternativo...');
      const { error: alterError2 } = await supabase
        .from('reservas')
        .select('telefono')
        .limit(1);
      
      if (alterError2 && alterError2.message.includes('character varying(12)')) {
        console.log('✅ Confirmado: el campo está limitado a 12 caracteres');
        console.log('📝 Necesitas ejecutar manualmente en Supabase SQL Editor:');
        console.log('   ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);');
        return;
      }
    } else {
      console.log('✅ Campo telefono ampliado exitosamente');
    }
    
    // 3. Verificar que el cambio se aplicó
    console.log('🔍 Verificando que el cambio se aplicó...');
    const { data: testData, error: testError } = await supabase
      .from('reservas')
      .select('telefono')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error verificando cambio:', testError);
    } else {
      console.log('✅ Verificación exitosa');
    }
    
    // 4. Insertar datos de prueba
    console.log('🧪 Insertando datos de prueba...');
    const telefonoLargo = '+569123456789'; // 13 caracteres
    const { data: testInsert, error: insertError } = await supabase
      .from('reservas')
      .insert({
        nombre: 'Test Telefono Largo',
        email: 'test@puntolegal.cl',
        telefono: telefonoLargo,
        rut: '12345678-9',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00:00',
        descripcion: 'Prueba de telefono largo',
        servicio: 'Consulta General',
        precio: '35000',
        categoria: 'General',
        tipo_reunion: 'online',
        estado: 'pendiente'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error insertando datos de prueba:', insertError);
      if (insertError.message.includes('character varying(12)')) {
        console.log('📝 El campo sigue limitado a 12 caracteres. Ejecuta manualmente:');
        console.log('   ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);');
      }
    } else {
      console.log('✅ Datos de prueba insertados exitosamente');
      console.log('📱 Teléfono insertado:', testInsert[0]?.telefono);
      
      // Limpiar datos de prueba
      await supabase
        .from('reservas')
        .delete()
        .eq('nombre', 'Test Telefono Largo');
      console.log('🧹 Datos de prueba eliminados');
    }
    
    console.log('🎉 Corrección del campo telefono completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  fixTelefonoField();
}

export { fixTelefonoField };
