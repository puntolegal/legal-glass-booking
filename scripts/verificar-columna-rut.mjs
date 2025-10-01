#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarColumnaRut() {
  console.log('🔍 Verificando si la columna RUT existe en la tabla reservas...\n');

  try {
    // Verificar estructura de la tabla
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'reservas')
      .order('ordinal_position');

    if (error) {
      console.error('❌ Error consultando estructura de tabla:', error);
      return;
    }

    console.log('📊 Estructura actual de la tabla reservas:');
    console.log('='.repeat(50));
    
    const tieneRut = data.some(col => col.column_name === 'rut');
    
    data.forEach(col => {
      const icon = col.column_name === 'rut' ? '🆔' : '📄';
      const required = col.is_nullable === 'NO' ? ' (REQUERIDO)' : ' (OPCIONAL)';
      console.log(`${icon} ${col.column_name}: ${col.data_type}${required}`);
    });

    console.log('\n' + '='.repeat(50));
    
    if (tieneRut) {
      console.log('✅ Columna RUT encontrada en la tabla reservas');
      
      // Probar inserción con RUT
      console.log('\n🧪 Probando inserción con campo RUT...');
      
      const testData = {
        nombre: 'Test RUT',
        email: 'test.rut@puntolegal.online',
        telefono: '+56912345678',
        rut: '12.345.678-9',
        servicio: 'Consulta Test RUT',
        precio: '35000',
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:00',
        tipo_reunion: 'online',
        descripcion: 'Test de inserción con RUT',
        estado: 'pendiente'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('reservas')
        .insert(testData)
        .select();

      if (insertError) {
        console.error('❌ Error insertando con RUT:', insertError);
      } else {
        console.log('✅ Inserción exitosa con RUT:', insertData[0].id);
        
        // Eliminar registro de prueba
        const { error: deleteError } = await supabase
          .from('reservas')
          .delete()
          .eq('id', insertData[0].id);
          
        if (deleteError) {
          console.log('⚠️ No se pudo eliminar registro de prueba:', deleteError);
        } else {
          console.log('🗑️ Registro de prueba eliminado correctamente');
        }
      }
      
    } else {
      console.log('❌ Columna RUT NO encontrada en la tabla reservas');
      console.log('\n📋 Para agregar la columna RUT, ejecuta este SQL en Supabase Dashboard:');
      console.log('='.repeat(60));
      console.log('ALTER TABLE reservas ADD COLUMN rut VARCHAR(12);');
      console.log('COMMENT ON COLUMN reservas.rut IS \'RUT del cliente en formato XX.XXX.XXX-X\';');
      console.log('='.repeat(60));
    }

    // Verificar registros existentes
    console.log('\n📊 Verificando registros existentes...');
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('id, nombre, rut')
      .limit(5);

    if (reservasError) {
      console.error('❌ Error consultando reservas:', reservasError);
    } else {
      console.log(`📋 Mostrando ${reservas.length} reservas recientes:`);
      reservas.forEach((reserva, index) => {
        const rutStatus = reserva.rut ? `RUT: ${reserva.rut}` : 'Sin RUT';
        console.log(`${index + 1}. ${reserva.nombre} - ${rutStatus}`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
verificarColumnaRut();
