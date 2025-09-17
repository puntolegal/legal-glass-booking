#!/usr/bin/env node

/**
 * Script para confirmar email del administrador en Supabase
 * Uso: node scripts/confirm-email-admin.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bhhtigrrenqkagtlwrju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoaHRpZ3JyZW5xa2FndGx3cmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5NTYsImV4cCI6MjA2NzA4Mzk1Nn0.ATd8YI-fUF5T6u4-J1WjsNJIQltI6cC41KXXh2Rlt6k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function confirmAdminEmail() {
  console.log('🔧 Confirmando email del administrador...\n');

  try {
    // 1. Intentar login para verificar el estado
    console.log('1. Verificando estado del usuario...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'puntolegalelgolf@gmail.com',
      password: 'adminadmin'
    });

    if (loginError) {
      console.log('❌ Error en login:', loginError.message);
      
      if (loginError.message.includes('Email not confirmed')) {
        console.log('\n📧 El email no está confirmado.');
        console.log('💡 Soluciones:');
        console.log('1. Ve a Supabase Dashboard > Authentication > Users');
        console.log('2. Busca: puntolegalelgolf@gmail.com');
        console.log('3. Cambia "Email Confirmed" a "Yes"');
        console.log('4. O deshabilita confirmación en Authentication > Settings');
      }
    } else {
      console.log('✅ Login exitoso - Email ya confirmado');
    }

    // 2. Verificar si existe el perfil
    console.log('\n2. Verificando perfil...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'puntolegalelgolf@gmail.com')
      .single();

    if (profileError) {
      console.log('❌ Perfil no encontrado:', profileError.message);
      console.log('💡 Creando perfil automáticamente...');
      
      // Crear perfil si no existe
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          email: 'puntolegalelgolf@gmail.com',
          nombre: 'Administrador Punto Legal',
          telefono: '+56962321883'
        })
        .select()
        .single();

      if (createError) {
        console.log('❌ Error creando perfil:', createError.message);
      } else {
        console.log('✅ Perfil creado exitosamente');
      }
    } else {
      console.log('✅ Perfil encontrado');
    }

    console.log('\n🎉 ¡Verificación completada!');
    console.log('\n📋 Credenciales:');
    console.log('📧 Email: puntolegalelgolf@gmail.com');
    console.log('🔑 Contraseña: adminadmin');
    console.log('🔗 Acceso: /servicios/corporativo');

    console.log('\n💡 Si aún no funciona:');
    console.log('1. Ve a Supabase Dashboard');
    console.log('2. Authentication > Settings');
    console.log('3. Desactiva "Enable email confirmations"');
    console.log('4. Guarda los cambios');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  confirmAdminEmail();
}

export { confirmAdminEmail }; 