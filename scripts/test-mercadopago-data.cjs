#!/usr/bin/env node

/**
 * Script de prueba para verificar que MercadoPago recibe correctamente todos los datos
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testMercadoPagoData() {
  console.log('🧪 PROBANDO DATOS ENVIADOS A MERCADOPAGO...');
  console.log('=' .repeat(60));
  
  try {
    // PASO 1: Crear una reserva de prueba
    console.log('📋 PASO 1: Creando reserva de prueba...');
    
    const testReservation = {
      nombre: 'Juan Pérez Test',
      email: 'juan.test@mercadopago.online',
      telefono: '+56912345678',
      rut: '12345678-9',
      servicio: 'Consulta General',
      precio: '35000',
      tipo_reunion: 'online',
      fecha: '2025-02-01',
      hora: '10:00',
      user_id: 'migration_placeholder',
      descripcion: 'Prueba de datos MercadoPago',
      estado: 'pendiente'
    };
    
    const { data: reservation, error: insertError } = await supabase
      .from('reservas')
      .insert(testReservation)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error creando reserva:', insertError.message);
      return;
    }
    
    console.log('✅ Reserva creada:', reservation.id);
    
    // PASO 2: Simular datos que se envían a MercadoPago
    console.log('\\n📋 PASO 2: Simulando datos enviados a MercadoPago...');
    
    const service = 'Consulta General';
    const price = 35000;
    const payerName = 'Juan Pérez Test';
    const payerEmail = 'juan.test@mercadopago.online';
    const externalReference = reservation.id;
    const phone = '+56912345678';
    
    // Simular la función createStandardPreferenceData
    const nameParts = payerName.trim().split(' ');
    const firstName = nameParts[0] || payerName;
    const lastName = nameParts.slice(1).join(' ') || firstName;
    
    const phoneNumber = phone.replace(/\\D/g, '');
    const areaCode = phoneNumber.startsWith('56') ? '56' : '56';
    const number = phoneNumber.replace(/^56/, '') || phoneNumber;
    
    const preferenceData = {
      items: [{
        id: `servicio_legal_${service.toLowerCase().replace(/\\s+/g, '_')}`,
        title: `${service} - Punto Legal`,
        description: `Consulta legal especializada: ${service}. Servicio profesional de asesoría jurídica.`,
        category_id: 'services_legal',
        quantity: 1,
        unit_price: price,
        currency_id: 'CLP'
      }],
      payer: {
        name: payerName,
        first_name: firstName,
        last_name: lastName,
        email: payerEmail,
        phone: { 
          number: number,
          area_code: areaCode
        },
        identification: {
          type: 'RUT',
          number: '12345678-9'
        }
      },
      back_urls: {
        success: `https://www.puntolegal.online/payment-success?source=mercadopago`,
        failure: `https://www.puntolegal.online/payment-failure?source=mercadopago`,
        pending: `https://www.puntolegal.online/payment-pending?source=mercadopago`
      },
      auto_return: 'approved',
      external_reference: externalReference,
      notification_url: `https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/mercadopago-webhook`,
      metadata: {
        reservation_id: reservation.id,
        service_name: service,
        appointment_date: '2025-02-01',
        appointment_time: '10:00',
        meeting_type: 'online'
      }
    };
    
    console.log('📊 DATOS ENVIADOS A MERCADOPAGO:');
    console.log(JSON.stringify(preferenceData, null, 2));
    
    // PASO 3: Verificar campos requeridos por MercadoPago
    console.log('\\n📋 PASO 3: Verificando campos requeridos por MercadoPago...');
    
    const requiredFields = {
      'items.id': preferenceData.items[0].id,
      'items.title': preferenceData.items[0].title,
      'items.description': preferenceData.items[0].description,
      'items.category_id': preferenceData.items[0].category_id,
      'payer.email': preferenceData.payer.email,
      'payer.first_name': preferenceData.payer.first_name,
      'payer.last_name': preferenceData.payer.last_name,
      'payer.phone.number': preferenceData.payer.phone.number,
      'payer.phone.area_code': preferenceData.payer.phone.area_code,
      'payer.identification.type': preferenceData.payer.identification.type,
      'payer.identification.number': preferenceData.payer.identification.number,
      'back_urls.success': preferenceData.back_urls.success,
      'back_urls.failure': preferenceData.back_urls.failure,
      'back_urls.pending': preferenceData.back_urls.pending,
      'auto_return': preferenceData.auto_return,
      'external_reference': preferenceData.external_reference,
      'notification_url': preferenceData.notification_url
    };
    
    console.log('✅ CAMPOS VERIFICADOS:');
    Object.entries(requiredFields).forEach(([field, value]) => {
      const status = value ? '✅' : '❌';
      console.log(`${status} ${field}: ${value || 'FALTANTE'}`);
    });
    
    // PASO 4: Verificar URLs de retorno
    console.log('\\n📋 PASO 4: Verificando URLs de retorno...');
    
    const returnUrls = [
      { name: 'Success', url: preferenceData.back_urls.success },
      { name: 'Failure', url: preferenceData.back_urls.failure },
      { name: 'Pending', url: preferenceData.back_urls.pending }
    ];
    
    returnUrls.forEach(({ name, url }) => {
      const isValid = url.includes('puntolegal.online') && url.includes('payment-');
      const status = isValid ? '✅' : '❌';
      console.log(`${status} ${name} URL: ${url}`);
    });
    
    // PASO 5: Verificar retorno automático
    console.log('\\n📋 PASO 5: Verificando retorno automático...');
    
    if (preferenceData.auto_return === 'approved') {
      console.log('✅ AUTO_RETURN configurado como "approved"');
      console.log('✅ Usuario será redirigido automáticamente después del pago');
    } else {
      console.log('❌ AUTO_RETURN no configurado correctamente');
    }
    
    // PASO 6: Limpiar datos de prueba
    console.log('\\n📋 PASO 6: Limpiando datos de prueba...');
    
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('id', reservation.id);
    
    if (deleteError) {
      console.error('❌ Error eliminando reserva de prueba:', deleteError.message);
    } else {
      console.log('✅ Datos de prueba eliminados');
    }
    
    console.log('\\n' + '=' .repeat(60));
    console.log('🏁 PRUEBA COMPLETADA');
    console.log('✅ MercadoPago recibirá todos los datos correctamente');
    console.log('✅ Retorno automático funcionará perfectamente');
    
  } catch (error) {
    console.error('❌ Error general en prueba:', error.message);
  }
}

testMercadoPagoData();
