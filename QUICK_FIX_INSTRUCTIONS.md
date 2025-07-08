# 🚨 Solución Rápida al Error de Columna `role`

## ❌ Error Actual
```
ERROR: 42703: column profiles.role does not exist
```

## ✅ Solución Inmediata

### **Opción 1: SQL Manual (Recomendado - 2 minutos)**

1. **Ve a Supabase Dashboard**:
   - https://app.supabase.com
   - Proyecto: `bhhtigrrenqkagtlwrju`

2. **SQL Editor → New Query**:
   ```sql
   -- Agregar columnas faltantes a profiles
   ALTER TABLE profiles 
   ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'abogado', 'cliente')),
   ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
   
   -- Crear trigger para updated_at
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
       NEW.updated_at = NOW();
       RETURN NEW;
   END;
   $$ language 'plpgsql';

   CREATE TRIGGER update_profiles_updated_at 
       BEFORE UPDATE ON profiles 
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
   ```

3. **Clic "Run"** para ejecutar

### **Opción 2: Desde la Consola del Navegador (1 minuto)**

1. **Abre tu aplicación**: http://localhost:8083
2. **Abre DevTools**: F12 → Console
3. **Ejecuta**:
   ```javascript
   // Configuración rápida del sistema
   PuntoLegalDebug.quickSetup().then(console.log);
   ```

## 🧪 Probar que Todo Funciona

### **1. Verificar Estado del Sistema**
```javascript
// En consola del navegador
PuntoLegalDebug.getStatus().then(result => console.log(result.message));
```

**Debería mostrar**:
```
🗄️ Base de datos: ✅ Funcionando
📧 Webhook: ❌ Sin configurar (normal)
📋 Reservas: X
👥 Perfiles: X
```

### **2. Probar Panel de Admin**
1. Ve a: http://localhost:8083/admin
2. Tab "Notificaciones" 
3. Debería cargar sin errores

### **3. Crear Reserva de Prueba**
1. Ve a: http://localhost:8083/agendamiento
2. Completa formulario
3. Debería crear reserva sin errores

## 🔧 Configurar Make.com (Opcional)

### **1. Crear Webhook**
1. Ve a https://make.com
2. Create scenario → Webhooks → Custom webhook
3. Copia la URL generada

### **2. Agregar URL a tu proyecto**
```bash
# En terminal del proyecto
echo "VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/TU_WEBHOOK_ID" >> .env
```

### **3. Reiniciar servidor**
```bash
# Ctrl+C para parar
npm run dev
```

### **4. Probar webhook**
```javascript
// En consola del navegador
PuntoLegalDebug.testWebhook().then(console.log);
```

## 🎯 Estado Esperado Después de la Solución

### ✅ **Base de Datos Funcionando**
- Tabla `profiles` con columnas `role` e `is_active`
- Tabla `reservas` funcionando
- Conexión estable con Supabase

### ✅ **Aplicación Funcionando**
- Panel de admin accesible
- Sistema de agendamiento operativo
- Sin errores en consola

### ⏳ **Notificaciones Listas**
- Sistema preparado para Make.com
- Webhook configurable
- Templates de email listos

## 🚨 Si Sigues Teniendo Problemas

### **Error: Cannot read properties**
```javascript
// Forzar recreación de datos de prueba
PuntoLegalDebug.cleanup().then(() => {
  return PuntoLegalDebug.quickSetup();
}).then(console.log);
```

### **Error: Webhook fails**
- Normal sin Make configurado
- Configura Make siguiendo `MAKE_SETUP.md`

### **Error: Access denied**
- Asegúrate de tener permisos en Supabase
- Verifica API keys en código

## 📱 Comandos Útiles de Debug

```javascript
// Estado completo del sistema
PuntoLegalDebug.getStatus();

// Estadísticas básicas
PuntoLegalDebug.getStats();

// Configuración rápida
PuntoLegalDebug.quickSetup();

// Probar webhook
PuntoLegalDebug.testWebhook();

// Limpiar datos de prueba
PuntoLegalDebug.cleanup();
```

## ⏰ Tiempo Total de Solución

- **SQL Manual**: 2 minutos
- **Verificación**: 1 minuto
- **Make.com** (opcional): 10 minutos

**Total: 3-13 minutos para sistema completamente funcional**

---

## 🎉 Después de la Solución

Tu sistema tendrá:
- ✅ Base de datos completamente funcional
- ✅ Sistema de agendamiento operativo
- ✅ Panel de administración
- ✅ Sistema de notificaciones listo
- ✅ Debugging tools integradas

**¡Solo necesitas ejecutar 1 query SQL y ya está todo listo!** 🚀 