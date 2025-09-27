# 🔧 Solución rápida: el botón “Pagar” (Checkout Pro) no hace nada

Estos son los motivos más comunes y cómo resolverlos en minutos, alineado con este repo (Vite frontend + backend/Edge para crear la preferencia).

## Causas típicas y fixes

1) Preferencia inválida o no creada
- Síntoma: el botón no navega o queda deshabilitado.
- Chequea: la respuesta de crear preferencia debe incluir `id` e `init_point` (o `sandbox_init_point`).
- Fix: loguea HTTP status, `id`, `init_point`/`sandbox_init_point` y, si falla, imprime el body completo para ver la causa.

2) Mezcla de entornos (sandbox vs producción)
- Síntoma: botón “muerto” o error genérico al abrir.
- Chequea: en dev, token `TEST-` y usar `sandbox_init_point`; en prod, token `APP_USR-` y usar `init_point`.
- Fix: selecciona URL por entorno; en Vite preferí `import.meta.env.PROD`.

3) Token/cuenta no habilitada para cobrar
- Síntoma: preferencia no se crea o viene sin init_point válido.
- Chequea: `MERCADOPAGO_ACCESS_TOKEN` sea del vendedor correcto y la cuenta esté verificada (KYC).
- Fix: valida con `GET https://api.mercadopago.com/users/me` usando el token.

4) Items mal formados o montos inválidos
- Síntoma: la API responde 4xx.
- Chequea: `title` string, `quantity` > 0, `unit_price` > 0, moneda/site correctos.
- Fix: valida el payload antes de llamar a la API.

5) URLs de retorno no HTTPS o dominio inconsistente
- Síntoma: error genérico al volver o flujo interrumpido.
- Chequea: `success/failure/pending` sean HTTPS en prod y del mismo dominio público.
- Fix: corrige a `https://…` y usa tu dominio público.

6) No redirigís al `init_point`
- Síntoma: el botón no navega aunque tengas preferencia.
- Fix: redirigí con `window.location.href`. Snippet correcto:

```ts
const goPay = async () => {
  const r = await fetch('/api/mercadopago/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error('No se pudo crear la preferencia');
  const url = (import.meta.env.PROD ? data.init_point : (data.sandbox_init_point || data.init_point));
  window.location.href = url;
};
```

7) Bloqueo por navegador/extensiones
- Síntoma: click sin efecto en ciertos usuarios.
- Chequea: ad-blockers, privacy, bloqueo de popups/redirecciones.
- Fix: probar incógnito sin extensiones y redirigir en misma pestaña.

8) CSP/IFrame que bloquea scripts/redirecciones
- Síntoma: errores CSP o navegación bloqueada.
- Chequea: permitir `https://sdk.mercadopago.com`, `https://api.mercadopago.com`, `https://www.mercadopago.com` en `script-src`, `connect-src`, `frame-src`.
- Fix: ajusta tu Content-Security-Policy.

9) SDK mal inicializado (Bricks/SDK cliente)
- Síntoma: botón renderiza pero queda deshabilitado.
- Chequea: `VITE_MERCADOPAGO_PUBLIC_KEY` cargada y no duplicar instancias/listeners.
- Fix: revisa orden de inicialización y una sola instancia del SDK.

10) Estado del comprador de prueba / medios de pago
- Síntoma: en sandbox el flujo no avanza o rechaza siempre.
- Chequea: comprador de prueba distinto al vendedor; tarjetas de prueba válidas.
- Fix: cambia cuentas de test; usa tarjetas oficiales.

11) Credenciales en lugar incorrecto (frontend vs backend)
- Síntoma: CORS o token expuesto.
- Chequea: la preferencia se crea en backend/edge; el frontend NUNCA usa el Access Token.
- Fix: deja `MERCADOPAGO_ACCESS_TOKEN` solo en backend y `VITE_MERCADOPAGO_PUBLIC_KEY` en frontend.

12) Botón propio con handler roto
- Síntoma: atributo `disabled`/estilos bloqueando o handler no vinculado.
- Fix: asegurar enabled y que el onClick ejecute la redirección.

13) Caché/SSR mezclando variables
- Síntoma: usa claves/URLs del entorno equivocado.
- Fix: limpiar cachés y verificar variables en el panel del hosting.

---

## Prueba de humo en 2 minutos
- Crear preferencia (backend) y loguear: status, `id`, `init_point`/`sandbox_init_point`.
- Pegar `init_point` en el navegador: si abre, el problema está en el botón/JS.
- Probar en incógnito sin extensiones.
- Revisar consola y Network: ¿4xx/5xx de la API? ¿CSP bloquea algo?

---

## Mini-checklist del repo
- `MERCADOPAGO_ACCESS_TOKEN` solo en backend/hosting.
- `VITE_MERCADOPAGO_PUBLIC_KEY` en frontend (Vite).
- En dev usa `sandbox_init_point`; en prod `init_point`.
- `back_urls` HTTPS en prod y del dominio público.
- Botón llama a backend/edge y redirige al `init_point`.

---

## Health-check rápido

Opción CLI: ejecuta el script de sanity que crea una preferencia de prueba con tu token del backend.

```
node scripts/mp-sanity-check.mjs
```

Opción UI: usa el snippet del punto 6 para crear y redirigir al `init_point`.

---

## Panel de Mercado Pago (opcional/fallback)

Aunque `back_urls` en la preferencia tienen prioridad, podés configurar URLs y webhook en el panel para validar conectividad:
- URL de éxito: `https://www.puntolegal.online/payment-success?source=mercadopago`
- URL de fallo: `https://www.puntolegal.online/payment-failure?source=mercadopago`
- URL pendiente: `https://www.puntolegal.online/payment-pending?source=mercadopago`
- Webhook: `https://www.puntolegal.online/api/mercadopago/webhook`
- Evento: “Pagos”
- Clave secreta: crea/usa una propia y guárdala solo como variable del hosting (no la dejes en docs/código)

Sugerencia: validá con el simulador del panel y verificá logs de tu backend/edge.
