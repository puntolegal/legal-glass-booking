// Test de conexión con Supabase
// Archivo: scripts/test-supabase-connection.cjs

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('🧪 Probando conexión con Supabase...');

// Leer credenciales del .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Extraer credenciales
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ No se encontraron credenciales de Supabase en .env');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('🌐 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...');

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔍 Probando conexión...');
    
    // Test 1: Verificar que la tabla existe
    console.log('1. Verificando tabla reservas...');
    const { data: tables, error: tablesError } = await supabase
      .from('reservas')
      .select('count', { count: 'exact', head: true });
    
    if (tablesError) {
      if (tablesError.message.includes('relation "public.reservas" does not exist')) {
        console.log('⚠️  Tabla "reservas" no existe aún');
        console.log('📝 Necesitas ejecutar la migración SQL en Supabase Dashboard');
        return false;
      } else {
        throw tablesError;
      }
    }
    
    console.log('✅ Tabla "reservas" existe');
    console.log(`📊 Registros actuales: ${tables || 0}`);
    
    // Test 2: Insertar registro de prueba
    console.log('\n2. Insertando registro de prueba...');
    const testData = {
      cliente_nombre: 'Test Usuario',
      cliente_email: 'test@puntolegal.cl',
      cliente_telefono: '+56912345678',
      servicio_tipo: 'Consulta de Prueba',
      servicio_precio: '0',
      fecha: new Date().toISOString().split('T')[0], // Fecha de hoy
      hora: '10:00:00',
      estado: 'pendiente',
      notas: 'Registro de prueba creado por script de testing'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('reservas')
      .insert(testData)
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }
    
    console.log('✅ Registro insertado exitosamente');
    console.log('🆔 ID:', insertData.id);
    
    // Test 3: Leer registros
    console.log('\n3. Leyendo registros...');
    const { data: selectData, error: selectError } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (selectError) {
      throw selectError;
    }
    
    console.log(`✅ Se encontraron ${selectData.length} registros`);
    selectData.forEach((registro, index) => {
      console.log(`  ${index + 1}. ${registro.cliente_nombre} - ${registro.servicio_tipo} (${registro.estado})`);
    });
    
    // Test 4: Limpiar registro de prueba
    console.log('\n4. Limpiando registro de prueba...');
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.warn('⚠️  No se pudo eliminar el registro de prueba:', deleteError.message);
    } else {
      console.log('✅ Registro de prueba eliminado');
    }
    
    console.log('\n🎉 ¡Conexión con Supabase exitosa!');
    console.log('📊 Sistema listo para recibir reservas');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Error en la conexión:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('🔑 Verifica que las credenciales en .env sean correctas');
    } else if (error.message.includes('relation "public.reservas" does not exist')) {
      console.log('🗄️ Ejecuta la migración SQL en Supabase Dashboard primero');
    } else {
      console.log('🔧 Error inesperado. Revisa la configuración.');
    }
    
    return false;
  }
}

// Ejecutar test
testConnection().then(success => {
  if (success) {
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. 🧪 Probar consulta gratuita: http://localhost:8080/agendamiento?plan=gratis');
    console.log('2. 💳 Probar pago MercadoPago: http://localhost:8080/agendamiento?plan=general');
    console.log('3. 📊 Ver reservas en Supabase: Table Editor > reservas');
  } else {
    console.log('\n🔧 SOLUCIÓN:');
    console.log('1. Ejecutar migración SQL en Supabase Dashboard');
    console.log('2. Verificar credenciales en .env');
    console.log('3. Ejecutar este script nuevamente');
  }
  
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Error crítico:', error);
  process.exit(1);
});

