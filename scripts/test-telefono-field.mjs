#!/usr/bin/env node

/**
 * Script para probar el campo telefono en la tabla reservas
 * Verifica si el campo está limitado a 12 caracteres
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY no configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTelefonoField() {
  try {
    console.log('🧪 Probando campo telefono...');
    
    // Probar con teléfono de 13 caracteres
    const telefonoLargo = '+569123456789'; // 13 caracteres
    console.log(`📱 Probando teléfono: "${telefonoLargo}" (${telefonoLargo.length} caracteres)`);
    
    const { data, error } = await supabase
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
    
    if (error) {
      console.error('❌ Error insertando:', error);
      
      if (error.message.includes('character varying(12)')) {
        console.log('🔍 CONFIRMADO: El campo telefono está limitado a 12 caracteres');
        console.log('📝 Solución: Ejecutar en Supabase SQL Editor:');
        console.log('   ALTER TABLE public.reservas ALTER COLUMN telefono TYPE VARCHAR(50);');
        
        // Probar con teléfono de 12 caracteres
        const telefonoCorto = '+56912345678'; // 12 caracteres
        console.log(`\n🧪 Probando con teléfono corto: "${telefonoCorto}" (${telefonoCorto.length} caracteres)`);
        
        const { data: dataCorto, error: errorCorto } = await supabase
          .from('reservas')
          .insert({
            nombre: 'Test Telefono Corto',
            email: 'test2@puntolegal.cl',
            telefono: telefonoCorto,
            rut: '12345678-9',
            fecha: new Date().toISOString().split('T')[0],
            hora: '10:00:00',
            descripcion: 'Prueba de telefono corto',
            servicio: 'Consulta General',
            precio: '35000',
            categoria: 'General',
            tipo_reunion: 'online',
            estado: 'pendiente'
          })
          .select();
        
        if (errorCorto) {
          console.error('❌ Error con teléfono corto:', errorCorto);
        } else {
          console.log('✅ Teléfono corto insertado exitosamente');
          console.log('📱 Datos insertados:', dataCorto[0]);
          
          // Limpiar datos de prueba
          await supabase
            .from('reservas')
            .delete()
            .eq('nombre', 'Test Telefono Corto');
          console.log('🧹 Datos de prueba eliminados');
        }
      }
    } else {
      console.log('✅ Teléfono largo insertado exitosamente');
      console.log('📱 Datos insertados:', data[0]);
      
      // Limpiar datos de prueba
      await supabase
        .from('reservas')
        .delete()
        .eq('nombre', 'Test Telefono Largo');
      console.log('🧹 Datos de prueba eliminados');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testTelefonoField();
}

export { testTelefonoField };
