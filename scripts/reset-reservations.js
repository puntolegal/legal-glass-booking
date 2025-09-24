import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 RESETEANDO RESERVAS - MANTENIENDO SOLO UNA POR COMBINACIÓN\n');

// Leer variables de entorno
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)?.[1]?.trim();
const SUPABASE_ANON_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function resetReservations() {
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
    
    // Crear un mapa para identificar combinaciones únicas
    const uniqueReservations = new Map();
    const toKeep = [];
    
    allReservations.forEach(reservation => {
      // Crear clave única: email + fecha + hora (solo hora, sin minutos)
      const hora = reservation.hora.split(':')[0] + ':00';
      const key = `${reservation.email}|${reservation.fecha}|${hora}`;
      
      if (!uniqueReservations.has(key)) {
        // Primera vez que vemos esta combinación, mantenerla
        uniqueReservations.set(key, reservation);
        toKeep.push(reservation);
      }
    });
    
    console.log(`🔍 Combinaciones únicas encontradas: ${uniqueReservations.size}`);
    console.log(`✅ Reservas a mantener: ${toKeep.length}`);
    console.log(`🗑️ Reservas a eliminar: ${allReservations.length - toKeep.length}`);
    
    // Obtener IDs de las reservas a mantener
    const keepIds = toKeep.map(r => r.id);
    
    // Eliminar todas las reservas que NO están en la lista de mantener
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .not('id', 'in', `(${keepIds.join(',')})`);
    
    if (deleteError) {
      console.error('❌ Error eliminando duplicados:', deleteError.message);
      return;
    }
    
    console.log(`✅ Duplicados eliminados exitosamente`);
    
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
    console.log(`   Duplicados eliminados: ${allReservations.length - finalReservations.length}`);
    
    // Mostrar reservas finales
    console.log('\n📋 Reservas finales:');
    finalReservations.forEach((reservation, index) => {
      console.log(`   ${index + 1}. ${reservation.nombre} - ${reservation.fecha} ${reservation.hora} (${reservation.created_at})`);
    });
    
    console.log('\n🎉 ¡Reseteo completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

resetReservations();
