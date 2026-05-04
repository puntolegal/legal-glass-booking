import { z } from 'zod';

/** sessionStorage: cualificación previa a `/agendamiento?plan=inmobiliario-eval` */
export const INMOB_QUAL_STORAGE_KEY = 'puntolegal_inmobiliario_qualification_v4';

export const inmobiliarioQualificationSchema = z.object({
  tipo_propiedad: z.enum(['casa', 'departamento', 'sitio_terreno']),
  ubicacion: z.enum(['las_condes', 'vitacura', 'lo_barnechea', 'la_reina']),
  /** Dirección legible si el usuario la eligió en el buscador simulado (Places). */
  direccion_referencia: z.string().max(220).optional(),
  /** Prioridad declarada del propietario (visitas, reunión, orden documental, exploración). */
  momento_venta: z.enum(['visitas_pronto', 'reunion_equipo', 'ordenar_documentacion', 'explorando']),
  metros_cuadrados: z.enum(['menos_100', 'entre_100_200', 'mas_200']),
  /** Incluye tramo bajo / a definir en reunión para no filtrar conversiones por UF. */
  precio_esperado: z.enum(['por_definir_menos_8000', '8000_15000', '15000_30000', 'over_30000']),
});

export type InmobiliarioQualification = z.infer<typeof inmobiliarioQualificationSchema>;

export const inmobiliarioQualificationStepSchemas = {
  tipo_propiedad: inmobiliarioQualificationSchema.pick({ tipo_propiedad: true }),
  ubicacion: inmobiliarioQualificationSchema.pick({ ubicacion: true }),
  momento_venta: inmobiliarioQualificationSchema.pick({ momento_venta: true }),
  metros_cuadrados: inmobiliarioQualificationSchema.pick({ metros_cuadrados: true }),
  precio_esperado: inmobiliarioQualificationSchema.pick({ precio_esperado: true }),
} as const;
