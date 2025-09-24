import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 IDENTIFICAR PROYECTO CORRECTO DE SUPABASE\n');

console.log('📋 SITUACIÓN ACTUAL:');
console.log('   - Proyecto en .env.local: qrgelocijmwnxcckxbdg (NO funciona)');
console.log('   - Proyecto con datos: ??? (SÍ funciona)');
console.log('   - Datos confirmados: 25+ reservas de "benjamin soza"\n');

console.log('🎯 SOLUCIÓN:');
console.log('   1. Ve a Supabase Dashboard: https://supabase.com/dashboard');
console.log('   2. Busca el proyecto que tiene los datos de reservas');
console.log('   3. Copia las credenciales correctas\n');

console.log('📊 DATOS QUE DEBES VER EN EL PROYECTO CORRECTO:');
console.log('   - Tabla: reservas');
console.log('   - Registros: 25+');
console.log('   - Datos de prueba: "benjamin soza", "benja.soza@gmail.com"');
console.log('   - Fechas: septiembre 2025\n');

console.log('🔧 UNA VEZ QUE ENCUENTRES EL PROYECTO CORRECTO:');
console.log('   1. Ve a Settings → API');
console.log('   2. Copia:');
console.log('      - Project URL');
console.log('      - anon public key');
console.log('      - service_role key');
console.log('   3. Actualiza .env.local con las credenciales correctas\n');

console.log('📝 COMANDO PARA ACTUALIZAR:');
console.log('   node scripts/update-correct-credentials.js\n');

console.log('🚨 IMPORTANTE:');
console.log('   - NO uses las credenciales de qrgelocijmwnxcckxbdg');
console.log('   - Busca el proyecto que SÍ tiene los datos');
console.log('   - Ese proyecto debe estar activo y funcionando\n');

console.log('✅ UNA VEZ CORREGIDO:');
console.log('   - El sistema funcionará completamente');
console.log('   - Los emails se enviarán realmente');
console.log('   - Las reservas se guardarán correctamente');
