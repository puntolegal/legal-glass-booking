## Contexto Pago & Quiz – 18 noviembre

### Documentación relevante en repo
- `CONFIGURACION_URLS_RETORNO_MERCADOPAGO.md` – describe el flujo completo de Checkout Pro y las URLs de retorno/process.
- `CONFIGURACION_PRODUCCION.md` + `ESTADO_FINAL_SISTEMA_IONOS.md` – checklists generales para credenciales, URLs y verificación con MercadoPago.
- `SOLUCION_ERROR_PXI03.md` y `SOLUCION_MERCADOPAGO_TOKEN.md` – guías específicas para errores de token/credenciales o PXI03 en Checkout Pro.
- `scripts/explicacion-modo-offline.md` – documentación del fallback offline/códigos de convenio.

### Estado actual del código
- **Agendamiento** (`src/contexts/AgendamientoContext.tsx`):
  - Inserta la reserva en Supabase (`createBookingWithRealEmail`).
  - Normaliza montos antes de llamar al edge function `create-mercadopago-preference`.
  - Redirige con `window.location.assign` a `init_point`/`sandbox_init_point`.
  - Si el precio es $0 (admin/código), salta directo a `payment-success`.
- **Quiz Gratis** (`src/components/QuizModal.tsx`):
  - Calcula el plan recomendado antes de pedir email.
  - Tras el submit muestra el resultado instantáneamente (aunque el insert falle).
  - Intenta guardar el lead en Supabase y, ante error, mantiene un buffer local (`pendingQuizLeads`).

### Plan de acción propuesto
1. **Verificación manual de pago**  
   - En sandbox/dev, completar `/agendamiento?plan=consulta-estrategica-familia` verificando que el request a `create-mercadopago-preference` reciba `init_point`.  
   - Revisar logs de la edge function en Supabase si la respuesta no es 200.  
   - Confirmar en la tabla `reservas` que el `external_reference` se guarda y el `preference_id` se actualiza tras crear la preferencia.
2. **Quiz**  
   - Ejecutar el flujo completo y revisar en la tabla `leads_quiz`.  
   - Si Supabase falla (modo offline), validar que `pendingQuizLeads` contenga la entrada y definir un job/manual para reenviar esos leads al volver a tener conexión.
3. **Preparación para producción**  
   - Cruzar el checklist de `CONFIGURACION_URLS_RETORNO_MERCADOPAGO.md` y `CONFIGURACION_PRODUCCION.md` (URLs, dominios verificados, tokens).  
   - Monitorear `PaymentSuccessPage` para asegurar que procesa los parámetros (`status`, `payment_id`, `external_reference`).

Esta nota sirve de referencia rápida para los puntos críticos a revisar antes del deploy.
