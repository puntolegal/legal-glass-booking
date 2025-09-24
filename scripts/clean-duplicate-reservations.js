import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 LIMPIANDO RESERVAS DUPLICADAS\n');

// Leer variables de entorno
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanDuplicateReservations() {
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
    
    // Identificar duplicados por email, fecha y hora
    const duplicates = new Map();
    const toKeep = new Map();
    const toDelete = [];
    
    allReservations.forEach(reservation => {
      const key = `${reservation.email}-${reservation.fecha}-${reservation.hora}`;
      
      if (duplicates.has(key)) {
        // Ya existe una reserva con la misma combinación
        const existing = duplicates.get(key);
        const currentTime = new Date(reservation.created_at).getTime();
        const existingTime = new Date(existing.created_at).getTime();
        
        if (currentTime > existingTime) {
          // La nueva es más reciente, mantener la nueva y eliminar la anterior
          toDelete.push(existing.id);
          duplicates.set(key, reservation);
          toKeep.set(key, reservation);
        } else {
          // La existente es más reciente, eliminar la actual
          toDelete.push(reservation.id);
        }
      } else {
        // Primera vez que vemos esta combinación
        duplicates.set(key, reservation);
        toKeep.set(key, reservation);
      }
    });
    
    console.log(`🔍 Duplicados identificados: ${toDelete.length}`);
    console.log(`✅ Reservas únicas a mantener: ${toKeep.size}`);
    
    if (toDelete.length === 0) {
      console.log('✅ No se encontraron duplicados para eliminar');
      return;
    }
    
    // Mostrar duplicados que se van a eliminar
    console.log('\n🗑️ Duplicados a eliminar:');
    for (let i = 0; i < Math.min(toDelete.length, 10); i++) {
      const duplicate = allReservations.find(r => r.id === toDelete[i]);
      if (duplicate) {
        console.log(`   ${i + 1}. ${duplicate.nombre} - ${duplicate.fecha} ${duplicate.hora} (${duplicate.created_at})`);
      }
    }
    
    if (toDelete.length > 10) {
      console.log(`   ... y ${toDelete.length - 10} más`);
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
    
    console.log(`✅ ${toDelete.length} duplicados eliminados exitosamente`);
    
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
    
    // Mostrar reservas finales
    console.log('\n📋 Reservas finales:');
    finalReservations.forEach((reservation, index) => {
      console.log(`   ${index + 1}. ${reservation.nombre} - ${reservation.fecha} ${reservation.hora} (${reservation.created_at})`);
    });
    
    console.log('\n🎉 ¡Limpieza completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

cleanDuplicateReservations();
