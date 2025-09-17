#!/usr/bin/env node

/**
 * Script para sincronizar archivos MD con la carpeta pública
 * Uso: node scripts/sync-md-files.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function syncMdFiles() {
  console.log('🔄 Sincronizando archivos MD...\n');
  
  const sourceDir = path.join(__dirname, '../src/pages/apuntes/content');
  const targetDir = path.join(__dirname, '../public/apuntes-content');
  
  // Crear directorio de destino si no existe
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Función para copiar archivos recursivamente
  function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const files = fs.readdirSync(src);
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        copyRecursive(srcPath, destPath);
      });
    } else if (src.endsWith('.md')) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copiado: ${path.relative(sourceDir, src)}`);
    }
  }
  
  try {
    copyRecursive(sourceDir, targetDir);
    console.log('\n🎉 ¡Sincronización completada!');
    console.log(`📁 Archivos copiados a: ${targetDir}`);
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  syncMdFiles();
}

export { syncMdFiles }; 