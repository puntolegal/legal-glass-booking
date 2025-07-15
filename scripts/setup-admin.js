// Script para configurar usuario admin en Supabase
// Ejecutar con: node scripts/setup-admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminUser() {
  try {
    console.log('🚀 Iniciando configuración del usuario admin...');
    
    // Datos del usuario admin
    const adminData = {
      email: 'sozajimenez@puntolegal.cl',
      password: 'puntolegalonline555',
      user_metadata: {
        full_name: 'Sofia Jimenez',
        role: 'admin',
        is_active: true
      }
    };

    // 1. Crear usuario en auth.users
    console.log('📝 Creando usuario en auth.users...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
      user_metadata: adminData.user_metadata
    });

    if (authError) {
      console.error('❌ Error creando usuario en auth:', authError);
      return;
    }

    console.log('✅ Usuario creado en auth.users:', authUser.user.id);

    // 2. Insertar en la tabla profiles
    console.log('📝 Insertando en tabla profiles...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: adminData.email,
        full_name: adminData.user_metadata.full_name,
        role: adminData.user_metadata.role,
        is_active: adminData.user_metadata.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('❌ Error insertando en profiles:', profileError);
      return;
    }

    console.log('✅ Perfil creado en tabla profiles');

    // 3. Verificar que el usuario existe
    console.log('🔍 Verificando usuario creado...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminData.email)
      .single();

    if (verifyError) {
      console.error('❌ Error verificando usuario:', verifyError);
      return;
    }

    console.log('✅ Usuario verificado:', verifyUser);

    // 4. Configurar políticas de seguridad (opcional)
    console.log('🔒 Configurando políticas de seguridad...');
    
    // Ejemplo de política para que solo admins puedan ver todos los perfiles
    const { error: policyError } = await supabase.rpc('create_admin_policy', {
      table_name: 'profiles',
      policy_name: 'admin_full_access',
      definition: 'CREATE POLICY admin_full_access ON profiles FOR ALL TO authenticated USING (role = \'admin\')'
    });

    if (policyError) {
      console.log('⚠️  No se pudo crear política automáticamente (puede que ya exista):', policyError.message);
    } else {
      console.log('✅ Política de seguridad creada');
    }

    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Contraseña: ${adminData.password}`);
    console.log(`   Rol: ${adminData.user_metadata.role}`);
    console.log(`   Estado: ${adminData.user_metadata.is_active ? 'Activo' : 'Inactivo'}`);
    console.log(`   ID de Usuario: ${authUser.user.id}`);
    
    console.log('\n🔐 Credenciales de acceso:');
    console.log(`   Usuario: sozajimenez`);
    console.log(`   Clave: puntolegalonline555`);
    
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Cambia la contraseña después del primer inicio de sesión');
    console.log('   - Mantén estas credenciales seguras');
    console.log('   - Considera usar autenticación de dos factores');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Función para verificar si el usuario ya existe
async function checkExistingUser() {
  try {
    console.log('🔍 Verificando si el usuario admin ya existe...');
    
    const { data: existingUser, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'sozajimenez@puntolegal.cl')
      .single();

    if (error && error.code === 'PGRST116') {
      console.log('✅ Usuario admin no existe, procediendo con la creación...');
      return false;
    }

    if (existingUser) {
      console.log('⚠️  El usuario admin ya existe:');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Rol: ${existingUser.role}`);
      console.log(`   Estado: ${existingUser.is_active ? 'Activo' : 'Inactivo'}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error verificando usuario existente:', error);
    return false;
  }
}

// Función para actualizar usuario existente
async function updateExistingUser() {
  try {
    console.log('🔄 Actualizando usuario admin existente...');
    
    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('email', 'sozajimenez@puntolegal.cl')
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando usuario:', error);
      return;
    }

    console.log('✅ Usuario actualizado:', updatedUser);
  } catch (error) {
    console.error('❌ Error en actualización:', error);
  }
}

// Función principal
async function main() {
  console.log('🏢 Configuración de Usuario Admin - Punto Legal');
  console.log('==============================================\n');

  // Verificar variables de entorno
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    console.error('❌ Error: VITE_SUPABASE_URL no está configurado');
    console.log('   Asegúrate de tener un archivo .env con VITE_SUPABASE_URL');
    return;
  }

  if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurado');
    console.log('   Asegúrate de tener un archivo .env con SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const userExists = await checkExistingUser();
  
  if (userExists) {
    console.log('\n¿Deseas actualizar el usuario existente? (s/n)');
    // En un entorno real, aquí podrías usar readline para input del usuario
    // Por ahora, asumimos que sí
    await updateExistingUser();
  } else {
    await setupAdminUser();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupAdminUser, checkExistingUser, updateExistingUser }; 