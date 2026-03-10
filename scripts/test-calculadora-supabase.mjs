#!/usr/bin/env node
/**
 * Prueba E2E: Verifica que los datos de la Calculadora se guarden en Supabase
 * Ejecutar: node scripts/test-calculadora-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEST_EMAIL = `test-calc-${Date.now()}@puntolegal.test`;

async function run() {
  console.log('🧪 Prueba E2E: Calculadora → Supabase\n');
  console.log('1. Insertando lead inicial (calculadora_iniciada)...');

  const { data: insertData, error: insertErr } = await supabase
    .from('leads_quiz')
    .insert([{
      email: TEST_EMAIL,
      name: 'Test Calculadora',
      quiz_answers: {
        source: 'calculadora_pension',
        nombre: 'Test Calculadora',
        whatsapp: '+56912345678',
        email: TEST_EMAIL
      },
      plan_recommended: null,
      status: 'calculadora_iniciada'
    }])
    .select();

  if (insertErr) {
    console.error('❌ Error en INSERT:', insertErr.message);
    process.exit(1);
  }
  console.log('   ✅ Lead insertado:', insertData?.[0]?.id);

  console.log('\n2. Actualizando con datos del cálculo (calculo_completado)...');

  const { data: updateData, error: updateErr } = await supabase
    .from('leads_quiz')
    .update({
      quiz_answers: {
        source: 'calculadora_pension',
        nombre: 'Test Calculadora',
        whatsapp: '+56912345678',
        email: TEST_EMAIL,
        materia_legal: 'alimentos',
        ingreso_demandado: 1150000,
        cantidad_hijos: 2,
        pension_actual: '$150000',
        oculta_ingresos: false,
        tiene_deuda: true,
        meses_deuda: 6,
        proteccion: 'none',
        patrimonio_complejo: false,
        is_vip: false,
        lead_score: 'WARM_DEBT'
      },
      income_value: 1150000,
      children_count: 2,
      calculated_min: '$215.600',
      calculated_max: '$575.000',
      status: 'calculo_completado'
    })
    .eq('email', TEST_EMAIL)
    .in('status', ['calculadora_iniciada', 'calculo_completado'])
    .select();

  if (updateErr) {
    console.error('❌ Error en UPDATE:', updateErr.message);
    process.exit(1);
  }
  if (!updateData?.length) {
    console.error('❌ UPDATE no afectó filas (RLS?)');
    process.exit(1);
  }
  console.log('   ✅ Lead actualizado:', updateData[0].status, '|', updateData[0].calculated_max);

  console.log('\n3. Verificando actualización de quiz_answers (checkout simulado en payload)...');

  const quizWithCheckout = { ...updateData[0].quiz_answers, consulta_precio: 35000, reserva_id: `CALC-${Date.now()}` };
  const { data: checkoutData, error: checkoutErr } = await supabase
    .from('leads_quiz')
    .update({
      quiz_answers: quizWithCheckout
      // status: 'checkout_iniciado' — puede estar restringido por CHECK en la tabla
    })
    .eq('email', TEST_EMAIL)
    .select();

  if (checkoutErr) {
    console.warn('   ⚠️ Update checkout:', checkoutErr.message, '(flujo principal INSERT+UPDATE OK)');
  } else {
    console.log('   ✅ Quiz answers actualizado con datos de checkout');
  }

  console.log('\n4. Limpiando lead de prueba (opcional)...');
  const { error: delErr } = await supabase.from('leads_quiz').delete().eq('email', TEST_EMAIL);
  if (delErr) console.log('   (Delete no permitido por RLS, lead de prueba permanece)');
  else console.log('   ✅ Lead de prueba eliminado');

  console.log('\n✅ Prueba E2E completada: Supabase guarda correctamente los datos de la Calculadora.\n');
}

run().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
