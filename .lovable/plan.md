

## Plan: Boton WhatsApp estrategico + Fix build error

### 1. Fix del error de build (critico)

En `src/contexts/AgendamientoContext.tsx` linea 357, se referencia `formData.ciudad` pero la interfaz `FormData` no tiene esa propiedad. Se eliminara esa referencia reemplazando `ct: formData.ciudad || undefined` por simplemente remover ese campo del `user_data`.

### 2. Boton de WhatsApp estrategico

La idea es agregar un enlace sutil de WhatsApp que no interrumpa el flujo de conversion, sino que capture a usuarios indecisos que necesitan hablar con un abogado antes de pagar.

**Ubicacion y diseno:**

- **Desktop (ConversionSidebar):** Agregar al final del sidebar, debajo del testimonio, un bloque discreto con icono de WhatsApp + texto tipo "Tienes dudas? Habla con un abogado antes de agendar". Estilo: borde sutil, colores tenues del tema, sin competir visualmente con el CTA principal de pago.

- **Mobile (AgendamientoLayout):** Agregar un enlace flotante fijo en la esquina inferior derecha (estilo FAB pequeno) con el icono de WhatsApp. Tamano moderado (48x48), semi-transparente, que no tape los botones de accion del formulario.

**Link:** `https://wa.me/56962321883?text=Hola%2C%20quisiera%20agendar%20en%20Punto%20Legal`

**Estrategia de no-interrupcion:**
- El boton no aparecera durante el Step 3 (pago) para no desviar al usuario que ya esta pagando
- En desktop, se ubica al final del sidebar (scroll natural)
- En mobile, es un FAB discreto con opacidad reducida que no compite con los CTAs principales

### Detalle tecnico

**Archivos a modificar:**

1. **`src/contexts/AgendamientoContext.tsx`** (linea 357): Eliminar `ct: formData.ciudad || undefined`

2. **`src/components/agendamiento/ConversionSidebar.tsx`**: Agregar al final (antes del cierre del div sticky) un bloque con enlace a WhatsApp, usando los colores del serviceTheme, con icono SVG de WhatsApp inline.

3. **`src/components/agendamiento/AgendamientoLayout.tsx`**: En la version mobile, agregar un boton FAB flotante de WhatsApp (posicion fixed, bottom-right) que solo se muestre en steps 1 y 2. Usar `target="_blank"` y `rel="noopener noreferrer"`.

