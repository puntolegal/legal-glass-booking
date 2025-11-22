# 🍎 Paleta Estratégica "iPadOS Legal"

## Filosofía de Color

**Regla de Oro**: Menos es más. Colores estratégicos, no decorativos.

## Paleta Base (Estructuras)

### Neutros (Stone)
- **Stone-50** (`#FAFAF9`): Fondos principales
- **Stone-100** (`#F5F5F4`): Fondos secundarios
- **Stone-200** (`#E7E5E4`): Bordes sutiles
- **Stone-600** (`#57534E`): Texto secundario
- **Stone-700** (`#44403C`): Texto principal
- **Stone-900** (`#1C1917`): Texto fuerte

### Neutros (Slate) - Solo para texto y bordes
- **Slate-400** (`#94A3B8`): Texto deshabilitado
- **Slate-500** (`#64748B`): Texto secundario
- **Slate-600** (`#475569`): Texto normal
- **Slate-700** (`#334155`): Texto importante
- **Slate-800** (`#1E293B`): Texto fuerte

## Colores de Acción (Uso Limitado)

### Indigo (Acciones Principales)
- **Indigo-500** (`#6366F1`): Botones principales, links activos
- **Indigo-600** (`#4F46E5`): Hover de acciones principales
- **Indigo-50** (`#EEF2FF`): Fondos sutiles de acciones (opacidad baja)

**Uso**: Solo para elementos interactivos principales (botones CTA, links importantes)

### Emerald (Éxito/Auditoría)
- **Emerald-500** (`#10B981`): Estados de éxito, badges de auditoría
- **Emerald-600** (`#059669`): Hover de éxito
- **Emerald-50** (`#ECFDF5`): Fondos sutiles de éxito (opacidad baja)

**Uso**: Solo para estados de éxito, validación, auditoría completada

## Colores Prohibidos (Neón)

❌ **NO USAR**:
- Cyan (demasiado brillante)
- Violet/Purple (demasiado saturado)
- Rose/Pink (demasiado llamativo)
- Orange (demasiado energético)
- Yellow (demasiado brillante)

## Reglas de Aplicación

### 1. Fondos
- **Base**: `bg-[#FAFAF9]` (Stone-50) o `bg-white/60` con `backdrop-blur-2xl`
- **Cards**: `bg-white/60 dark:bg-[#1c1c1e]/60` con `backdrop-blur-2xl`
- **Nunca**: Gradientes de colores neón como fondo

### 2. Texto
- **Principal**: `text-[#1d1d1f] dark:text-white` o `text-stone-900 dark:text-stone-100`
- **Secundario**: `text-slate-600 dark:text-slate-400`
- **Deshabilitado**: `text-slate-400 dark:text-slate-500`

### 3. Bordes
- **Sutiles**: `border-white/20 dark:border-white/5`
- **Definidos**: `border-stone-200 dark:border-stone-700`
- **Nunca**: Bordes de colores neón

### 4. Acciones
- **Botones Primarios**: `bg-indigo-500 text-white`
- **Botones Secundarios**: `bg-white/60 border border-white/20`
- **Éxito**: `bg-emerald-500/20 text-emerald-600 border-emerald-500/30`

### 5. Estados
- **Hover**: `hover:bg-white/80 dark:hover:bg-[#2c2c2e]/80`
- **Active**: `active:scale-95`
- **Focus**: `focus:ring-2 focus:ring-indigo-500/30`

## Ejemplos de Uso Correcto

### ✅ Correcto
```tsx
// Card con glassmorphism
<div className="bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 rounded-[32px]">

// Botón de acción
<button className="bg-indigo-500 text-white rounded-full px-6 py-3">

// Badge de éxito
<span className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 rounded-full">
```

### ❌ Incorrecto
```tsx
// Gradiente neón
<div className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400">

// Color neón en texto
<span className="text-cyan-600">Texto</span>

// Orbe de color saturado
<div className="bg-violet-400/20 blur-3xl">
```

## Checklist de Aplicación

- [ ] Eliminar todos los gradientes de colores neón
- [ ] Reemplazar cyan/violet/rose/orange por stone/slate
- [ ] Usar indigo solo para acciones principales
- [ ] Usar emerald solo para éxito/auditoría
- [ ] Aplicar `rounded-[32px]` a contenedores principales
- [ ] Aplicar `backdrop-blur-2xl` a elementos glass
- [ ] Verificar que no haya colores saturados en fondos


