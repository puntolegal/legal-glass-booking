import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 OBTENER CREDENCIALES CORRECTAS DE SUPABASE\n');

console.log('📋 INSTRUCCIONES PARA OBTENER LAS CREDENCIALES CORRECTAS:\n');

console.log('1. Ve a Supabase Dashboard:');
console.log('   https://supabase.com/dashboard\n');

console.log('2. Busca el proyecto que SÍ está funcionando (el que tiene los datos de reservas)');
console.log('   - Debe tener datos en la tabla "reservas"');
console.log('   - Debe estar activo y funcionando\n');

console.log('3. Una vez que encuentres el proyecto correcto:');
console.log('   - Ve a Settings → API');
console.log('   - Copia la "Project URL"');
console.log('   - Copia la "anon public" key');
console.log('   - Copia la "service_role" key\n');

console.log('4. Ejecuta este comando con las credenciales correctas:');
console.log('   node scripts/update-supabase-credentials-correct.js\n');

console.log('5. O actualiza manualmente el archivo .env.local con:');
console.log('   VITE_SUPABASE_URL=tu_project_url_aqui');
console.log('   VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui');
console.log('   VITE_SUPABASE_SERVICE_ROLE=tu_service_role_aqui\n');

console.log('🔍 PROYECTOS POSIBLES:');
console.log('   - El proyecto actual (qrgelocijmwnxcckxbdg) no funciona');
console.log('   - Debe haber otro proyecto con los datos de reservas');
console.log('   - Busca en tu dashboard de Supabase\n');

console.log('📊 DATOS QUE DEBES VER:');
console.log('   - 25+ registros en la tabla reservas');
console.log('   - Datos de "benjamin soza" y "benja.soza@gmail.com"');
console.log('   - Fechas de septiembre 2025\n');

console.log('✅ Una vez que tengas las credenciales correctas:');
console.log('   - El sistema funcionará completamente');
console.log('   - Los emails se enviarán realmente');
console.log('   - Las reservas se guardarán correctamente\n');

console.log('🚨 IMPORTANTE:');
console.log('   - NO uses las credenciales del proyecto qrgelocijmwnxcckxbdg');
console.log('   - Busca el proyecto que SÍ tiene los datos');
console.log('   - Ese proyecto debe estar activo y funcionando');
