import { z } from 'zod';

/** sessionStorage: cualificación previa a `/agendamiento?plan=inmobiliario-eval` */
export const INMOB_QUAL_STORAGE_KEY = 'puntolegal_inmobiliario_qualification_v5';

export const inmobiliarioQualificationSchema = z
  .object({
    tipo_propiedad: z.enum(['casa', 'departamento', 'sitio_terreno']),
    ubicacion: z.enum(['las_condes', 'vitacura', 'lo_barnechea', 'la_reina']),
    /** Dirección legible si el usuario la eligió en el buscador simulado (Places). */
    direccion_referencia: z.string().max(220).optional(),
    /** Prioridad declarada del propietario (visitas, reunión, orden documental, exploración). */
    momento_venta: z.enum(['visitas_pronto', 'reunion_equipo', 'ordenar_documentacion', 'explorando']),
    metros_cuadrados: z.enum(['menos_100', 'entre_100_200', 'mas_200']),
    /** Incluye tramo bajo / a definir en reunión para no filtrar conversiones por UF. */
    precio_esperado: z.enum(['por_definir_menos_8000', '8000_15000', '15000_30000', 'over_30000']),

    tiene_piscina: z.enum(['si', 'no']),
    tiene_quincho: z.enum(['si', 'no']),
    tiene_cancha: z.enum(['si', 'no']),
    tipo_cancha: z.enum(['tenis', 'futbol', 'golf', 'varias', 'no_aplica']),
    /** Si no es departamento, debe ser `no_aplica` (normalizar antes de parse). */
    balcon_terraza: z.enum(['no', 'balcon', 'terraza_loggia', 'prefiero_reunion', 'no_aplica']),
    titularidad_compra: z.enum([
      'personal',
      'sociedad_conyugal',
      'separacion_o_fuera_patrimonio',
      'sociedad_empresa',
      'prefiero_reunion',
    ]),
    carga_hipoteca: z.enum(['si', 'no', 'no_seguro']),
    carga_uso_habitacion: z.enum(['si', 'no', 'no_seguro']),
    carga_usufructo: z.enum(['si', 'no', 'no_seguro']),
    carga_otros_gravamen: z.enum(['si', 'no', 'no_seguro']),
  })
  .superRefine((data, ctx) => {
    if (data.tiene_cancha === 'si' && data.tipo_cancha === 'no_aplica') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tipo_cancha'],
        message: 'Indique el tipo de cancha.',
      });
    }
    if (data.tipo_propiedad === 'departamento' && data.balcon_terraza === 'no_aplica') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['balcon_terraza'],
        message: 'Indique balcón o terraza.',
      });
    }
  });

export type InmobiliarioQualification = z.infer<typeof inmobiliarioQualificationSchema>;

/** Normaliza condicionales antes de `safeParse` (cancha no → tipo no_aplica; no depto → balcon no_aplica). */
export function normalizeInmobiliarioQualificationInput(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const o = { ...raw };
  if (o.tiene_cancha === 'no') o.tipo_cancha = 'no_aplica';
  if (o.tipo_propiedad && o.tipo_propiedad !== 'departamento') o.balcon_terraza = 'no_aplica';
  return o;
}
