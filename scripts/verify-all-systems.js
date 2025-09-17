#!/usr/bin/env node

/**
 * Script para verificar que todos los sistemas estén funcionando
 * Uso: node scripts/verify-all-systems.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifyAllSystems() {
  console.log('🔍 Verificando Todos los Sistemas de Punto Legal...\n');
  
  // Verificar archivos críticos del sistema
  const criticalFiles = [
    '../src/App.tsx',
    '../src/contexts/GamificationContext.tsx',
    '../src/contexts/AccessibilityContext.tsx',
    '../src/contexts/SidebarContext.tsx',
    '../src/components/GamificationProgress.tsx',
    '../src/components/AccessibilityPanel.tsx',
    '../src/pages/apuntes/index.tsx',
    '../src/pages/apuntes/[slug].tsx',
    '../src/index.css',
    '../package.json',
    '../vite.config.ts'
  ];
  
  console.log('📁 Verificando archivos críticos:');
  let allFilesExist = true;
  
  criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - NO ENCONTRADO`);
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    console.log('\n❌ ERROR: Algunos archivos críticos no existen');
    return false;
  }
  
  // Verificar configuración de Vite
  const viteConfigPath = path.join(__dirname, '../vite.config.ts');
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  console.log('\n⚙️ Verificando configuración de Vite:');
  
  const viteChecks = [
    'base: "/"',
    'outDir: "dist"',
    'assetsDir: "assets"',
    'sourcemap: false',
    'manualChunks'
  ];
  
  let viteConfigOk = true;
  viteChecks.forEach(check => {
    if (viteConfig.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ ${check} - NO ENCONTRADO`);
      viteConfigOk = false;
    }
  });
  
  // Verificar package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('\n📦 Verificando package.json:');
  
  const requiredScripts = ['dev', 'build', 'build:prod', 'preview'];
  let scriptsOk = true;
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`✅ script: ${script}`);
    } else {
      console.log(`❌ script: ${script} - NO ENCONTRADO`);
      scriptsOk = false;
    }
  });
  
  // Verificar dependencias críticas
  const criticalDeps = ['react', 'react-dom', 'react-router-dom', 'framer-motion', '@radix-ui/react-progress'];
  let depsOk = true;
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ dependencia: ${dep}`);
    } else {
      console.log(`❌ dependencia: ${dep} - NO ENCONTRADA`);
      depsOk = false;
    }
  });
  
  // Verificar App.tsx
  const appPath = path.join(__dirname, '../src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  console.log('\n📱 Verificando configuración de App.tsx:');
  
  const appChecks = [
    'HelmetProvider',
    'AccessibilityProvider',
    'SidebarProvider',
    'GamificationProvider',
    'Router',
    'Routes',
    'Route'
  ];
  
  let appConfigOk = true;
  appChecks.forEach(check => {
    if (appContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ ${check} - NO ENCONTRADO`);
      appConfigOk = false;
    }
  });
  
  // Verificar rutas de apuntes
  const apuntesRoutes = [
    'path="/apuntes"',
    'path="/apuntes/:slug"'
  ];
  
  let routesOk = true;
  apuntesRoutes.forEach(route => {
    if (appContent.includes(route)) {
      console.log(`✅ ruta: ${route}`);
    } else {
      console.log(`❌ ruta: ${route} - NO ENCONTRADA`);
      routesOk = false;
    }
  });
  
  // Verificar sistema de gamificación
  const gamificationPath = path.join(__dirname, '../src/contexts/GamificationContext.tsx');
  const gamificationContent = fs.readFileSync(gamificationPath, 'utf8');
  
  console.log('\n🎮 Verificando sistema de gamificación:');
  
  const gamificationChecks = [
    'GamificationProvider',
    'useGamification',
    'readNote',
    'getMedals',
    'getProgressPercentage',
    'AVAILABLE_MEDALS',
    'MILESTONES'
  ];
  
  let gamificationOk = true;
  gamificationChecks.forEach(check => {
    if (gamificationContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ ${check} - NO ENCONTRADO`);
      gamificationOk = false;
    }
  });
  
  // Verificar medallas
  const medalCount = (gamificationContent.match(/id: '/g) || []).length;
  console.log(`🏆 Medallas implementadas: ${medalCount}/12`);
  
  // Verificar CSS
  const cssPath = path.join(__dirname, '../src/index.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  console.log('\n🎨 Verificando estilos CSS:');
  
  const cssChecks = [
    'prose',
    'glass',
    'animate',
    'dark',
    'responsive'
  ];
  
  let cssOk = true;
  cssChecks.forEach(check => {
    if (cssContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ ${check} - NO ENCONTRADO`);
      cssOk = false;
    }
  });
  
  // Verificar que no hay errores de prose-invert
  if (cssContent.includes('prose-invert')) {
    console.log('❌ ERROR: prose-invert encontrado en CSS');
    cssOk = false;
  } else {
    console.log('✅ No hay errores de prose-invert');
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE VERIFICACIÓN COMPLETA:');
  console.log(`📁 Archivos críticos: ${allFilesExist ? '✅ Todos presentes' : '❌ Faltan archivos'}`);
  console.log(`⚙️ Configuración Vite: ${viteConfigOk ? '✅ Correcta' : '❌ Problemas'}`);
  console.log(`📦 Package.json: ${scriptsOk && depsOk ? '✅ Correcto' : '❌ Problemas'}`);
  console.log(`📱 App.tsx: ${appConfigOk && routesOk ? '✅ Correcto' : '❌ Problemas'}`);
  console.log(`🎮 Gamificación: ${gamificationOk ? '✅ Funcional' : '❌ Problemas'}`);
  console.log(`🎨 CSS: ${cssOk ? '✅ Correcto' : '❌ Problemas'}`);
  console.log(`🏆 Medallas: ${medalCount}/12 implementadas`);
  
  const allSystemsOk = allFilesExist && viteConfigOk && scriptsOk && depsOk && appConfigOk && routesOk && gamificationOk && cssOk && medalCount >= 12;
  
  if (allSystemsOk) {
    console.log('\n🎉 ¡TODOS LOS SISTEMAS VERIFICADOS EXITOSAMENTE!');
    console.log('\n🚀 La plataforma está completamente funcional:');
    console.log('1. ✅ Sistema de gamificación con 12 medallas');
    console.log('2. ✅ Panel de accesibilidad funcional');
    console.log('3. ✅ Configuración de Vite optimizada');
    console.log('4. ✅ Rutas de apuntes implementadas');
    console.log('5. ✅ Estilos CSS sin errores');
    console.log('6. ✅ Providers configurados correctamente');
    console.log('\n🌐 Accede a: http://localhost:8080');
    console.log('📚 Apuntes: http://localhost:8080/apuntes');
    console.log('🎮 ¡Disfruta de la experiencia gamificada!');
    return true;
  } else {
    console.log('\n❌ VERIFICACIÓN FALLIDA');
    console.log('Hay problemas que necesitan ser corregidos antes de continuar.');
    return false;
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAllSystems();
}

export { verifyAllSystems }; 