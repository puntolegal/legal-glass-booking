# 🚀 Checklist de Despliegue en Lovable

## ⚠️ PROBLEMA IDENTIFICADO

Los archivos críticos del sistema de auditoría **NO están en el repositorio**:
- ❌ `src/hooks/useAuditManager.ts`
- ❌ `src/components/AmandaProfileCard.tsx`
- ❌ `src/pages/apuntes/AuditoriaPage.tsx`
- ❌ `src/pages/AmandaLogin.tsx`

## ✅ ARCHIVOS QUE SÍ ESTÁN EN GITHUB

- ✅ `supabase/migrations/20250128000000-create-audit-system.sql` - Migración SQL
- ✅ `src/integrations/supabase/types.ts` - Tipos de Supabase con `apuntes_audits`
- ✅ `src/components/ApuntesHeader.tsx` - Header con referencias a auditoría
- ✅ `src/components/ApuntesContent.tsx` - Contenido de apuntes

## 🔧 SOLUCIÓN INMEDIATA

### Opción 1: Verificar archivos locales
Si los archivos existen localmente pero no están en Git:

```bash
# Verificar archivos no trackeados
git status

# Agregar archivos faltantes
git add src/hooks/useAuditManager.ts
git add src/components/AmandaProfileCard.tsx
git add src/pages/apuntes/AuditoriaPage.tsx
git add src/pages/AmandaLogin.tsx

# Commit y push
git commit -m "feat: Agregar archivos críticos del sistema de auditoría"
git push origin main
```

### Opción 2: Recrear archivos faltantes
Si los archivos fueron eliminados, necesitas recrearlos basándote en el código que funcionaba en local.

## 📋 CHECKLIST PRE-DEPLOY

### 1. Verificar Git Status
- [ ] `git status` muestra working tree clean
- [ ] Todos los cambios están commitados
- [ ] Último commit está en `origin/main`

### 2. Verificar Archivos Críticos
- [ ] `src/hooks/useAuditManager.ts` existe
- [ ] `src/components/AmandaProfileCard.tsx` existe
- [ ] `src/pages/apuntes/AuditoriaPage.tsx` existe
- [ ] `src/pages/AmandaLogin.tsx` existe
- [ ] `supabase/migrations/20250128000000-create-audit-system.sql` existe

### 3. Verificar Rutas en App.tsx
- [ ] Ruta `/apuntes/auditoria` está configurada
- [ ] Ruta `/amanda` está configurada (si aplica)
- [ ] Imports de componentes están correctos

### 4. Verificar Variables de Entorno en Lovable
- [ ] `VITE_SUPABASE_URL` está configurada
- [ ] `VITE_SUPABASE_ANON_KEY` está configurada
- [ ] Variables están en formato correcto (sin comillas)

### 5. Verificar Migración SQL en Supabase
- [ ] Tabla `apuntes_audits` existe en Supabase
- [ ] Políticas RLS están activas
- [ ] Índices están creados

## 🚀 PASOS PARA DEPLOY EN LOVABLE

### Paso 1: Sincronizar con GitHub
1. Ve a tu proyecto en Lovable
2. Verifica que esté conectado a `origin/main`
3. Haz clic en "Sync" o "Pull from GitHub"

### Paso 2: Verificar Build
1. Ve a Settings > Build
2. Verifica que el comando sea `npm run build:prod`
3. Verifica que el output sea `dist`

### Paso 3: Ejecutar Build Manual
1. Ve a Deployments
2. Haz clic en "New Deployment"
3. Selecciona branch `main`
4. Espera a que termine el build

### Paso 4: Verificar Deployment
1. Abre la URL de preview
2. Verifica que `/apuntes` carga correctamente
3. Verifica que `/apuntes/auditoria` funciona (si está configurada)
4. Verifica que el login de Amanda funciona (si está configurado)

## 🐛 TROUBLESHOOTING

### Problema: "Module not found: useAuditManager"
**Solución:** El archivo `src/hooks/useAuditManager.ts` no existe. Necesitas recrearlo o verificar que esté en Git.

### Problema: "Cannot find module '@/components/AmandaProfileCard'"
**Solución:** El archivo `src/components/AmandaProfileCard.tsx` no existe. Necesitas recrearlo o verificar que esté en Git.

### Problema: "Route /apuntes/auditoria not found"
**Solución:** Verifica que la ruta esté configurada en `src/App.tsx` y que el componente `AuditoriaPage` esté importado.

### Problema: "Supabase table apuntes_audits does not exist"
**Solución:** Ejecuta la migración SQL en Supabase Dashboard:
1. Ve a SQL Editor
2. Copia contenido de `supabase/migrations/20250128000000-create-audit-system.sql`
3. Ejecuta el script

## 📝 NOTAS IMPORTANTES

1. **Lovable sincroniza automáticamente** con GitHub cuando haces push a `main`
2. **El build puede tardar** varios minutos la primera vez
3. **Las variables de entorno** deben estar configuradas en Lovable Settings
4. **La migración SQL** debe ejecutarse manualmente en Supabase Dashboard

## ✅ ESTADO ACTUAL

- ✅ Migración SQL lista y guardada en GitHub
- ✅ Tipos de Supabase actualizados
- ❌ Archivos de componentes faltantes (necesitan ser recreados o agregados a Git)
- ❌ Rutas de auditoría no configuradas en App.tsx

