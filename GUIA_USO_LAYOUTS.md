# 📖 GUÍA DE USO: SISTEMA DE LAYOUTS REFACTORIZADO

## 🎯 Para Desarrolladores

### Cómo funciona el nuevo sistema

El sistema de layouts ahora es **declarativo y centralizado**. Toda la lógica de decisión sobre qué layout usar está en **un solo lugar**: `MainLayout.tsx`.

---

## 🏗️ Estructura del Sistema

### 1. MainLayout.tsx - El Cerebro

Este componente analiza la ruta actual y decide:
- ¿Mostrar header? ¿Cuál variante?
- ¿Mostrar footer? ¿Cuál variante?
- ¿Usar MobileLayout especial?
- ¿Layout de foco (sin header/footer)?

### 2. Componentes Despachadores

#### Header.tsx
```tsx
<Header variant="default" | "apuntes" | "none" />
```

#### Footer.tsx
```tsx
<Footer variant="default" | "apuntes" | "none" />
```

### 3. Componentes Específicos

#### Footers
- `ApuntesFooter.tsx` - Footer premium para Apuntes
- `MainFooter.tsx` - Footer estándar

#### Layouts
- `AgendamientoLayout.tsx` - Layout de conversión (tema oscuro, sin header/footer)

---

## 🚀 Casos de Uso

### Caso 1: Agregar una nueva sección con layout personalizado

**Escenario:** Quieres crear `/servicios/premium` con un footer especial.

**Pasos:**

1. **Crear el footer específico:**
```tsx
// src/components/layout/footers/PremiumFooter.tsx
const PremiumFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-gold-500 to-amber-600">
      {/* Tu diseño premium aquí */}
    </footer>
  );
};
```

2. **Actualizar Footer.tsx:**
```tsx
// src/components/Footer.tsx
interface FooterProps {
  variant?: 'default' | 'apuntes' | 'premium' | 'none';
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  if (variant === 'none') return null;
  if (variant === 'apuntes') return <ApuntesFooter />;
  if (variant === 'premium') return <PremiumFooter />;
  return <MainFooter />;
};
```

3. **Configurar en MainLayout.tsx:**
```tsx
// En getLayoutConfig()
if (path.startsWith('/servicios/premium')) {
  return {
    type: 'premium',
    showHeader: true,
    showFooter: true,
    headerVariant: 'default',
    footerVariant: 'premium', // ← Aquí
    useMobileLayout: false,
  };
}
```

✅ **Listo!** Sin tocar ninguna otra parte del código.

---

### Caso 2: Página sin header ni footer (como Agendamiento)

**Escenario:** Crear `/checkout` con foco total en conversión.

**Solución:**
```tsx
// En MainLayout.tsx, getLayoutConfig()
if (path === '/checkout') {
  return {
    type: 'focus',
    showHeader: false,
    showFooter: false,
    headerVariant: 'none',
    footerVariant: 'none',
    useMobileLayout: false,
  };
}
```

El componente se renderiza directamente sin ningún wrapper.

---

### Caso 3: Mobile layout especial para una sección

**Escenario:** Sección `/comunidad` con header especial en móvil.

**Solución:**
```tsx
if (path.startsWith('/comunidad')) {
  return {
    type: 'comunidad',
    showHeader: true,
    showFooter: true,
    headerVariant: 'default',
    footerVariant: 'default',
    useMobileLayout: true, // ← MobileLayout con scroll hiding
  };
}
```

---

## 🎨 Layouts Actuales Configurados

| Ruta | Header | Footer | Mobile Especial | Notas |
|------|--------|--------|-----------------|-------|
| `/agendamiento` | ❌ None | ❌ None | ❌ No | Layout de foco total |
| `/mercadopago` | ❌ None | ❌ None | ❌ No | Proceso de pago |
| `/apuntes/*` | ✅ Apuntes | ✅ Apuntes | ✅ Sí | Header que se oculta al scroll |
| `/servicios/familia` | ✅ Default | ❌ None | ❌ No | Tiene su propio footer |
| Resto (`/`, `/blog`, etc.) | ✅ Default | ✅ Default | ❌ No | Layout estándar |

---

## 💡 Tips de Desarrollo

### 1. Debugging de Layouts

Si quieres ver qué layout está activo:

```tsx
// En MainLayout.tsx, temporal
const config = getLayoutConfig();
console.log('🎨 Layout Config:', config);
```

### 2. Transiciones entre páginas

Las transiciones están manejadas por `PageTransition.tsx`, que está integrado en `MainLayout`. No necesitas agregarlo manualmente.

### 3. Agregando props dinámicas

Si necesitas pasar props al Header/Footer según la ruta:

```tsx
// En MainLayout.tsx
const getHeaderProps = () => {
  if (path.startsWith('/servicios/')) {
    return {
      onAgendarClick: () => navigate('/agendamiento'),
      serviceName: 'Tu Servicio'
    };
  }
  return {};
};

// Luego
<Header variant={config.headerVariant} {...getHeaderProps()} />
```

### 4. Manejo de rutas protegidas

El nuevo sistema sigue siendo compatible con `ProtectedRoute`. Simplemente envuelve la ruta:

```tsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🐛 Troubleshooting

### Problema: "El footer no aparece"

**Solución:** Verifica en `MainLayout.tsx` que la ruta esté configurada con `showFooter: true`.

### Problema: "El header no se está ocultando en móvil"

**Solución:** Asegúrate de que `useMobileLayout: true` esté configurado para esa ruta.

### Problema: "Quiero un layout completamente custom"

**Solución:** Para casos muy específicos, puedes renderizar directamente sin MainLayout:

```tsx
// En App.tsx
<Route path="/custom" element={<CustomPageWithOwnLayout />} />
```

Pero esto debe ser la excepción, no la regla.

---

## 📊 Comparación de Complejidad

### Antes (Sistema Antiguo)
```
Para agregar un nuevo layout:
1. Modificar Footer.tsx (añadir lógica condicional)
2. Modificar Header.tsx (añadir lógica condicional)
3. Modificar MobileLayout.tsx (añadir lógica condicional)
4. Posiblemente crear un nuevo componente de layout
5. Actualizar múltiples archivos

Total: ~5 archivos tocados
Líneas modificadas: ~50-100
Riesgo de bugs: ALTO
```

### Ahora (Sistema Refactorizado)
```
Para agregar un nuevo layout:
1. Crear componente específico (opcional)
2. Actualizar Footer/Header despachador (1 línea)
3. Configurar en MainLayout.tsx (5-10 líneas)

Total: ~2 archivos tocados
Líneas modificadas: ~10-20
Riesgo de bugs: BAJO
```

**Reducción de complejidad: 70%**

---

## 🎓 Ejemplos Avanzados

### Ejemplo 1: Layout con Sidebar condicional

```tsx
if (path.startsWith('/dashboard')) {
  return {
    type: 'dashboard',
    showHeader: true,
    showFooter: false,
    headerVariant: 'default',
    footerVariant: 'none',
    useMobileLayout: false,
    showSidebar: true, // Nueva prop
  };
}
```

### Ejemplo 2: Layout con animaciones custom

```tsx
// Crear CustomLayout.tsx
const CustomLayout = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

// En MainLayout.tsx
if (config.type === 'custom') {
  return <CustomLayout><Outlet /></CustomLayout>;
}
```

---

## ✅ Checklist para nuevos desarrolladores

Al trabajar con layouts:
- [ ] ¿Es necesario un layout completamente nuevo o puedo usar uno existente?
- [ ] ¿Qué header y footer necesito? (default, apuntes, none)
- [ ] ¿Es una página móvil-first? (useMobileLayout)
- [ ] ¿Necesita transiciones especiales?
- [ ] He configurado correctamente en `MainLayout.tsx`?

---

## 🏆 Beneficios del Nuevo Sistema

1. **Mantenibilidad:** Una sola fuente de verdad
2. **Escalabilidad:** Agregar layouts es trivial
3. **Testabilidad:** Componentes independientes
4. **Performance:** Lazy loading optimizado
5. **DX (Developer Experience):** Código más limpio y predecible

---

## 📞 Soporte

Si tienes dudas sobre cómo implementar un layout específico:
1. Revisa `MainLayout.tsx` para ver ejemplos existentes
2. Consulta esta guía
3. Pregunta en el equipo de desarrollo

---

**Última actualización:** Noviembre 2025  
**Versión:** 2.0 (Sistema Refactorizado)








