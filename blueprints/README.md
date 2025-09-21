# 📋 Blueprints para Make.com

Este directorio contiene todos los archivos necesarios para configurar Make.com automáticamente.

## 📁 Archivos Incluidos

### 🎯 Blueprint Principal
- **`make-scenario-blueprint.json`** - Blueprint completo para importar en Make.com
- **`IMPORT_INSTRUCTIONS.md`** - Instrucciones paso a paso para importar

### 🧪 Scripts de Prueba
- **`../scripts/test-make-webhook.js`** - Script para probar el webhook

## 🚀 Uso Rápido

### 1. Importar Blueprint
1. Abrir `make-scenario-blueprint.json`
2. Copiar todo el contenido
3. Ir a [Make.com](https://www.make.com)
4. Crear nuevo scenario
5. Importar el JSON copiado

### 2. Configurar Conexiones
1. **Webhook:** Copiar URL y actualizar en el código
2. **Google Calendar:** Conectar cuenta de Google
3. **Emails:** Configurar servicio de email

### 3. Probar
1. Ejecutar `node scripts/test-make-webhook.js`
2. Verificar emails enviados
3. Confirmar evento en calendario

## 🎯 Funcionalidades del Blueprint

### ✅ Módulos Incluidos
1. **Webhook Trigger** - Recibe datos de la aplicación
2. **Email Cliente** - Envía confirmación al cliente
3. **Email Admin** - Notifica nueva consulta al admin
4. **Google Calendar** - Crea evento automáticamente
5. **Response** - Retorna confirmación a la aplicación

### ✅ Características
- **Templates HTML** profesionales para emails
- **Códigos de seguimiento** únicos
- **Links de Google Meet** automáticos
- **Eventos en calendario** con recordatorios
- **Respuesta JSON** estructurada

## 🔧 Configuración Requerida

### Make.com
- Cuenta activa en Make.com
- Permisos para crear scenarios
- Acceso a módulos de email y Google Calendar

### Google Calendar
- Cuenta de Google con Calendar habilitado
- Permisos para crear eventos
- Calendario principal configurado

### Email
- Servicio de email configurado (Gmail, Outlook, etc.)
- Credenciales SMTP válidas
- Límites de envío apropiados

## 📊 Estructura de Datos

El webhook espera recibir:

```json
{
  "cliente": {
    "nombre": "string",
    "email": "string",
    "telefono": "string"
  },
  "servicio": {
    "tipo": "string",
    "precio": "string",
    "fecha": "string",
    "hora": "string"
  },
  "pago": {
    "metodo": "string",
    "estado": "string",
    "fecha_pago": "string"
  },
  "reserva": {
    "id": "string",
    "tracking_code": "string",
    "google_meet_link": "string"
  }
}
```

## 🚨 Notas Importantes

1. **URL del Webhook:** Actualizar en `src/services/makeEmailService.ts`
2. **Testing:** Siempre probar antes de producción
3. **Seguridad:** No exponer URLs de webhook públicamente
4. **Monitoreo:** Revisar logs de Make.com regularmente

## 🔍 Troubleshooting

### Problemas Comunes
- **Webhook no recibe datos:** Verificar URL y método POST
- **Emails no se envían:** Revisar credenciales SMTP
- **Calendar no funciona:** Verificar permisos de Google
- **Variables no mapean:** Revisar estructura JSON

### Soluciones
1. Revisar configuración de módulos
2. Probar con datos de prueba
3. Verificar logs de Make.com
4. Contactar soporte si es necesario

## 📞 Soporte

Para problemas con la configuración:
1. Revisar documentación de Make.com
2. Verificar configuración de módulos
3. Probar con datos de prueba
4. Contactar soporte técnico
