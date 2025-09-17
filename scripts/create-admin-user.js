#!/usr/bin/env node

/**
 * Script para crear usuario administrador en Supabase
 * Uso: node scripts/create-admin-user.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - Usar las credenciales correctas del cliente
const supabaseUrl = 'https://bhhtigrrenqkagtlwrju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoaHRpZ3JyZW5xa2FndGx3cmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5NTYsImV4cCI6MjA2NzA4Mzk1Nn0.ATd8YI-fUF5T6u4-J1WjsNJIQltI6cC41KXXh2Rlt6k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('🔧 Creando usuario administrador...\n');

  try {
    // 1. Crear usuario en auth con email confirmado
    console.log('1. Creando usuario en autenticación...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'puntolegalelgolf@gmail.com',
      password: 'adminadmin',
      options: {
        data: {
          role: 'admin',
          is_active: true
        },
        emailRedirectTo: `${supabaseUrl}/auth/callback`
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario:', authError.message);
      return;
    }

    console.log('✅ Usuario creado en auth:', authData.user?.email);
    console.log('📧 Estado de confirmación:', authData.user?.email_confirmed_at ? 'Confirmado' : 'Pendiente');

    // 2. Crear perfil de administrador
    console.log('\n2. Creando perfil de administrador...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: 'puntolegalelgolf@gmail.com',
        nombre: 'Administrador Punto Legal',
        telefono: '+56962321883'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creando perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil de administrador creado');

    // 3. Intentar login directo (puede fallar si email no está confirmado)
    console.log('\n3. Probando login del administrador...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'puntolegalelgolf@gmail.com',
      password: 'adminadmin'
    });

    if (loginError) {
      console.log('⚠️  Login falló (esperado si email no está confirmado):', loginError.message);
      console.log('\n📧 Para confirmar el email:');
      console.log('1. Ve a tu email: puntolegalelgolf@gmail.com');
      console.log('2. Busca el email de confirmación de Supabase');
      console.log('3. Haz clic en el enlace de confirmación');
      console.log('4. Intenta login nuevamente');
    } else {
      console.log('✅ Login exitoso del administrador');
    }

    // 4. Verificar perfil del administrador
    console.log('\n4. Verificando perfil del administrador...');
    const { data: userProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileCheckError) {
      console.error('❌ Error verificando perfil:', profileCheckError.message);
      return;
    }

    console.log('✅ Perfil del administrador verificado');

    console.log('\n🎉 ¡Usuario administrador creado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('📧 Email: puntolegalelgolf@gmail.com');
    console.log('🔑 Contraseña: adminadmin');
    console.log('👤 Rol: Administrador');
    console.log('🔗 Puede acceder desde: /servicios/corporativo');

    console.log('\n📝 Funcionalidades del administrador:');
    console.log('✅ Acceso completo al sistema');
    console.log('✅ Gestión de usuarios corporativos');
    console.log('✅ Visualización de todas las causas');
    console.log('✅ Estadísticas globales');
    console.log('✅ Configuración del sistema');

    console.log('\n⚠️  IMPORTANTE:');
    console.log('Si recibes "Email not confirmed", necesitas:');
    console.log('1. Revisar el email: puntolegalelgolf@gmail.com');
    console.log('2. Confirmar el email desde el enlace de Supabase');
    console.log('3. Intentar login nuevamente');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export { createAdminUser }; 