import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 DEPLOY FINAL PARA PUNTOLEGAL.ONLINE - PUNTO LEGAL\n');

const envPath = path.join(__dirname, '..', '.env.temp');
const envProductionPath = path.join(__dirname, '..', '.env.production');

try {
  // Cargar configuración de producción
  const configPath = path.join(__dirname, '..', 'production-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Archivo de configuración no encontrado: ${configPath}`);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  console.log('📋 Configuración cargada:');
  console.log(`   Dominio: ${config.domain}`);
  console.log(`   Variables: ${Object.keys(config.variables).length}`);
  console.log(`   URLs: ${Object.keys(config.urls).length}`);

  // Crear un archivo .env temporal para el script
  const envContent = Object.entries(config.variables)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env temporal creado');

  // Limpiar build anterior completamente
  console.log('\n🧹 Limpiando build anterior...');
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('✅ Build anterior eliminado completamente');
  } else {
    console.log('ℹ️ No se encontró build anterior para limpiar.');
  }

  // Limpiar caché de Vite
  console.log('\n🧹 Limpiando caché de Vite...');
  const viteCacheDir = path.join(__dirname, '..', 'node_modules', '.vite');
  if (fs.existsSync(viteCacheDir)) {
    fs.rmSync(viteCacheDir, { recursive: true, force: true });
    console.log('✅ Caché de Vite eliminado');
  }

  console.log('\n🔨 Iniciando build de producción con timestamp...');
  
  // Crear archivo .env.production para Vite
  const envProductionContent = Object.entries(config.variables)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envProductionPath, envProductionContent);
  console.log('✅ Archivo .env.production creado');

  // Crear comando con variables de entorno y timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const envVars = Object.entries(config.variables)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  const buildCommand = `VITE_BUILD_TIMESTAMP="${timestamp}" ${envVars} npm run build`;
  console.log('🔧 Comando de build con timestamp:', buildCommand.substring(0, 100) + '...');

  execSync(buildCommand, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    shell: true,
    env: {
      ...process.env,
      ...config.variables,
      NODE_ENV: 'production',
      VITE_BUILD_TIMESTAMP: timestamp
    }
  });
  
  console.log('✅ Build de producción completado con timestamp');

  // Verificar que los archivos se generaron
  const distPath = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('La carpeta dist/ no se generó correctamente.');
  }
  const generatedFiles = fs.readdirSync(distPath, { recursive: true }).filter(f => !fs.statSync(path.join(distPath, f)).isDirectory());
  console.log(`📁 Archivos generados: ${generatedFiles.length}`);

  // Crear archivo .htaccess mejorado para IONOS
  console.log('\n📝 Creando archivo .htaccess mejorado para IONOS...');
  const htaccessContent = `
# Configuración para Punto Legal - IONOS
RewriteEngine On
RewriteBase /

# Forzar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache para archivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# SPA routing
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]

# Headers de seguridad
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options nosniff
  Header always set X-Frame-Options DENY
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>
  `;
  fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent.trim());
  console.log('✅ Archivo .htaccess mejorado creado');

  // Crear archivo de verificación
  console.log('\n📝 Creando archivo de verificación...');
  const verificationContent = `
# VERIFICACIÓN DE DEPLOY - PUNTO LEGAL
# Timestamp: ${timestamp}
# Fecha: ${new Date().toLocaleString('es-CL')}

## Variables de entorno embebidas:
${Object.entries(config.variables).map(([key, value]) => `${key}=${value.substring(0, 20)}...`).join('\n')}

## URLs configuradas:
${Object.entries(config.urls).map(([key, value]) => `${key}=${value}`).join('\n')}

## Archivos generados:
${generatedFiles.map(file => `- ${file}`).join('\n')}

## Instrucciones de deploy:
1. Subir TODOS los archivos de esta carpeta al servidor IONOS
2. Asegurarse de que index.html esté en la raíz del dominio
3. Verificar que .htaccess esté presente
4. Limpiar caché del navegador (Ctrl+F5)
5. Probar en modo incógnito

## Verificación post-deploy:
- https://puntolegal.online
- https://puntolegal.online/mercadopago
- https://puntolegal.online/agendamiento

## Debug en el navegador:
1. Abrir DevTools (F12)
2. Ir a Console
3. Escribir: console.log(import.meta.env)
4. Verificar que aparezcan las variables VITE_*
  `;
  fs.writeFileSync(path.join(distPath, 'VERIFICACION_DEPLOY.txt'), verificationContent);
  console.log('✅ Archivo de verificación creado');

  // Limpiar archivos temporales
  fs.unlinkSync(envPath);
  if (fs.existsSync(envProductionPath)) {
    fs.unlinkSync(envProductionPath);
  }
  console.log('🧹 Archivos temporales eliminados');
  
  console.log('\n🎉 ¡DEPLOY FINAL COMPLETADO!');
  console.log('📁 Archivos listos en: dist/');
  console.log('📝 Verificación en: dist/VERIFICACION_DEPLOY.txt');
  console.log('🚀 Listo para subir a IONOS');
  console.log(`⏰ Timestamp del build: ${timestamp}`);
  
  console.log('\n🔍 PRÓXIMOS PASOS:');
  console.log('1. Subir TODOS los archivos de dist/ a IONOS');
  console.log('2. Verificar que index.html esté en la raíz');
  console.log('3. Limpiar caché del navegador');
  console.log('4. Probar en https://puntolegal.online/mercadopago');
  
} catch (error) {
  console.error('❌ Error durante el deploy:', error.message);
  
  // Limpiar archivos temporales en caso de error
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
  if (fs.existsSync(envProductionPath)) {
    fs.unlinkSync(envProductionPath);
  }
  
  process.exit(1);
}
