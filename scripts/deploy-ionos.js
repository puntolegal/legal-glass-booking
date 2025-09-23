#!/usr/bin/env node

/**
 * Script para preparar archivos para deploy en IONOS
 * Ejecutar: node scripts/deploy-ionos.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 PREPARANDO DEPLOY PARA IONOS - PUNTO LEGAL\n');

// Cargar configuración de producción
const configPath = path.join(__dirname, '..', 'production-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

console.log('📋 Configuración cargada:');
console.log(`   Dominio: puntolegal.online`);
console.log(`   Variables: ${Object.keys(config.variables).length}`);
console.log(`   URLs: ${Object.keys(config.urls).length}`);

// Crear archivo .env temporal para el build
const envContent = Object.entries(config.variables)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

const envPath = path.join(__dirname, '..', '.env.production.temp');
fs.writeFileSync(envPath, envContent);

console.log('✅ Archivo .env temporal creado');

try {
  // Limpiar build anterior
  console.log('\n🧹 Limpiando build anterior...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  console.log('✅ Build anterior eliminado');

  // Hacer build de producción
  console.log('\n🔨 Iniciando build de producción...');
  
  const buildCommand = 'npm run build';
  console.log(`Ejecutando: ${buildCommand}`);
  
  execSync(buildCommand, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      ...config.variables,
      NODE_ENV: 'production'
    }
  });
  
  console.log('✅ Build de producción completado');

  // Verificar que los archivos se generaron
  const distPath = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('La carpeta dist no se generó');
  }

  const files = fs.readdirSync(distPath);
  console.log(`📁 Archivos generados: ${files.length}`);

  // Crear archivo .htaccess para IONOS
  console.log('\n📝 Creando archivo .htaccess para IONOS...');
  const htaccessContent = `# Configuración para IONOS - Punto Legal
RewriteEngine On

# Redirigir HTTP a HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Configurar headers para SPA
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Configurar caché para assets estáticos
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

# Configurar compresión
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Configurar rutas para SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Configurar tipos MIME
AddType application/javascript .js
AddType text/css .css
`;

  const htaccessPath = path.join(distPath, '.htaccess');
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log('✅ Archivo .htaccess creado');

  // Crear archivo de instrucciones de deploy
  console.log('\n📝 Creando instrucciones de deploy...');
  const deployInstructions = `# INSTRUCCIONES DE DEPLOY PARA IONOS

## ARCHIVOS GENERADOS
- Carpeta: dist/
- Archivos: ${files.length}
- Incluye: .htaccess para configuración

## PASOS PARA SUBIR A IONOS

### Método 1: FTP/SFTP
1. Conecta a tu servidor IONOS via FTP
2. Navega al directorio htdocs/ o public_html/
3. Sube TODOS los archivos de la carpeta dist/
4. Asegúrate de que index.html esté en la raíz

### Método 2: File Manager
1. Ve al panel de control de IONOS
2. Abre File Manager
3. Navega a htdocs/ o public_html/
4. Sube todos los archivos de dist/

## VERIFICACIÓN POST-DEPLOY
- https://puntolegal.online
- https://puntolegal.online/agendamiento
- https://puntolegal.online/payment-success

## VARIABLES DE ENTORNO
Configurar en IONOS Panel → Environment Variables:
${Object.entries(config.variables).map(([key, value]) => `${key}=${value}`).join('\n')}

## CONFIGURACIÓN MERCADOPAGO
URLs a configurar en MercadoPago Dashboard:
${Object.entries(config.urls).map(([key, value]) => `${key}: ${value}`).join('\n')}
`;

  const instructionsPath = path.join(distPath, 'DEPLOY_INSTRUCTIONS.txt');
  fs.writeFileSync(instructionsPath, deployInstructions);
  console.log('✅ Instrucciones de deploy creadas');

  // Limpiar archivo temporal
  fs.unlinkSync(envPath);
  console.log('🧹 Archivo temporal eliminado');
  
  console.log('\n🎉 ¡PREPARACIÓN PARA IONOS COMPLETA!');
  console.log('📁 Archivos listos en: dist/');
  console.log('📝 Instrucciones en: dist/DEPLOY_INSTRUCTIONS.txt');
  console.log('🚀 Listo para subir a IONOS');
  
} catch (error) {
  console.error('❌ Error durante la preparación:', error.message);
  
  // Limpiar archivo temporal en caso de error
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath);
  }
  
  process.exit(1);
}
