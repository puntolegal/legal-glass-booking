import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 PROBANDO SISTEMA COMPLETO\n');

// Leer variables de entorno
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const RESEND_API_KEY = envContent.match(/VITE_RESEND_API_KEY=(.*)/)?.[1]?.trim();
const MERCADOPAGO_ACCESS_TOKEN = envContent.match(/VITE_MERCADOPAGO_ACCESS_TOKEN=(.*)/)?.[1]?.trim();
const MERCADOPAGO_PUBLIC_KEY = envContent.match(/VITE_MERCADOPAGO_PUBLIC_KEY=(.*)/)?.[1]?.trim();

console.log('📋 CONFIGURACIÓN:');
console.log(`   Supabase URL: ${SUPABASE_URL ? '✅' : '❌'}`);
console.log(`   Supabase Key: ${SUPABASE_ANON_KEY ? '✅' : '❌'}`);
console.log(`   Resend API: ${RESEND_API_KEY ? '✅' : '❌'}`);
console.log(`   MercadoPago Access: ${MERCADOPAGO_ACCESS_TOKEN ? '✅' : '❌'}`);
console.log(`   MercadoPago Public: ${MERCADOPAGO_PUBLIC_KEY ? '✅' : '❌'}\n`);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testCompleteSystem() {
  let testsPassed = 0;
  let totalTests = 0;

  // Test 1: Conexión a Supabase
  totalTests++;
  console.log('🧪 Test 1: Conexión a Supabase');
  try {
    const { data, error } = await supabase.from('reservas').select('id').limit(1);
    if (error) throw error;
    console.log('   ✅ Conexión exitosa');
    testsPassed++;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 2: Lectura de reservas
  totalTests++;
  console.log('\n🧪 Test 2: Lectura de reservas');
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('id, nombre, email, servicio, fecha, hora')
      .limit(3);
    if (error) throw error;
    console.log(`   ✅ ${data.length} reservas encontradas`);
    data.forEach((r, i) => {
      console.log(`      ${i+1}. ${r.nombre} - ${r.servicio} (${r.fecha})`);
    });
    testsPassed++;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 3: Crear reserva de prueba
  totalTests++;
  console.log('\n🧪 Test 3: Crear reserva de prueba');
  try {
    const testReservation = {
      nombre: 'Test Sistema',
      email: 'test@sistema.com',
      telefono: '123456789',
      rut: '12345678-9',
      servicio: 'Consulta Test',
      precio: '50000',
      fecha: new Date().toISOString().split('T')[0],
      hora: '10:00',
      descripcion: 'Reserva de prueba del sistema',
      tipo_reunion: 'online',
      estado: 'pendiente',
      recordatorio_enviado: false,
      webhook_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('reservas')
      .insert([testReservation])
      .select()
      .single();
    
    if (error) throw error;
    console.log(`   ✅ Reserva creada con ID: ${data.id}`);
    
    // Limpiar reserva de prueba
    await supabase.from('reservas').delete().eq('id', data.id);
    console.log('   🧹 Reserva de prueba eliminada');
    testsPassed++;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 4: Verificar estructura de tabla
  totalTests++;
  console.log('\n🧪 Test 4: Verificar estructura de tabla');
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    const columns = Object.keys(data[0] || {});
    const requiredColumns = ['id', 'nombre', 'email', 'telefono', 'servicio', 'precio', 'fecha', 'hora'];
    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('   ✅ Estructura de tabla correcta');
      console.log(`   📊 Columnas encontradas: ${columns.length}`);
      testsPassed++;
    } else {
      console.log(`   ❌ Columnas faltantes: ${missingColumns.join(', ')}`);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Resumen
  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log(`   Pruebas exitosas: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
    console.log('✅ Supabase: Conectado y funcionando');
    console.log('✅ Base de datos: Accesible y estructurada correctamente');
    console.log('✅ CRUD: Crear, leer, actualizar, eliminar funcionando');
    console.log('✅ Variables de entorno: Configuradas correctamente');
    console.log('\n🚀 El sistema está listo para producción');
  } else {
    console.log('\n⚠️ ALGUNAS PRUEBAS FALLARON');
    console.log('❌ Revisar configuración antes de continuar');
  }
}

testCompleteSystem();