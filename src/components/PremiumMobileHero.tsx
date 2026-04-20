import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Compass } from "lucide-react";

/** Stat institucional estilo papel — mobile.
 *  Versión compacta del PaperStat del desktop, con tipografía ajustada. */
const PaperStat: React.FC<{
  value: string;
  label: string;
  note?: string;
}> = ({ value, label, note }) => (
  <div className="paper-stat paper-stat--compact">
    <span className="paper-stat__value">{value}</span>
    <span className="paper-stat__label">{label}</span>
    {note && <span className="paper-stat__note">{note}</span>}
  </div>
);

export const PremiumMobileHero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const skipEnter = prefersReducedMotion === true;

  const scrollToServices = () => {
    document
      .getElementById("servicios")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("como-funciona")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative px-4 pt-10 pb-8 text-slate-100">
      <motion.div
        initial={skipEnter ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-md"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-slate-200">
            Atención hoy · 09:00 a 22:00
          </span>
        </div>

        <h1 className="font-display text-[34px] leading-[1.02] font-bold tracking-tight text-white">
          Tu abogado especialista,
          <br />
          <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-sky-100 bg-clip-text text-transparent">
            online y en minutos.
          </span>
        </h1>

        <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-slate-300">
          45 minutos por Google Meet con un experto en tu caso. Diagnóstico,
          estrategia y un{" "}
          <strong className="text-white">plan de acción claro</strong>.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={scrollToServices}
            className="cta-hero cta-hero--primary w-full justify-center py-3.5 text-[15px]"
          >
            <span>Ver consultas y agendar</span>
            <ArrowDown
              className="cta-hero__arrow h-4 w-4 opacity-80"
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={scrollToHowItWorks}
            className="cta-hero cta-hero--ghost w-full justify-center py-3 text-[14px]"
            aria-label="Ver cómo funciona el proceso en 3 pasos"
          >
            <Compass className="h-4 w-4" aria-hidden />
            <span>Cómo funciona</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <PaperStat
            value="+1.200"
            label="Consultas"
            note="desde 2023"
          />
          <PaperStat
            value="4,9"
            label="Satisfacción"
            note="de 5,0"
          />
          <PaperStat
            value="Secreto"
            label="Profesional"
            note="Art. 231 COT"
          />
        </div>

        <p className="mt-5 text-center text-[10.5px] uppercase tracking-[0.18em] text-slate-500">
          Pago seguro · Cancelación hasta 1 hora antes
        </p>
      </motion.div>
    </section>
  );
};

export default PremiumMobileHero;
