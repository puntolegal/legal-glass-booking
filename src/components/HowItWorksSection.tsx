import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  ListChecks,
  Video,
  type LucideIcon,
} from "lucide-react";
import BrandWordmark from "@/components/BrandWordmark";
import { useTheme } from "@/hooks/useTheme";

interface Step {
  number: string;
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  accent: string; // RGB triplet
}

/** Acento único tipo iOS / estudio: azul tinta legible (sin arcoíris por paso). */
const STEP_ACCENT = "37 99 235"; // blue-600

const steps: Step[] = [
  {
    number: "01",
    title: "Eliges tu consulta",
    description:
      "Selecciona la especialidad que necesitas — familia, laboral, sucesorio, inmobiliario o empresarial.",
    detail: "Si no estás seguro, te orientamos en segundos.",
    icon: ListChecks,
    accent: STEP_ACCENT,
  },
  {
    number: "02",
    title: "Agendas en 60 segundos",
    description:
      "Reservas día y hora desde tu celular. Pago seguro y confirmación instantánea por mail.",
    detail: "Cancelación gratis hasta 1 hora antes.",
    icon: CalendarCheck,
    accent: STEP_ACCENT,
  },
  {
    number: "03",
    title: "Te conectas por Meet",
    description:
      "45 minutos uno a uno con un abogado especialista. Te entregamos un plan de acción claro y por escrito.",
    detail: "Sin filas, sin oficinas, sin papeleo.",
    icon: Video,
    accent: STEP_ACCENT,
  },
];

const HowItWorksSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="como-funciona"
      className="section-flow relative px-4 py-20 sm:py-24 lg:py-28 scroll-mt-20"
    >
      {/* Bridges — gradientes que conectan visualmente con Hero (arriba) y Services (abajo) */}
      <span className="section-flow__top" aria-hidden />
      <span className="section-flow__bottom" aria-hidden />
      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Wordmark sobrio — solo tipografía, tono institucional de estudio jurídico */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex justify-center"
        >
          <BrandWordmark orientation="inline" />
        </motion.div>

        <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-20">
          <span
            className={`badge-ios ${isDark ? "text-slate-200" : "text-slate-700"}`}
          >
            Tu consulta en 3 pasos
          </span>
          <h2
            className={`font-display mt-6 text-[32px] font-bold leading-[1.04] tracking-tight sm:text-[48px] lg:text-[60px] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <span className={isDark ? "text-white" : "text-slate-950"}>
              Sin filas, sin papeleo,
              <br className="hidden sm:block" />
              sin vueltas innecesarias.
            </span>
          </h2>
          <p
            className={`mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Resuelves tu caso desde donde estés, en tu horario, con un abogado real
            del área que necesitas.
          </p>
        </div>

        {/* Stage 3D — perspective contenedor */}
        <div className="step-stage relative">
          {/* Connector dotted path (solo desktop) */}
          <div className="absolute inset-x-12 top-[58%] hidden md:block">
            <div className="step-connector" aria-hidden />
          </div>

          <div className="relative grid gap-6 md:grid-cols-3 lg:gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={
                    prefersReducedMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 24,
                          rotateX: -6,
                        }
                  }
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -8,
                          rotateX: 2,
                          transition: {
                            type: "spring",
                            stiffness: 280,
                            damping: 22,
                          },
                        }
                  }
                  className="step-card relative flex flex-col overflow-hidden p-7 lg:p-8"
                  style={{ ["--card-accent" as string]: step.accent }}
                >
                  {/* Liquid glass overlays — alineados con el sistema de service-card */}
                  <span className="liquid-bleed" aria-hidden />
                  <span className="liquid-shine" aria-hidden />
                  <span className="liquid-edge" aria-hidden />

                  <span
                    className="ambient-orb -right-12 -top-12 h-44 w-44"
                    style={{ background: `rgba(${step.accent}, 0.12)` }}
                    aria-hidden
                  />
                  <span
                    className="ambient-orb -left-10 -bottom-10 h-36 w-36"
                    style={{ background: `rgba(${step.accent}, 0.06)` }}
                    aria-hidden
                  />

                  {/* Numero gigante de fondo — gradiente + más prominente */}
                  <span className="step-numeral absolute -right-2 -top-4 z-0">
                    {step.number}
                  </span>

                  {/* Header: icon tile 3D ampliado + step label premium */}
                  <div className="relative z-10 mb-10 flex items-start justify-between gap-3">
                    <div className="step-icon-tile" aria-hidden>
                      <Icon className="h-7 w-7" strokeWidth={2.2} />
                    </div>
                    <span className="step-label step-label--cta">
                      Paso {step.number}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="relative z-10 mt-auto">
                    <h3
                      className={`font-display text-[22px] font-bold leading-[1.15] tracking-tight lg:text-[26px] ${
                        isDark ? "text-slate-50" : "text-slate-900"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`mt-3 text-[14.5px] leading-relaxed ${
                        isDark ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {step.description}
                    </p>
                    <p
                      className={`mt-4 flex items-center gap-2 text-[12.5px] font-medium ${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                          isDark ? "bg-slate-300 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "bg-slate-500/80"
                        }`}
                        aria-hidden
                      />
                      <span>{step.detail}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <p
          className={`mt-12 text-center text-[12px] uppercase tracking-[0.2em] ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Tiempo promedio de agendamiento ·{" "}
          <span className={isDark ? "text-slate-100" : "text-slate-800"}>2 minutos</span>
        </p>
      </div>
    </section>
  );
};

export default HowItWorksSection;
