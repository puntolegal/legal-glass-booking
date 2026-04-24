/**
 * iCalendar (.ics) para consultas Punto Legal — hora en calendario local del usuario (misma fecha/hora que eligió en Chile).
 */

/** Acepta `YYYY-MM-DD` o ISO de Postgres (`2026-04-21T00:00:00...`). */
export function normalizeFechaYmd(fecha: string | undefined | null): string {
  const t = String(fecha ?? "").trim();
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(t);
  return m ? m[1] : t;
}

export function hasConcreteBookingSlot(
  fecha: string | undefined | null,
  hora: string | undefined | null,
): boolean {
  const f = normalizeFechaYmd(fecha);
  const h = String(hora ?? "")
    .trim()
    .toLowerCase();
  if (!f || !h) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) return false;
  if (/agendar|coordinar|elegir|pendiente|definir|calendario/i.test(f)) return false;
  if (/agendar|coordinar|pendiente|^por\s/i.test(h)) return false;
  let clean = h.replace(/\s*hrs?$/i, "").trim();
  const trimSec = /^(\d{1,2}:\d{2}):\d{2}$/.exec(clean);
  if (trimSec) clean = trimSec[1];
  const m = /^(\d{1,2}):(\d{2})$/.exec(clean);
  if (!m) return false;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}

export function formatFechaLargaEs(fechaYmd: string): string {
  const parts = normalizeFechaYmd(fechaYmd).split("-").map((x) => parseInt(x, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return fechaYmd;
  const [y, mo, d] = parts;
  const dt = new Date(y, mo - 1, d);
  return dt.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatFechaCortaAsunto(fechaYmd: string): string {
  const parts = normalizeFechaYmd(fechaYmd).split("-").map((x) => parseInt(x, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return "";
  const [y, mo, d] = parts;
  const dt = new Date(y, mo - 1, d);
  return dt
    .toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })
    .replace(/\.$/, "");
}

export interface BookingIcsInput {
  title: string;
  description?: string;
  fechaYmd: string;
  horaHm: string;
  durationMinutes?: number;
  uid?: string;
  meetUrl?: string;
}

function foldIcsLine(line: string): string {
  const max = 73;
  if (line.length <= max) return line;
  let out = line.slice(0, max);
  let rest = line.slice(max);
  while (rest.length > 0) {
    out += "\r\n " + rest.slice(0, max - 1);
    rest = rest.slice(max - 1);
  }
  return out;
}

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function buildBookingIcs(input: BookingIcsInput): string {
  const duration = input.durationMinutes ?? 45;
  const ymd = normalizeFechaYmd(input.fechaYmd);
  const [y, mo, da] = ymd.split("-").map((x) => parseInt(x, 10));
  const cleanHora = input.horaHm.replace(/\s*hrs?$/i, "").trim();
  const [hh, mm] = cleanHora.split(":").map((x) => parseInt(x, 10));
  const start = new Date(y, mo - 1, da, hh, mm, 0, 0);
  const end = new Date(start.getTime() + duration * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmtLocal = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(
      d.getMinutes(),
    )}00`;
  const dtstamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const uid =
    input.uid ||
    `pl-${ymd}-${cleanHora}-${Math.random().toString(36).slice(2, 10)}@puntolegal.online`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Punto Legal//Consulta//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${fmtLocal(start)}`,
    `DTEND:${fmtLocal(end)}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(input.title)}`),
  ];
  if (input.description) {
    lines.push(foldIcsLine(`DESCRIPTION:${escapeIcsText(input.description)}`));
  }
  const meet = input.meetUrl?.trim();
  if (meet) {
    lines.push(foldIcsLine(`URL:${escapeIcsText(meet)}`));
    lines.push(foldIcsLine(`LOCATION:${escapeIcsText(meet)}`));
  } else {
    lines.push(
      foldIcsLine("LOCATION:Punto Legal — Consulta online (enlace Meet por correo)"),
    );
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadBookingIcsFile(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
