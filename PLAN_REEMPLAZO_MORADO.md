# 🎨 Plan de Reemplazo del Color Morado/Violet

## 📊 Análisis del Uso Actual

### ❌ Problema Identificado
El morado/violet (`purple-500`, `violet-500`) está **PROHIBIDO** según la paleta "iPadOS Legal" porque:
- Es demasiado saturado y distrae del contenido
- No transmite profesionalismo legal (asociado más con creatividad/arte)
- Rompe la coherencia visual de la aplicación
- Puede causar fatiga visual en sesiones largas de estudio

### 🔍 Usos Encontrados en Sección Apuntes

1. **ApuntesContent.tsx** (CRÍTICO):
   - Footer de completitud: `from-indigo-500 to-purple-600` ❌

2. **ApuntesCard.tsx**:
   - Categoría "derecho-procesal": `bg-purple-100` ❌

3. **ApuntesFooter.tsx**:
   - Múltiples gradientes con purple ❌

4. **ApuntesSidebar_Móvil.tsx**:
   - Orbes decorativos: `to-purple-400/10` ❌

## ✅ Propuesta de Reemplazo

### Opción 1: Indigo Sólido (Recomendado)
**Para**: Gradientes, botones, acentos
- `from-indigo-500 to-indigo-600` → `bg-indigo-500`
- Más profesional, menos saturado
- Ya aprobado en la paleta para acciones principales

### Opción 2: Stone/Slate (Más Neutro)
**Para**: Fondos, categorías, elementos decorativos
- `purple-100` → `stone-100` o `slate-100`
- `purple-500` → `stone-600` o `slate-600`
- Máxima neutralidad y profesionalismo

### Opción 3: Indigo + Stone (Gradiente Elegante)
**Para**: Elementos especiales que necesitan profundidad
- `from-indigo-500 to-purple-600` → `from-indigo-500 to-stone-600`
- Mantiene dinamismo sin saturación excesiva

## 🎯 Recomendación Final

**Para una app jurídica de primer nivel:**

1. **Gradientes de acción**: Usar `indigo-500` sólido (sin gradiente)
2. **Categorías**: Usar `indigo` para diferenciación sutil
3. **Fondos decorativos**: Usar `stone` o `slate` con opacidad baja
4. **Acentos especiales**: Solo `indigo` para acciones, `emerald` para éxito

**Razón**: El indigo es más profesional, menos saturado que el morado, y ya está aprobado en nuestra paleta. Para elementos que no requieren acción, usar stone/slate mantiene la neutralidad profesional.

## 📋 Plan de Ejecución

1. ✅ Reemplazar gradiente en ApuntesContent.tsx (footer completitud)
2. ✅ Reemplazar purple en ApuntesCard.tsx (categoría derecho-procesal)
3. ✅ Limpiar ApuntesFooter.tsx (si se usa en apuntes)
4. ✅ Limpiar ApuntesSidebar_Móvil.tsx (orbes decorativos)


