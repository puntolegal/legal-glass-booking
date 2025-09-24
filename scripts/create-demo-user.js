#!/usr/bin/env node

/**
 * Script para crear usuario de demostración corporativo
 * Credenciales: admin@miempresa.cl / demo123
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnGg';

// Crear cliente con service key para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDemoUser() {
  console.log('🏢 Creando usuario de demostración corporativo...\n');

  try {
    // Crear usuario de demostración
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@miempresa.cl',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        role: 'corporate',
        empresa: 'Mi Empresa Demo',
        access_level: 'admin'
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Usuario ya existe, actualizando credenciales...');
        
        // Actualizar contraseña del usuario existente
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          data?.user?.id || 'existing-user-id',
          { password: 'demo123' }
        );
        
        if (updateError) {
          console.log('⚠️  No se pudo actualizar la contraseña, pero el usuario existe');
        } else {
          console.log('✅ Contraseña actualizada exitosamente');
        }
      } else {
        throw error;
      }
    } else {
      console.log('✅ Usuario de demostración creado exitosamente:');
      console.log('   📧 Email: admin@miempresa.cl');
      console.log('   🔑 Password: demo123');
      console.log('   🏢 Empresa: Mi Empresa Demo');
      console.log('   👑 Role: corporate admin');
      console.log('   🆔 ID:', data.user.id);
    }

    console.log('\n🎯 CREDENCIALES PARA USAR EN LA APLICACIÓN:');
    console.log('==========================================');
    console.log('Email:    admin@miempresa.cl');
    console.log('Password: demo123');
    console.log('');

    console.log('🌐 URL para probar:');
    console.log('http://localhost:8080/servicios/corporativo');
    console.log('');

    console.log('📱 Versión móvil:');
    console.log('http://localhost:8080/servicios/corporativo (en móvil)');
    console.log('');

    console.log('🎉 ¡Sistema corporativo listo para usar!');

  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    
    if (error.message.includes('already registered')) {
      console.log('\n💡 El usuario ya existe. Las credenciales deberían funcionar:');
      console.log('   📧 Email: admin@miempresa.cl');
      console.log('   🔑 Password: demo123');
    }
  }
}

// Ejecutar script
createDemoUser();
