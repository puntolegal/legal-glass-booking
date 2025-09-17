#!/usr/bin/env node

/**
 * Script para probar el sistema de login corporativo
 * Uso: node scripts/test-corporate-login.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bhhtigrrenqkagtlwrju.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCorporateLogin() {
  console.log('🧪 Probando sistema de login corporativo...\n');

  try {
    // 1. Crear usuario de prueba
    console.log('1. Creando usuario de prueba...');
    const testEmail = `test-empresa-${Date.now()}@puntolegal.cl`;
    const testPassword = 'TestPassword123!';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          role: 'corporativo',
          is_active: true
        }
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario:', authError.message);
      return;
    }

    console.log('✅ Usuario creado:', testEmail);

    // 2. Crear perfil corporativo
    console.log('\n2. Creando perfil corporativo...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: testEmail,
        role: 'corporativo',
        is_active: true,
        tipo_empresa: 'corporativo',
        razon_social: 'Empresa Test SPA',
        rut_empresa: '76.123.456-7',
        plan_suscripcion: 'premium',
        estado_suscripcion: 'activa',
        fecha_inicio_suscripcion: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creando perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil corporativo creado');

    // 3. Probar login
    console.log('\n3. Probando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (loginError) {
      console.error('❌ Error en login:', loginError.message);
      return;
    }

    console.log('✅ Login exitoso');

    // 4. Verificar rol corporativo
    console.log('\n4. Verificando rol corporativo...');
    const { data: userProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', loginData.user.id)
      .single();

    if (profileCheckError) {
      console.error('❌ Error verificando perfil:', profileCheckError.message);
      return;
    }

    if (userProfile.role !== 'corporativo') {
      console.error('❌ Error: Usuario no tiene rol corporativo');
      return;
    }

    console.log('✅ Rol corporativo verificado');

    // 5. Probar acceso a tablas corporativas
    console.log('\n5. Probando acceso a tablas corporativas...');
    
    // Probar inserción de causa
    const { data: causaData, error: causaError } = await supabase
      .from('causas')
      .insert({
        user_id: loginData.user.id,
        empresa_id: userProfile.id,
        titulo: 'Causa de Prueba',
        tipo: 'laboral',
        estado: 'pendiente',
        prioridad: 'media',
        descripcion: 'Causa de prueba para verificar funcionalidad',
        fecha_inicio: new Date().toISOString().split('T')[0],
        tribunal: 'Juzgado del Trabajo de Santiago',
        numero_causa: `TEST-${Date.now()}`,
        costo_estimado: 1000000,
        resultado_proyectado: 'Favorable (80%)',
        probabilidad_exito: 80
      })
      .select()
      .single();

    if (causaError) {
      console.error('❌ Error creando causa:', causaError.message);
      return;
    }

    console.log('✅ Causa creada exitosamente');

    // 6. Probar consulta de estadísticas
    console.log('\n6. Probando consulta de estadísticas...');
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_empresa_stats', { empresa_user_id: loginData.user.id });

    if (statsError) {
      console.error('❌ Error consultando estadísticas:', statsError.message);
      return;
    }

    console.log('✅ Estadísticas obtenidas:', statsData);

    // 7. Probar consulta de causas
    console.log('\n7. Probando consulta de causas...');
    const { data: causasData, error: causasError } = await supabase
      .rpc('get_empresa_causas', { empresa_user_id: loginData.user.id });

    if (causasError) {
      console.error('❌ Error consultando causas:', causasError.message);
      return;
    }

    console.log('✅ Causas obtenidas:', causasData.length, 'causas');

    // 8. Limpiar datos de prueba
    console.log('\n8. Limpiando datos de prueba...');
    
    // Eliminar causa de prueba
    await supabase
      .from('causas')
      .delete()
      .eq('id', causaData.id);

    // Eliminar perfil de prueba
    await supabase
      .from('profiles')
      .delete()
      .eq('user_id', loginData.user.id);

    // Eliminar usuario de prueba
    await supabase.auth.admin.deleteUser(loginData.user.id);

    console.log('✅ Datos de prueba limpiados');

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('✅ Usuario corporativo creado');
    console.log('✅ Login funcionando');
    console.log('✅ Rol corporativo verificado');
    console.log('✅ Acceso a tablas corporativas');
    console.log('✅ Estadísticas funcionando');
    console.log('✅ Consulta de causas funcionando');
    console.log('✅ Limpieza de datos exitosa');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión a base de datos...\n');

  try {
    // Verificar que las tablas existen
    const tables = ['profiles', 'causas', 'comparendos', 'documentos_legales', 'proyecciones', 'notificaciones_empresariales'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`❌ Error accediendo a tabla ${table}:`, error.message);
      } else {
        console.log(`✅ Tabla ${table} accesible`);
      }
    }

    // Verificar funciones RPC
    console.log('\n🔍 Probando funciones RPC...');
    
    const { data: statsTest, error: statsTestError } = await supabase
      .rpc('get_empresa_stats', { empresa_user_id: '00000000-0000-0000-0000-000000000000' });

    if (statsTestError) {
      console.error('❌ Error en función get_empresa_stats:', statsTestError.message);
    } else {
      console.log('✅ Función get_empresa_stats funcionando');
    }

  } catch (error) {
    console.error('💥 Error en prueba de conexión:', error.message);
  }
}

async function main() {
  console.log('🚀 Test Suite para Sistema Corporativo');
  console.log('=====================================\n');

  // Verificar variables de entorno
  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  ADVERTENCIA: Variables de entorno no configuradas');
    console.log('💡 Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY\n');
    return;
  }

  // Probar conexión primero
  await testDatabaseConnection();
  console.log('\n' + '='.repeat(50) + '\n');

  // Probar login corporativo
  await testCorporateLogin();

  console.log('\n📝 Próximos pasos:');
  console.log('1. Verifica que el login funciona en la aplicación');
  console.log('2. Prueba el dashboard corporativo');
  console.log('3. Verifica que las funcionalidades están disponibles');
  console.log('4. Revisa los logs de Supabase para errores');
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testCorporateLogin, testDatabaseConnection }; 