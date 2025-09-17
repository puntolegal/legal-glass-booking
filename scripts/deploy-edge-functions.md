# 🚀 Desplegar Edge Functions en Supabase

## 📋 **Requisitos Previos**

1. **Instalar Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Autenticarse con Supabase:**
   ```bash
   supabase login
   ```

3. **Vincular el proyecto:**
   ```bash
   supabase link --project-ref qrgelocijmwnxcckxbdg
   ```

## 🚀 **Desplegar Edge Functions**

### **Opción 1: Desplegar todas las funciones**
```bash
supabase functions deploy
```

### **Opción 2: Desplegar función específica**
```bash
supabase functions deploy send-booking-emails
```

## 🔧 **Configurar Variables de Entorno**

### **En Supabase Dashboard:**
1. Ve a: `https://app.supabase.com/project/qrgelocijmwnxcckxbdg/settings/functions`
2. Agrega las siguientes variables:

```env
RESEND_API_KEY=tu_api_key_de_resend
```

### **Para obtener API Key de Resend:**
1. Ve a: https://resend.com/
2. Crea una cuenta gratuita
3. Ve a API Keys
4. Crea una nueva API Key
5. Cópiala y agrégala en Supabase

## 🧪 **Probar las Edge Functions**

### **Desde el navegador:**
```javascript
// En la consola del navegador
const { data, error } = await supabase.functions.invoke('send-booking-emails', {
  body: {
    bookingData: {
      id: 'test-123',
      cliente_nombre: 'Juan Pérez',
      cliente_email: 'juan@example.com',
      cliente_telefono: '+56912345678',
      servicio_tipo: 'Consulta General',
      servicio_precio: '35000',
      fecha: '2025-09-15',
      hora: '10:00',
      created_at: new Date().toISOString()
    }
  }
});

console.log('Resultado:', data);
```

### **Desde cURL:**
```bash
curl -X POST 'https://qrgelocijmwnxcckxbdg.supabase.co/functions/v1/send-booking-emails' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI' \
  -H 'Content-Type: application/json' \
  -d '{
    "bookingData": {
      "id": "test-123",
      "cliente_nombre": "Juan Pérez",
      "cliente_email": "juan@example.com",
      "cliente_telefono": "+56912345678",
      "servicio_tipo": "Consulta General",
      "servicio_precio": "35000",
      "fecha": "2025-09-15",
      "hora": "10:00",
      "created_at": "2025-09-14T12:00:00Z"
    }
  }'
```

## 🎯 **Estados del Sistema**

### **✅ Con Edge Functions Desplegadas:**
- Emails reales enviados via Resend
- Notificaciones al cliente y admin
- Plantillas HTML profesionales

### **⚠️ Sin Edge Functions (Fallback):**
- Emails simulados en consola
- Funcionalidad completa mantenida
- Perfecto para desarrollo y testing

## 🔄 **Flujo Completo**

1. **Cliente agenda cita** → Formulario completado
2. **Reserva guardada** → Supabase database
3. **Edge Function llamada** → send-booking-emails
4. **Emails enviados** → Cliente + Admin
5. **Estado actualizado** → email_enviado = true

## 📧 **Emails Enviados**

### **Al Cliente:**
- ✅ Confirmación de cita
- 📋 Detalles completos
- 📞 Información de contacto
- 🎨 Diseño profesional HTML

### **Al Admin (puntolegalelgolf@gmail.com):**
- 🔔 Notificación de nueva reserva
- 👤 Datos completos del cliente
- 📅 Detalles de la cita
- 🎯 Acciones requeridas

## 🚨 **Troubleshooting**

### **Error: "Function not found"**
```bash
# Verificar que la función esté desplegada
supabase functions list
```

### **Error: "Invalid API Key"**
- Verificar RESEND_API_KEY en Supabase Dashboard
- Asegurarse de que la API Key sea válida

### **Error: "CORS"**
- Las Edge Functions ya incluyen headers CORS
- Verificar que el dominio esté permitido

## 🎉 **¡Sistema Listo!**

Una vez desplegadas las Edge Functions:
- ✅ Emails automáticos funcionando
- ✅ Notificaciones al admin
- ✅ Confirmaciones al cliente
- ✅ Sistema completamente operativo
