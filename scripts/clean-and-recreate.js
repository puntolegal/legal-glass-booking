import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 LIMPIEZA COMPLETA Y RECREACIÓN DE RESERVAS ÚNICAS\n');

// Leer variables de entorno
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanAndRecreate() {
  try {
    console.log('📊 Obteniendo todas las reservas...');
    
    const { data: allReservations, error: fetchError } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('❌ Error:', fetchError.message);
      return;
    }
    
    console.log(`📋 Total de reservas: ${allReservations.length}`);
    
    // Identificar reservas únicas
    const uniqueReservations = new Map();
    
    allReservations.forEach(reservation => {
      // Crear clave única: email + fecha + hora (solo hora, sin minutos)
      const hora = reservation.hora.split(':')[0] + ':00';
      const key = `${reservation.email}|${reservation.fecha}|${hora}`;
      
      if (!uniqueReservations.has(key)) {
        // Mantener la más reciente de cada grupo
        uniqueReservations.set(key, reservation);
      } else {
        // Comparar fechas y mantener la más reciente
        const existing = uniqueReservations.get(key);
        const existingTime = new Date(existing.created_at).getTime();
        const currentTime = new Date(reservation.created_at).getTime();
        
        if (currentTime > existingTime) {
          uniqueReservations.set(key, reservation);
        }
      }
    });
    
    const uniqueList = Array.from(uniqueReservations.values());
    console.log(`🔍 Reservas únicas identificadas: ${uniqueList.length}`);
    console.log(`🗑️ Duplicados a eliminar: ${allReservations.length - uniqueList.length}`);
    
    // Mostrar reservas únicas que se van a mantener
    console.log('\n📋 Reservas únicas a mantener:');
    uniqueList.forEach((reservation, index) => {
      console.log(`   ${index + 1}. ${reservation.nombre} - ${reservation.fecha} ${reservation.hora}`);
    });
    
    // Eliminar TODAS las reservas
    console.log('\n🗑️ Eliminando todas las reservas...');
    const { error: deleteAllError } = await supabase
      .from('reservas')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todas
    
    if (deleteAllError) {
      console.error('❌ Error eliminando todas las reservas:', deleteAllError.message);
      return;
    }
    
    console.log('✅ Todas las reservas eliminadas');
    
    // Recrear solo las reservas únicas
    console.log('\n🔄 Recreando reservas únicas...');
    const { data: newReservations, error: insertError } = await supabase
      .from('reservas')
      .insert(uniqueList)
      .select('id, nombre, email, fecha, hora, created_at');
    
    if (insertError) {
      console.error('❌ Error recreando reservas:', insertError.message);
      return;
    }
    
    console.log(`✅ ${newReservations.length} reservas únicas recreadas`);
    
    // Mostrar resultado final
    console.log('\n📊 RESULTADO FINAL:');
    console.log(`   Reservas únicas: ${newReservations.length}`);
    console.log(`   Duplicados eliminados: ${allReservations.length - newReservations.length}`);
    
    console.log('\n📋 Reservas finales:');
    newReservations.forEach((reservation, index) => {
      console.log(`   ${index + 1}. ${reservation.nombre} - ${reservation.fecha} ${reservation.hora} (${reservation.created_at})`);
    });
    
    console.log('\n🎉 ¡Limpieza y recreación completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

cleanAndRecreate();
