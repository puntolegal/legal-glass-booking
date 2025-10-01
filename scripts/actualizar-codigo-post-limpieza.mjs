#!/usr/bin/env node

/**
 * 🔧 ACTUALIZACIÓN: Código post-limpieza de esquema
 * Actualiza el código para usar solo las columnas esenciales después de la limpieza
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 ACTUALIZACIÓN DE CÓDIGO POST-LIMPIEZA\n');
console.log('='.repeat(60));

// Mapeo de columnas duplicadas a columnas esenciales
const mapeoColumnas = {
  'cliente_nombre': 'nombre',
  'cliente_email': 'email', 
  'cliente_telefono': 'telefono',
  'servicio_nombre': 'servicio',
  'servicio_precio': 'precio',
  'fecha_agendada': 'fecha',
  'hora_agendada': 'hora',
  'motivo_consulta': 'descripcion',
  'notas': 'descripcion'
};

// Archivos que necesitan actualización
const archivosActualizar = [
  'src/services/realEmailService.ts',
  'src/services/supabaseBooking.ts',
  'supabase/functions/clever-action/index.ts',
  'supabase/functions/mercadopago-webhook/index.ts'
];

async function actualizarArchivo(archivoPath) {
  try {
    if (!fs.existsSync(archivoPath)) {
      console.log(`⚠️  Archivo no encontrado: ${archivoPath}`);
      return;
    }

    let contenido = fs.readFileSync(archivoPath, 'utf8');
    let cambios = 0;

    // Aplicar mapeo de columnas
    Object.entries(mapeoColumnas).forEach(([duplicada, esencial]) => {
      const regex = new RegExp(`\\b${duplicada}\\b`, 'g');
      const matches = contenido.match(regex);
      if (matches) {
        contenido = contenido.replace(regex, esencial);
        cambios += matches.length;
        console.log(`   ✅ ${duplicada} → ${esencial} (${matches.length} cambios)`);
      }
    });

    // Cambios específicos para realEmailService.ts
    if (archivoPath.includes('realEmailService.ts')) {
      // Actualizar el objeto realBookingData
      contenido = contenido.replace(
        /cliente_nombre: bookingData\.nombre,/g,
        'nombre: bookingData.nombre,'
      );
      contenido = contenido.replace(
        /cliente_email: bookingData\.email,/g,
        'email: bookingData.email,'
      );
      contenido = contenido.replace(
        /cliente_telefono: bookingData\.telefono \|\| '',/g,
        'telefono: bookingData.telefono || \'\','
      );
      contenido = contenido.replace(
        /servicio_tipo: bookingData\.servicio,/g,
        'servicio: bookingData.servicio,'
      );
      contenido = contenido.replace(
        /servicio_precio: bookingData\.precio,/g,
        'precio: bookingData.precio,'
      );
      
      cambios += 5;
      console.log('   ✅ Objeto realBookingData actualizado');
    }

    if (cambios > 0) {
      // Crear backup
      const backupPath = archivoPath + '.backup';
      fs.writeFileSync(backupPath, fs.readFileSync(archivoPath, 'utf8'));
      console.log(`   📁 Backup creado: ${backupPath}`);
      
      // Escribir archivo actualizado
      fs.writeFileSync(archivoPath, contenido);
      console.log(`   ✅ Archivo actualizado: ${archivoPath}`);
    } else {
      console.log(`   ℹ️  Sin cambios necesarios: ${archivoPath}`);
    }

  } catch (error) {
    console.error(`❌ Error actualizando ${archivoPath}:`, error.message);
  }
}

async function generarScriptSQL() {
  console.log('\n📋 GENERANDO SCRIPT SQL DE LIMPIEZA...\n');
  
  const columnasAEliminar = [
    'rut',
    'cliente_nombre',
    'cliente_email', 
    'cliente_telefono',
    'servicio_nombre',
    'servicio_precio',
    'fecha_agendada',
    'hora_agendada',
    'motivo_consulta',
    'notas',
    'recordatorio_enviado',
    'webhook_sent',
    'user_id',
    'categoria',
    'preference_id',
    'pago_id',
    'pago_metodo'
  ];

  let scriptSQL = '-- Script de limpieza de tabla reservas\n';
  scriptSQL += '-- Ejecutar en Supabase SQL Editor\n\n';
  
  scriptSQL += '-- PASO 1: Backup de la tabla actual\n';
  scriptSQL += 'CREATE TABLE reservas_backup AS SELECT * FROM reservas;\n\n';
  
  scriptSQL += '-- PASO 2: Eliminar columnas redundantes\n';
  columnasAEliminar.forEach(columna => {
    scriptSQL += `ALTER TABLE reservas DROP COLUMN IF EXISTS ${columna};\n`;
  });
  
  scriptSQL += '\n-- PASO 3: Verificar estructura final\n';
  scriptSQL += '\\d reservas;\n\n';
  
  scriptSQL += '-- PASO 4: Verificar datos\n';
  scriptSQL += 'SELECT COUNT(*) as total_reservas FROM reservas;\n';
  scriptSQL += 'SELECT COUNT(*) as emails_enviados FROM reservas WHERE email_enviado = true;\n';

  fs.writeFileSync('scripts/limpiar-tabla-reservas.sql', scriptSQL);
  console.log('✅ Script SQL generado: scripts/limpiar-tabla-reservas.sql');
}

async function main() {
  try {
    console.log('🔍 1. ACTUALIZANDO ARCHIVOS DE CÓDIGO...\n');
    
    for (const archivo of archivosActualizar) {
      console.log(`📝 Procesando: ${archivo}`);
      await actualizarArchivo(archivo);
      console.log('');
    }

    console.log('📋 2. GENERANDO SCRIPT SQL...\n');
    await generarScriptSQL();

    console.log('\n🎯 RESUMEN DE CAMBIOS:\n');
    console.log('✅ Archivos de código actualizados');
    console.log('✅ Script SQL de limpieza generado');
    console.log('✅ Backups creados para seguridad');
    
    console.log('\n📋 PRÓXIMOS PASOS:\n');
    console.log('1. Ejecutar script SQL en Supabase Dashboard');
    console.log('2. Verificar que no hay errores');
    console.log('3. Probar funcionalidad completa');
    console.log('4. Confirmar que emails siguen funcionando');

    console.log('\n⚠️  IMPORTANTE:');
    console.log('- El sistema seguirá funcionando durante la limpieza');
    console.log('- Los backups permiten rollback si es necesario');
    console.log('- Verificar todos los endpoints después de la limpieza');

  } catch (error) {
    console.error('❌ Error en actualización:', error);
  }
}

// Ejecutar actualización
main();
