# Evaluación: Supabase → Notion (Zapier vs manual)

## Opción A — CSV / vista manual (recomendado al inicio)

- Exportar desde Supabase Table Editor o SQL las tablas `reservas` (y `agendamiento_intakes` si aplica) semanalmente.
- Importar o pegar en la base **Pipeline Causas** en Notion (ver `notion-hub-scaffold.md`).
- **Pros:** Sin coste Zap, control fino de columnas, fácil de auditar.
- **Contras:** No tiempo real.

## Opción B — Zapier (u otro) automático

- Trigger: “New row” o “Updated row” en Supabase (si el conector Zapier expone tu proyecto y tablas).
- Acción: Notion “Create/update database item” en la DB de pipeline.
- **Requisitos:** IDs de data source de Notion; mapeo campo a campo; revisar **RLS** y service role solo en backend seguro (no exponer claves en Zaps públicos).
- **Privacidad:** Minimizar PII en Notion (iniciales, hash de email, o solo ID interno + notas); cumplir finalidad de tratamiento acordada con clientes.

## Recomendación

Validar el embudo con **Opción A** 2–4 semanas; pasar a **B** solo si el volumen lo exige y hay política de datos clara.
