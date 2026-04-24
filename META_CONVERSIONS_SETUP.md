# Configuración Meta Conversions API

## Token de Acceso

```
EABAXeUpkjJIBQ2fV4rm07Dj9K3aWV30YmpT6yPBTzSZCrZBSmxJDaYnc8vdM8r5dOM2l1gte9rLA6yXAQ039x09vwCipOxyMflnSZAFQZAmhWqLnz1IF0i6JbzCzT4ZCQmNwmgdV70wiXtbZCC06RGR4RttYWtVC6ZBQpnVauLTeznJVGntNrWHgDxxAKLOQv4fbwZDZD
```

**Fecha de creación:** 21 feb 2026, 10:31 pm  
**Creado por:** Punto Juridico

## Configuración en Supabase

### 1. Configurar Variable de Entorno

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Settings** → **Edge Functions** → **Secrets**
3. Agrega la siguiente variable de entorno:

```
META_CONVERSIONS_API_TOKEN=EABAXeUpkjJIBQ2fV4rm07Dj9K3aWV30YmpT6yPBTzSZCrZBSmxJDaYnc8vdM8r5dOM2l1gte9rLA6yXAQ039x09vwCipOxyMflnSZAFQZAmhWqLnz1IF0i6JbzCzT4ZCQmNwmgdV70wiXtbZCC06RGR4RttYWtVC6ZBQpnVauLTeznJVGntNrWHgDxxAKLOQv4fbwZDZD
```

### 2. Pixel ID

- **Pixel ID:** `1101807351995991`
- **API Version:** `v21.0`
- **Endpoint:** `https://graph.facebook.com/v21.0/1101807351995991/events`

## Eventos Configurados

### 1. CompleteRegistration

**Descripción:** Envío de información por parte de un cliente a cambio de un servicio proporcionado.

**Parámetros:**

- `event_name`: "CompleteRegistration"
- `event_time`: Timestamp Unix
- `action_source`: "website"
- `user_data`: email (hashed), phone (hashed), nombre, ciudad, sexo
- `event_source_url`: URL de origen

**Dónde se dispara:** Cuando un usuario completa el formulario de agendamiento

### 2. Purchase

**Descripción:** Finalización de una compra.

**Parámetros:**

- `event_name`: "Purchase"
- `event_time`: Timestamp Unix
- `action_source`: "website"
- `custom_data`: currency, value
- `user_data`: email (hashed), phone (hashed)

**Dónde se dispara:** En `PaymentSuccessPage.tsx` cuando se confirma el pago

### 3. ViewContent

**Descripción:** Visita a una página de contenido importante.

**Parámetros:**

- `event_name`: "ViewContent"
- `event_time`: Timestamp Unix
- `action_source`: "website"
- `event_source_url`: URL de la página

**Dónde se dispara:** En páginas de servicios y landing page

### 4. Schedule

**Descripción:** Reserva de una cita.

**Parámetros:**

- `event_name`: "Schedule"
- `event_time`: Timestamp Unix
- `action_source`: "website"
- `custom_data`: content_name, content_category, value, currency

**Dónde se dispara:** En `AgendamientoContext.tsx` para reservas gratuitas

## Eventos Adicionales Implementados

### Lead

**Dónde se dispara:** Cuando un usuario inicia el proceso de agendamiento con pago

### InitiateCheckout

**Dónde se dispara:** Cuando un usuario es redirigido a MercadoPago para pagar

## Estructura de la Carga

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1771723860,
      "action_source": "website",
      "user_data": {
        "em": ["7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068"],
        "ph": [null]
      },
      "custom_data": {
        "currency": "CLP",
        "value": "35000"
      },
      "event_source_url": "https://puntolegal.cl/payment-success"
    }
  ]
}
```

## Notas Importantes

1. **Deduplicación:** Facebook deduplica automáticamente eventos idénticos del Pixel y la API
2. **Event Time:** El tiempo puede ser anterior al momento de envío, pero no más de 7 días
3. **Lotes:** Se pueden enviar hasta 1,000 eventos por lote
4. **Hash de Datos:** Los emails y teléfonos se hashean con SHA-256 antes de enviarse

## Verificación

Para verificar que los eventos se están enviando correctamente:

1. Ve a **Eventos** en Meta Events Manager
2. Busca eventos con el nombre correspondiente
3. Verifica que los parámetros estén correctos

## Prueba de Eventos

### Código de prueba (Test Events)

En **Events Manager** → **Probar eventos**, Meta muestra un código que cambia (ej. `TEST53498`). Para que el front y la Edge Function envíen eventos a ese flujo de prueba:

1. En la raíz del proyecto, en `.env.local` (no commitear):

```bash
VITE_META_TEST_EVENT_CODE=TEST53498
```

1. Reinicia el servidor de Vite. `trackMetaEvent` adjunta automáticamente `test_event_code` a la petición CAPI (la función `meta-conversions` ya lo reenvía a Graph API).

En **producción** no definas esta variable: los eventos deben registrarse como tráfico real, no en el panel de prueba.

- **Parámetro Graph API:** `test_event_code` (mismo valor que muestra Meta).

### Página de Prueba Local

Visita: `http://localhost:8080/test-meta-pixel`

Esta página incluye botones para probar todos los eventos configurados:

- PageView
- ViewContent
- CompleteRegistration
- Lead
- InitiateCheckout
- Schedule
- Purchase

### Probar desde Meta Events Manager

1. Ve a **Meta Events Manager** → **Probar eventos**
2. Mantén la página "Probar eventos" abierta
3. Usa la página de prueba local (`/test-meta-pixel`) o realiza acciones en el sitio
4. Los eventos aparecerán en tiempo real en Meta Events Manager con el código `TEST2065`

### Probar con Graph API Explorer

1. Copia el código de prueba: `TEST2065`
2. Ve a Graph API Explorer
3. Realiza una solicitud POST a:
  ```
   https://graph.facebook.com/v21.0/1101807351995991/events?access_token={TOKEN}&test_event_code=TEST2065
  ```
4. Con el payload de ejemplo proporcionado en Meta Events Manager
5. Vuelve a la página "Probar eventos" para verificar

## Troubleshooting

Si los eventos no aparecen:

1. Verifica que el token esté configurado correctamente en Supabase
2. Revisa los logs de la función Edge en Supabase
3. Verifica que el Pixel ID sea correcto
4. Asegúrate de que los datos estén hasheados correctamente

