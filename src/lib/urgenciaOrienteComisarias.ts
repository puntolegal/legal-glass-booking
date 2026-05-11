/**
 * Comisarías Carabineros de Chile — foco sector oriente RM y comunas cercanas.
 * Coordenadas aproximadas (centro de jurisdicción / sede típica) para sugerir la unidad
 * más cercana cuando el navegador entrega geolocalización. El usuario debe confirmar o corregir.
 */

export type ComisariaOriente = {
  /** Texto listo para el formulario (unidad policial) */
  label: string;
  lat: number;
  lng: number;
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Unidades representativas del oriente capitalino y cordón cercano (RM).
 * Orden no importa: se elige por distancia mínima.
 */
export const COMISARIAS_RM_ORIENTE: ComisariaOriente[] = [
  { label: '17.ª Comisaría Las Condes', lat: -33.4114, lng: -70.5721 },
  { label: '19.ª Comisaría Providencia', lat: -33.4371, lng: -70.6342 },
  { label: '16.ª Comisaría Ñuñoa', lat: -33.4558, lng: -70.596 },
  { label: '40.ª Comisaría Vitacura', lat: -33.3925, lng: -70.575 },
  { label: '42.ª Comisaría Lo Barnechea', lat: -33.3532, lng: -70.5155 },
  { label: '55.ª Comisaría La Florida', lat: -33.5112, lng: -70.5995 },
  { label: '50.ª Comisaría Macul', lat: -33.4868, lng: -70.6085 },
  { label: '44.ª Comisaría Peñalolén', lat: -33.4705, lng: -70.5455 },
  { label: '43.ª Comisaría La Reina', lat: -33.4498, lng: -70.5418 },
  { label: '54.ª Comisaría Huechuraba', lat: -33.3888, lng: -70.6355 },
  { label: '49.ª Comisaría La Granja', lat: -33.5312, lng: -70.6258 },
  { label: '52.ª Comisaría San Joaquín', lat: -33.4968, lng: -70.6455 },
];

const MAX_SUGERENCIA_KM = 85;

export function getNearestComisariaOriente(lat: number, lng: number): ComisariaOriente | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  let best: ComisariaOriente = COMISARIAS_RM_ORIENTE[0];
  let bestKm = Infinity;
  for (const c of COMISARIAS_RM_ORIENTE) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (d < bestKm) {
      bestKm = d;
      best = c;
    }
  }
  if (bestKm > MAX_SUGERENCIA_KM) return null;
  return best;
}
