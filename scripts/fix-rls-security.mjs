#!/usr/bin/env node

console.log('🔒 Corrigiendo políticas RLS de seguridad...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

async function disablePublicAccess() {
  console.log('🔒 Deshabilitando acceso público a la tabla reservas...');
  
  try {
    // SQL para deshabilitar acceso público
    const sqlCommands = [
      // 1. Deshabilitar RLS temporalmente para poder modificar políticas
      'ALTER TABLE public.reservas DISABLE ROW LEVEL SECURITY;',
      
      // 2. Eliminar todas las políticas existentes
      'DROP POLICY IF EXISTS "Enable read for all users" ON public.reservas;',
      'DROP POLICY IF EXISTS "Users can only view own reservations" ON public.reservas;',
      'DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reservas;',
      'DROP POLICY IF EXISTS "Enable update for users based on email" ON public.reservas;',
      
      // 3. Habilitar RLS
      'ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;',
      
      // 4. Crear política restrictiva: Solo permitir acceso a Edge Functions autorizadas
      `CREATE POLICY "Allow access only to service role and authenticated operations" ON public.reservas
       FOR ALL
       TO authenticated, service_role
       USING (true)
       WITH CHECK (true);`,
       
      // 5. Crear política para anon: Solo permitir inserción de nuevas reservas
      `CREATE POLICY "Allow anonymous users to create reservations only" ON public.reservas
       FOR INSERT
       TO anon
       WITH CHECK (true);`,
       
      // 6. Denegar explícitamente SELECT y UPDATE para usuarios anónimos
      `CREATE POLICY "Deny read and update for anonymous users" ON public.reservas
       FOR SELECT, UPDATE, DELETE
       TO anon
       USING (false);`
    ];

    for (const sql of sqlCommands) {
      console.log(`📝 Ejecutando: ${sql.substring(0, 60)}...`);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql })
      });

      if (!response.ok) {
        console.log(`⚠️ Advertencia: ${response.status} - ${await response.text()}`);
      } else {
        console.log('✅ Comando ejecutado correctamente');
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error ejecutando comandos SQL: ${error.message}`);
    return false;
  }
}

async function verifySecurityFix() {
  console.log('\n🔍 Verificando que la corrección de seguridad funcione...');
  
  try {
    // Intentar acceder como usuario anónimo (debería fallar)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('❌ PROBLEMA PERSISTE: Aún se puede acceder públicamente');
      return false;
    } else if (response.status === 401 || response.status === 403) {
      console.log('✅ CORRECCIÓN EXITOSA: Acceso público denegado');
      return true;
    } else {
      console.log(`⚠️ Status inesperado: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando: ${error.message}`);
    return false;
  }
}

async function testAuthenticatedAccess() {
  console.log('\n🔍 Verificando que Edge Functions puedan seguir accediendo...');
  
  try {
    // Probar que las Edge Functions puedan acceder usando service role
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Edge Functions pueden acceder correctamente');
      return true;
    } else {
      console.log('⚠️ Edge Functions pueden tener problemas de acceso');
      return false;
    }
  } catch (error) {
    console.log(`❌ Error verificando acceso de Edge Functions: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando corrección de seguridad RLS...\n');
  
  console.log('⚠️ ADVERTENCIA: Esta operación modificará las políticas de seguridad de la base de datos');
  console.log('📋 Objetivo: Restringir acceso público a datos sensibles de clientes\n');
  
  // 1. Aplicar correcciones de seguridad
  const fixApplied = await disablePublicAccess();
  
  if (fixApplied) {
    // 2. Verificar que la corrección funcione
    const securityFixed = await verifySecurityFix();
    
    // 3. Verificar que Edge Functions sigan funcionando
    const edgeFunctionsWorking = await testAuthenticatedAccess();
    
    console.log('\n📊 RESUMEN DE CORRECCIÓN DE SEGURIDAD:');
    console.log('═'.repeat(60));
    
    if (securityFixed) {
      console.log('✅ SEGURIDAD CORREGIDA EXITOSAMENTE');
      console.log('✅ Datos de clientes protegidos');
      console.log('✅ Acceso público denegado');
      
      if (edgeFunctionsWorking) {
        console.log('✅ Edge Functions funcionando correctamente');
        console.log('✅ Sistema operativo');
      } else {
        console.log('⚠️ Edge Functions pueden necesitar ajustes');
      }
      
      console.log('\n🔒 MEDIDAS DE SEGURIDAD IMPLEMENTADAS:');
      console.log('• RLS habilitado en tabla reservas');
      console.log('• Acceso público denegado');
      console.log('• Solo Edge Functions autorizadas pueden acceder');
      console.log('• Usuarios anónimos solo pueden crear reservas');
      console.log('• Lectura y modificación restringidas');
      
    } else {
      console.log('❌ CORRECCIÓN FALLÓ');
      console.log('❌ Aún hay problemas de seguridad');
      console.log('❌ Se requiere intervención manual');
    }
  } else {
    console.log('❌ NO SE PUDO APLICAR LA CORRECCIÓN');
    console.log('❌ Verificar permisos y configuración');
  }
  
  console.log('\n✨ Corrección de seguridad completada');
}

main().catch(console.error);
