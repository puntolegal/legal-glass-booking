#!/usr/bin/env node

/**
 * Script para corregir las referencias de cliente_email a email
 * en todos los archivos del proyecto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 CORRIGIENDO REFERENCIAS DE COLUMNAS EN LA TABLA RESERVAS');
console.log('==========================================================');

// Archivos a corregir
const filesToFix = [
  'src/services/supabaseBooking.ts',
  'src/components/MercadoPagoOfficialButton.tsx',
  'src/services/reservationService.ts',
  'src/pages/AgendamientoPage.tsx',
  'src/services/realEmailService.ts',
  'src/utils/quickDatabaseSetup.ts',
  'src/utils/testNotifications.ts',
  'src/pages/PaymentSuccessPage.tsx',
  'src/services/notificationService.ts',
  'src/services/emailService.ts',
  'src/components/NotificationPanel.tsx',
  'src/pages/AdminPage.tsx',
  'src/components/ReservationsList.tsx',
  'src/services/makeEmailService.ts',
  'src/services/workingEmailService.ts',
  'src/services/simpleEmailService.ts',
  'src/services/directEmailService.ts',
  'src/services/emailWebhookService.ts',
  'src/services/offlineBooking.ts'
];

// Mapeo de correcciones
const corrections = [
  // Correcciones de columnas de la tabla reservas
  { from: 'cliente_email', to: 'email' },
  { from: 'cliente_nombre', to: 'nombre' },
  { from: 'cliente_telefono', to: 'telefono' },
  { from: 'cliente_rut', to: 'rut' },
  { from: 'servicio_tipo', to: 'servicio' },
  { from: 'servicio_precio', to: 'precio' },
  { from: 'servicio_categoria', to: 'categoria' },
  { from: 'pago_metodo', to: 'pago_metodo' },
  { from: 'pago_estado', to: 'pago_estado' },
  { from: 'pago_id', to: 'pago_id' },
  { from: 'pago_monto', to: 'pago_monto' }
];

let totalFiles = 0;
let totalChanges = 0;

async function fixFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ Archivo no encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let fileChanges = 0;
  
  // Aplicar correcciones
  corrections.forEach(({ from, to }) => {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, to);
      fileChanges += matches.length;
      console.log(`   ✅ ${from} → ${to} (${matches.length} ocurrencias)`);
    }
  });
  
  if (fileChanges > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`📝 ${filePath}: ${fileChanges} cambios aplicados`);
    totalChanges += fileChanges;
  } else {
    console.log(`✅ ${filePath}: Sin cambios necesarios`);
  }
  
  totalFiles++;
}

async function main() {
  console.log(`📁 Procesando ${filesToFix.length} archivos...\n`);
  
  for (const file of filesToFix) {
    await fixFile(file);
  }
  
  console.log('\n📊 RESUMEN DE CORRECCIONES');
  console.log('========================');
  console.log(`Archivos procesados: ${totalFiles}`);
  console.log(`Total de cambios: ${totalChanges}`);
  
  if (totalChanges > 0) {
    console.log('\n✅ Correcciones aplicadas exitosamente');
    console.log('🔄 Reinicia el servidor de desarrollo para aplicar los cambios');
  } else {
    console.log('\n✅ No se encontraron cambios necesarios');
  }
}

main().catch(console.error);
