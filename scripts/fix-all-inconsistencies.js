#!/usr/bin/env node

/**
 * Script para corregir todas las inconsistencias de mapeo de campos
 */

import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Corrigiendo todas las inconsistencias de mapeo...\n');

const filesToFix = [
  {
    path: 'src/pages/AdminPage.tsx',
    changes: [
      { from: 'nombre: string;', to: 'cliente_nombre: string;' },
      { from: 'rut: string;', to: 'cliente_rut: string;' },
      { from: 'email: string;', to: 'cliente_email: string;' },
      { from: 'telefono: string;', to: 'cliente_telefono: string;' }
    ]
  },
  {
    path: 'src/components/ReservationsList.tsx',
    changes: [
      { from: 'reservation.nombre', to: 'reservation.cliente_nombre' },
      { from: 'reservation.rut', to: 'reservation.cliente_rut' },
      { from: 'reservation.email', to: 'reservation.cliente_email' },
      { from: 'reservation.telefono', to: 'reservation.cliente_telefono' }
    ]
  },
  {
    path: 'src/services/reservationService.ts',
    changes: [
      { from: 'reserva.nombre', to: 'reserva.cliente_nombre' },
      { from: 'reserva.email', to: 'reserva.cliente_email' },
      { from: 'reserva.telefono', to: 'reserva.cliente_telefono' }
    ]
  },
  {
    path: 'src/services/notificationService.ts',
    changes: [
      { from: 'reserva.nombre', to: 'reserva.cliente_nombre' },
      { from: 'reserva.email', to: 'reserva.cliente_email' },
      { from: 'reserva.telefono', to: 'reserva.cliente_telefono' }
    ]
  },
  {
    path: 'src/utils/quickDatabaseSetup.ts',
    changes: [
      { from: 'reserva.nombre', to: 'reserva.cliente_nombre' }
    ]
  }
];

let totalChanges = 0;

for (const file of filesToFix) {
  try {
    console.log(`🔧 Corrigiendo ${file.path}...`);
    
    let content = readFileSync(file.path, 'utf8');
    let fileChanges = 0;
    
    for (const change of file.changes) {
      if (content.includes(change.from)) {
        content = content.replace(new RegExp(change.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), change.to);
        fileChanges++;
        console.log(`  ✅ ${change.from} → ${change.to}`);
      }
    }
    
    if (fileChanges > 0) {
      // Crear backup
      writeFileSync(file.path + '.backup', readFileSync(file.path, 'utf8'));
      console.log(`  💾 Backup creado: ${file.path}.backup`);
      
      // Escribir archivo corregido
      writeFileSync(file.path, content);
      console.log(`  ✅ Archivo corregido (${fileChanges} cambios aplicados)`);
      totalChanges += fileChanges;
    } else {
      console.log(`  ℹ️ No se encontraron cambios necesarios`);
    }
    
    console.log('');
    
  } catch (error) {
    console.error(`❌ Error procesando ${file.path}:`, error.message);
  }
}

console.log(`🎉 Corrección completada: ${totalChanges} cambios aplicados en total`);
console.log('📝 Todos los archivos ahora usan la estructura correcta con prefijos cliente_');
