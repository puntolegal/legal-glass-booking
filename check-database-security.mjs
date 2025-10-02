#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no configurado');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔍 VERIFICACIÓN DE SEGURIDAD DE BASE DE DATOS');
console.log('=' .repeat(60));

async function checkRLSStatus() {
  console.log('\n📋 PASO 1: Verificando estado de RLS...');
  
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            schemaname,
            tablename,
            rowsecurity as rls_enabled
          FROM pg_tables 
          WHERE schemaname = 'public' 
          AND tablename IN ('reservas', 'reservas_backup')
          ORDER BY tablename;
        `
      });
    
    if (error) {
      console.log('⚠️ No se puede verificar RLS directamente (función exec_sql no disponible)');
      return false;
    }
    
    console.log('📊 Estado de RLS:');
    data.forEach(table => {
      const status = table.rls_enabled ? '✅ Habilitado' : '❌ Deshabilitado';
      console.log(`   • ${table.tablename}: ${status}`);
    });
    
    return data.every(table => table.rls_enabled);
  } catch (error) {
    console.log('❌ Error verificando RLS:', error.message);
    return false;
  }
}

async function checkPolicies() {
  console.log('\n📋 PASO 2: Verificando políticas RLS...');
  
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            tablename,
            policyname,
            cmd,
            roles
          FROM pg_policies 
          WHERE schemaname = 'public' 
          AND tablename IN ('reservas', 'reservas_backup')
          ORDER BY tablename, policyname;
        `
      });
    
    if (error) {
      console.log('⚠️ No se puede verificar políticas directamente');
      return false;
    }
    
    console.log('📊 Políticas encontradas:');
    const policiesByTable = {};
    data.forEach(policy => {
      if (!policiesByTable[policy.tablename]) {
        policiesByTable[policy.tablename] = [];
      }
      policiesByTable[policy.tablename].push(policy);
    });
    
    Object.keys(policiesByTable).forEach(table => {
      console.log(`   📋 ${table}:`);
      policiesByTable[table].forEach(policy => {
        console.log(`      • ${policy.policyname} (${policy.cmd})`);
      });
    });
    
    return data.length > 0;
  } catch (error) {
    console.log('❌ Error verificando políticas:', error.message);
    return false;
  }
}

async function testDataAccess() {
  console.log('\n📋 PASO 3: Probando acceso a datos...');
  
  try {
    // Test 1: Acceso con clave anónima
    const anonClient = createClient(SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
    
    console.log('   🔍 Probando acceso con clave anónima...');
    const { data: anonData, error: anonError } = await anonClient
      .from('reservas')
      .select('id, nombre, email, telefono')
      .limit(1);
    
    if (anonError) {
      console.log(`   ✅ Acceso anónimo bloqueado: ${anonError.message}`);
    } else if (anonData && anonData.length > 0) {
      console.log('   ❌ Acceso anónimo permitido (PROBLEMA DE SEGURIDAD)');
      console.log('   📋 Datos expuestos:', JSON.stringify(anonData[0], null, 2));
      return false;
    } else {
      console.log('   ✅ Acceso anónimo bloqueado (sin datos)');
    }
    
    // Test 2: Acceso con clave de servicio
    console.log('   🔍 Probando acceso con clave de servicio...');
    const { data: serviceData, error: serviceError } = await supabase
      .from('reservas')
      .select('id, nombre, email, telefono')
      .limit(1);
    
    if (serviceError) {
      console.log(`   ❌ Acceso de servicio bloqueado: ${serviceError.message}`);
      return false;
    } else {
      console.log('   ✅ Acceso de servicio permitido');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error probando acceso:', error.message);
    return false;
  }
}

async function checkBackupTable() {
  console.log('\n📋 PASO 4: Verificando tabla de backup...');
  
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_name = 'reservas_backup' 
            AND table_schema = 'public'
          ) as backup_exists;
        `
      });
    
    if (error) {
      console.log('⚠️ No se puede verificar tabla de backup');
      return false;
    }
    
    const backupExists = data[0]?.backup_exists;
    
    if (backupExists) {
      console.log('   📋 Tabla reservas_backup existe');
      
      // Verificar RLS en tabla de backup
      const { data: backupRLS, error: backupError } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT rowsecurity as rls_enabled
            FROM pg_tables 
            WHERE tablename = 'reservas_backup' 
            AND schemaname = 'public';
          `
        });
      
      if (backupError) {
        console.log('   ⚠️ No se puede verificar RLS en tabla de backup');
      } else {
        const rlsEnabled = backupRLS[0]?.rls_enabled;
        if (rlsEnabled) {
          console.log('   ✅ RLS habilitado en tabla de backup');
        } else {
          console.log('   ❌ RLS NO habilitado en tabla de backup (PROBLEMA DE SEGURIDAD)');
          return false;
        }
      }
    } else {
      console.log('   ℹ️ Tabla reservas_backup no existe');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error verificando tabla de backup:', error.message);
    return false;
  }
}

async function checkExtensions() {
  console.log('\n📋 PASO 5: Verificando extensiones en schema public...');
  
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            extname as extension_name,
            extnamespace::regnamespace as schema_name
          FROM pg_extension 
          WHERE extnamespace::regnamespace::text = 'public'
          ORDER BY extname;
        `
      });
    
    if (error) {
      console.log('⚠️ No se puede verificar extensiones');
      return false;
    }
    
    if (data.length > 0) {
      console.log('   ⚠️ Extensiones en schema public:');
      data.forEach(ext => {
        console.log(`      • ${ext.extension_name}`);
      });
      console.log('   💡 Considerar mover extensiones a schema dedicado');
    } else {
      console.log('   ✅ No hay extensiones en schema public');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error verificando extensiones:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de seguridad...\n');
  
  const results = {
    rls: false,
    policies: false,
    dataAccess: false,
    backup: false,
    extensions: false
  };
  
  // Verificaciones
  results.rls = await checkRLSStatus();
  results.policies = await checkPolicies();
  results.dataAccess = await testDataAccess();
  results.backup = await checkBackupTable();
  results.extensions = await checkExtensions();
  
  // Resumen final
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMEN DE VERIFICACIÓN DE SEGURIDAD');
  console.log('=' .repeat(60));
  
  console.log('\n🔒 ESTADO DE SEGURIDAD:');
  console.log(`• RLS habilitado: ${results.rls ? '✅' : '❌'}`);
  console.log(`• Políticas configuradas: ${results.policies ? '✅' : '❌'}`);
  console.log(`• Acceso a datos controlado: ${results.dataAccess ? '✅' : '❌'}`);
  console.log(`• Tabla de backup segura: ${results.backup ? '✅' : '❌'}`);
  console.log(`• Extensiones en schema correcto: ${results.extensions ? '✅' : '❌'}`);
  
  const allSecure = Object.values(results).every(Boolean);
  
  console.log('\n' + '=' .repeat(60));
  if (allSecure) {
    console.log('🎉 BASE DE DATOS SEGURA');
    console.log('✅ Todas las verificaciones de seguridad pasaron');
    console.log('✅ Datos de clientes protegidos correctamente');
  } else {
    console.log('⚠️ PROBLEMAS DE SEGURIDAD DETECTADOS');
    console.log('❌ Se requieren correcciones de seguridad');
    console.log('💡 Ejecutar fix-database-security.sql para corregir');
  }
  console.log('=' .repeat(60));
}

main().catch(console.error);
