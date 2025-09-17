#!/usr/bin/env node

/**
 * Script para crear usuario de prueba sin confirmación de email
 * Uso: node scripts/create-test-user.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bhhtigrrenqkagtlwrju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoaHRpZ3JyZW5xa2FndGx3cmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5NTYsImV4cCI6MjA2NzA4Mzk1Nn0.ATd8YI-fUF5T6u4-J1WjsNJIQltI6cC41KXXh2Rlt6k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  console.log('🔧 Creando usuario de prueba...\n');

  try {
    // Usar un email válido que no requiera confirmación
    const testEmail = 'admin@temp-mail.org';
    
    console.log('1. Creando usuario de prueba...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'helloworld',
      options: {
        data: {
          role: 'admin',
          is_active: true
        }
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario:', authError.message);
      return;
    }

    console.log('✅ Usuario creado en auth:', authData.user?.email);

    // 2. Crear perfil
    console.log('\n2. Creando perfil...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: testEmail,
        nombre: 'Usuario de Prueba',
        telefono: '+56962321883'
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creando perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil creado');

    // 3. Probar login
    console.log('\n3. Probando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'helloworld'
    });

    if (loginError) {
      console.log('⚠️  Login falló:', loginError.message);
    } else {
      console.log('✅ Login exitoso');
    }

    console.log('\n🎉 ¡Usuario de prueba creado!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Contraseña: helloworld');
    console.log('👤 Rol: Administrador');
    console.log('🔗 Puede acceder desde: /servicios/corporativo');

    console.log('\n💡 Nota: Este usuario usa un email temporal que puede no requerir confirmación.');

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser();
}

export { createTestUser }; 