import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Lock,
  ChevronRight,
  CheckCircle2,
  Users,
  FileSearch,
  ArrowUp,
  Shield,
  X,
  Check,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SEO from '@/components/SEO'
import { siteUrl } from '@/config/siteUrl'
import { InmobiliarioProcessingTerminal } from '@/components/inmobiliario/InmobiliarioProcessingTerminal'
import { InmobiliarioAddressStep } from '@/components/inmobiliario/InmobiliarioAddressStep'
import type { MockOrienteAddress } from '@/constants/inmobiliarioMockAddresses'
import {
  inmobiliarioQualificationSchema,
  INMOB_QUAL_STORAGE_KEY,
  normalizeInmobiliarioQualificationInput,
  type InmobiliarioQualification,
} from '@/constants/inmobiliarioQualification'

/** Estado intermedio del micro-embudo (valores alineados al schema antes de Zod) */
type HeroFormState = {
  tipo_propiedad: string
  ubicacion: string
  direccion_referencia: string
  momento_venta: string
  metros_cuadrados: string
  tiene_piscina: string
  tiene_quincho: string
  tiene_cancha: string
  tipo_cancha: string
  balcon_terraza: string
  titularidad_compra: string
  carga_hipoteca: string
  carga_uso_habitacion: string
  carga_usufructo: string
  carga_otros_gravamen: string
  precio_esperado: string
}

type InmobiliarioStepId =
  | 'tipo_propiedad'
  | 'ubicacion'
  | 'momento_venta'
  | 'metros_cuadrados'
  | 'amenidad_piscina'
  | 'amenidad_quincho'
  | 'amenidad_cancha'
  | 'tipo_cancha'
  | 'balcon_terraza'
  | 'titularidad_compra'
  | 'carga_hipoteca'
  | 'carga_uso_habitacion'
  | 'carga_usufructo'
  | 'carga_otros_gravamen'
  | 'precio_esperado'

const initialForm: HeroFormState = {
  tipo_propiedad: '',
  ubicacion: '',
  direccion_referencia: '',
  momento_venta: '',
  metros_cuadrados: '',
  tiene_piscina: '',
  tiene_quincho: '',
  tiene_cancha: '',
  tipo_cancha: '',
  balcon_terraza: '',
  titularidad_compra: '',
  carga_hipoteca: '',
  carga_uso_habitacion: '',
  carga_usufructo: '',
  carga_otros_gravamen: '',
  precio_esperado: '',
}

function getStepSequence(d: HeroFormState): InmobiliarioStepId[] {
  const seq: InmobiliarioStepId[] = [
    'tipo_propiedad',
    'ubicacion',
    'momento_venta',
    'metros_cuadrados',
    'amenidad_piscina',
    'amenidad_quincho',
    'amenidad_cancha',
  ]
  if (d.tiene_cancha === 'si') seq.push('tipo_cancha')
  if (d.tipo_propiedad === 'departamento') seq.push('balcon_terraza')
  seq.push(
    'titularidad_compra',
    'carga_hipoteca',
    'carga_uso_habitacion',
    'carga_usufructo',
    'carga_otros_gravamen',
    'precio_esperado',
  )
  return seq
}

const TRANSITION_MS = 280
const SUCCESS_NAV_MS = 2200
/** Ilusión de trabajo antes del éxito (3,5 s). */
const PROCESSING_MS = 3500
const ADDRESS_LABOR_MS = 720

function mapHeroToQualification(d: HeroFormState): InmobiliarioQualification | null {
  const raw: Record<string, unknown> = {
    tipo_propiedad: d.tipo_propiedad,
    ubicacion: d.ubicacion,
    momento_venta: d.momento_venta,
    metros_cuadrados: d.metros_cuadrados,
    tiene_piscina: d.tiene_piscina,
    tiene_quincho: d.tiene_quincho,
    tiene_cancha: d.tiene_cancha,
    tipo_cancha: d.tipo_cancha,
    balcon_terraza: d.balcon_terraza,
    titularidad_compra: d.titularidad_compra,
    carga_hipoteca: d.carga_hipoteca,
    carga_uso_habitacion: d.carga_uso_habitacion,
    carga_usufructo: d.carga_usufructo,
    carga_otros_gravamen: d.carga_otros_gravamen,
    precio_esperado: d.precio_esperado,
  }
  if (d.direccion_referencia.trim()) raw.direccion_referencia = d.direccion_referencia.trim()
  const normalized = normalizeInmobiliarioQualificationInput(raw)
  const parsed = inmobiliarioQualificationSchema.safeParse(normalized)
  return parsed.success ? parsed.data : null
}

const TRADITIONAL_PAINS = [
  'Sales al mercado sin chequear bien dominio y cargas: después aparece la hipoteca mal entendida, el usufructo o el uso y habitación —y la escritura se empantana cuando ya tenías comprador.',
  'La compraventa se cae o se enfría frente al notario o al banco del comprador: meses perdidos, estrés y la sensación de haber “fallado” con tu propio patrimonio.',
  'Visitas tras visitas con gente sin crédito claro: cansancio en casa, precio en UF que baja en el portal y la frustración de que nadie cierre de verdad.',
]

const MARSHALL_WINS = [
  'En Punto Legal revisamos contigo si la venta es viable según tu realidad (matrimonio, sociedad conyugal, empresa): menos dudas de golpe, más claridad desde el inicio.',
  'Antes de mostrar el inmueble, ordenamos con abogado dominio y gravámenes —y encaramos el saneamiento de vicios o cargas que suelan frenar la compraventa.',
  'Filtramos interesados con señal seria de capacidad hipotecaria para que cada visita te acerque a una oferta concreta, no a perder otro sábado.',
]

const TIMELINE_PHASES = [
  {
    key: 'p1',
    days: 'Días 1–3',
    title: 'Plan de venta que te devuelve control',
    body: 'Reunión para bajar la ansiedad a un plan: vemos si tu bien puede transferirse según tu patrimonio, qué cargas hay y cómo encarar precio en UF sin improvisar.',
  },
  {
    key: 'p2',
    days: 'Días 4–15',
    title: 'Dominio ordenado y venta con cabeza fría',
    body: 'Abogados ordenan Conservador y gravámenes; el equipo comercial trabaja la salida al mercado sin sobreexponerte ni quemar el relato de tu propiedad.',
  },
  {
    key: 'p3',
    days: 'Días 16–30',
    title: 'Promesa y escritura sin quedarte solo frente al trámite',
    body: 'Te acompañamos en promesa de compraventa, coordinación con el banco del comprador y traspaso hasta escritura y cobro —con menos sorpresas de último minuto.',
  },
] as const

const PATRIMONIO_SCANNER_MESSAGES = [
  'Detectando gravámenes y cargas que muchos descubren tarde…',
  'Pasando de la duda a un mapa claro: dominio, titularidad y qué falta ordenar…',
  'Contrastando tu referencia en UF con lo que realmente está pasando en el barrio…',
  'Preparando tu reunión con abogado y comercial: próximos pasos concretos para vender…',
] as const

/** Bloque hero: contexto de trabajo + mensajes (sin animación tipo radar). */
function InmobiliarioPatrimonioScanner() {
  const reduce = useReducedMotion()
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % PATRIMONIO_SCANNER_MESSAGES.length)
    }, 1500)
    return () => window.clearInterval(id)
  }, [reduce])

  const active = reduce ? 0 : msgIndex

  return (
    <div className="mb-2 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
        Tu venta empieza acá · dominio y papeles antes de publicar
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className="relative h-44 min-h-[11rem] flex-1 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/95 sm:max-w-[260px]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(100, 116, 139, 0.14) 1px, transparent 1px),
                linear-gradient(90deg, rgba(100, 116, 139, 0.14) 1px, transparent 1px)
              `,
              backgroundSize: '18px 18px',
            }}
            aria-hidden
          />
          <svg
            className="absolute inset-2 text-slate-400/35"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <rect x="6" y="8" width="88" height="52" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <line x1="6" y1="36" x2="94" y2="36" stroke="currentColor" strokeWidth="0.4" />
            <line x1="48" y1="8" x2="48" y2="60" stroke="currentColor" strokeWidth="0.4" />
            <rect x="28" y="68" width="44" height="22" fill="none" stroke="currentColor" strokeWidth="0.55" />
          </svg>
        </div>
        <div className="flex min-h-[11rem] flex-1 items-center sm:pl-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm font-medium leading-relaxed text-slate-800 sm:text-[15px]"
            >
              {PATRIMONIO_SCANNER_MESSAGES[active]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/** Ventana tipo escritorio — cristal luminoso (banca privada), mismo lenguaje visual en formulario y dashboard. */
function MacGlassWindow({
  title,
  subtitle,
  progressPct,
  bodyClassName,
  children,
}: {
  title: string
  subtitle?: string
  progressPct?: number
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200/50 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04] backdrop-blur-2xl">
      <div className="relative flex items-center gap-3 border-b border-slate-200/50 bg-slate-50/90 px-4 py-2.5">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[11px] font-semibold tracking-wide text-slate-800">{title}</p>
          {subtitle ? <p className="truncate text-[10px] text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="w-[52px] shrink-0" aria-hidden />
      </div>
      {typeof progressPct === 'number' && (
        <div className="relative h-[3px] overflow-hidden bg-slate-200/70">
          <div className="relative h-full overflow-hidden" style={{ width: `${progressPct}%` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            <motion.div
              className="absolute inset-y-0 w-[40%] skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/70 to-transparent"
              initial={false}
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      )}
      <div className={cn('relative', bodyClassName)}>{children}</div>
    </div>
  )
}

export default function ServicioInmobiliarioPage() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const [currentStepId, setCurrentStepId] = useState<InmobiliarioStepId>('tipo_propiedad')
  const [formData, setFormData] = useState<HeroFormState>(initialForm)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [phase, setPhase] = useState<'questions' | 'processing' | 'success'>('questions')
  const [addressPreview, setAddressPreview] = useState<MockOrienteAddress | null>(null)

  const heroRef = useRef<HTMLElement>(null)
  const formDataRef = useRef<HeroFormState>({ ...initialForm })
  const navigateTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const processingTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const addressLaborTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  const stepSequence = getStepSequence(formData)
  const stepIndexInSeq = stepSequence.indexOf(currentStepId)
  const stepDisplayIdx = stepIndexInSeq >= 0 ? stepIndexInSeq + 1 : 1
  const stepDisplayTotal = stepSequence.length

  const applyFormPatch = useCallback((patch: Partial<HeroFormState>) => {
    const next = { ...formDataRef.current, ...patch }
    formDataRef.current = next
    setFormData(next)
  }, [])


  useEffect(() => {
    return () => {
      if (navigateTimerRef.current != null) window.clearTimeout(navigateTimerRef.current)
      if (processingTimerRef.current != null) window.clearTimeout(processingTimerRef.current)
      if (addressLaborTimerRef.current != null) window.clearTimeout(addressLaborTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'questions') return
    const seq = getStepSequence(formDataRef.current)
    if (!seq.includes(currentStepId)) {
      const k = seq.indexOf('amenidad_cancha')
      const fallback = k >= 0 ? seq[k + 1] ?? 'tipo_propiedad' : 'tipo_propiedad'
      setCurrentStepId(fallback)
    }
  }, [formData, phase, currentStepId])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const onHeroScroll = () => {
      const rect = el.getBoundingClientRect()
      setShowStickyCta(rect.bottom < 0)
    }

    onHeroScroll()
    window.addEventListener('scroll', onHeroScroll, { passive: true })
    return () => window.removeEventListener('scroll', onHeroScroll)
  }, [])

  const scrollToForm = useCallback(() => {
    document.getElementById('evaluacion-formulario')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  const persistAndNavigate = useCallback(
    (data: HeroFormState) => {
      setSubmitError(null)
      const qual = mapHeroToQualification(data)
      if (!qual) {
        setSubmitError('No pudimos validar los datos. Revise las respuestas e intente nuevamente.')
        setPhase('questions')
        setCurrentStepId('tipo_propiedad')
        return
      }
      try {
        sessionStorage.setItem(INMOB_QUAL_STORAGE_KEY, JSON.stringify(qual))
      } catch {
        setSubmitError('Active el almacenamiento del navegador para continuar.')
        setPhase('questions')
        setCurrentStepId('precio_esperado')
        return
      }
      navigate('/agendamiento?plan=inmobiliario-eval')
    },
    [navigate],
  )

  const advanceToStepAfter = useCallback(
    (completedStepId: InmobiliarioStepId, nextForm: HeroFormState) => {
      const seq = getStepSequence(nextForm)
      const i = seq.indexOf(completedStepId)
      const nextId = i >= 0 ? seq[i + 1] : null
      if (nextId) setCurrentStepId(nextId)
    },
    [],
  )

  const handleAddressPick = useCallback(
    (row: MockOrienteAddress) => {
      if (isTransitioning || phase !== 'questions' || currentStepId !== 'ubicacion') return
      setSubmitError(null)
      setIsTransitioning(true)
      const prev = formDataRef.current
      const next: HeroFormState = {
        ...prev,
        ubicacion: row.comuna,
        direccion_referencia: row.label,
      }
      formDataRef.current = next
      setFormData(next)
      setAddressPreview(row)
      if (addressLaborTimerRef.current != null) window.clearTimeout(addressLaborTimerRef.current)
      addressLaborTimerRef.current = window.setTimeout(() => {
        addressLaborTimerRef.current = null
        setAddressPreview(null)
        advanceToStepAfter('ubicacion', next)
        setIsTransitioning(false)
      }, ADDRESS_LABOR_MS)
    },
    [isTransitioning, phase, currentStepId, advanceToStepAfter],
  )

  const runProcessingThenSuccess = useCallback(() => {
    setPhase('processing')
    if (navigateTimerRef.current != null) window.clearTimeout(navigateTimerRef.current)
    if (processingTimerRef.current != null) window.clearTimeout(processingTimerRef.current)
    processingTimerRef.current = window.setTimeout(() => {
      processingTimerRef.current = null
      setPhase('success')
      if (navigateTimerRef.current != null) window.clearTimeout(navigateTimerRef.current)
      navigateTimerRef.current = window.setTimeout(() => {
        navigateTimerRef.current = null
        persistAndNavigate(formDataRef.current)
      }, SUCCESS_NAV_MS)
    }, PROCESSING_MS)
  }, [persistAndNavigate])

  const handleOptionSelect = useCallback(
    (field: keyof HeroFormState, value: string) => {
      if (isTransitioning || phase === 'success' || phase === 'processing') return
      setSubmitError(null)
      setIsTransitioning(true)

      const stepBefore = currentStepId
      applyFormPatch({ [field]: value })
      const nextForm = formDataRef.current

      window.setTimeout(() => {
        if (field === 'precio_esperado') {
          setIsTransitioning(false)
          runProcessingThenSuccess()
          return
        }
        advanceToStepAfter(stepBefore, nextForm)
        setIsTransitioning(false)
      }, TRANSITION_MS)
    },
    [isTransitioning, phase, currentStepId, applyFormPatch, advanceToStepAfter, runProcessingThenSuccess],
  )

  const handleBack = useCallback(() => {
    if (isTransitioning || phase !== 'questions') return
    const seq = getStepSequence(formDataRef.current)
    const i = seq.indexOf(currentStepId)
    if (i <= 0) return
    setSubmitError(null)
    setCurrentStepId(seq[i - 1])
  }, [isTransitioning, phase, currentStepId])

  const progressPct =
    phase === 'success' || phase === 'processing'
      ? 100
      : stepSequence.length > 0
        ? (stepDisplayIdx / stepSequence.length) * 100
        : 0

  const stepHeading = (() => {
    switch (currentStepId) {
      case 'tipo_propiedad':
        return '¿Qué tipo de inmueble desea vender?'
      case 'ubicacion':
        return 'Dirección referencial en Sector Oriente'
      case 'momento_venta':
        return '¿Qué prioriza en las próximas semanas?'
      case 'metros_cuadrados':
        return 'Superficie útil aproximada'
      case 'amenidad_piscina':
        return '¿La propiedad cuenta con piscina?'
      case 'amenidad_quincho':
        return '¿Cuenta con quincho o espacio cubierto para asados?'
      case 'amenidad_cancha':
        return '¿Cuenta con cancha deportiva (tenis, fútbol, golf u otra)?'
      case 'tipo_cancha':
        return 'Indique el tipo de cancha'
      case 'balcon_terraza':
        return 'Balcón, terraza o loggia'
      case 'titularidad_compra':
        return 'Titularidad al momento de la compra'
      case 'carga_hipoteca':
        return '¿Registra hipoteca o mutuo con garantía hipotecaria?'
      case 'carga_uso_habitacion':
        return '¿Registra derecho de uso y habitación?'
      case 'carga_usufructo':
        return '¿Registra usufructo u otro derecho real de uso relevante?'
      case 'carga_otros_gravamen':
        return '¿Otros gravámenes o prohibiciones (embargo, segunda clase, etc.)?'
      case 'precio_esperado':
        return 'Rango de precio referencial en UF'
      default:
        return ''
    }
  })()

  const stickyBottomStyle = { bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' } as const

  return (
    <>
      <SEO
        title="Vender casa o departamento Las Condes, Vitacura, Lo Barnechea, La Reina | Venta inmobiliaria — Punto Legal"
        description="Servicio de venta de propiedades en Santiago Oriente: revisamos si puede vender sin trabas (patrimonio, matrimonio, empresa), gravámenes e hipotecas antes de publicar, y acercamos compradores con capacidad de pago. Promesa y escritura en notaría con abogado. Evaluación confidencial."
        url={siteUrl('/servicios/inmobiliario')}
        keywords="vender casa Santiago Oriente, venta departamento Las Condes, vender propiedad Vitacura Lo Barnechea, gravámenes venta casa Chile, hipoteca venta inmueble, estudio de títulos orientativo, compraventa inmueble Chile, uso y habitación venta, sociedad conyugal venta casa, abogado venta propiedad Santiago, precio UF venta casa, Punto Legal"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Punto Legal — Venta de inmuebles Sector Oriente (legal y comercial)',
            description:
              'Venta de casas y departamentos en Santiago Oriente (Las Condes, Vitacura, Lo Barnechea, La Reina): revisión orientativa de dominio y gravámenes, encaramiento de saneamiento de cargas que traban la compraventa, y apoyo legal y comercial hasta promesa y escritura en notaría.',
            url: siteUrl('/servicios/inmobiliario'),
            provider: { '@type': 'Organization', name: 'Punto Legal', url: 'https://puntolegal.online' },
            areaServed: {
              '@type': 'AdministrativeArea',
              name: 'Santiago Oriente, Chile',
            },
            serviceType: 'Venta de inmuebles con asesoría legal y comercial',
          })}
        </script>
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800">
        <div
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(128, 128, 128, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(128, 128, 128, 0.045) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />
        <div className="relative z-10">
        <section
          ref={heroRef}
          className="relative pt-24 pb-20 md:pt-28 md:pb-24 px-4 z-10 min-h-[min(92vh,920px)] flex flex-col justify-center"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="order-2 lg:order-1"
              >
                <div className="mb-4 inline-flex max-w-xl items-start gap-2.5 rounded-2xl border border-slate-200/50 bg-white/80 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/90 sm:items-center">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 sm:mt-0" aria-hidden />
                  <p className="text-[11px] font-semibold leading-snug tracking-wide text-slate-800 sm:text-[12px]">
                    Sector Oriente (Las Condes, Vitacura, Lo Barnechea, La Reina): equipo legal + comercial para que no te
                    agarre el susto frente al notario ni pierdas meses con compradores que no tienen crédito.
                  </p>
                </div>

                <h1 className="mb-5 text-4xl font-bold leading-[1.06] tracking-[-0.02em] text-slate-900 sm:text-5xl lg:text-[3.05rem]">
                  ¿Vas a vender tu casa o departamento?
                  <span className="mt-3 block text-[0.72em] font-bold leading-snug text-slate-700 sm:text-[0.68em]">
                    ¿Seguro que tienes todos los papeles para cerrar sin que la venta se caiga?
                  </span>
                </h1>

                <p className="mb-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  Esa incertidumbre es más común de lo que parece: hipotecas olvidadas, usufructos, uso y habitación o la
                  forma en que está tu matrimonio o sociedad pueden aparecer cuando ya hay oferta —y ahí duele. En{' '}
                  <span className="font-semibold text-slate-800">Punto Legal</span> nos ocupamos de ordenar dominio y de
                  encarar el saneamiento de vicios o cargas que traben la compraventa; después trabajamos la venta de tu
                  bien raíz con interesados que muestran capacidad hipotecaria real. Menos noches en vela, menos tiempo
                  perdido en visitas que no cierran.
                </p>

                <InmobiliarioPatrimonioScanner />

                <div className="mt-8 flex max-w-xl flex-col gap-3 text-sm text-slate-800 sm:gap-3.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" strokeWidth={2} />
                    <span>
                      Priorizamos visitas con señal seria de crédito: menos curiosos en tu living, más pasos hacia una oferta
                      real.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" strokeWidth={2} />
                    <span>
                      Precio en UF y estrategia cuando ya viste dominio, hipotecas y cargas en Conservador —sin improvisar
                      frente al comprador.
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                id="evaluacion-formulario"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="order-1 lg:order-2 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto scroll-mt-28 pb-28 sm:pb-24"
              >
                <MacGlassWindow
                  title="Tu evaluación para vender (confidencial)"
                  subtitle="Las Condes · Vitacura · Lo Barnechea · La Reina"
                  progressPct={progressPct}
                  bodyClassName={cn(
                    'px-6 py-6 sm:px-8 sm:py-8',
                    'pb-[max(1.75rem,env(safe-area-inset-bottom,0px))]',
                  )}
                >
                  <AnimatePresence mode="wait">
                    {phase === 'questions' && (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="mb-6 mt-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                              Paso {stepDisplayIdx} de {stepDisplayTotal}
                            </span>
                            {currentStepId === 'precio_esperado' ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/90 bg-emerald-50/90 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-900">
                                <Lock className="h-3 w-3" aria-hidden />
                                100% confidencial
                              </span>
                            ) : null}
                          </div>
                          <p className="mb-2 text-[11px] font-medium tracking-wide text-slate-600">
                            Unos datos rápidos antes de agendar: te ayudan a ordenar ideas y tiempos (orientativo; no reemplaza
                            tasación ni estudio de títulos completo).
                          </p>
                          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                            {stepHeading}
                          </h2>
                        </div>

                        {stepIndexInSeq > 0 ? (
                          <button
                            type="button"
                            onClick={handleBack}
                            disabled={isTransitioning}
                            className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600 transition hover:text-slate-900 disabled:opacity-40"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                            Volver
                          </button>
                        ) : null}

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentStepId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-2.5"
                          >
                            {currentStepId === 'tipo_propiedad' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_propiedad', 'casa')}
                                  label="Casa"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_propiedad', 'departamento')}
                                  label="Departamento"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_propiedad', 'sitio_terreno')}
                                  label="Sitio o terreno"
                                />
                              </>
                            )}
                            {currentStepId === 'ubicacion' && (
                              <InmobiliarioAddressStep
                                disabled={isTransitioning}
                                onConfirm={handleAddressPick}
                                previewRow={addressPreview}
                              />
                            )}
                            {currentStepId === 'momento_venta' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('momento_venta', 'visitas_pronto')}
                                  label="Agendar visitas con compradores precalificados"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('momento_venta', 'reunion_equipo')}
                                  label="Reunión con el equipo antes de exponer el inmueble"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('momento_venta', 'ordenar_documentacion')}
                                  label="Revisar dominio y cargas antes de salir al mercado"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('momento_venta', 'explorando')}
                                  label="Aún evalúo vender / sin urgencia de calendario"
                                />
                              </>
                            )}
                            {currentStepId === 'metros_cuadrados' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('metros_cuadrados', 'menos_100')}
                                  label="Menos de 100 m²"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('metros_cuadrados', 'entre_100_200')}
                                  label="Entre 100 y 200 m²"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('metros_cuadrados', 'mas_200')}
                                  label="Más de 200 m²"
                                />
                              </>
                            )}
                            {currentStepId === 'amenidad_piscina' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tiene_piscina', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tiene_piscina', 'no')}
                                  label="No"
                                />
                              </>
                            )}
                            {currentStepId === 'amenidad_quincho' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tiene_quincho', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tiene_quincho', 'no')}
                                  label="No"
                                />
                              </>
                            )}
                            {currentStepId === 'amenidad_cancha' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tiene_cancha', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tiene_cancha', 'no')}
                                  label="No"
                                />
                              </>
                            )}
                            {currentStepId === 'tipo_cancha' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_cancha', 'tenis')}
                                  label="Cancha de tenis"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_cancha', 'futbol')}
                                  label="Cancha de fútbol"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_cancha', 'golf')}
                                  label="Práctica de golf / putting"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('tipo_cancha', 'varias')}
                                  label="Varias / combinación"
                                />
                              </>
                            )}
                            {currentStepId === 'balcon_terraza' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('balcon_terraza', 'no')}
                                  label="Sin balcón ni terraza de relevancia"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('balcon_terraza', 'balcon')}
                                  label="Balcón"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('balcon_terraza', 'terraza_loggia')}
                                  label="Terraza o loggia"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('balcon_terraza', 'prefiero_reunion')}
                                  label="Prefiero detallarlo en la reunión"
                                />
                              </>
                            )}
                            {currentStepId === 'titularidad_compra' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('titularidad_compra', 'personal')}
                                  label="A título personal"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('titularidad_compra', 'sociedad_conyugal')}
                                  label="Comprada en matrimonio con sociedad conyugal"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() =>
                                    handleOptionSelect('titularidad_compra', 'separacion_o_fuera_patrimonio')
                                  }
                                  label="Separación de bienes, fuera de patrimonio reservado u otro régimen"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('titularidad_compra', 'sociedad_empresa')}
                                  label="Titularidad en persona jurídica"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('titularidad_compra', 'prefiero_reunion')}
                                  label="Prefiero explicarlo en la reunión"
                                />
                              </>
                            )}
                            {currentStepId === 'carga_hipoteca' && (
                              <>
                                <p className="mb-1 text-[12px] leading-relaxed text-slate-600">
                                  Respuesta orientativa; la revisión registral definitiva es en la reunión y en el
                                  estudio de títulos.
                                </p>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_hipoteca', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_hipoteca', 'no')}
                                  label="No"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_hipoteca', 'no_seguro')}
                                  label="No estoy seguro"
                                />
                              </>
                            )}
                            {currentStepId === 'carga_uso_habitacion' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_uso_habitacion', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_uso_habitacion', 'no')}
                                  label="No"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_uso_habitacion', 'no_seguro')}
                                  label="No estoy seguro"
                                />
                              </>
                            )}
                            {currentStepId === 'carga_usufructo' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_usufructo', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_usufructo', 'no')}
                                  label="No"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_usufructo', 'no_seguro')}
                                  label="No estoy seguro"
                                />
                              </>
                            )}
                            {currentStepId === 'carga_otros_gravamen' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_otros_gravamen', 'si')}
                                  label="Sí"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_otros_gravamen', 'no')}
                                  label="No"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('carga_otros_gravamen', 'no_seguro')}
                                  label="No estoy seguro"
                                />
                              </>
                            )}
                            {currentStepId === 'precio_esperado' && (
                              <>
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('precio_esperado', 'por_definir_menos_8000')}
                                  label="Menos de 8.000 UF"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('precio_esperado', '8000_15000')}
                                  label="8.000 – 15.000 UF"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('precio_esperado', '15000_30000')}
                                  label="15.000 – 30.000 UF"
                                />
                                <FormButton
                                  variant="panel"
                                  disabled={isTransitioning}
                                  onClick={() => handleOptionSelect('precio_esperado', 'over_30000')}
                                  label="Más de 30.000 UF"
                                />
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {submitError && (
                          <p className="mt-4 text-sm text-amber-800" role="alert">
                            {submitError}
                          </p>
                        )}

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-slate-200/50 pt-6 text-[11px] text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                            100% confidencial
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                            Visitas con precalificación previa
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <FileSearch className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                            Revisión orientativa de títulos
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                          <Lock className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                          <span>Sin correo masivo: sus datos solo para esta evaluación.</span>
                        </div>
                      </motion.div>
                    )}
                    {phase === 'processing' && (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex min-h-[20rem] flex-col justify-center"
                      >
                        <p className="text-center text-[11px] font-semibold tracking-wide text-emerald-800">
                          Analizando antecedentes de la zona…
                        </p>
                        <InmobiliarioProcessingTerminal
                          variant="light"
                          messageIntervalMs={560}
                          durationMs={PROCESSING_MS}
                        />
                      </motion.div>
                    )}
                    {phase === 'success' && (
                      <motion.div
                        key="success"
                        role="status"
                        aria-live="polite"
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8 mb-6 text-center px-1"
                      >
                        <motion.div
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/90 bg-emerald-50/90"
                        >
                          <CheckCircle2 className="h-7 w-7 text-emerald-700" aria-hidden />
                        </motion.div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
                          Ya dimos el primer paso
                        </p>
                        <p className="text-base font-medium leading-snug tracking-tight text-slate-900 sm:text-lg">
                          Respira: agenda con abogado y comercial para traducir esto en un plan de venta con plazos realistas
                          y saber qué falta revisar en dominio y gravámenes antes de firmar promesa.
                        </p>
                        <motion.div
                          className="mt-6 flex justify-center gap-1"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.12 } },
                          }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-1 w-1 rounded-full bg-slate-400"
                              variants={{
                                hidden: { opacity: 0.3, y: 0 },
                                visible: {
                                  opacity: [0.3, 1, 0.3],
                                  y: [0, -4, 0],
                                  transition: { duration: 0.9, repeat: Infinity, delay: i * 0.15 },
                                },
                              }}
                            />
                          ))}
                        </motion.div>
                        <p className="mt-5 text-[11px] text-slate-600">Redirigiendo al agendamiento…</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </MacGlassWindow>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mercado tradicional vs Sistema */}
        <section className="relative z-10 border-t border-slate-200/80 py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 text-center md:mb-16"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Cuando la venta te quita el sueño
              </p>
              <h2 className="mx-auto max-w-3xl text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                No es solo cuánto pidas en UF:{' '}
                <span className="text-emerald-800">
                  es la angustia de no saber si mañana la escritura firma o todo se cae
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                En Vitacura, Las Condes, Lo Barnechea y La Reina hay demanda, sí —pero una hipoteca mal contada, un
                usufructo o el matrimonio mal entendido pueden dejarte con el comprador enfrente y el corazón en la mano.
                Nosotros ponemos el foco en ordenar dominio primero y en compradores que pueden pagar de verdad.
              </p>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-rose-200/80 bg-white/80 p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/90 sm:p-9"
              >
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">
                    Lo que más duele al vender solo
                  </span>
                </div>
                <ul className="space-y-4">
                  {TRADITIONAL_PAINS.map((t, i) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-rose-200/90 bg-rose-50/90">
                        <X className="h-3.5 w-3.5 text-rose-600" strokeWidth={2.5} aria-hidden />
                      </span>
                      <motion.span
                        initial={{ opacity: 0.5 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: prefersReducedMotion ? 0 : i * 0.06 }}
                      >
                        {t}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: prefersReducedMotion ? 0 : 0.06 }}
                className="rounded-2xl border border-emerald-200/80 bg-white/85 p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl ring-1 ring-white/90 sm:p-9"
              >
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-900">
                    Cómo te ayudamos en Punto Legal a vender con respaldo
                  </span>
                </div>
                <ul className="space-y-4">
                  {MARSHALL_WINS.map((t, i) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed text-slate-800">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-emerald-200/90 bg-emerald-50/80">
                        <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} aria-hidden />
                      </span>
                      <motion.span
                        initial={{ opacity: 0.5 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: prefersReducedMotion ? 0 : i * 0.06 }}
                      >
                        {t}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline acelerada */}
        <section className="relative z-10 overflow-hidden border-t border-slate-200/80 py-20 md:py-28">
          <div className="container relative mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center md:mb-16"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Del estrés al plan
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Tres etapas para pasar del mandato a la escritura —sin sentirte solo en el trámite
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
                Un mismo equipo legal y comercial recorre la venta contigo: primero dominio y cargas, después mercado con
                cabeza fría, y cierre en notaría con menos sustos para ti y para quien compra con banco.
              </p>
            </motion.div>

            {/* Desktop: horizontal */}
            <div className="relative hidden px-2 md:block">
              <div className="absolute left-[8%] right-[8%] top-[22px] h-[2px] rounded-full bg-gradient-to-r from-slate-200 via-emerald-200/80 to-sky-200/70" />
              <div className="grid grid-cols-3 gap-8">
                {TIMELINE_PHASES.map((p, i) => (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.45,
                      delay: prefersReducedMotion ? 0 : i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative pt-2 text-center"
                  >
                    <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100">
                      <span className="text-xs font-bold text-emerald-700">{i + 1}</span>
                    </div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {p.days}
                    </p>
                    <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-900">{p.title}</h3>
                    <p className="px-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: vertical */}
            <div className="relative pl-3 md:hidden">
              <div className="absolute bottom-3 left-[19px] top-3 w-[2px] rounded-full bg-gradient-to-b from-emerald-200/90 via-slate-200 to-sky-200/80" />
              <div className="space-y-10">
                {TIMELINE_PHASES.map((p, i) => (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: prefersReducedMotion ? 0.01 : 0.4,
                      delay: prefersReducedMotion ? 0 : i * 0.1,
                    }}
                    className="relative flex gap-5"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100">
                      <span className="text-xs font-bold text-emerald-700">{i + 1}</span>
                    </div>
                    <div className="pb-2 pt-0.5">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {p.days}
                      </p>
                      <h3 className="mb-1.5 text-base font-semibold text-slate-900">{p.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">{p.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* El resultado: dossier de liquidación (anclaje de éxito) */}
        <section className="relative z-10 border-t border-slate-200/80 py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center md:mb-12"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                El resultado
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Liquidación exitosa</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
                Referencia ilustrativa de cierre; cada caso se documenta según su propio expediente.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-4xl"
            >
              <MacGlassWindow
                title="Dossier de Cierre Confidencial"
                subtitle="Punto Legal Inmobiliario · referencia de operación"
                bodyClassName="p-6 sm:p-10 md:p-12"
              >
                <div className="text-center">
                  <p className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-4xl md:text-[2.65rem] md:leading-tight">
                    $ 573.000.000 CLP
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
                    Equivalente a 15.200 UF (aprox.)
                  </p>
                  <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2 sm:gap-3">
                    {[
                      'Cierre notarial coordinado',
                      'Identidad reservada en la gestión',
                      'Mandato de venta cumplido',
                    ].map((pill) => (
                      <span
                        key={pill}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/90 bg-emerald-50 px-3 py-1.5 text-left text-[11px] font-semibold text-emerald-950 sm:text-xs"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-700" strokeWidth={2.5} aria-hidden />
                        {pill}
                      </span>
                    ))}
                  </div>
                  <p className="mx-auto mt-10 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                    Caso referencial: operación cerrada en torno a un precio acorde al mercado y defendible frente a
                    comprador y banco, limitando exposición innecesaria.
                  </p>
                  <p className="mt-6 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Referencia ilustrativa · cada operación es distinta
                  </p>
                </div>
              </MacGlassWindow>
            </motion.div>
          </div>
        </section>

        <motion.button
          type="button"
          onClick={scrollToForm}
          initial={false}
          animate={{
            opacity: showStickyCta && phase === 'questions' ? 1 : 0,
            y: showStickyCta && phase === 'questions' ? 0 : 12,
            pointerEvents: showStickyCta && phase === 'questions' ? 'auto' : 'none',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-800/25 bg-emerald-800 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(6,78,59,0.22)] backdrop-blur-xl transition-all hover:bg-emerald-900 active:scale-[0.98] sm:left-auto sm:right-6 sm:translate-x-0"
          style={stickyBottomStyle}
          aria-hidden={!showStickyCta || phase !== 'questions'}
          tabIndex={showStickyCta && phase === 'questions' ? 0 : -1}
        >
          <ArrowUp className="h-4 w-4 text-white/90" aria-hidden />
          Revisar mis papeles antes de vender
        </motion.button>
        </div>
      </div>
    </>
  )
}

function FormButton({
  onClick,
  label,
  disabled,
  variant = 'light',
}: {
  onClick: () => void
  label: string
  disabled?: boolean
  variant?: 'light' | 'panel'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left px-5 py-3.5 rounded-xl border backdrop-blur-xl font-medium flex justify-between items-center gap-3 group transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45 disabled:hover:scale-100 disabled:hover:shadow-none',
        variant === 'panel'
          ? 'border-slate-200/80 bg-white/95 text-slate-900 shadow-sm hover:border-emerald-600/40 hover:bg-emerald-50/60 hover:shadow-[0_8px_28px_rgba(5,150,105,0.12)]'
          : 'border-slate-200/90 bg-white/90 text-slate-800 shadow-sm hover:border-slate-400/90 hover:bg-white',
      )}
    >
      <span className="leading-snug">{label}</span>
      <ChevronRight
        className={cn(
          'w-5 h-5 shrink-0 transition-colors',
          variant === 'panel'
            ? 'text-slate-400 group-hover:text-emerald-800'
            : 'text-slate-400 group-hover:text-slate-800',
        )}
      />
    </button>
  )
}
