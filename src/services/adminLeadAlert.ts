/**
 * Aviso de respaldo al administrador.
 *
 * Se usa cuando el flujo normal de confirmación (reserva en Supabase +
 * clever-action) falla: garantiza que el equipo reciba SIEMPRE los datos
 * del lead para hacer seguimiento manual.
 */

const SUPABASE_URL = 'https://qrgelocijmwnxcckxbdg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ2Vsb2Npam13bnhjY2t4YmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI0MjksImV4cCI6MjA3MzM3ODQyOX0.0q_3bb8bKR8VVZZAK_hYvhvLSTaU1ioQzmO5fKALjbI';

const ADMIN_EMAIL = 'puntolegalelgolf@gmail.com';

export interface AdminLeadAlertData {
  nombre: string;
  email: string;
  telefono?: string;
  servicio: string;
  categoria?: string;
  precio?: string;
  fecha?: string;
  hora?: string;
  tipoReunion?: string;
  descripcion?: string;
  referencia?: string;
  motivo: string;
}

const esc = (value: unknown): string =>
  String(value ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const buildHtml = (d: AdminLeadAlertData): string => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;max-width:600px;margin:0 auto">
  <h2 style="font-size:18px;margin:0 0 4px">Nueva consulta agendada — seguimiento manual</h2>
  <p style="font-size:13px;color:#666;margin:0 0 20px">${esc(d.motivo)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 0;color:#666;width:150px">Cliente</td><td style="padding:6px 0"><strong>${esc(d.nombre)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></td></tr>
    <tr><td style="padding:6px 0;color:#666">Teléfono</td><td style="padding:6px 0">${esc(d.telefono)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Servicio</td><td style="padding:6px 0">${esc(d.servicio)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Categoría</td><td style="padding:6px 0">${esc(d.categoria)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Precio</td><td style="padding:6px 0">${esc(d.precio)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Fecha / hora</td><td style="padding:6px 0">${esc(d.fecha)} · ${esc(d.hora)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Modalidad</td><td style="padding:6px 0">${esc(d.tipoReunion)}</td></tr>
    <tr><td style="padding:6px 0;color:#666">Referencia</td><td style="padding:6px 0">${esc(d.referencia)}</td></tr>
  </table>
  <p style="font-size:14px;margin:20px 0 0"><strong>Descripción</strong><br>${esc(d.descripcion)}</p>
</div>`;

/** Envía el aviso al admin vía edge function `send-email`. No lanza excepciones. */
export const sendAdminLeadAlert = async (
  data: AdminLeadAlertData,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        emailData: {
          to: [ADMIN_EMAIL],
          subject: `Nueva consulta — ${data.nombre} · ${data.servicio}`,
          html: buildHtml(data),
        },
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result?.success === false) {
      const detail = typeof result?.error === 'string' ? result.error : `HTTP ${response.status}`;
      console.error('❌ Aviso admin no enviado:', detail);
      return { success: false, error: detail };
    }

    console.log('✅ Aviso de respaldo enviado al admin');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ Error enviando aviso admin:', message);
    return { success: false, error: message };
  }
};
