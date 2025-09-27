import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VERIFICANDO BUILD DE PRODUCCIÓN PARA PUNTOLEGAL.ONLINE\n');

// Verificar que el build existe
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ No se encontró el build. Ejecuta primero:');
  console.log('   node scripts/deploy-ionos.js');
  process.exit(1);
}

console.log('✅ Build encontrado en dist/');

// Leer archivos principales
const indexPath = path.join(distPath, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

console.log(`📄 index.html: ${indexContent.length} caracteres`);

// Buscar archivos JS
const assetsPath = path.join(distPath, 'assets');
const jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));

console.log(`📁 Archivos JS encontrados: ${jsFiles.length}`);

// Verificar variables críticas
const criticalVars = {
  'VITE_MERCADOPAGO_ACCESS_TOKEN': 'APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947',
  'VITE_MERCADOPAGO_PUBLIC_KEY': 'APP_USR-ebca3c36-af6d-4e88-ac94-5e984ce6bf5e',
  'VITE_RESEND_API_KEY': 're_RNEXa27x_GqqBRBWbLjp3tFwVUFm1gX9C',
  'VITE_SUPABASE_URL': 'https://qrgelocijmwnxcckxbdg.supabase.co'
};

let allContent = indexContent;
jsFiles.forEach(file => {
  const filePath = path.join(assetsPath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  allContent += content;
  console.log(`📄 ${file}: ${content.length} caracteres`);
});

console.log(`\n📏 Tamaño total del contenido: ${allContent.length} caracteres`);

console.log('\n🔍 Verificando variables críticas:');
let foundVars = 0;
Object.entries(criticalVars).forEach(([key, value]) => {
  const found = allContent.includes(value);
  console.log(`   ${found ? '✅' : '❌'} ${key}: ${found ? 'Encontrada' : 'NO encontrada'}`);
  if (found) foundVars++;
});

console.log(`\n📊 Resumen: ${foundVars}/${Object.keys(criticalVars).length} variables críticas encontradas`);

if (foundVars === Object.keys(criticalVars).length) {
  console.log('\n🎉 ¡Todas las variables críticas están en el build!');
  console.log('✅ El build está listo para producción');
  
  console.log('\n🚀 INSTRUCCIONES PARA DEPLOY EN PUNTOLEGAL.ONLINE:');
  console.log('1. Subir TODOS los archivos de dist/ al servidor IONOS');
  console.log('2. Asegurarse de que index.html esté en la raíz del dominio');
  console.log('3. Verificar que .htaccess esté presente');
  console.log('4. Limpiar caché del navegador (Ctrl+F5)');
  console.log('5. Probar en modo incógnito');
  
  console.log('\n📁 Archivos que DEBEN subirse:');
  console.log('   - index.html (archivo principal)');
  console.log('   - .htaccess (configuración del servidor)');
  console.log('   - assets/ (carpeta completa con archivos JS/CSS)');
  console.log('   - Todos los archivos de imagen y recursos');
  
} else {
  console.log('\n❌ ALGUNAS VARIABLES FALTAN EN EL BUILD');
  console.log('🔧 Soluciones:');
  console.log('1. Regenerar el build: node scripts/deploy-ionos.js');
  console.log('2. Verificar que production-config.json tenga las variables correctas');
  console.log('3. Limpiar caché de Vite: rm -rf node_modules/.vite');
}

console.log('\n🔍 Para verificar en el navegador:');
console.log('1. Abrir DevTools (F12)');
console.log('2. Ir a Console');
console.log('3. Escribir: console.log(import.meta.env)');
console.log('4. Verificar que aparezcan las variables VITE_*');