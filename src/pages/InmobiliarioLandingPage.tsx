import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Building2,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  MapPin,
  Scale,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { siteUrl } from '@/config/siteUrl';
import ServicioPageShell from '@/components/servicios/ServicioPageShell';
import {
  inmobiliarioQualificationSchema,
  inmobiliarioQualificationStepSchemas,
  type InmobiliarioQualification,
  INMOB_QUAL_STORAGE_KEY,
} from '@/constants/inmobiliarioQualification';

const steps = [
  { id: 'tipo_propiedad', title: 'El activo', subtitle: '¿Qué tipo de propiedad desea vender?' },
  { id: 'ubicacion', title: 'La ubicación', subtitle: '¿En qué comuna se encuentra?' },
  {
    id: 'momento_venta',
    title: 'Su prioridad',
    subtitle: '¿Qué necesita resolver primero en las próximas semanas?',
  },
  { id: 'metros_cuadrados', title: 'El tamaño', subtitle: 'Metros cuadrados útiles aproximados' },
  { id: 'precio_esperado', title: 'Rango de precio', subtitle: 'Referencia en UF (puede afinarse en la reunión)' },
] as const;

const tipoOptions: { value: InmobiliarioQualification['tipo_propiedad']; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'sitio_terreno', label: 'Sitio / terreno' },
];

const ubicacionOptions: { value: InmobiliarioQualification['ubicacion']; label: string }[] = [
  { value: 'las_condes', label: 'Las Condes' },
  { value: 'vitacura', label: 'Vitacura' },
  { value: 'lo_barnechea', label: 'Lo Barnechea' },
  { value: 'la_reina', label: 'La Reina' },
];

const metrosOptions: { value: InmobiliarioQualification['metros_cuadrados']; label: string }[] = [
  { value: 'menos_100', label: 'Menos de 100 m²' },
  { value: 'entre_100_200', label: 'Entre 100 y 200 m²' },
  { value: 'mas_200', label: 'Más de 200 m²' },
];

const momentoOptions: { value: InmobiliarioQualification['momento_venta']; label: string }[] = [
  { value: 'visitas_pronto', label: 'Empezar con visitas serias (compradores filtrados)' },
  { value: 'reunion_equipo', label: 'Reunión con su equipo antes de exponer el inmueble' },
  { value: 'ordenar_documentacion', label: 'Ordenar títulos o cargas antes de salir al mercado' },
  { value: 'explorando', label: 'Aún evalúo vender / sin apuro' },
];

const precioOptions: { value: InmobiliarioQualification['precio_esperado']; label: string }[] = [
  { value: 'por_definir_menos_8000', label: 'Sin precio fijo aún o menos de 8.000 UF' },
  { value: '8000_15000', label: '8.000 – 15.000 UF' },
  { value: '15000_30000', label: '15.000 – 30.000 UF' },
  { value: 'over_30000', label: 'Más de 30.000 UF' },
];

export default function InmobiliarioLandingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const form = useForm<InmobiliarioQualification>({
    mode: 'onChange',
    defaultValues: {
      tipo_propiedad: 'casa',
      ubicacion: 'las_condes',
      momento_venta: 'reunion_equipo',
      metros_cuadrados: 'menos_100',
      precio_esperado: 'por_definir_menos_8000',
    },
  });

  const progress = ((stepIndex + 1) / steps.length) * 100;

  const goNext = async () => {
    const stepId = steps[stepIndex].id;
    const fieldValue = form.getValues(stepId);
    const partial = inmobiliarioQualificationStepSchemas[stepId].safeParse({ [stepId]: fieldValue });
    if (!partial.success) {
      const msg = partial.error.flatten().fieldErrors[stepId]?.[0] ?? 'Dato inválido';
      form.setError(stepId, { type: 'manual', message: msg });
      return;
    }
    form.clearErrors(stepId);

    if (stepIndex < steps.length - 1) setStepIndex((s) => s + 1);
    else {
      const data = form.getValues();
      const parsed = inmobiliarioQualificationSchema.safeParse(data);
      if (!parsed.success) return;
      try {
        sessionStorage.setItem(INMOB_QUAL_STORAGE_KEY, JSON.stringify(parsed.data));
      } catch {
        /* ignore */
      }
      window.location.assign('/agendamiento?plan=inmobiliario-eval');
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((s) => s - 1);
  };

  return (
    <>
      <SEO
        title="Venta inmobiliaria Sector Oriente | Evaluación jurídica — Punto Legal"
        description="Orientación para vender en Las Condes, Vitacura, Lo Barnechea y La Reina: gestión de élite y certeza jurídica. Agenda con videollamada. Punto Legal Chile."
        url={siteUrl('/inmobiliario')}
        keywords="inmobiliario Chile, abogado inmobiliario Las Condes, Vitacura, Lo Barnechea, compraventa propiedades, estudio de títulos, Punto Legal"
      />
      <ServicioPageShell
        theme="civil"
        contentName="Inmobiliario Sector Oriente"
        contentCategory="Servicios Legales — Derecho Inmobiliario"
      >
        <section className="relative z-10 mx-auto max-w-4xl px-4 pb-8 pt-10 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center"
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300 backdrop-blur-xl">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              Santiago Oriente
            </p>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
              Venda o compre con criterio jurídico antes de la oferta
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-slate-400 md:text-lg">
              En Punto Legal combinamos orientación registral y contractual con un proceso de agenda claro.
              Ideal si su activo está en Las Condes, Vitacura, Lo Barnechea o La Reina y quiere reducir fricción
              en escritura o promesa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#cualificacion"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30"
              >
                Agendar evaluación
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/agendamiento?plan=inmobiliario"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-xl hover:bg-white/10"
              >
                Consulta pagada inmobiliaria
                <ChevronRight className="h-4 w-4 opacity-70" />
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="relative z-10 border-y border-white/5 bg-slate-900/40 py-14 backdrop-blur-md">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Prevención registral',
                body: 'Identificamos focos típicos (cargas, sucesión, límites) para que la negociación no se detenga por sorpresas evitables.',
              },
              {
                icon: TrendingUp,
                title: 'Enfoque comercial prudente',
                body: 'Alineamos narrativa de venta y documentos con estándares que suelen exigir bancos y compradores informados.',
              },
              {
                icon: Building2,
                title: 'Operación con agenda propia',
                body: 'Reserva con videollamada y confirmación por correo; integración con calendario para una sola fuente de verdad.',
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 backdrop-blur-xl"
              >
                <c.icon className="mb-3 h-8 w-8 text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-50">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-3xl px-4 py-14">
          <div className="mb-8 flex items-start gap-3">
            <Scale className="mt-1 h-8 w-8 shrink-0 text-sky-400" />
            <div>
              <h2 className="text-2xl font-bold text-slate-50">Autoridad sin promesas vacías</h2>
              <p className="mt-2 text-slate-400">
                Muchas operaciones se demoran por títulos u obligaciones no revisadas a tiempo. Nuestro enfoque es
                ordenar la información antes de comprometer plazos con terceros. La evaluación inicial no reemplaza
                un estudio de títulos exhaustivo ni garantiza un resultado judicial o registral.
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-slate-300">
            {[
              'Sesión orientativa sin costo (plan inmobiliario-eval) sujeta a disponibilidad.',
              'Si su caso requiere trabajo documental profundo, proponemos plan por escrito con honorarios acordes.',
              'Atención 100 % remota con estándar de confidencialidad profesional.',
            ].map((t) => (
              <li key={t} className="flex gap-2 text-sm md:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="cualificacion" className="relative z-10 scroll-mt-24 pb-20">
          <div className="mx-auto max-w-lg px-4">
            <h2 className="mb-2 text-center text-2xl font-bold text-slate-50">Micro-cualificación</h2>
            <p className="mb-6 text-center text-sm text-slate-400">
              Cinco pasos. Luego podrá elegir fecha en el agendamiento. Los datos se guardan sólo en su navegador
              hasta confirmar la cita.
            </p>
            <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-xl backdrop-blur-xl">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-400/90">
                Paso {stepIndex + 1} de {steps.length}
              </p>
              <h3 className="text-lg font-semibold text-slate-50">{steps[stepIndex].title}</h3>
              <p className="text-sm text-slate-500">{steps[stepIndex].subtitle}</p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[stepIndex].id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 space-y-3"
                >
                  {steps[stepIndex].id === 'tipo_propiedad' &&
                    tipoOptions.map((o) => (
                      <label
                        key={o.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          form.watch('tipo_propiedad') === o.value
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-slate-100'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          {...form.register('tipo_propiedad')}
                          value={o.value}
                        />
                        {o.label}
                      </label>
                    ))}
                  {steps[stepIndex].id === 'ubicacion' &&
                    ubicacionOptions.map((o) => (
                      <label
                        key={o.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          form.watch('ubicacion') === o.value
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-slate-100'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          {...form.register('ubicacion')}
                          value={o.value}
                        />
                        {o.label}
                      </label>
                    ))}
                  {steps[stepIndex].id === 'momento_venta' &&
                    momentoOptions.map((o) => (
                      <label
                        key={o.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          form.watch('momento_venta') === o.value
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-slate-100'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only mt-0.5"
                          {...form.register('momento_venta')}
                          value={o.value}
                        />
                        {o.label}
                      </label>
                    ))}
                  {steps[stepIndex].id === 'metros_cuadrados' &&
                    metrosOptions.map((o) => (
                      <label
                        key={o.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          form.watch('metros_cuadrados') === o.value
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-slate-100'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          {...form.register('metros_cuadrados')}
                          value={o.value}
                        />
                        {o.label}
                      </label>
                    ))}
                  {steps[stepIndex].id === 'precio_esperado' &&
                    precioOptions.map((o) => (
                      <label
                        key={o.value}
                        className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          form.watch('precio_esperado') === o.value
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-slate-100'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          {...form.register('precio_esperado')}
                          value={o.value}
                        />
                        {o.label}
                      </label>
                    ))}
                </motion.div>
              </AnimatePresence>

              {form.formState.errors[steps[stepIndex].id] && (
                <p className="mt-3 text-sm text-red-400">
                  {String(form.formState.errors[steps[stepIndex].id]?.message || 'Revise el campo')}
                </p>
              )}

              <div className="mt-8 flex gap-3">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
                  >
                    Atrás
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  className="ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 py-2.5 text-sm font-semibold text-white shadow-md"
                >
                  {stepIndex < steps.length - 1 ? 'Siguiente' : 'Ir a agendar'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </ServicioPageShell>
    </>
  );
}
