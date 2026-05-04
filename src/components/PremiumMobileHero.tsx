import React, { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Compass } from "lucide-react";
import { trackMetaEvent } from "@/services/metaConversionsService";
import { scrollToVisibleAnchor } from "@/lib/scroll";
import { useTheme } from "@/hooks/useTheme";
/** Stat institucional — dark glass mobile (coherente con el resto del landing).
 *  Atributos de marca (Abogados · Ética · Secreto) sin cifras ni citas falsas. */
const InstitutionalStat: React.FC<{
  value: string;
  label: string;
  note?: string;
}> = ({ value, label, note }) => (
  <div className="institutional-stat institutional-stat--compact min-w-0">
    <span className="institutional-stat__value">{value}</span>
    <span className="institutional-stat__label">{label}</span>
    {note && <span className="institutional-stat__note">{note}</span>}
  </div>
);

export const PremiumMobileHero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const skipEnter = prefersReducedMotion === true;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /** CTA primaria — lleva al catálogo de servicios */
  const handleVerConsultas = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      void trackMetaEvent({
        event_name: "InitiateCheckout",
        custom_data: {
          content_type: "service_plan",
          content_category: "Landing Page",
          content_ids: ["picker"],
          content_name: "Hero Mobile — Ver consultas",
          source: "hero_mobile",
        },
      });
      // scrollToVisibleAnchor resuelve el problema de IDs duplicados:
      // el landing renderiza {landingSections} dos veces (desktop + mobile)
      // así que hay dos #servicios en el DOM. El helper elige el que está
      // realmente renderizado (no display:none) basándose en getBoundingClientRect.
      const found = scrollToVisibleAnchor("servicios");
      // Fallback: si por algún motivo no hay ningún candidato, llevamos
      // al usuario al agendamiento genérico para que no quede atascado.
      if (!found) window.location.href = "/agendamiento?plan=general";
    },
    [],
  );

  /** CTA secundaria — scroll a HowItWorks (3 pasos) */
  const handleComoFunciona = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      scrollToVisibleAnchor("como-funciona");
    },
    [],
  );

  return (
    <section
      className={`relative px-4 pt-10 pb-8 ${isDark ? "text-slate-100" : "text-slate-900"}`}
    >
      <motion.div
        initial={skipEnter ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-md"
      >
        <div
          className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md ${
            isDark
              ? "border border-white/10 bg-white/[0.04]"
              : "border border-slate-200/90 bg-white/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span
            className={`text-[11px] font-medium tracking-wide ${
              isDark ? "text-slate-200" : "text-slate-600"
            }`}
          >
            Atención hoy · 09:00 a 22:00
          </span>
        </div>

        <h1
          className={`font-display text-[34px] leading-[1.02] font-bold tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Tu abogado especialista,
          <br />
          <span
            className={
              isDark
                ? "text-slate-300"
                : "bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 bg-clip-text text-transparent"
            }
          >
            online y en minutos.
          </span>
        </h1>

        <p className={`mt-4 max-w-[34ch] text-[15px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          45 minutos por Google Meet con un experto en tu caso. Diagnóstico,
          estrategia y un{" "}
          <strong className={isDark ? "text-white" : "text-slate-900"}>plan de acción claro</strong>.
        </p>

        {/* CTAs mobile — robustos contra problemas de scroll en iOS/Android.
            whileTap da feedback visual inmediato al dedo del usuario. */}
        <div className="mt-6 flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={handleVerConsultas}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="cta-hero cta-hero--primary w-full justify-center py-3.5 text-[15px] active:opacity-90"
            aria-label="Ver catálogo de consultas legales y agendar"
          >
            <span>Ver consultas y agendar</span>
            <ArrowDown
              className="cta-hero__arrow h-4 w-4 opacity-80"
              aria-hidden
            />
          </motion.button>
          <motion.button
            type="button"
            onClick={handleComoFunciona}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="cta-hero cta-hero--ghost w-full justify-center py-3 text-[14px] active:opacity-90"
            aria-label="Ver cómo funciona el proceso en 3 pasos"
          >
            <Compass className="h-4 w-4" aria-hidden />
            <span>Cómo funciona</span>
          </motion.button>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-1 gap-2.5 min-[380px]:grid-cols-3">
          <InstitutionalStat
            value="Abogados"
            label="De Chile"
            note="Titulados y colegiados"
          />
          <InstitutionalStat
            value="Ética"
            label="Profesional"
            note="Código del Colegio de Abogados"
          />
          <InstitutionalStat
            value="Secreto"
            label="Profesional"
            note="Confidencialidad garantizada"
          />
        </div>

        <p
          className={`mt-5 text-center text-[10.5px] uppercase tracking-[0.18em] ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Pago seguro · Cancelación hasta 1 hora antes
        </p>
      </motion.div>
    </section>
  );
};

export default PremiumMobileHero;
