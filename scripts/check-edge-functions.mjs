// Script para verificar qué Edge Functions están desplegadas
import fetch from "node-fetch";

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';

console.log('🔍 Verificando Edge Functions desplegadas en Supabase...\n');

// Lista de Edge Functions que deberían estar desplegadas
const expectedFunctions = [
  'create-mercadopago-preference',
  'mercadopago-webhook',
  'send-booking-emails',
  'send-resend-emails'
];

async function checkEdgeFunction(functionName) {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;
  
  try {
    const response = await fetch(url, {
      method: 'OPTIONS', // Usar OPTIONS para verificar si existe sin autenticación
    });
    
    console.log(`${response.ok ? '✅' : '❌'} ${functionName}: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log(`   📍 URL: ${url}`);
      console.log(`   📋 Headers:`, Object.fromEntries(response.headers.entries()));
    }
    
    return response.ok;
  } catch (error) {
    console.log(`❌ ${functionName}: Error - ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('📋 Verificando Edge Functions:\n');
  
  const results = {};
  
  for (const func of expectedFunctions) {
    results[func] = await checkEdgeFunction(func);
    console.log(''); // Línea en blanco
  }
  
  console.log('📊 Resumen:');
  console.log('┌─────────────────────────────────────┬─────────┐');
  console.log('│ Edge Function                      │ Estado  │');
  console.log('├─────────────────────────────────────┼─────────┤');
  
  expectedFunctions.forEach(func => {
    const status = results[func] ? '✅ Desplegada' : '❌ No desplegada';
    const name = func.padEnd(35);
    console.log(`│ ${name} │ ${status} │`);
  });
  
  console.log('└─────────────────────────────────────┴─────────┘');
  
  const deployedCount = Object.values(results).filter(Boolean).length;
  const totalCount = expectedFunctions.length;
  
  console.log(`\n📈 Progreso: ${deployedCount}/${totalCount} Edge Functions desplegadas`);
  
  if (deployedCount === totalCount) {
    console.log('\n🎉 ¡Todas las Edge Functions están desplegadas!');
  } else {
    console.log('\n⚠️  Faltan Edge Functions por desplegar:');
    expectedFunctions.forEach(func => {
      if (!results[func]) {
        console.log(`   - ${func}`);
      }
    });
    
    console.log('\n🚀 Para desplegar las Edge Functions faltantes:');
    console.log('   1. Instalar Supabase CLI: brew install supabase/tap/supabase');
    console.log('   2. Login: supabase login');
    console.log('   3. Vincular proyecto: supabase link --project-ref qrgelocijmwnxcckxbdg');
    console.log('   4. Desplegar: supabase functions deploy');
    console.log('\n📖 O usar el dashboard web:');
    console.log('   https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg/functions');
  }
}

main().catch(console.error);
