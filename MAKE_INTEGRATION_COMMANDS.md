# 🚀 Comandos de Integración Make.com

## 📦 Instalación y Configuración

### 1. Instalar dependencias adicionales (si es necesario)
```bash
# Ya tienes todas las dependencias necesarias en tu proyecto
npm run dev
```

### 2. Configurar variables de entorno
```bash
# Crear archivo .env (si no existe)
cp .env.example .env

# Editar con tu información
nano .env
```

### 3. Configurar webhook URL
```bash
# Después de crear el webhook en Make, agregar la URL a .env:
echo "VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/TU_WEBHOOK_ID" >> .env
```

## 🧪 Comandos de Prueba

### 1. Probar el sistema completo
```bash
# Iniciar servidor de desarrollo
npm run dev

# En otra terminal, probar webhook (ejemplo con curl)
curl -X POST http://localhost:8081/api/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_evento": "nueva_reserva",
    "reserva": {
      "id": "test-123",
      "nombre": "Juan Pérez",
      "email": "juan@test.com",
      "telefono": "+56912345678",
      "fecha": "2025-01-10",
      "hora": "15:00",
      "servicio": "Consulta General",
      "precio": "50000"
    }
  }'
```

### 2. Simular reserva desde la aplicación
```bash
# 1. Abrir http://localhost:8081/agendamiento
# 2. Completar formulario de prueba
# 3. Verificar en consola del navegador
# 4. Revisar logs en Make.com
```

### 3. Probar recordatorios manuales
```bash
# Desde el panel de admin -> Notificaciones -> Ejecutar Recordatorios
# O usando la consola del navegador:

# En DevTools Console:
import('./src/services/notificationService.js').then(({notificationService}) => {
  notificationService.programarRecordatoriosDiarios().then(console.log);
});
```

## 🔧 Comandos de Desarrollo

### 1. Ver logs en tiempo real
```bash
# Terminal 1: Servidor de desarrollo
npm run dev

# Terminal 2: Seguir logs (si tienes pm2 o similar)
# O simplemente revisar consola del navegador
```

### 2. Debugging de webhooks
```bash
# Usar ngrok para exponer localhost (útil para pruebas)
npm install -g ngrok
ngrok http 8081

# Luego usar la URL de ngrok en Make como webhook de prueba
```

### 3. Reiniciar servicios
```bash
# Reiniciar servidor de desarrollo
Ctrl+C
npm run dev

# Limpiar cache si hay problemas
rm -rf node_modules/.vite
npm run dev
```

## 📧 Comandos de Testing de Emails

### 1. Configurar email de prueba en Make
```javascript
// En Make.com, usar estos datos de prueba:
{
  "to": "tu-email@test.com",
  "subject": "Prueba - {{reserva.servicio}}",
  "html": "Hola {{reserva.nombre}}, tu cita es el {{reserva.fecha}}"
}
```

### 2. Probar diferentes tipos de notificación
```bash
# Desde panel de admin, ejecutar:
# - Prueba de conexión (nueva_reserva)
# - Recordatorios manuales (recordatorio)
# - Comprobantes (cuando implementes pagos)
```

## 🔍 Comandos de Monitoreo

### 1. Ver estado de notificaciones
```bash
# En consola del navegador (F12):
fetch('/api/notifications/stats')
  .then(response => response.json())
  .then(console.log);
```

### 2. Verificar webhook endpoint
```bash
# Probar que el webhook está activo
curl -X GET https://hook.eu2.make.com/TU_WEBHOOK_ID
```

### 3. Logs de base de datos
```bash
# Si usas Supabase, revisar en:
# https://app.supabase.com/project/TU_PROJECT/logs/explorer

# Buscar tabla 'reservas' y logs de API
```

## 🚨 Comandos de Solución de Problemas

### 1. Webhook no funciona
```bash
# Verificar URL
echo $VITE_MAKE_WEBHOOK_URL

# Verificar conectividad
curl -X POST $VITE_MAKE_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### 2. Variables de entorno no cargan
```bash
# Verificar archivo .env
cat .env | grep MAKE

# Reiniciar servidor
npm run dev
```

### 3. Emails no se envían
```bash
# Revisar configuración en Make:
# 1. Módulo de email conectado
# 2. Permisos de Gmail/Outlook
# 3. Filtros en router configurados
# 4. Variables mapeadas correctamente
```

### 4. Reset completo del sistema
```bash
# 1. Limpiar cache
rm -rf node_modules/.vite

# 2. Reinstalar dependencias
npm install

# 3. Reiniciar servidor
npm run dev

# 4. Limpiar localStorage del navegador
# En DevTools: localStorage.clear()
```

## 📊 Comandos de Estadísticas

### 1. Ver métricas de notificaciones
```bash
# En panel de admin -> Notificaciones -> Dashboard
# O en consola:
import('./src/services/notificationService.js').then(({notificationService}) => {
  notificationService.obtenerEstadisticas().then(console.log);
});
```

### 2. Exportar datos de reservas
```bash
# En consola del navegador:
import('./src/services/reservationService.js').then(({getAllReservations}) => {
  getAllReservations().then(data => {
    console.log('Reservas:', data);
    // Opcional: descargar como JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservas.json';
    a.click();
  });
});
```

## 🔄 Comandos de Automatización

### 1. Configurar cron job para recordatorios (servidor)
```bash
# Editar crontab
crontab -e

# Agregar línea (ejecutar todos los días a las 18:00):
0 18 * * * curl -X POST http://localhost:8081/api/recordatorios-diarios
```

### 2. Script de backup de datos
```bash
# Crear script backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
echo "Ejecutando backup de reservas..."
# Aquí agregar comandos de backup de Supabase
echo "Backup completado: backup_$DATE.sql"
```

## 📱 Comandos para Producción

### 1. Build para producción
```bash
npm run build
npm run preview
```

### 2. Deploy con variables de entorno
```bash
# Asegurar que las variables estén en producción
echo "VITE_MAKE_WEBHOOK_URL=$VITE_MAKE_WEBHOOK_URL" >> .env.production
```

---

## 🆘 Soporte Rápido

**En caso de emergencia**, ejecuta estos comandos paso a paso:

```bash
# 1. Verificar que todo funciona básicamente
npm run dev

# 2. Ir a http://localhost:8081/admin
# 3. Tab "Notificaciones" -> "Probar Conexión"
# 4. Si falla, revisar .env y webhook URL en Make
# 5. Si funciona, probar "Ejecutar Recordatorios"
```

**¡Tu sistema de notificaciones automáticas está listo para funcionar! 🎉** 