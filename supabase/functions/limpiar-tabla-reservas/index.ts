import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🚀 Iniciando limpieza de tabla reservas...');

    // Columnas a eliminar
    const columnasAEliminar = [
      'rut',
      'cliente_nombre',
      'cliente_email', 
      'cliente_telefono',
      'servicio_nombre',
      'servicio_precio',
      'fecha_agendada',
      'hora_agendada',
      'motivo_consulta',
      'notas',
      'recordatorio_enviado',
      'webhook_sent',
      'user_id',
      'categoria',
      'preference_id',
      'pago_id',
      'pago_metodo'
    ];

    const resultados = {
      backup: false,
      eliminadas: 0,
      errores: 0,
      detalles: [] as any[]
    };

    // 1. Crear backup
    try {
      console.log('📋 Creando backup...');
      const { error: backupError } = await supabaseClient.rpc('exec_sql', {
        sql: 'CREATE TABLE reservas_backup AS SELECT * FROM reservas;'
      });
      
      if (backupError) {
        console.log('⚠️ Error creando backup:', backupError.message);
        resultados.detalles.push({ tipo: 'backup', error: backupError.message });
      } else {
        resultados.backup = true;
        console.log('✅ Backup creado exitosamente');
      }
    } catch (error) {
      console.log('⚠️ Error en backup:', error.message);
      resultados.detalles.push({ tipo: 'backup', error: error.message });
    }

    // 2. Eliminar columnas
    for (const columna of columnasAEliminar) {
      try {
        console.log(`🗑️ Eliminando columna: ${columna}`);
        
        const { error: dropError } = await supabaseClient.rpc('exec_sql', {
          sql: `ALTER TABLE reservas DROP COLUMN IF EXISTS ${columna};`
        });
        
        if (dropError) {
          console.log(`❌ Error eliminando ${columna}: ${dropError.message}`);
          resultados.errores++;
          resultados.detalles.push({ 
            tipo: 'eliminacion', 
            columna, 
            error: dropError.message 
          });
        } else {
          console.log(`✅ ${columna} eliminada exitosamente`);
          resultados.eliminadas++;
          resultados.detalles.push({ 
            tipo: 'eliminacion', 
            columna, 
            exito: true 
          });
        }
      } catch (error) {
        console.log(`❌ Error eliminando ${columna}: ${error.message}`);
        resultados.errores++;
        resultados.detalles.push({ 
          tipo: 'eliminacion', 
          columna, 
          error: error.message 
        });
      }
    }

    // 3. Verificar estructura final
    let estructuraFinal = [];
    try {
      console.log('🔍 Verificando estructura final...');
      const { data: estructura, error: errorEstructura } = await supabaseClient
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'reservas')
        .order('ordinal_position');

      if (errorEstructura) {
        console.log('❌ Error verificando estructura:', errorEstructura.message);
        resultados.detalles.push({ 
          tipo: 'verificacion', 
          error: errorEstructura.message 
        });
      } else {
        estructuraFinal = estructura || [];
        console.log(`✅ Estructura verificada: ${estructuraFinal.length} columnas`);
      }
    } catch (error) {
      console.log('❌ Error en verificación:', error.message);
      resultados.detalles.push({ 
        tipo: 'verificacion', 
        error: error.message 
      });
    }

    // 4. Verificar datos
    let totalReservas = 0;
    let emailsEnviados = 0;
    
    try {
      const { data: reservas, error: errorReservas } = await supabaseClient
        .from('reservas')
        .select('id', { count: 'exact' });

      const { data: emails, error: errorEmails } = await supabaseClient
        .from('reservas')
        .select('id', { count: 'exact' })
        .eq('email_enviado', true);

      if (!errorReservas) {
        totalReservas = reservas?.length || 0;
      }
      
      if (!errorEmails) {
        emailsEnviados = emails?.length || 0;
      }
    } catch (error) {
      console.log('❌ Error verificando datos:', error.message);
    }

    const respuesta = {
      success: true,
      message: 'Limpieza de tabla reservas completada',
      resultados: {
        ...resultados,
        estructura_final: estructuraFinal,
        total_reservas: totalReservas,
        emails_enviados: emailsEnviados,
        columnas_eliminadas: resultados.eliminadas,
        columnas_restantes: estructuraFinal.length
      }
    };

    console.log('🎯 Limpieza completada:', respuesta);

    return new Response(
      JSON.stringify(respuesta),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Error en limpieza:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Error ejecutando limpieza de tabla'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
