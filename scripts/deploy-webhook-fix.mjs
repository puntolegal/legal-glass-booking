// Script para desplegar la corrección del webhook de MercadoPago
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Desplegando corrección del webhook de MercadoPago...\n');

// Verificar si Supabase CLI está instalado
try {
  execSync('which supabase', { stdio: 'pipe' });
  console.log('✅ Supabase CLI encontrado');
} catch (error) {
  console.log('❌ Supabase CLI no encontrado');
  console.log('📦 Instalando Supabase CLI...');
  
  try {
    execSync('brew install supabase/tap/supabase', { stdio: 'inherit' });
    console.log('✅ Supabase CLI instalado correctamente');
  } catch (installError) {
    console.log('❌ Error instalando Supabase CLI');
    console.log('🔧 Solución alternativa:');
    console.log('   1. Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/functions');
    console.log('   2. Editar la función "mercadopago-webhook"');
    console.log('   3. Copiar el código actualizado y hacer deploy');
    process.exit(1);
  }
}

// Verificar si está logueado
try {
  execSync('supabase projects list', { stdio: 'pipe' });
  console.log('✅ Autenticado en Supabase');
} catch (error) {
  console.log('❌ No autenticado en Supabase');
  console.log('🔐 Ejecutando login...');
  console.log('⚠️  Necesitarás hacer login manualmente');
  console.log('   Ejecuta: supabase login');
  process.exit(1);
}

// Verificar si el proyecto está vinculado
try {
  execSync('supabase status', { stdio: 'pipe' });
  console.log('✅ Proyecto vinculado');
} catch (error) {
  console.log('❌ Proyecto no vinculado');
  console.log('🔗 Vinculando proyecto...');
  try {
    execSync('supabase link --project-ref qrgelocijmwnxcckxbdg', { stdio: 'inherit' });
    console.log('✅ Proyecto vinculado correctamente');
  } catch (linkError) {
    console.log('❌ Error vinculando proyecto');
    process.exit(1);
  }
}

// Desplegar la función específica
console.log('📦 Desplegando función mercadopago-webhook...');
try {
  execSync('supabase functions deploy mercadopago-webhook', { stdio: 'inherit' });
  console.log('✅ Función desplegada correctamente');
} catch (error) {
  console.log('❌ Error desplegando función');
  console.log('🔧 Solución alternativa:');
  console.log('   1. Ir a: https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/functions');
  console.log('   2. Seleccionar "mercadopago-webhook"');
  console.log('   3. Copiar el código actualizado y hacer deploy');
  process.exit(1);
}

console.log('\n🎉 ¡Webhook desplegado correctamente!');
console.log('🧪 Ahora puedes probar la URL en MercadoPago:');
console.log('   https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook');
