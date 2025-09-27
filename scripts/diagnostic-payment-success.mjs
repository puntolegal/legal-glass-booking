#!/usr/bin/env node

console.log('🔍 Diagnosticando problema de PaymentSuccessPage...\n');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

// Datos del pago desde el log
const paymentData = {
  payment_id: '127228511473',
  external_reference: 'c772d564-c7da-4632-a482-739ec09a97df',
  preference_id: '229698947-c62b8208-a8dd-498f-a509-45a170dae896',
  status: 'approved',
  amount: 1000
};

async function checkReservationByExternalReference() {
  console.log('🔍 Buscando reserva por external_reference...');
  console.log(`📋 External Reference: ${paymentData.external_reference}`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?external_reference=eq.${paymentData.external_reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Error consultando reservas: ${response.status}`);
      return null;
    }

    const reservations = await response.json();
    console.log(`📊 Reservas encontradas: ${reservations.length}`);
    
    if (reservations.length > 0) {
      console.log('✅ Reserva encontrada por external_reference:');
      console.log(JSON.stringify(reservations[0], null, 2));
      return reservations[0];
    } else {
      console.log('❌ No se encontró reserva con ese external_reference');
      return null;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function checkReservationByPreferenceId() {
  console.log('\n🔍 Buscando reserva por preference_id...');
  console.log(`📋 Preference ID: ${paymentData.preference_id}`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?preference_id=eq.${paymentData.preference_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Error consultando reservas: ${response.status}`);
      return null;
    }

    const reservations = await response.json();
    console.log(`📊 Reservas encontradas: ${reservations.length}`);
    
    if (reservations.length > 0) {
      console.log('✅ Reserva encontrada por preference_id:');
      console.log(JSON.stringify(reservations[0], null, 2));
      return reservations[0];
    } else {
      console.log('❌ No se encontró reserva con ese preference_id');
      return null;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function checkAllRecentReservations() {
  console.log('\n🔍 Buscando reservas recientes...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservas?order=created_at.desc&limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Error consultando reservas: ${response.status}`);
      return [];
    }

    const reservations = await response.json();
    console.log(`📊 Reservas recientes encontradas: ${reservations.length}`);
    
    if (reservations.length > 0) {
      console.log('📋 Reservas recientes:');
      reservations.forEach((reserva, index) => {
        console.log(`\n${index + 1}. ID: ${reserva.id}`);
        console.log(`   Cliente: ${reserva.cliente_nombre}`);
        console.log(`   External Reference: ${reserva.external_reference || 'No asignado'}`);
        console.log(`   Preference ID: ${reserva.preference_id || 'No asignado'}`);
        console.log(`   Created: ${reserva.created_at}`);
      });
    }
    
    return reservations;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return [];
  }
}

async function checkPaymentInfo() {
  console.log('\n🔍 Verificando información del pago desde MercadoPago...');
  
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentData.payment_id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer APP_USR-7407359076060108-092318-7fb22dd54bc0d3e4a42accab058e8a3e-229698947',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`❌ Error consultando MercadoPago: ${response.status}`);
      return null;
    }

    const paymentInfo = await response.json();
    console.log('✅ Información del pago obtenida:');
    console.log(`   Status: ${paymentInfo.status}`);
    console.log(`   Amount: ${paymentInfo.transaction_amount}`);
    console.log(`   External Reference: ${paymentInfo.external_reference}`);
    console.log(`   Description: ${paymentInfo.description}`);
    
    return paymentInfo;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico del problema de PaymentSuccessPage...\n');
  
  console.log('📋 DATOS DEL PAGO:');
  console.log(JSON.stringify(paymentData, null, 2));
  
  // 1. Buscar por external_reference
  const reservaByExternalRef = await checkReservationByExternalReference();
  
  // 2. Buscar por preference_id
  const reservaByPreferenceId = await checkReservationByPreferenceId();
  
  // 3. Verificar información del pago
  const paymentInfo = await checkPaymentInfo();
  
  // 4. Mostrar reservas recientes
  const recentReservations = await checkAllRecentReservations();
  
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
  console.log('═'.repeat(50));
  
  if (reservaByExternalRef) {
    console.log('✅ PROBLEMA RESUELTO: Reserva encontrada por external_reference');
  } else if (reservaByPreferenceId) {
    console.log('✅ PROBLEMA RESUELTO: Reserva encontrada por preference_id');
  } else {
    console.log('❌ PROBLEMA IDENTIFICADO: No se encontró reserva asociada');
    
    console.log('\n🔧 POSIBLES CAUSAS:');
    console.log('1. La reserva no se guardó correctamente en la base de datos');
    console.log('2. El external_reference no se asignó correctamente');
    console.log('3. La reserva se creó con un ID diferente');
    console.log('4. Error en el proceso de creación de la reserva');
    
    console.log('\n🛠️ SOLUCIONES RECOMENDADAS:');
    console.log('1. Verificar que la reserva se guarde antes de crear la preferencia');
    console.log('2. Asegurar que el external_reference se asigne correctamente');
    console.log('3. Implementar mejor manejo de errores en la creación de reservas');
    console.log('4. Agregar logs más detallados en el proceso de pago');
  }
  
  console.log('\n✨ Diagnóstico completado');
}

main().catch(console.error);
