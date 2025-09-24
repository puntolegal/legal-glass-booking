#!/usr/bin/env node

/**
 * Script para crear un usuario corporativo de demostración
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

// Crear cliente con service key para operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDemoCorporateUser() {
  console.log('🏢 Creando usuario corporativo de demostración...\n');

  try {
    // Crear usuario de demostración
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@puntolegal.cl',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        role: 'corporate',
        empresa: 'Punto Legal',
        access_level: 'admin'
      }
    });

    if (error) {
      throw error;
    }

    console.log('✅ Usuario corporativo creado exitosamente:');
    console.log('   📧 Email: admin@puntolegal.cl');
    console.log('   🔑 Password: demo123');
    console.log('   🏢 Empresa: Punto Legal');
    console.log('   👑 Role: corporate admin');
    console.log('   🆔 ID:', data.user.id);
    console.log('');

    console.log('🎯 CREDENCIALES PARA USAR EN LA APLICACIÓN:');
    console.log('=====================================');
    console.log('Email:    admin@puntolegal.cl');
    console.log('Password: demo123');
    console.log('');

    console.log('🌐 URL para probar:');
    console.log('http://localhost:8080/corporativo');
    console.log('');

    console.log('🎉 ¡Sistema corporativo listo para usar!');

  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    
    if (error.message.includes('User already registered')) {
      console.log('');
      console.log('ℹ️  El usuario ya existe. Puedes usar estas credenciales:');
      console.log('   📧 Email: admin@puntolegal.cl');
      console.log('   🔑 Password: demo123');
    }
  }
}

// Ejecutar el script
createDemoCorporateUser();
