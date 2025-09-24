import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 LIMPIEZA ROBUSTA DE DUPLICADOS\n');

// Leer variables de entorno
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanDuplicatesRobust() {
  try {
    console.log('📊 Analizando reservas existentes...');
    
    // Obtener todas las reservas
    const { data: allReservations, error: fetchError } = await supabase
      .from('reservas')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('❌ Error obteniendo reservas:', fetchError.message);
      return;
    }
    
    console.log(`📋 Total de reservas encontradas: ${allReservations.length}`);
    
    // Agrupar por email, fecha y hora (ignorando minutos y segundos)
    const groups = new Map();
    
    allReservations.forEach(reservation => {
      // Normalizar la hora (solo horas, sin minutos)
      const horaNormalizada = reservation.hora.split(':')[0] + ':00:00';
      const key = `${reservation.email}-${reservation.fecha}-${horaNormalizada}`;
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(reservation);
    });
    
    console.log(`🔍 Grupos únicos encontrados: ${groups.size}`);
    
    const toDelete = [];
    let duplicatesFound = 0;
    
    // Para cada grupo, mantener solo la más reciente
    groups.forEach((reservations, key) => {
      if (reservations.length > 1) {
        console.log(`\n📋 Grupo duplicado: ${key}`);
        console.log(`   Reservas en grupo: ${reservations.length}`);
        
        // Ordenar por fecha de creación (más reciente primero)
        reservations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        // Mantener la primera (más reciente) y marcar las demás para eliminar
        const toKeep = reservations[0];
        const toRemove = reservations.slice(1);
        
        console.log(`   ✅ Mantener: ${toKeep.nombre} (${toKeep.created_at})`);
        
        toRemove.forEach(reservation => {
          console.log(`   🗑️ Eliminar: ${reservation.nombre} (${reservation.created_at})`);
          toDelete.push(reservation.id);
          duplicatesFound++;
        });
      }
    });
    
    if (toDelete.length === 0) {
      console.log('\n✅ No se encontraron duplicados para eliminar');
      return;
    }
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`   Duplicados encontrados: ${duplicatesFound}`);
    console.log(`   Reservas a eliminar: ${toDelete.length}`);
    console.log(`   Reservas a mantener: ${allReservations.length - toDelete.length}`);
    
    // Eliminar duplicados en lotes de 10
    console.log('\n🗑️ Eliminando duplicados...');
    const batchSize = 10;
    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = toDelete.slice(i, i + batchSize);
      const { error: deleteError } = await supabase
        .from('reservas')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.error(`❌ Error eliminando lote ${Math.floor(i/batchSize) + 1}:`, deleteError.message);
        continue;
      }
      
      console.log(`   ✅ Lote ${Math.floor(i/batchSize) + 1} eliminado (${batch.length} reservas)`);
    }
    
    // Verificar resultado final
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
    
    // Mostrar reservas finales agrupadas
    const finalGroups = new Map();
    finalReservations.forEach(reservation => {
      const horaNormalizada = reservation.hora.split(':')[0] + ':00:00';
      const key = `${reservation.email}-${reservation.fecha}-${horaNormalizada}`;
      
      if (!finalGroups.has(key)) {
        finalGroups.set(key, []);
      }
      finalGroups.get(key).push(reservation);
    });
    
    console.log('\n📋 Reservas finales por grupo:');
    finalGroups.forEach((reservations, key) => {
      console.log(`\n   📅 ${key}:`);
      reservations.forEach((reservation, index) => {
        console.log(`      ${index + 1}. ${reservation.nombre} - ${reservation.hora} (${reservation.created_at})`);
      });
    });
    
    console.log('\n🎉 ¡Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

cleanDuplicatesRobust();
