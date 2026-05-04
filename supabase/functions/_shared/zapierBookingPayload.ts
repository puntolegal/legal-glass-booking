/**
 * Payload homogéneo para Catch Hook de Zapier (Calendar / Meet / Notion).
 * Usado por mercadopago-webhook y enqueue-booking-calendar.
 */
export function buildZapierBookingPayloadFromRow(row: Record<string, unknown>) {
  const tipo = String(row.tipo_reunion ?? "online");
  return {
    booking_id: row.id,
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono,
    servicio: row.servicio,
    fecha: row.fecha,
    hora: row.hora,
    tipo_reunion: tipo,
    external_reference: row.external_reference,
    precio: row.precio,
    descripcion: row.descripcion,
    risk_level: row.risk_level ?? null,
    qualification_data: row.qualification_data ?? null,
  };
}
