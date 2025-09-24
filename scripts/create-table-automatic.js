// Script para crear automáticamente la tabla reservas en Supabase
// Ejecutar con: node scripts/create-table-automatic.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurado');
  console.log('💡 Configura la variable de entorno SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTable() {
  try {
    console.log('🚀 Iniciando creación de tabla reservas...');
    
    // Leer el script SQL
    const sqlPath = path.join(process.cwd(), 'CREATE_TABLE_RESERVAS.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Ejecutando script SQL...');
    
    // Ejecutar el script SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      return false;
    }
    
    console.log('✅ Script SQL ejecutado exitosamente');
    
    // Verificar que la tabla existe
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'reservas');
    
    if (tableError) {
      console.error('❌ Error verificando tabla:', tableError);
      return false;
    }
    
    if (tables && tables.length > 0) {
      console.log('✅ Tabla reservas creada exitosamente');
      
      // Verificar datos de prueba
      const { data: reservas, error: reservasError } = await supabase
        .from('reservas')
        .select('*')
        .limit(5);
      
      if (reservasError) {
        console.error('❌ Error consultando reservas:', reservasError);
        return false;
      }
      
      console.log(`📊 Total de reservas: ${reservas.length}`);
      console.log('🎉 ¡Tabla reservas lista para usar!');
      return true;
    } else {
      console.error('❌ La tabla reservas no se creó correctamente');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createTable().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { createTable };
