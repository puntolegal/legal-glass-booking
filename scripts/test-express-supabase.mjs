#!/usr/bin/env node
/**
 * Verificación Express: Prueba que leads_quiz acepte status express_iniciado
 * Ejecutar: node scripts/test-express-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEST_PHONE = '56912345678';
const TEST_EMAIL = `express-${TEST_PHONE}@puntolegal.online`;

async function run() {
  console.log('🧪 Verificación Express → Supabase\n');
  console.log('URL:', SUPABASE_URL);
  console.log('Email test:', TEST_EMAIL);
  console.log('');

  // 1. INSERT express_iniciado (como hace saveLead en ExpressPage)
  console.log('1. INSERT con status express_iniciado...');
  const { data: insertData, error: insertErr } = await supabase
    .from('leads_quiz')
    .insert([{
      email: TEST_EMAIL,
      name: 'Test Express',
      status: 'express_iniciado',
      quiz_answers: {
        source: 'QR_CALLE_CENTRO',
        nombre: 'Test Express',
        whatsapp: '+56 9 1234 5678',
        materia: 'deudas',
        precio: 25000,
        precio_original: 75000
      }
    }])
    .select('id, status');

  if (insertErr) {
    console.error('   ❌ Error:', insertErr.message);
    console.error('   Código:', insertErr.code);
    process.exit(1);
  }
  console.log('   ✅ Lead insertado:', insertData?.[0]?.id);

  // 2. UPDATE a checkout_iniciado (como hace handlePayment)
  console.log('\n2. UPDATE a checkout_iniciado...');
  const { data: updateData, error: updateErr } = await supabase
    .from('leads_quiz')
    .update({
      status: 'checkout_iniciado',
      quiz_answers: {
        source: 'QR_CALLE_CENTRO',
        nombre: 'Test Express',
        whatsapp: '+56 9 1234 5678',
        materia: 'deudas',
        precio: 25000,
        precio_original: 75000
      }
    })
    .eq('email', TEST_EMAIL)
    .select('id, status');

  if (updateErr) {
    console.error('   ❌ Error:', updateErr.message);
    process.exit(1);
  }
  if (!updateData?.length) {
    console.error('   ❌ No se actualizó ninguna fila');
    process.exit(1);
  }
  console.log('   ✅ Actualizado:', updateData[0].status);

  // 3. Limpiar: eliminar el registro de prueba
  console.log('\n3. Limpiando registro de prueba...');
  const { error: delErr } = await supabase
    .from('leads_quiz')
    .delete()
    .eq('email', TEST_EMAIL);

  if (delErr) {
    console.warn('   ⚠️ No se pudo eliminar (puede ser RLS):', delErr.message);
  } else {
    console.log('   ✅ Eliminado');
  }

  console.log('\n✅ Express + Supabase: TODO OK');
  console.log('   - express_iniciado: aceptado');
  console.log('   - checkout_iniciado: aceptado');
  console.log('   - RLS permite INSERT y UPDATE anónimo');
}

run().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
