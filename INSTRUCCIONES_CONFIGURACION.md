# 🚀 Instrucciones de Configuración - Sistema de Agendamiento

## 📋 **PASOS PARA CONFIGURAR EL SISTEMA COMPLETO**

### **PASO 1: Configurar Base de Datos Supabase**

1. **Ir a Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Proyecto: `qrgelocijmwnxcckxbdg`

2. **Ejecutar SQL Script:**
   - Ir a SQL Editor
   - Copiar y pegar el contenido de `SETUP_COMPLETO_SISTEMA.sql`
   - Ejecutar el script completo

3. **Verificar creación:**
   - Deberías ver: "✅ Sistema de agendamiento configurado exitosamente"
   - Deberías ver: "3" en total_reservas

### **PASO 2: Configurar Variables de Entorno**

1. **Ir a Settings → Configuration → Secrets**

2. **Agregar las siguientes variables:**

```
RESEND_API_KEY = re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
MAIL_FROM = Punto Legal <team@puntolegal.online>
ADMIN_EMAIL = puntolegalelgolf@gmail.com
SUPABASE_URL = https://qrgelocijmwnxcckxbdg.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [tu_service_role_key_actual]
EDGE_ADMIN_TOKEN = puntolegal-admin-token-2025
PROJECT_REF = qrgelocijmwnxcckxbdg
```

### **PASO 3: Desplegar Edge Function**

1. **Instalar Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login en Supabase:**
   ```bash
   supabase login
   ```

3. **Linkear proyecto:**
   ```bash
   supabase link --project-ref qrgelocijmwnxcckxbdg
   ```

4. **Desplegar función:**
   ```bash
   supabase functions deploy send-resend-emails
   ```

### **PASO 4: Configurar Variables de Entorno del Frontend**

1. **Crear archivo `.env.local`:**
   ```bash
   # MercadoPago
   VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-a7d7e95c-653a-43bf-8a4d-2ab7b2ea30d3
   VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-4010337867785275-091313-920eb61517cac97567e501a9b30592eb-2685419265
   
   # Resend
   VITE_RESEND_API_KEY=re_gvt6L3ER_5JiDjxtbkT1UpYowirF24DFW
   VITE_MAIL_FROM=Punto Legal <team@puntolegal.online>
   VITE_ADMIN_EMAIL=puntolegalelgolf@gmail.com
   
   # Supabase
   VITE_SUPABASE_URL=https://qrgelocijmwnxcckxbdg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.8Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q
   VITE_SUPABASE_PROJECT_REF=qrgelocijmwnxcckxbdg
   ```

### **PASO 5: Probar el Sistema**

1. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

2. **Ir a la página de agendamiento:**
   - URL: http://localhost:8080/agendamiento

3. **Completar formulario de prueba:**
   - Nombre: "Test Usuario"
   - Email: "test@email.com"
   - Teléfono: "+56912345678"
   - Servicio: "Consulta General"
   - Fecha: Fecha futura
   - Hora: "10:00"

4. **Proceder al pago:**
   - Seleccionar MercadoPago
   - Completar pago de prueba

5. **Verificar emails:**
   - Revisar email del cliente
   - Revisar email del admin (puntolegalelgolf@gmail.com)

### **PASO 6: Verificar Configuración**

1. **Verificar base de datos:**
   ```sql
   SELECT COUNT(*) FROM public.reservas;
   SELECT * FROM public.reservas ORDER BY created_at DESC LIMIT 5;
   ```

2. **Verificar Edge Function:**
   - Ir a Supabase Dashboard → Edge Functions
   - Verificar que `send-resend-emails` esté desplegada

3. **Verificar logs:**
   - Revisar logs de la Edge Function
   - Revisar logs del frontend en consola

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Could not find the table 'public.reservas'"**
- **Solución:** Ejecutar el script `SETUP_COMPLETO_SISTEMA.sql` en Supabase

### **Error: "RESEND_API_KEY no configurada"**
- **Solución:** Verificar que la variable esté configurada en Supabase Secrets

### **Error: "Failed to fetch" en emails**
- **Solución:** Verificar que la Edge Function esté desplegada correctamente

### **Error: "RLS policy violation"**
- **Solución:** Verificar que las políticas RLS estén configuradas correctamente

## ✅ **CHECKLIST DE CONFIGURACIÓN**

- [ ] Script SQL ejecutado en Supabase
- [ ] Variables de entorno configuradas en Supabase
- [ ] Edge Function desplegada
- [ ] Variables de entorno del frontend configuradas
- [ ] Sistema probado con datos de prueba
- [ ] Emails enviados correctamente
- [ ] Base de datos actualizada correctamente

## 🎯 **RESULTADO ESPERADO**

Después de completar todos los pasos, deberías tener:

1. ✅ **Sistema de agendamiento funcionando**
2. ✅ **Pagos con MercadoPago integrados**
3. ✅ **Emails automáticos con Resend**
4. ✅ **Base de datos actualizada en tiempo real**
5. ✅ **URLs de retorno configuradas correctamente**

## 📞 **SOPORTE**

Si encuentras problemas:
1. Revisar logs de Supabase
2. Revisar logs del navegador (F12)
3. Verificar configuración de variables de entorno
4. Probar con datos de prueba simples
