import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  Award,
  Calendar,
  Compass,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { trackMetaEvent } from "@/services/metaConversionsService";
import { scrollToVisibleAnchor } from "@/lib/scroll";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showForm?: boolean;
  setShowForm?: (show: boolean) => void;
  servicePrice?: string | null;
  serviceName?: string;
}

/**
 * Stagger orquestado — rápido pero ordenado.
 * Sensación gratificante sin esperas que cansen la vista.
 * Total: ~600ms desde el primer elemento hasta el último.
 */
const STAGGER: Record<string, number> = {
  badge: 0,
  title: 0.05,
  subtitle: 0.12,
  desc: 0.20,
  ctas: 0.28,
  microcopy: 0.38,
  trust: 0.32,
};

const HeroSection = ({
  title = "Tu abogado especialista,",
  subtitle = "online y en minutos.",
}: HeroSectionProps) => {
  const prefersReducedMotion = useReducedMotion();

  const goToServices = () => {
    void trackMetaEvent({
      event_name: "InitiateCheckout",
      custom_data: {
        content_type: "service_plan",
        content_category: "Landing Page",
        content_ids: ["picker"],
        content_name: "Hero — Ver consultas",
        source: "hero_desktop",
      },
    });
    // Helper resiliente ante IDs duplicados (el landing renderiza las
    // secciones en dos contenedores: hidden lg:block + lg:hidden).
    scrollToVisibleAnchor("servicios");
  };

  const goToHowItWorks = () => {
    scrollToVisibleAnchor("como-funciona");
  };

  /** Helper: motion props con stagger según la key */
  const reveal = (key: keyof typeof STAGGER) =>
    prefersReducedMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.45,
            delay: STAGGER[key],
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          },
        };

  return (
    <section
      id="inicio"
      className="section-flow relative flex min-h-[72vh] items-center justify-start px-6 pt-28 pb-20 sm:px-10 lg:min-h-[68vh] lg:px-16 lg:pb-24"
    >
      {/* Bridge inferior — gradiente que se "derrama" hacia HowItWorks */}
      <span className="section-flow__bottom" aria-hidden />
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Status pill — pulso verde "vivo hoy" */}
            <motion.span
              {...reveal("badge")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Atención hoy · 09:00 a 22:00 · Cupos limitados
            </motion.span>

            {/* Headline en dos líneas con gradient distinto por línea (foco visual) */}
            <h1 className="font-display mt-6 text-[44px] font-bold leading-[0.96] tracking-tight text-white sm:text-[64px] lg:text-[84px]">
              <motion.span
                {...reveal("title")}
                className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent"
              >
                {title}
              </motion.span>
              <motion.span
                {...reveal("subtitle")}
                className="mt-1 block bg-gradient-to-r from-blue-300 via-cyan-200 to-sky-100 bg-clip-text text-transparent"
              >
                {subtitle}
              </motion.span>
            </h1>

            <motion.p
              {...reveal("desc")}
              className="mt-7 max-w-[58ch] text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              45 minutos por Google Meet con un abogado especialista en tu caso.
              Diagnóstico, estrategia y un{" "}
              <strong className="text-white">plan de acción claro</strong>. Sin
              filas, sin trámites confusos, sin sorpresas en la cuenta.
            </motion.p>

            {/* CTAs — primario (agendar) + secundario (cómo funciona, scroll a 3 pasos) */}
            <motion.div
              {...reveal("ctas")}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={goToServices}
                className="cta-hero cta-hero--primary"
              >
                <Calendar className="h-5 w-5" aria-hidden />
                <span>Ver consultas y agendar</span>
                <ArrowDown
                  className="cta-hero__arrow h-4 w-4 opacity-80"
                  aria-hidden
                />
              </button>

              <button
                type="button"
                onClick={goToHowItWorks}
                className="cta-hero cta-hero--ghost"
                aria-label="Ver cómo funciona el proceso en 3 pasos"
              >
                <Compass className="h-5 w-5" aria-hidden />
                <span>Cómo funciona</span>
              </button>
            </motion.div>

            <motion.p
              {...reveal("microcopy")}
              className="mt-5 text-[11.5px] uppercase tracking-[0.18em] text-slate-500"
            >
              Pago seguro · Cancelación gratis · Especialistas certificados
            </motion.p>
          </div>

          {/* Columna derecha: solo teléfono. Las stats van en fila ancha debajo (PC: textos legales largos). */}
          <div className="relative lg:col-span-4">
            <FloatingPhone />
          </div>

          <motion.div
            {...reveal("trust")}
            className="institutional-stat-row mt-8 grid min-w-0 grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4 lg:col-span-12 lg:mt-4"
          >
            <InstitutionalStat
              value="Abogados"
              label="De Chile"
              note="Titulados y colegiados"
              delay={0}
            />
            <InstitutionalStat
              value="Ética"
              label="Profesional"
              note="Código del Colegio de Abogados"
              delay={0.08}
            />
            <InstitutionalStat
              value="Secreto"
              label="Profesional"
              note="Confidencialidad garantizada"
              delay={0.16}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/**
 * Phone illustration 3D flotando con animación de "levitación" suave.
 * La imagen debe colocarse en /public/hero-phone-3d.png (PNG con fondo
 * transparente). Si la imagen no existe, el componente degrada
 * silenciosamente sin romper el layout.
 */
const FloatingPhone = () => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="floating-phone-stage">
      {/* Glow radial detrás de la imagen — sutil halo cyan */}
      <div className="floating-phone-glow" aria-hidden />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.95 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: [0, -10, 0],
                scale: 1,
                rotate: [-1.2, 1.2, -1.2],
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.45 }
            : {
                opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                y: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        className="floating-phone-img"
      >
        <img
          src="/hero-phone-3d.png"
          alt="Aplicación móvil de Punto Legal con perfil de abogado y reseñas"
          loading="eager"
          decoding="async"
          draggable={false}
          onError={(e) => {
            (e.currentTarget.parentElement as HTMLElement).style.display = "none";
          }}
        />
      </motion.div>
    </div>
  );
};

/** Stat institucional — dark glass coherente con la paleta del landing.
 *  Comunica atributos de marca (Abogados · Ética · Secreto) sin recurrir
 *  a cifras ni a citas legales imprecisas. */
const InstitutionalStat = ({
  value,
  label,
  note,
  delay = 0,
}: {
  value: string;
  label: string;
  note: string;
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: STAGGER.trust + delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -3,
              transition: {
                type: "spring",
                stiffness: 320,
                damping: 22,
              },
            }
      }
      className="institutional-stat institutional-stat--hero min-w-0 h-full"
    >
      <span className="institutional-stat__value">{value}</span>
      <span className="institutional-stat__label">{label}</span>
      <span className="institutional-stat__note">{note}</span>
    </motion.div>
  );
};

/** (Legacy) Chip de confianza con micro-spring al hover.
 *  Conservado por si otras páginas lo reutilizan. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TrustChip = ({
  icon: Icon,
  value,
  label,
  delay = 0,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: STAGGER.trust + delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -4,
              transition: {
                type: "spring",
                stiffness: 320,
                damping: 22,
              },
            }
      }
      className="trust-chip glass-ios-card-dark group flex flex-col items-start gap-1.5 p-4"
    >
      <Icon className="h-4 w-4 text-cyan-300 transition-colors group-hover:text-cyan-200" />
      <span className="font-display text-xl font-bold leading-none text-white sm:text-2xl">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
    </motion.div>
  );
};

export default HeroSection;
