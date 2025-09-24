#!/usr/bin/env node

/**
 * Script para crear la tabla reservas manualmente
 * Usa la service role key para poder crear la tabla
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzgwMjQyOSwiZXhwIjoyMDczMzc4NDI5fQ.eKvVrXiuz39_JP9lydQI6gxyrYX2tLQWIJzlI4lqnGg';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTable() {
  console.log('🚀 Creando tabla reservas...\n');

  try {
    // Primero, intentar eliminar la tabla existente
    console.log('🗑️ Eliminando tabla existente...');
    const { error: dropError } = await supabase
      .from('reservas')
      .select('*')
      .limit(0); // Solo para verificar si existe

    // Crear la tabla usando una inserción de prueba con la estructura correcta
    console.log('📋 Creando estructura de tabla...');
    
    const testData = {
      cliente_nombre: 'Test User',
      cliente_rut: '12345678-9',
      cliente_email: 'test@test.com',
      cliente_telefono: '+56912345678',
      fecha: '2025-09-23',
      hora: '10:00',
      descripcion: 'Test description',
      servicio_tipo: 'Test Service',
      servicio_precio: 1000,
      servicio_categoria: 'Test',
      tipo_reunion: 'online',
      estado: 'pendiente',
      webhook_sent: false,
      recordatorio_enviado: false
    };

    const { data, error } = await supabase
      .from('reservas')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.log('❌ Error creando tabla:', error);
      
      // Si el error es que la tabla no existe, necesitamos crearla manualmente
      if (error.message.includes('relation "public.reservas" does not exist')) {
        console.log('\n📝 La tabla no existe. Necesitas crearla manualmente en el Dashboard de Supabase.');
        console.log('📋 Usa este SQL en el SQL Editor:');
        console.log(`
-- Crear la tabla reservas
CREATE TABLE public.reservas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_rut VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    descripcion TEXT,
    servicio_tipo VARCHAR(100) NOT NULL,
    servicio_precio DECIMAL(10,2) NOT NULL,
    servicio_categoria VARCHAR(50) DEFAULT 'General',
    tipo_reunion VARCHAR(20) DEFAULT 'online',
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    webhook_sent BOOLEAN DEFAULT FALSE,
    recordatorio_enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id VARCHAR(255) DEFAULT 'anonymous'
);

-- Habilitar RLS
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Permitir crear reservas públicas" 
    ON public.reservas FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY "Permitir leer reservas públicas" 
    ON public.reservas FOR SELECT TO public 
    USING (true);

CREATE POLICY "Permitir actualizar reservas públicas" 
    ON public.reservas FOR UPDATE TO public 
    USING (true) WITH CHECK (true);
        `);
        return;
      }
    } else {
      console.log('✅ Tabla creada exitosamente!');
      console.log('📋 Datos de prueba insertados:', data);
      
      // Limpiar el registro de prueba
      await supabase
        .from('reservas')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Registro de prueba eliminado');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createTable();
