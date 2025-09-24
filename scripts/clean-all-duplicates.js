import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 LIMPIEZA COMPLETA DE DUPLICADOS\n');

// Leer variables de entorno
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanAllDuplicates() {
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
    
    // Crear un mapa para agrupar por email, fecha y hora
    const reservationMap = new Map();
    const toDelete = [];
    
    allReservations.forEach(reservation => {
      // Crear clave única: email + fecha + hora (solo hora, sin minutos)
      const hora = reservation.hora.split(':')[0] + ':00';
      const key = `${reservation.email}|${reservation.fecha}|${hora}`;
      
      if (reservationMap.has(key)) {
        // Ya existe una reserva con esta combinación
        const existing = reservationMap.get(key);
        
        // Comparar fechas de creación
        const existingTime = new Date(existing.created_at).getTime();
        const currentTime = new Date(reservation.created_at).getTime();
        
        if (currentTime > existingTime) {
          // La actual es más reciente, eliminar la anterior
          toDelete.push(existing.id);
          reservationMap.set(key, reservation);
        } else {
          // La existente es más reciente, eliminar la actual
          toDelete.push(reservation.id);
        }
      } else {
        // Primera vez que vemos esta combinación
        reservationMap.set(key, reservation);
      }
    });
    
    console.log(`🔍 Duplicados encontrados: ${toDelete.length}`);
    console.log(`✅ Reservas únicas a mantener: ${reservationMap.size}`);
    
    if (toDelete.length === 0) {
      console.log('✅ No hay duplicados para eliminar');
      return;
    }
    
    // Mostrar algunos duplicados que se van a eliminar
    console.log('\n🗑️ Algunos duplicados a eliminar:');
    const sampleDuplicates = toDelete.slice(0, 5);
    sampleDuplicates.forEach((id, index) => {
      const reservation = allReservations.find(r => r.id === id);
      if (reservation) {
        console.log(`   ${index + 1}. ${reservation.nombre} - ${reservation.fecha} ${reservation.hora}`);
      }
    });
    
    if (toDelete.length > 5) {
      console.log(`   ... y ${toDelete.length - 5} más`);
    }
    
    // Eliminar duplicados
    console.log('\n🗑️ Eliminando duplicados...');
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .in('id', toDelete);
    
    if (deleteError) {
      console.error('❌ Error eliminando duplicados:', deleteError.message);
      return;
    }
    
    console.log(`✅ ${toDelete.length} duplicados eliminados`);
    
    // Verificar resultado
    const { data: finalReservations, error: finalError } = await supabase
      .from('reservas')
      .select('id, nombre, email, fecha, hora, created_at')
      .order('created_at', { ascending: true });
    
    if (finalError) {
      console.error('❌ Error verificando resultado:', finalError.message);
      return;
    }
    
    console.log(`\n📊 RESULTADO FINAL:`);
    console.log(`   Reservas únicas: ${finalReservations.length}`);
    console.log(`   Duplicados eliminados: ${toDelete.length}`);
    
    // Mostrar reservas finales
    console.log('\n📋 Reservas finales:');
    finalReservations.forEach((reservation, index) => {
      console.log(`   ${index + 1}. ${reservation.nombre} - ${reservation.fecha} ${reservation.hora} (${reservation.created_at})`);
    });
    
    console.log('\n🎉 ¡Limpieza completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

cleanAllDuplicates();
