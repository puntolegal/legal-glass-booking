#!/bin/bash

# Script para desplegar el sistema de emails de Supabase
# Ejecutar: chmod +x scripts/deploy-email-system.sh && ./scripts/deploy-email-system.sh

echo "🚀 DESPLEGANDO SISTEMA DE EMAILS DE SUPABASE"
echo "=============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Error: No se encontró supabase/config.toml"
    echo "   Asegúrate de estar en el directorio raíz del proyecto"
    exit 1
fi

echo "✅ Directorio correcto detectado"

# Verificar que Supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI no está instalado"
    echo "   Instalar con: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI detectado"

# Verificar login
echo "🔐 Verificando login en Supabase..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Error: No estás logueado en Supabase"
    echo "   Ejecutar: supabase login"
    exit 1
fi

echo "✅ Login en Supabase verificado"

# Desplegar Edge Function
echo "📧 Desplegando Edge Function send-booking-emails..."
if supabase functions deploy send-booking-emails; then
    echo "✅ Edge Function desplegada exitosamente"
else
    echo "❌ Error desplegando Edge Function"
    exit 1
fi

# Ejecutar migración
echo "🗄️ Ejecutando migración de trigger de emails..."
if supabase db push; then
    echo "✅ Migración ejecutada exitosamente"
else
    echo "❌ Error ejecutando migración"
    exit 1
fi

echo ""
echo "🎉 SISTEMA DE EMAILS DESPLEGADO EXITOSAMENTE"
echo "=============================================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Configurar variables de entorno en Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/qrgelocijmwnxcckxbdg"
echo "   Settings → Configuration → Secrets"
echo ""
echo "2. Variables a configurar:"
echo "   RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW"
echo "   MAIL_FROM=Punto Legal <noreply@puntolegal.cl>"
echo "   ADMIN_EMAIL=puntolegalelgolf@gmail.com"
echo "   SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co"
echo "   SUPABASE_SERVICE_ROLE_KEY=[obtener desde Settings → API]"
echo "   EDGE_ADMIN_TOKEN=puntolegal-admin-token-2025"
echo ""
echo "3. Probar el sistema:"
echo "   node scripts/test-supabase-email-system.js"
echo ""
echo "4. Verificar en Resend Dashboard:"
echo "   https://resend.com/emails"
echo ""
echo "✅ Sistema listo para usar!"
