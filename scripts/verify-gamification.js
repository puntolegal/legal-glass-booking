#!/usr/bin/env node

/**
 * Script para verificar que el sistema de gamificación esté funcionando
 * Uso: node scripts/verify-gamification.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifyGamification() {
  console.log('🔍 Verificando Sistema de Gamificación...\n');
  
  // Verificar archivos críticos
  const criticalFiles = [
    '../src/contexts/GamificationContext.tsx',
    '../src/components/GamificationProgress.tsx',
    '../src/pages/apuntes/index.tsx',
    '../src/pages/apuntes/[slug].tsx',
    '../src/App.tsx'
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
  
  // Verificar contenido del GamificationContext
  const contextPath = path.join(__dirname, '../src/contexts/GamificationContext.tsx');
  const contextContent = fs.readFileSync(contextPath, 'utf8');
  
  console.log('\n🔧 Verificando funcionalidades del contexto:');
  
  const requiredFeatures = [
    'GamificationProvider',
    'useGamification',
    'readNote',
    'getMedals',
    'getProgressPercentage',
    'getNextMilestone',
    'resetProgress',
    'AVAILABLE_MEDALS',
    'MILESTONES'
  ];
  
  let allFeaturesPresent = true;
  requiredFeatures.forEach(feature => {
    if (contextContent.includes(feature)) {
      console.log(`✅ ${feature}`);
    } else {
      console.log(`❌ ${feature} - NO ENCONTRADO`);
      allFeaturesPresent = false;
    }
  });
  
  // Verificar medallas
  const medalCount = (contextContent.match(/id: '/g) || []).length;
  console.log(`\n🏆 Medallas implementadas: ${medalCount}/12`);
  
  // Verificar milestones
  const milestoneCount = (contextContent.match(/MILESTONES = \[/g) || []).length;
  console.log(`📈 Milestones implementados: ${milestoneCount > 0 ? 'Sí' : 'No'}`);
  
  // Verificar integración en páginas
  const indexContent = fs.readFileSync(path.join(__dirname, '../src/pages/apuntes/index.tsx'), 'utf8');
  const slugContent = fs.readFileSync(path.join(__dirname, '../src/pages/apuntes/[slug].tsx'), 'utf8');
  
  console.log('\n🔗 Verificando integración:');
  
  const integrationChecks = [
    { name: 'useGamification en index', content: indexContent, pattern: 'useGamification' },
    { name: 'readNote en index', content: indexContent, pattern: 'readNote' },
    { name: 'GamificationProgress en index', content: indexContent, pattern: 'GamificationProgress' },
    { name: 'useGamification en slug', content: slugContent, pattern: 'useGamification' },
    { name: 'readNote en slug', content: slugContent, pattern: 'readNote' }
  ];
  
  integrationChecks.forEach(check => {
    if (check.content.includes(check.pattern)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - NO ENCONTRADO`);
      allFeaturesPresent = false;
    }
  });
  
  // Verificar App.tsx
  const appContent = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');
  
  console.log('\n📱 Verificando configuración en App.tsx:');
  
  const appChecks = [
    'GamificationProvider',
    'AccessibilityProvider',
    'HelmetProvider'
  ];
  
  appChecks.forEach(check => {
    if (appContent.includes(check)) {
      console.log(`✅ ${check}`);
    } else {
      console.log(`❌ ${check} - NO ENCONTRADO`);
      allFeaturesPresent = false;
    }
  });
  
  // Resumen final
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log(`📁 Archivos críticos: ${allFilesExist ? '✅ Todos presentes' : '❌ Faltan archivos'}`);
  console.log(`🔧 Funcionalidades: ${allFeaturesPresent ? '✅ Todas implementadas' : '❌ Faltan funcionalidades'}`);
  console.log(`🏆 Medallas: ${medalCount}/12 implementadas`);
  console.log(`🔗 Integración: ${integrationChecks.every(c => c.content.includes(c.pattern)) ? '✅ Completa' : '❌ Incompleta'}`);
  
  if (allFilesExist && allFeaturesPresent && medalCount >= 12) {
    console.log('\n🎉 ¡SISTEMA DE GAMIFICACIÓN VERIFICADO EXITOSAMENTE!');
    console.log('\n🚀 El sistema está listo para usar:');
    console.log('1. Ve a http://localhost:8080/apuntes');
    console.log('2. Lee apuntes para ganar puntos y medallas');
    console.log('3. Observa el progreso en el panel lateral');
    console.log('4. ¡Disfruta de la experiencia gamificada!');
    return true;
  } else {
    console.log('\n❌ VERIFICACIÓN FALLIDA');
    console.log('Hay problemas que necesitan ser corregidos.');
    return false;
  }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyGamification();
}

export { verifyGamification }; 