import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  FileSignature,
  FileWarning,
  Flame,
  Gavel,
  Heart,
  Landmark,
  LayoutGrid,
  Plane,
  Receipt,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Stamp,
  Video,
  type LucideIcon,
} from "lucide-react";

interface ExternalService {
  title: string;
  description: string;
  icon?: string;
  price?: string;
  plan?: string;
  features?: string[];
}

interface ServicesSectionProps {
  title?: string;
  services?: ExternalService[];
  onAgendarClick?: (service: { title: string; promoPrice?: string; price?: string; plan?: string }) => void;
}

type Audience = "all" | "personas" | "empresas" | "patrimonio";

interface InternalService {
  title: string;
  shortName: string;
  /** Una línea de gancho — orientada al outcome del cliente */
  hook: string;
  /** Descripción rica en HTML (con <strong>) */
  descriptionHtml: string;
  /** Etiqueta CTA — verbo + beneficio */
  ctaLabel: string;
  price: string;
  priceBefore?: string;
  priceFootnote?: string;
  /** Slug del plan — corresponde a /agendamiento?plan=<plan> */
  plan: string;
  icon: LucideIcon;
  features: string[];
  audience: Exclude<Audience, "all">;
  /** RGB triplet usado por --card-accent en .service-card */
  accent: string;
  /** Badge único — sólo en español */
  badge?: string;
  featured?: boolean;
  /** Testimonial corto sólo para featured */
  testimonial?: { quote: string; author: string };
  /** Plan gratuito (cambia el render del precio) */
  free?: boolean;
}

const internalServices: InternalService[] = [
  // ========== PRODUCTO ESTRELLA ==========
  // Defensa CAE — máxima urgencia financiera + alta intención de búsqueda.
  // Colocado como PRIMERO + FEATURED para máxima visibilidad.
  {
    title: "Punto Legal Defensa CAE",
    shortName: "Defensa CAE",
    hook: "¿La Tesorería te está reteniendo tu sueldo o tu devolución de impuestos por tu CAE moroso? Frenamos el embargo, repactamos la deuda y, cuando corresponde, solicitamos rebaja o condonación.",
    descriptionHtml:
      "Defensa integral de deudores morosos del <strong>Crédito con Aval del Estado (CAE) frente a la Tesorería General de la República</strong>. Presentamos recurso para suspender la retención judicial, evaluamos tu capacidad de pago y negociamos un convenio que se ajuste a tu realidad. Si calificas por insolvencia o error administrativo, impulsamos rebaja o condonación parcial.",
    ctaLabel: "Frenar mi embargo TGR",
    price: "$109.000",
    priceBefore: "$169.000",
    plan: "cae-tesoreria",
    icon: Receipt,
    features: [
      "Suspensión de retención de sueldo o devolución de impuestos",
      "Convenio de pago contributivo (% según renta)",
      "Solicitud de rebaja o condonación parcial",
      "Defensa administrativa y judicial ante la TGR",
    ],
    audience: "patrimonio",
    accent: "239 68 68", // red-500 — urgencia financiera
    badge: "Producto estrella",
    featured: true,
    testimonial: {
      quote:
        "“Me estaban reteniendo el sueldo hacía 8 meses. En 3 semanas frenaron el embargo y cerramos un plan mensual razonable. Recomendadísimos.”",
      author: "Camilo V.",
    },
  },
  // ========== PERSONAS ==========
  {
    title: "Punto Legal Tutela Laboral",
    shortName: "Tutela Laboral",
    hook: "Si te despidieron sin justificación o sufriste acoso laboral, te decimos cuánto te corresponde. El diagnóstico es gratis.",
    descriptionHtml:
      "Calculamos tu <strong>indemnización por despido injustificado</strong>, evaluamos casos de tutela laboral, Ley Karin y nulidad del despido. Si tu caso tiene mérito, lo tomamos a porcentaje: pagas sólo cuando recuperas.",
    ctaLabel: "Pedir mi diagnóstico gratis",
    price: "Gratis",
    plan: "tutela-laboral",
    icon: Scale,
    free: true,
    features: [
      "Diagnóstico gratuito de tu caso",
      "Cálculo real de indemnización",
      "Tutela laboral, Ley Karin y nulidad del despido",
      "Honorarios sólo si recuperamos",
    ],
    audience: "personas",
    accent: "16 185 129", // emerald-500 — éxito + recuperación
    badge: "Diagnóstico gratis",
  },
  {
    title: "Punto Legal Familia",
    shortName: "Familia",
    hook: "Calculamos tu pensión de alimentos, ordenamos tu divorcio y te decimos qué hacer en cada paso.",
    descriptionHtml:
      "Calculamos tu <strong>pensión de alimentos según Ley 14.908</strong>, evaluamos tu causa de divorcio o cuidado personal, y te entregamos un plan de acción por escrito.",
    ctaLabel: "Agendar mi consulta",
    price: "$89.000",
    priceBefore: "$149.000",
    plan: "familia",
    icon: Heart,
    features: [
      "Cálculo de pensión y deuda acumulada",
      "Estrategia de divorcio o cuidado personal",
      "Plan de acción por escrito",
    ],
    audience: "personas",
    accent: "129 140 248", // indigo-400
  },
  {
    title: "Punto Legal Sucesorio",
    shortName: "Sucesorio",
    hook: "Posesión efectiva, testamento y partición de herencia con plazos claros y honorarios cerrados.",
    descriptionHtml:
      "Tramitamos tu <strong>posesión efectiva</strong> intestada o testada, redactamos testamentos y resolvemos particiones con presupuesto cerrado desde la primera reunión.",
    ctaLabel: "Ordenar mi herencia",
    price: "$89.000",
    plan: "sucesorio",
    icon: Stamp,
    features: [
      "Posesión efectiva intestada o testada",
      "Testamento abierto o cerrado",
      "Partición y cesión de derechos",
    ],
    audience: "personas",
    accent: "100 116 139", // slate-500
  },
  {
    title: "Punto Legal Migratorio",
    shortName: "Migratorio",
    hook: "Visa de trabajo, residencia definitiva o nacionalización chilena con plazos reales y seguimiento al Servicio Nacional de Migraciones.",
    descriptionHtml:
      "Te acompañamos en <strong>visa temporaria, visa de responsabilidad democrática, residencia definitiva y nacionalización</strong>. Armamos el expediente, calculamos tiempos reales y respondemos los requerimientos.",
    ctaLabel: "Asesorar mi caso migratorio",
    price: "$129.000",
    plan: "migratorio",
    icon: Plane,
    features: [
      "Visa temporaria y de trabajo",
      "Residencia definitiva y nacionalización",
      "Recursos contra rechazos o expulsión",
    ],
    audience: "personas",
    accent: "6 182 212", // cyan-500
  },
  {
    title: "Punto Legal Penal",
    shortName: "Penal",
    hook: "Defensa penal con un abogado litigante en juicio oral, querellas y salidas alternativas.",
    descriptionHtml:
      "Asumimos <strong>defensas en delitos contra las personas y la propiedad</strong>. Negociamos suspensión condicional y acuerdos reparatorios, y vamos a juicio oral cuando corresponde.",
    ctaLabel: "Defender mi caso",
    price: "$169.000",
    plan: "penal",
    icon: Gavel,
    features: [
      "Defensa en juicio oral",
      "Querellas y representación de víctimas",
      "Suspensión condicional y acuerdos",
    ],
    audience: "personas",
    accent: "190 18 60", // rose-700 — gravedad
    badge: "Atención inmediata",
  },
  {
    title: "Punto Legal Delitos Económicos",
    shortName: "Delitos Económicos",
    hook: "Defensa especializada en la Ley de Delitos Económicos (Ley 21.595): fraude, lavado de activos, administración desleal y corrupción entre particulares.",
    descriptionHtml:
      "Defensa penal de ejecutivos, directores y socios frente a investigaciones de la Fiscalía, UAF o SII. Cubrimos <strong>Ley 21.595 de Delitos Económicos</strong>: administración desleal, fraude al Fisco, lavado de activos, delitos tributarios y ambientales. Estrategia desde la primera audiencia y coordinación con peritos contables.",
    ctaLabel: "Pedir defensa especializada",
    price: "$290.000",
    plan: "delitos-economicos",
    icon: BriefcaseBusiness,
    features: [
      "Ley 21.595 — delitos económicos y tributarios",
      "Defensa en investigación y juicio oral",
      "Coordinación con peritos contables y compliance",
      "Procedimiento abreviado y suspensión condicional",
    ],
    audience: "personas",
    accent: "153 27 27", // red-800 — gravedad corporativa
    badge: "Alta complejidad",
  },

  // ========== EMPRESAS ==========
  {
    title: "Punto Legal Empresarial",
    shortName: "Empresarial",
    hook: "Constituye tu SpA en 72 horas y queda con un abogado que te acompaña todos los meses.",
    descriptionHtml:
      "<strong>Constituimos tu SpA o EIRL en 72 horas</strong>, redactamos pactos de socios y entregamos asesoría legal todos los meses con un abogado dedicado.",
    ctaLabel: "Asesorar mi empresa",
    price: "$149.000",
    plan: "empresarial",
    icon: Building2,
    features: [
      "Constitución de SpA o EIRL en 72 h",
      "Pactos de socios y estatutos",
      "Asesoría legal mensual",
    ],
    audience: "empresas",
    accent: "139 92 246", // violet-500
  },
  {
    title: "Punto Legal Constitución Empresarial",
    shortName: "Constitución Empresarial",
    hook: "Estructuras societarias complejas: Sociedades Anónimas, estructuras internacionales y constitución con múltiples series de acciones.",
    descriptionHtml:
      "Para proyectos que exigen más que una SpA estándar: <strong>Sociedad Anónima Cerrada o Abierta, estructuras con matriz extranjera, fondos de inversión y sociedades con múltiples series de acciones</strong>. Due diligence, redacción de estatutos, inscripción en CMF si corresponde y coordinación notarial.",
    ctaLabel: "Constituir mi empresa",
    price: "$229.000",
    plan: "constitucion-empresarial",
    icon: Building2,
    features: [
      "Sociedad Anónima Cerrada o Abierta",
      "Estructuras con matriz extranjera",
      "Series de acciones y preferencias",
      "Inscripción ante CMF si corresponde",
    ],
    audience: "empresas",
    accent: "124 58 237", // violet-600
  },
  {
    title: "Punto Legal Reestructuración",
    shortName: "Reestructuración",
    hook: "Fusiones, escisiones, transformaciones de tipo social y adecuación estatutaria con todo el respaldo jurídico del cambio.",
    descriptionHtml:
      "Reestructuración societaria completa: <strong>fusión por absorción, escisión, transformación de tipo social, aumento o disminución de capital y adecuación estatutaria</strong>. Dictamen jurídico-tributario, tramitación notarial, inscripción en Registro de Comercio y publicación en el Diario Oficial.",
    ctaLabel: "Reestructurar mi empresa",
    price: "$290.000",
    plan: "reestructuracion",
    icon: Landmark,
    features: [
      "Fusión por absorción o por creación",
      "Escisión y transformación societaria",
      "Aumento o disminución de capital",
      "Tramitación Registro de Comercio y DO",
    ],
    audience: "empresas",
    accent: "79 70 229", // indigo-600
  },
  {
    title: "Punto Legal Holding Patrimonial",
    shortName: "Holding Patrimonial",
    hook: "Protege y ordena tu patrimonio con una estructura de holding familiar o empresarial diseñada a medida.",
    descriptionHtml:
      "Diseño e implementación de <strong>sociedades holding patrimoniales y familiares</strong>: sociedad matriz, traspaso de activos, pactos de accionistas, protocolos familiares y planificación de sucesión. Enfoque integrado civil-tributario que minimiza carga impositiva y protege el patrimonio intergeneracional.",
    ctaLabel: "Estructurar mi holding",
    price: "$350.000",
    plan: "holding-patrimonial",
    icon: Landmark,
    features: [
      "Diseño de sociedad matriz y filiales",
      "Pactos de accionistas y protocolo familiar",
      "Planificación sucesoria patrimonial",
      "Análisis civil-tributario integrado",
    ],
    audience: "empresas",
    accent: "30 58 138", // blue-900 — institucional
    badge: "Alto patrimonio",
  },
  {
    title: "Punto Legal Gestión Patrimonial",
    shortName: "Gestión Patrimonial",
    hook: "Asesoría legal continua para tu grupo empresarial: contratos, gobierno corporativo y planificación tributaria mensual.",
    descriptionHtml:
      "Asesoría patrimonial-empresarial permanente con un abogado senior dedicado: <strong>revisión mensual de contratos, gobierno corporativo, dividendos y retiros, planificación tributaria y due diligence de inversiones</strong>. Tarifa mensual cerrada que incluye hasta 5 horas de consulta y revisión ilimitada de documentos estándar.",
    ctaLabel: "Iniciar asesoría mensual",
    price: "$390.000",
    plan: "gestion-patrimonial",
    icon: BriefcaseBusiness,
    priceFootnote: "Tarifa mensual · 5 horas incluidas",
    features: [
      "Abogado senior dedicado",
      "Revisión ilimitada de contratos estándar",
      "Gobierno corporativo y retiros",
      "Planificación tributaria mensual",
    ],
    audience: "empresas",
    accent: "67 56 202", // indigo-700
    badge: "Asesoría mensual",
  },
  {
    title: "Punto Legal Despido Empresas",
    shortName: "Despido Empresas",
    hook: "Antes de desvincular a un trabajador, calculamos el costo real, la causal correcta y blindamos la carta de despido para evitar juicios.",
    descriptionHtml:
      "Asesoría preventiva en <strong>desvinculación de trabajadores</strong>: análisis de la causal aplicable (necesidades de la empresa, incumplimiento grave, Artículo 160), cálculo del costo real del despido y redacción de la carta para minimizar riesgo de demanda por despido injustificado, nulidad o tutela.",
    ctaLabel: "Asesorar despido",
    price: "$149.000",
    plan: "despido-empresa",
    icon: BriefcaseBusiness,
    features: [
      "Análisis de causal de despido",
      "Cálculo real de finiquito",
      "Redacción de carta de despido",
      "Evaluación de riesgo de litigio",
    ],
    audience: "empresas",
    accent: "147 51 234", // purple-600
  },
  {
    title: "Punto Legal Tributario",
    shortName: "Tributario",
    hook: "Pagas los impuestos justos y respondes al SII con un abogado tributarista a tu lado.",
    descriptionHtml:
      "Planificación tributaria personal y para PYME, recursos administrativos y representación frente al SII. <strong>Pagas lo justo, ni un peso más.</strong>",
    ctaLabel: "Optimizar mis impuestos",
    price: "$99.000",
    plan: "tributario",
    icon: Calculator,
    features: [
      "Planificación tributaria personal y PYME",
      "Recursos y reposiciones ante el SII",
      "Defensa frente a fiscalizaciones",
    ],
    audience: "empresas",
    accent: "8 145 178", // cyan-700
  },
  {
    title: "Punto Legal Contratos",
    shortName: "Contratos",
    hook: "Redactamos o revisamos tu contrato en 24 horas, con cláusulas claras y sin sorpresas.",
    descriptionHtml:
      "Redactamos y revisamos <strong>contratos civiles y comerciales</strong> con cláusulas a tu medida. Te explicamos cada riesgo antes de que firmes.",
    ctaLabel: "Revisar mi contrato",
    price: "$59.000",
    plan: "contratos",
    icon: FileSignature,
    features: [
      "Redacción a medida o revisión en 24 h",
      "Acuerdos de confidencialidad",
      "Asesoría en negociación",
    ],
    audience: "empresas",
    accent: "59 130 246", // blue-500
    badge: "24 horas",
  },
  {
    title: "Punto Legal Comparendos",
    shortName: "Comparendos DT",
    hook: "Te representamos en comparendos ante la Dirección del Trabajo y negociamos avenimientos favorables.",
    descriptionHtml:
      "Comparecemos por tu empresa en <strong>conciliaciones ante la Dirección del Trabajo</strong>. Preparamos la estrategia, calculamos riesgos reales y negociamos avenimientos que te convengan.",
    ctaLabel: "Asesorar mi comparendo",
    price: "$130.000",
    plan: "comparendos",
    icon: Gavel,
    features: [
      "Representación en comparendo DT",
      "Cálculo de riesgo y contingencia laboral",
      "Negociación de avenimiento",
    ],
    audience: "empresas",
    accent: "168 85 247", // purple-500
  },
  {
    title: "Punto Legal Fiscalizaciones DT",
    shortName: "Fiscalizaciones DT",
    hook: "Defensa en fiscalizaciones de la Dirección del Trabajo y reconsideración de multas administrativas.",
    descriptionHtml:
      "Te asistimos durante la <strong>fiscalización de la Dirección del Trabajo</strong>, presentamos descargos y solicitudes de reconsideración de multas. También recurrimos al juez en sede laboral cuando corresponde.",
    ctaLabel: "Defender a mi empresa",
    price: "$110.000",
    plan: "fiscalizaciones-dt",
    icon: ShieldAlert,
    features: [
      "Asistencia durante la fiscalización",
      "Descargos y reconsideración de multas",
      "Reclamación judicial de multas",
    ],
    audience: "empresas",
    accent: "236 72 153", // pink-500
  },
  {
    title: "Punto Legal Defensa Empresarial",
    shortName: "Defensa Empresarial",
    hook: "Defendemos a tu empresa frente a demandas de trabajadores: despido, tutela, indemnizaciones y nulidad.",
    descriptionHtml:
      "Asumimos la <strong>defensa de tu empresa en juicios laborales</strong>: despidos, tutelas, demandas por indemnizaciones y nulidad. Audiencias preparatoria y de juicio en Juzgados del Trabajo.",
    ctaLabel: "Proteger a mi empresa",
    price: "$189.000",
    plan: "defensa-laboral-empresarial",
    icon: BriefcaseBusiness,
    features: [
      "Defensa en juicios por despido y tutela",
      "Audiencia preparatoria y de juicio",
      "Estrategia conciliatoria o contenciosa",
    ],
    audience: "empresas",
    accent: "67 56 202", // indigo-700
  },
  {
    title: "Punto Legal Ley Karin",
    shortName: "Ley Karin",
    hook: "Implementación del protocolo Ley Karin, capacitación al equipo y defensa frente a denuncias.",
    descriptionHtml:
      "Diseñamos e implementamos tu <strong>protocolo Ley Karin</strong> (Ley 21.643), capacitamos a jefaturas y RRHH, y te asesoramos cuando llega una denuncia interna o ante la Dirección del Trabajo.",
    ctaLabel: "Implementar Ley Karin",
    price: "$169.000",
    plan: "ley-karin",
    icon: ShieldCheck,
    features: [
      "Diseño e implementación del protocolo",
      "Capacitación a jefaturas y RRHH",
      "Defensa frente a denuncias",
    ],
    audience: "empresas",
    accent: "124 58 237", // violet-600
    badge: "Obligación legal",
  },
  {
    title: "Punto Legal Cumplimiento",
    shortName: "Cumplimiento",
    hook: "Modelo de prevención del delito (Ley 20.393) y protección de datos personales para tu empresa.",
    descriptionHtml:
      "Diseñamos tu <strong>modelo de prevención del delito según Ley 20.393</strong>, programas de cumplimiento normativo y protocolos de protección de datos personales (Ley 19.628).",
    ctaLabel: "Asesorar el cumplimiento",
    price: "$179.000",
    plan: "cumplimiento",
    icon: ShieldCheck,
    features: [
      "Modelo de prevención Ley 20.393",
      "Protección de datos personales",
      "Capacitación y protocolos internos",
    ],
    audience: "empresas",
    accent: "147 51 234", // purple-600
  },
  {
    title: "Punto Legal Marcas",
    shortName: "Marcas",
    hook: "Registra tu marca en INAPI, defiende oposiciones y protege tu nombre comercial.",
    descriptionHtml:
      "Búsqueda de antecedentes, redacción de la solicitud y <strong>registro de marca ante INAPI</strong>. También te defendemos frente a oposiciones y resolvemos disputas por nombre comercial.",
    ctaLabel: "Registrar mi marca",
    price: "$89.000",
    plan: "marcas",
    icon: Award,
    features: [
      "Registro de marca en INAPI",
      "Oposiciones y defensa de marca",
      "Búsqueda de antecedentes",
    ],
    audience: "empresas",
    accent: "236 72 153", // pink-500 (compartido visual con fiscalización OK)
  },

  // ========== PATRIMONIO ==========
  {
    title: "Punto Legal Inmobiliario",
    shortName: "Inmobiliario",
    hook: "Antes de firmar una promesa, compraventa o arriendo, revisamos cada cláusula contigo.",
    descriptionHtml:
      "<strong>Estudio de títulos en 72 horas</strong>, redacción de compraventas, promesas y arriendos, y resolución de conflictos de propiedad y comunidades.",
    ctaLabel: "Proteger mi inversión",
    price: "$119.000",
    plan: "inmobiliario",
    icon: Landmark,
    features: [
      "Estudio de títulos y antecedentes",
      "Compraventa y promesa con cláusulas claras",
      "Contratos de arriendo a tu medida",
    ],
    audience: "patrimonio",
    accent: "20 184 166", // teal-500
  },
  {
    title: "Punto Legal Cobranza",
    shortName: "Cobranza",
    hook: "Recupera facturas impagas, cheques protestados y pagarés con juicio ejecutivo y embargo.",
    descriptionHtml:
      "Cobranza extrajudicial inicial y <strong>juicio ejecutivo</strong> de facturas, pagarés y cheques. Embargamos bienes, ejecutamos garantías y te representamos en remates.",
    ctaLabel: "Recuperar mi dinero",
    price: "$109.000",
    plan: "cobranza",
    icon: Banknote,
    features: [
      "Juicio ejecutivo y embargos",
      "Cobranza extrajudicial inicial",
      "Ejecución de pagarés y cheques",
    ],
    audience: "patrimonio",
    accent: "34 197 94", // green-500
  },
];

interface CategoryDef {
  id: Audience;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  /** RGB triplet — paleta fría profesional */
  accent: string;
}

const categories: CategoryDef[] = [
  {
    id: "all",
    label: "Todas",
    sublabel: "Ver todo el catálogo legal",
    icon: LayoutGrid,
    accent: "186 230 253", // sky-200
  },
  {
    id: "personas",
    label: "Personas",
    sublabel: "Tutela laboral, familia, sucesorio, migratorio y penal",
    icon: Heart,
    accent: "96 165 250", // blue-400
  },
  {
    id: "empresas",
    label: "Empresas",
    sublabel: "Sociedades, tributario, laboral empresarial, Ley Karin y marcas",
    icon: Building2,
    accent: "167 139 250", // violet-400
  },
  {
    id: "patrimonio",
    label: "Patrimonio",
    sublabel: "Inmobiliario, cobranza y defensa CAE",
    icon: Landmark,
    accent: "45 212 191", // teal-400
  },
];

const ServicesSection = ({
  title = "Elige tu consulta legal",
  services,
  onAgendarClick,
}: ServicesSectionProps) => {
  const [audience, setAudience] = useState<Audience>("all");

  const list = useMemo<InternalService[]>(() => {
    if (services && services.length > 0) {
      return services.map((s, i) => {
        const fallback = internalServices[i % internalServices.length];
        return {
          ...fallback,
          title: s.title,
          shortName: s.title.replace("Punto Legal ", ""),
          descriptionHtml: s.description,
          hook: s.description,
          price: s.price ?? fallback.price,
          plan: s.plan ?? fallback.plan,
          features: s.features ?? fallback.features,
        };
      });
    }
    return internalServices;
  }, [services]);

  const filtered = useMemo(
    () => (audience === "all" ? list : list.filter((s) => s.audience === audience)),
    [list, audience]
  );

  /** Count de servicios por categoría */
  const counts = useMemo(() => {
    return {
      all: list.length,
      personas: list.filter((s) => s.audience === "personas").length,
      empresas: list.filter((s) => s.audience === "empresas").length,
      patrimonio: list.filter((s) => s.audience === "patrimonio").length,
    } as Record<Audience, number>;
  }, [list]);

  const prefersReducedMotion = useReducedMotion();

  const handleClick = (s: InternalService) => {
    if (onAgendarClick) {
      onAgendarClick({ title: s.title, price: s.price, plan: s.plan });
    } else {
      // Fallback: routing directo si no hay handler externo
      window.location.href = `/agendamiento?plan=${s.plan}`;
    }
  };

  const activeCategory =
    categories.find((c) => c.id === audience) ?? categories[0];

  return (
    <section
      id="servicios"
      className="section-flow relative overflow-hidden px-4 py-16 sm:py-20 lg:py-24 scroll-mt-20"
    >
      {/* Bridge superior — conecta con HowItWorks suavemente */}
      <span className="section-flow__top" aria-hidden />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl" />
        <div className="absolute -right-24 bottom-6 h-64 w-64 rounded-full bg-cyan-500/[0.05] blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-3xl text-center lg:mb-10">
          <span className="badge-ios" style={{ color: "rgb(186 230 253)" }}>
            Online · Google Meet · Chile
          </span>
          <h2 className="font-display mt-6 text-[34px] font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[56px]">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            45 minutos por Google Meet con un abogado especialista. Diagnóstico,
            estrategia y un{" "}
            <strong className="text-white">plan de acción por escrito</strong>.
          </p>
        </div>

        {/* === Apple Watch–style category bubbles === */}
        <div
          className="cat-stage mb-8 lg:mb-12"
          role="tablist"
          aria-label="Filtrar consultas por categoría"
        >
          <div className="cat-grid">
            {categories.map((c, idx) => {
              const Icon = c.icon;
              const isActive = audience === c.id;
              const count = counts[c.id] ?? 0;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-pressed={isActive}
                  aria-label={`${c.label}: ${count} consulta${count === 1 ? "" : "s"}`}
                  onClick={() => setAudience(c.id)}
                  data-active={isActive ? "true" : undefined}
                  className="cat-bubble"
                  style={{ ["--bubble-accent" as string]: c.accent }}
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, y: 14, scale: 0.94 }
                  }
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileTap={
                    prefersReducedMotion
                      ? undefined
                      : {
                          scale: 0.92,
                          transition: {
                            type: "spring",
                            stiffness: 600,
                            damping: 28,
                          },
                        }
                  }
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -3,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          },
                        }
                  }
                >
                  <span className="cat-bubble__ring" aria-hidden>
                    <span className="cat-bubble__tile" aria-hidden>
                      <Icon
                        className="relative z-10 h-6 w-6 sm:h-7 sm:w-7"
                        strokeWidth={2.2}
                      />
                    </span>
                    <span className="cat-bubble__count" aria-hidden>
                      {count}
                    </span>
                  </span>
                  <span className="cat-bubble__label">{c.label}</span>
                  <span className="cat-bubble__dot" aria-hidden />
                </motion.button>
              );
            })}
          </div>

          {/* Sublabel contextual */}
          <div className="mt-4 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeCategory.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="text-center text-[12px] uppercase tracking-[0.22em]"
                style={{ color: `rgb(${activeCategory.accent})` }}
              >
                {activeCategory.sublabel} ·{" "}
                <span className="text-slate-400">
                  {counts[activeCategory.id]} consultas
                </span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* === Trending callout — "Lo más buscado esta semana" ===
            Posicionado estratégicamente entre las categorías y el catálogo.
            Capta atención del usuario justo cuando está decidiendo, con un
            servicio de alta urgencia financiera (Defensa CAE). */}
        <TrendingSpotlight
          onAgendarClick={() => {
            const cae = list.find((s) => s.plan === "cae-tesoreria");
            if (cae) handleClick(cae);
          }}
        />

        {/* === MOBILE: vertical stack iOS-style — sin carousel horizontal ===
            Cada card ocupa 100% width, scroll vertical natural y cómodo.
            Una sola CTA grande por card lleva directo al agendamiento. */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${audience}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3.5"
            >
              {filtered.map((s, idx) => (
                <MobileServiceCard
                  key={s.plan}
                  service={s}
                  onClick={() => handleClick(s)}
                  revealIndex={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* === DESKTOP: grid 3-col limpio === */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-${audience}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            >
              {filtered.map((s, idx) => (
                <ServiceCard
                  key={s.plan}
                  service={s}
                  onClick={() => handleClick(s)}
                  featured={
                    s.featured &&
                    audience !== "patrimonio" &&
                    audience !== "empresas"
                  }
                  revealIndex={idx}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Trust strip al final */}
        <div className="relative z-10 mt-10 flex flex-col items-center gap-3 text-[12px] text-slate-500 md:flex-row md:justify-center md:gap-6">
          <span className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            +1.200 consultas resueltas
          </span>
          <span className="hidden md:inline-flex h-1 w-1 rounded-full bg-slate-700" aria-hidden />
          <span className="inline-flex items-center gap-2">
            Cupos limitados por agenda
          </span>
          <span className="hidden md:inline-flex h-1 w-1 rounded-full bg-slate-700" aria-hidden />
          <span className="inline-flex items-center gap-2">
            Pago seguro · Cancelación gratuita
          </span>
        </div>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: InternalService;
  onClick: () => void;
  featured?: boolean;
  mobile?: boolean;
  /** Index dentro del grid filtrado — controla la cascada del unlock animation */
  revealIndex?: number;
}

/**
 * TrendingSpotlight — banner-card de "Lo más buscado esta semana".
 *
 * Posición estratégica: entre las cat-bubbles y el catálogo de cards.
 * Captura tráfico orgánico de alta intención (CAE = embargo TGR es una
 * consulta en alza por el aumento de morosidad de créditos universitarios).
 *
 * Diseño: card horizontal con accent rojo del CAE, ícono Flame (trending)
 * + Receipt (CAE), métrica social proof, CTA prominente.
 */
const TrendingSpotlight = ({
  onAgendarClick,
}: {
  onAgendarClick: () => void;
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.aside
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="trending-spotlight relative z-10 mb-8 lg:mb-10"
      aria-label="Servicio más buscado esta semana — Defensa CAE"
    >
      {/* Glow ambient sutil del color del servicio */}
      <span className="trending-spotlight__glow" aria-hidden />

      <div className="trending-spotlight__content">
        {/* Ribbon trending superior */}
        <div className="trending-spotlight__ribbon">
          <Flame className="h-3 w-3" strokeWidth={2.4} aria-hidden />
          <span>Lo más buscado esta semana</span>
        </div>

        <div className="trending-spotlight__row">
          {/* Icon tile rojo CAE */}
          <span className="trending-spotlight__tile" aria-hidden>
            <Receipt className="h-6 w-6" strokeWidth={2.2} />
          </span>

          <div className="trending-spotlight__body">
            <h3 className="trending-spotlight__title">
              Defensa CAE frente a Tesorería
            </h3>
            <p className="trending-spotlight__hook">
              ¿Te embargó la TGR por tu CAE moroso? Frenamos el embargo y
              repactamos la deuda contigo. <strong>Casos reales este mes.</strong>
            </p>

            {/* Social proof microcopy */}
            <div className="trending-spotlight__stats">
              <span className="trending-spotlight__stat">
                <span className="trending-spotlight__stat-value">+47</span>
                consultas esta semana
              </span>
              <span className="trending-spotlight__stat-sep" aria-hidden />
              <span className="trending-spotlight__stat">
                <span className="trending-spotlight__stat-value">$109.000</span>
                tarifa cerrada
              </span>
            </div>
          </div>

          {/* CTA principal */}
          <button
            type="button"
            onClick={onAgendarClick}
            className="trending-spotlight__cta cta-shimmer"
            aria-label="Frenar mi embargo CAE — agendar consulta con Punto Legal"
          >
            <span>Frenar mi embargo</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

interface MobileServiceCardProps {
  service: InternalService;
  onClick: () => void;
  revealIndex?: number;
}

/**
 * MobileServiceCard — versión iOS list-style optimizada para mobile.
 *
 * Diseño: una fila compacta tipo App Store con:
 *   - Icon tile (48px, color del servicio)
 *   - Title + hook breve (1-2 líneas)
 *   - Price right-aligned + chevron expandible
 *   - Tap en chevron → expande features + CTA
 *   - Tap en cuerpo → directo al agendamiento
 *
 * Reemplaza el horizontal snap carousel (incómodo con 17 cards).
 * Pensado para scroll vertical natural con thumb-zone óptima.
 */
const MobileServiceCard = ({
  service,
  onClick,
  revealIndex = 0,
}: MobileServiceCardProps) => {
  const Icon = service.icon;
  const prefersReducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const cascadeDelay = Math.min(revealIndex * 0.03, 0.18);

  const discount = (() => {
    if (!service.priceBefore || service.free) return null;
    const cur = Number(service.price.replace(/\D/g, ""));
    const before = Number(service.priceBefore.replace(/\D/g, ""));
    if (!cur || !before || before <= cur) return null;
    return Math.round(((before - cur) / before) * 100);
  })();

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.32,
        delay: cascadeDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      data-featured={service.featured ? "true" : undefined}
      className="mobile-service-card"
      style={{ ["--card-accent" as string]: service.accent }}
    >
      {/* Badge SUPERIOR — banda full-width arriba del row.
          Antes: estaba en línea con el título y truncaba "Tutela Laboral".
          Ahora: banda independiente arriba (cuando existe) y el título tiene
          todo el espacio horizontal disponible. */}
      {service.badge && (
        <div
          className="mobile-service-card__badge-bar"
          style={{
            color: `rgb(${service.accent})`,
            background: `linear-gradient(90deg, rgba(${service.accent}, 0.16), rgba(${service.accent}, 0.04))`,
            borderColor: `rgba(${service.accent}, 0.22)`,
          }}
          aria-hidden
        >
          <span
            className="mobile-service-card__badge-dot"
            style={{
              background: `rgb(${service.accent})`,
              boxShadow: `0 0 6px rgba(${service.accent}, 0.7)`,
            }}
          />
          {service.badge}
        </div>
      )}

      {/* Fila principal — tap para expandir features */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mobile-service-card__row"
        aria-expanded={expanded}
        aria-label={`${service.title} — toca para ver detalles`}
      >
        <span
          className="mobile-service-card__tile"
          style={{
            background: `linear-gradient(135deg, rgb(${service.accent}), rgba(${service.accent}, 0.72))`,
          }}
          aria-hidden
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>

        <div className="mobile-service-card__body">
          <h3 className="mobile-service-card__title">{service.shortName}</h3>
          <p className="mobile-service-card__hook">{service.hook}</p>
        </div>

        <div className="mobile-service-card__price-col">
          <p
            className={`mobile-service-card__price ${
              service.free
                ? "bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent"
                : ""
            }`}
          >
            {service.price}
          </p>
          {service.priceBefore && !service.free && (
            <p className="mobile-service-card__price-before">
              {service.priceBefore}
            </p>
          )}
          {discount !== null && (
            <span className="mobile-service-card__discount">−{discount}%</span>
          )}
        </div>

        <ChevronDown
          className={`mobile-service-card__chevron h-4 w-4 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {/* Expandible — features + CTA */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { type: "spring", stiffness: 280, damping: 32 },
                opacity: { duration: 0.2, delay: 0.06 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.22, ease: [0.4, 0, 1, 1] },
                opacity: { duration: 0.12 },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="mobile-service-card__panel">
              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[13px] leading-snug text-slate-300"
                  >
                    <span
                      className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full"
                      style={{
                        background: `rgb(${service.accent})`,
                        boxShadow: `0 0 6px rgba(${service.accent}, 0.6)`,
                      }}
                      aria-hidden
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-slate-500">
                <Clock className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                45 min
                <span className="mx-1">·</span>
                <Video className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                Google Meet
                <span className="mx-1">·</span>
                Plan PDF
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="service-card-cta cta-shimmer mt-4 w-full text-sm"
                aria-label={`${service.ctaLabel} — ${service.shortName}${service.free ? " (gratis)" : ` desde ${service.price}`}`}
              >
                {service.ctaLabel}
                <ArrowUpRight
                  className="service-card-cta__arrow h-4 w-4"
                  aria-hidden
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

function getDesktopSizeClass(featured: boolean): string {
  if (featured) return "md:col-span-2 lg:col-span-2";
  return "";
}

const ServiceCard = ({
  service,
  onClick,
  featured = false,
  mobile = false,
  revealIndex = 0,
}: ServiceCardProps) => {
  const Icon = service.icon;
  const prefersReducedMotion = useReducedMotion();

  const sizeClass = mobile
    ? "w-[20rem] flex-none snap-start"
    : getDesktopSizeClass(featured);

  // Calcula descuento si hay priceBefore
  const discount = (() => {
    if (!service.priceBefore || service.free) return null;
    const cur = Number(service.price.replace(/\D/g, ""));
    const before = Number(service.priceBefore.replace(/\D/g, ""));
    if (!cur || !before || before <= cur) return null;
    return Math.round(((before - cur) / before) * 100);
  })();

  const authorInitial = service.testimonial?.author?.[0] ?? "";

  /**
   * Reveal cascada — rápido y gratificante, sin cansar la vista.
   * delay máx 240ms (3 cards visibles entran casi simultáneamente),
   * duración 0.4s. Sigue siendo un "unlock" pero sin esperas perceptibles.
   */
  const cascadeDelay = Math.min(revealIndex * 0.04, 0.24);

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 16, scale: 0.98 }
      }
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: cascadeDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative ${sizeClass}`}
    >
      <article
        data-featured={featured ? "true" : undefined}
        className="service-card group relative flex h-full flex-col overflow-hidden p-6 lg:p-7"
        style={{ ["--card-accent" as string]: service.accent }}
      >
        {/* Liquid glass overlays */}
        <span className="liquid-bleed" aria-hidden />
        <span className="liquid-shine" aria-hidden />
        <span className="liquid-edge" aria-hidden />

        {featured && (
          <span
            className="ambient-orb -left-16 -bottom-16 h-52 w-52"
            style={{ background: `rgba(${service.accent}, 0.20)` }}
            aria-hidden
          />
        )}

        {featured && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <filter id={`noise-${service.plan}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#noise-${service.plan})`}
            />
          </svg>
        )}

        {/* === HEADER: icon tile + badge === */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white lg:h-14 lg:w-14"
            style={{
              background: `linear-gradient(135deg, rgb(${service.accent}), rgba(${service.accent}, 0.72))`,
              boxShadow: `0 18px 36px -12px rgba(${service.accent}, 0.6), inset 0 1.5px 0 rgba(255,255,255,0.32), inset 0 -2px 0 rgba(0,0,0,0.20)`,
            }}
            aria-hidden
          >
            <Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.2} />
          </span>

          {service.badge && (
            <span
              className="badge-ios badge-ios--accent shrink-0"
              style={{
                ["--card-accent" as string]: service.accent,
              }}
            >
              {service.badge}
            </span>
          )}
        </div>

        {/* === Title + hook + descripción === */}
        <div className="relative z-10 mt-5 min-w-0">
          <h3
            className={`font-display font-bold leading-[1.06] tracking-tight text-white ${
              featured
                ? "text-[24px] lg:text-[30px]"
                : "text-[19px] lg:text-[22px]"
            }`}
          >
            {service.title}
          </h3>
          <p
            className={`mt-2 leading-snug text-slate-200/90 ${
              featured
                ? "text-[15px] font-medium lg:text-[16px]"
                : "text-[13.5px] font-medium"
            }`}
          >
            {service.hook}
          </p>
          <p
            className="mt-3 max-w-[48ch] text-[13.5px] leading-relaxed text-slate-400 lg:text-[14px]"
            dangerouslySetInnerHTML={{ __html: service.descriptionHtml }}
          />
        </div>

        {/* === Features como pills === */}
        <ul className="relative z-10 mt-5 flex flex-wrap gap-2">
          {service.features.map((f) => (
            <li key={f} className="feature-pill">
              <span className="feature-pill__check" aria-hidden>
                <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* === Testimonial — sólo featured, SIN estrellas === */}
        {featured && service.testimonial && (
          <figure className="relative z-10 mt-6 flex flex-col items-end gap-2.5">
            <blockquote
              className="relative max-w-md rounded-[22px] rounded-br-[8px] border border-white/10 px-4 py-3 text-[13.5px] leading-[1.55] text-slate-100 backdrop-blur-md"
              style={{
                background: `rgba(255, 255, 255, 0.06)`,
                boxShadow: `0 20px 44px -16px rgba(${service.accent}, 0.32), inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
            >
              {service.testimonial.quote}
            </blockquote>
            <figcaption className="flex items-center gap-2 text-[11.5px] font-medium tracking-wide text-slate-400">
              <span className="testimonial-avatar" aria-hidden>
                {authorInitial}
              </span>
              <span className="text-slate-300">
                {service.testimonial.author}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">cliente verificado</span>
            </figcaption>
          </figure>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* === Trust pills (sin estrellas — sólo duración + modalidad + diagnóstico) === */}
        <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2">
          <span className="trust-pill" aria-label="Duración">
            <Clock className="trust-pill__icon" strokeWidth={2.2} aria-hidden />
            45 min
          </span>
          <span className="trust-pill" aria-label="Modalidad">
            <Video className="trust-pill__icon" strokeWidth={2.2} aria-hidden />
            Google Meet
          </span>
          <span
            className="trust-pill"
            aria-label="Plan de acción"
            style={{
              color: `rgb(${service.accent})`,
              borderColor: `rgba(${service.accent}, 0.30)`,
              background: `rgba(${service.accent}, 0.08)`,
            }}
          >
            <FileWarning
              className="trust-pill__icon"
              strokeWidth={2.2}
              aria-hidden
            />
            Plan PDF
          </span>
        </div>

        {/* === Price + CTA === */}
        <div className="price-well relative z-10 mt-4 pt-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {service.free ? "Diagnóstico" : "Desde"}
              </p>
              <div className="mt-1 flex items-end gap-2.5">
                <p
                  className={`price-ticker font-display font-bold leading-none ${
                    service.free
                      ? "bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent"
                      : "text-white"
                  } ${
                    featured
                      ? "text-[34px] lg:text-[42px]"
                      : "text-[26px] lg:text-[32px]"
                  }`}
                >
                  {service.price}
                </p>
                {service.priceBefore && !service.free && (
                  <p className="price-ticker mb-1 text-[12px] font-medium text-slate-500 line-through">
                    {service.priceBefore}
                  </p>
                )}
              </div>
            </div>
            {discount !== null && (
              <span className="price-savings mb-1">−{discount}%</span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="service-card-cta cta-shimmer w-full text-sm"
            aria-label={`${service.ctaLabel} — ${service.shortName}${service.free ? " (gratis)" : ` desde ${service.price}`}`}
          >
            {service.ctaLabel}
            <ArrowUpRight
              className="service-card-cta__arrow h-4 w-4"
              aria-hidden
            />
          </button>
        </div>
      </article>
    </motion.div>
  );
};

export default ServicesSection;
