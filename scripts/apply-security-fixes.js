#!/usr/bin/env node

/**
 * Script para aplicar correcciones de seguridad en Supabase
 * Uso: node scripts/apply-security-fixes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Aplicando correcciones de seguridad en Supabase...\n');

// Leer el archivo de migración
const migrationPath = path.join(__dirname, '../supabase/migrations/20250705000000-fix-security-warnings.sql');

try {
  const migrationContent = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('✅ Archivo de migración encontrado');
  console.log('📄 Contenido del archivo:');
  console.log('=' .repeat(50));
  console.log(migrationContent);
  console.log('=' .repeat(50));
  
  console.log('\n🚀 Instrucciones para aplicar las correcciones:');
  console.log('\n1. Ve a tu dashboard de Supabase');
  console.log('2. Navega a SQL Editor');
  console.log('3. Copia y pega el contenido anterior');
  console.log('4. Ejecuta el script');
  console.log('5. Ve a Authentication > Settings');
  console.log('6. Cambia OTP Expiry a 10 minutos');
  console.log('7. Verifica Security Advisor (debe mostrar 0 warnings)');
  
  console.log('\n📋 Checklist de verificación:');
  console.log('□ Ejecutar migración SQL');
  console.log('□ Configurar OTP expiry en dashboard');
  console.log('□ Verificar Security Advisor (0 warnings)');
  console.log('□ Probar funciones seguras');
  console.log('□ Verificar auditoría funciona');
  console.log('□ Confirmar permisos correctos');
  
  console.log('\n🔍 Para verificar después de aplicar:');
  console.log('- Ve a Security Advisor en Supabase');
  console.log('- Confirma que aparezcan 0 warnings');
  console.log('- Prueba las nuevas funciones seguras');
  
  console.log('\n📞 Si tienes problemas:');
  console.log('- Revisa los logs de Supabase');
  console.log('- Verifica la sintaxis SQL');
  console.log('- Contacta al soporte de Supabase');
  
} catch (error) {
  console.error('❌ Error al leer el archivo de migración:', error.message);
  console.log('\n💡 Asegúrate de que el archivo existe en:');
  console.log('supabase/migrations/20250705000000-fix-security-warnings.sql');
}

console.log('\n✅ Script completado. Sigue las instrucciones arriba para aplicar las correcciones.'); 