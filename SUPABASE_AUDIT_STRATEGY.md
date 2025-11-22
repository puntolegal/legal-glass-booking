# 🗄️ Estrategia Supabase - Sistema de Auditoría

## 📊 Qué Guardar en Supabase

### Tabla: `apuntes_audits`

**Campos Esenciales:**
```sql
- id (UUID, PK)
- note_id (TEXT) - ID de la nota/apunte
- auditor_id (UUID, FK a auth.users) - Quién auditó
- auditor_name (TEXT) - Nombre del auditor (ej: "Amanda G.")
- audited_at (TIMESTAMP) - Cuándo se auditó
- status (TEXT) - 'audited', 'pending', 'rejected'
- comments (TEXT, nullable) - Comentarios del auditor
- created_at, updated_at (TIMESTAMPS)
```

**Índices:**
- `note_id` - Para buscar auditorías de una nota
- `auditor_id` - Para ver qué auditó cada auditor
- `status` - Para filtrar por estado
- `audited_at DESC` - Para ordenar por fecha

**RLS Policies:**
- SELECT: Cualquier usuario autenticado puede ver
- INSERT: Solo curadores pueden crear
- UPDATE: Solo el auditor original puede actualizar

## 🔄 Flujo de Sincronización

### 1. Guardar en Supabase (Prioritario)
```typescript
// Cuando se audita una nota
await supabase
  .from('apuntes_audits')
  .upsert({
    note_id: noteId,
    auditor_id: user.id,
    auditor_name: user.name,
    audited_at: new Date().toISOString(),
    status: 'audited'
  }, {
    onConflict: 'note_id,auditor_id'
  });
```

### 2. Fallback a localStorage
- Si Supabase falla, guardar en localStorage
- Sincronizar cuando vuelva la conexión

### 3. Cargar desde Supabase
```typescript
// Al cargar la página
const { data } = await supabase
  .from('apuntes_audits')
  .select('note_id, status, audited_at')
  .eq('status', 'audited');

// Convertir a Set para uso local
const auditedNotes = new Set(data.map(a => a.note_id));
```

## 🎯 Ventajas de Supabase

1. **Persistencia Real**: No se pierde al cambiar de dispositivo
2. **Historial Completo**: Ver quién auditó qué y cuándo
3. **Multi-usuario**: Varios auditores pueden trabajar
4. **Analytics**: Consultas SQL para reportes
5. **Backup Automático**: Supabase hace backup

## 📋 Migración desde localStorage

1. Leer todos los datos de localStorage
2. Migrar a Supabase en batch
3. Mantener localStorage como cache local
4. Sincronizar periódicamente


