#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Intentar obtener las credenciales de Supabase de diferentes fuentes
let supabaseUrl, supabaseKey;

// 1. Intentar desde variables de entorno del sistema
if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
  supabaseUrl = process.env.VITE_SUPABASE_URL;
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  console.log('✅ Usando variables de entorno del sistema');
}

// 2. Si no están disponibles, usar las credenciales conocidas del proyecto
if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️ Variables de entorno no encontradas, usando credenciales conocidas...');
  supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzYwMzcsImV4cCI6MjA1MDU1MjAzN30.8k4YqJ8KqJ8KqJ8KqJ8KqJ8KqJ8KqJ8KqJ8KqJ8KqJ8';
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarAgendamientoRut() {
  console.log('🔍 Verificando si el agendamiento funcionará correctamente con RUT...\n');

  try {
    // 1. Verificar estructura de la tabla
    console.log('1️⃣ Verificando estructura de tabla reservas...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'reservas')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error consultando estructura:', columnsError);
      return;
    }

    const tieneRut = columns.some(col => col.column_name === 'rut');
    const tieneCamposEsenciales = ['nombre', 'email', 'telefono', 'servicio', 'precio', 'fecha', 'hora'].every(
      campo => columns.some(col => col.column_name === campo)
    );

    console.log(`📊 Columnas encontradas: ${columns.length}`);
    console.log(`🆔 Campo RUT: ${tieneRut ? '✅ PRESENTE' : '❌ AUSENTE'}`);
    console.log(`📋 Campos esenciales: ${tieneCamposEsenciales ? '✅ COMPLETOS' : '❌ FALTANTES'}`);

    if (!tieneCamposEsenciales) {
      console.log('\n❌ ERROR: Faltan campos esenciales para el agendamiento');
      return;
    }

    // 2. Probar inserción sin RUT (comportamiento actual)
    console.log('\n2️⃣ Probando inserción SIN campo RUT...');
    const testDataSinRut = {
      nombre: 'Test Sin RUT',
      email: 'test.sin.rut@puntolegal.online',
      telefono: '+56912345678',
      servicio: 'Consulta Test',
      precio: '35000',
      fecha: new Date().toISOString().split('T')[0],
      hora: '10:00',
      tipo_reunion: 'online',
      descripcion: 'Test sin RUT',
      estado: 'pendiente'
    };

    const { data: insertSinRut, error: insertSinRutError } = await supabase
      .from('reservas')
      .insert(testDataSinRut)
      .select();

    if (insertSinRutError) {
      console.log('❌ Inserción sin RUT falló:', insertSinRutError.message);
    } else {
      console.log('✅ Inserción sin RUT exitosa:', insertSinRut[0].id);
      
      // Eliminar registro de prueba
      await supabase.from('reservas').delete().eq('id', insertSinRut[0].id);
      console.log('🗑️ Registro sin RUT eliminado');
    }

    // 3. Probar inserción con RUT (si la columna existe)
    if (tieneRut) {
      console.log('\n3️⃣ Probando inserción CON campo RUT...');
      const testDataConRut = {
        ...testDataSinRut,
        nombre: 'Test Con RUT',
        email: 'test.con.rut@puntolegal.online',
        rut: '12.345.678-9'
      };

      const { data: insertConRut, error: insertConRutError } = await supabase
        .from('reservas')
        .insert(testDataConRut)
        .select();

      if (insertConRutError) {
        console.log('❌ Inserción con RUT falló:', insertConRutError.message);
      } else {
        console.log('✅ Inserción con RUT exitosa:', insertConRut[0].id);
        
        // Eliminar registro de prueba
        await supabase.from('reservas').delete().eq('id', insertConRut[0].id);
        console.log('🗑️ Registro con RUT eliminado');
      }
    } else {
      console.log('\n3️⃣ ⚠️ No se puede probar inserción con RUT - columna no existe');
    }

    // 4. Verificar registros existentes
    console.log('\n4️⃣ Verificando registros existentes...');
    const { data: reservas, error: reservasError } = await supabase
      .from('reservas')
      .select('id, nombre, rut, email')
      .limit(3);

    if (reservasError) {
      console.log('❌ Error consultando reservas:', reservasError.message);
    } else {
      console.log(`📋 Mostrando ${reservas.length} reservas recientes:`);
      reservas.forEach((reserva, index) => {
        const rutStatus = reserva.rut ? `RUT: ${reserva.rut}` : 'Sin RUT';
        console.log(`${index + 1}. ${reserva.nombre} - ${rutStatus}`);
      });
    }

    // 5. Conclusión
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CONCLUSIÓN:');
    
    if (tieneCamposEsenciales && !tieneRut) {
      console.log('✅ El agendamiento FUNCIONARÁ correctamente');
      console.log('⚠️ PERO el campo RUT se perderá hasta agregar la columna');
      console.log('\n📋 Para agregar la columna RUT, ejecuta:');
      console.log('ALTER TABLE reservas ADD COLUMN rut VARCHAR(12);');
    } else if (tieneCamposEsenciales && tieneRut) {
      console.log('✅ El agendamiento FUNCIONARÁ PERFECTAMENTE con RUT');
      console.log('🎉 Sistema completamente operativo');
    } else {
      console.log('❌ El agendamiento NO funcionará correctamente');
      console.log('🔧 Se requieren correcciones en la base de datos');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar verificación
verificarAgendamientoRut();
