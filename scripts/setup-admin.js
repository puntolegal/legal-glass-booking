// Script para configurar el primer usuario administrador
// Uso: node scripts/setup-admin.js

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurado');
  console.log('💡 Asegúrate de tener la variable de entorno SUPABASE_SERVICE_ROLE_KEY configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('🔧 Configurando usuario administrador...');
    
    // Solicitar datos del administrador
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    const adminEmail = await question('📧 Email del administrador: ');
    const adminPassword = await question('🔒 Contraseña del administrador: ');
    const adminName = await question('👤 Nombre del administrador: ');

    rl.close();

    if (!adminEmail || !adminPassword || !adminName) {
      console.error('❌ Error: Todos los campos son requeridos');
      process.exit(1);
    }

    // 1. Crear usuario en auth.users
    console.log('👤 Creando usuario en autenticación...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        nombre: adminName
      }
    });

    if (authError) {
      console.error('❌ Error creando usuario:', authError.message);
      process.exit(1);
    }

    console.log('✅ Usuario creado exitosamente');

    // 2. Actualizar el perfil para asignar rol de administrador
    console.log('👑 Asignando rol de administrador...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin',
        is_active: true,
        nombre: adminName
      })
      .eq('user_id', authData.user.id);

    if (profileError) {
      console.error('❌ Error actualizando perfil:', profileError.message);
      process.exit(1);
    }

    console.log('✅ Rol de administrador asignado exitosamente');

    // 3. Verificar que todo esté correcto
    const { data: profile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (verifyError) {
      console.error('❌ Error verificando perfil:', verifyError.message);
      process.exit(1);
    }

    console.log('\n🎉 ¡Usuario administrador configurado exitosamente!');
    console.log('📋 Detalles del administrador:');
    console.log(`   👤 Nombre: ${profile.nombre}`);
    console.log(`   📧 Email: ${profile.email}`);
    console.log(`   👑 Rol: ${profile.role}`);
    console.log(`   ✅ Estado: ${profile.is_active ? 'Activo' : 'Inactivo'}`);
    console.log(`   🆔 User ID: ${profile.user_id}`);
    
    console.log('\n🔐 Ahora puedes iniciar sesión en la aplicación con:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Contraseña: ${adminPassword}`);
    
    console.log('\n🚀 Para acceder al panel de administración, ve a:');
    console.log('   http://localhost:8081/admin');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

// Función para listar usuarios existentes
async function listUsers() {
  try {
    console.log('📋 Listando usuarios existentes...');
    
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error listando usuarios:', error.message);
      return;
    }

    if (users.length === 0) {
      console.log('📭 No hay usuarios registrados');
      return;
    }

    console.log(`\n👥 Usuarios registrados (${users.length}):`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.nombre || 'Sin nombre'}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👑 Rol: ${user.role}`);
      console.log(`   ✅ Estado: ${user.is_active ? 'Activo' : 'Inactivo'}`);
      console.log(`   📅 Registro: ${new Date(user.created_at).toLocaleDateString('es-CL')}`);
    });

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Función para cambiar rol de usuario existente
async function changeUserRole() {
  try {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    const userEmail = await question('📧 Email del usuario: ');
    const newRole = await question('👑 Nuevo rol (admin/abogado/cliente): ');

    rl.close();

    if (!['admin', 'abogado', 'cliente'].includes(newRole)) {
      console.error('❌ Error: Rol debe ser admin, abogado o cliente');
      return;
    }

    console.log('🔄 Cambiando rol de usuario...');
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('email', userEmail);

    if (error) {
      console.error('❌ Error cambiando rol:', error.message);
      return;
    }

    console.log('✅ Rol cambiado exitosamente');

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Función principal
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'setup':
      await setupAdmin();
      break;
    case 'list':
      await listUsers();
      break;
    case 'change-role':
      await changeUserRole();
      break;
    default:
      console.log('🔧 Script de administración de usuarios');
      console.log('\n📖 Uso:');
      console.log('   node scripts/setup-admin.js setup     - Crear nuevo administrador');
      console.log('   node scripts/setup-admin.js list      - Listar usuarios existentes');
      console.log('   node scripts/setup-admin.js change-role - Cambiar rol de usuario');
      console.log('\n💡 Asegúrate de tener configuradas las variables de entorno:');
      console.log('   - VITE_SUPABASE_URL');
      console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  }
}

main().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
}); 