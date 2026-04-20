import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  Landmark,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";
import { trackMetaEvent } from "@/services/metaConversionsService";
import { serviceThemes } from "@/config/serviceThemes";

type MobileService = {
  id: string;
  name: string;
  description: string;
  plan: string;
  price: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  gradient: string;
    accent: string;
};

const services: MobileService[] = [
  {
    id: "general",
    name: "Consulta General",
    description: "Diagnóstico legal inicial para definir estrategia y próximos pasos.",
    plan: "general",
    price: "$35.000",
    icon: Scale,
    highlights: ["Análisis de tu caso", "Plan de acción claro", "Sesión por Google Meet"],
    gradient: serviceThemes.general.gradient,
    accent: serviceThemes.general.accent,
  },
  {
    id: "familia",
    name: "Consulta Familia",
    description: "Divorcio, pensiones y acuerdos parentales con enfoque humano.",
    plan: "familia",
    price: "$35.000",
    icon: Heart,
    highlights: ["Divorcios y cuidado personal", "Pensiones", "Mediación estratégica"],
    gradient: serviceThemes.familia.gradient,
    accent: serviceThemes.familia.accent,
  },
  {
    id: "laboral",
    name: "Consulta Laboral",
    description: "Despidos, tutela de derechos, Ley Karin y negociación.",
    plan: "laboral",
    price: "$30.000",
    icon: Shield,
    highlights: ["Despido injustificado", "Tutela laboral", "Ley Karin"],
    gradient: serviceThemes.laboral.gradient,
    accent: serviceThemes.laboral.accent,
  },
  {
    id: "inmobiliario",
    name: "Consulta Inmobiliaria",
    description: "Compraventa, arriendos y revisión jurídica de inmuebles.",
    plan: "inmobiliario",
    price: "$45.000",
    icon: Landmark,
    highlights: ["Estudio de títulos", "Compraventa segura", "Contratos de arriendo"],
    gradient: serviceThemes.general.gradient,
    accent: serviceThemes.general.accent,
  },
  {
    id: "corporativo",
    name: "Consulta Empresarial",
    description: "Constitución de empresas, pactos y decisiones societarias.",
    plan: "corporativo",
    price: "$45.000",
    icon: Building2,
    highlights: ["Constitución SpA/EIRL", "Pactos de socios", "Prevención de riesgos"],
    gradient: serviceThemes.general.gradient,
    accent: serviceThemes.general.accent,
  },
  {
    id: "contratos",
    name: "Consulta Contratos",
    description: "Redacción y validación legal de contratos y anexos.",
    plan: "contratos",
    price: "$15.000",
    icon: FileText,
    highlights: ["Contratos civiles", "Contratos comerciales", "Cláusulas críticas"],
    gradient: serviceThemes.general.gradient,
    accent: serviceThemes.general.accent,
  },
];

export const PremiumServiceSelector: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, [-180, 180], [-8, 8]);
  const opacity = useTransform(dragX, [-180, 0, 180], [0.82, 1, 0.82]);
  const selectedService = services[selectedIndex];

  const quickPills = useMemo(() => services.slice(0, 4), []);

  const handleServiceChange = (direction: "prev" | "next") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedIndex((prev) =>
      direction === "next" ? (prev + 1) % services.length : (prev - 1 + services.length) % services.length
    );
    setTimeout(() => setIsAnimating(false), 260);
  };

  const handleAgendarClick = () => {
    void trackMetaEvent({
      event_name: "InitiateCheckout",
      custom_data: {
        content_type: "service_plan",
        content_category: "Landing Page",
        content_ids: [selectedService.plan],
        content_name: selectedService.name,
        source: "mobile_service_selector",
        // value + currency: el helper coerce el string "$35.000" → 35000 automáticamente
        value: selectedService.price,
        currency: "CLP",
      },
    });
    navigate(`/agendamiento?plan=${selectedService.plan}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-md px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${selectedService.accent}2b, transparent 60%)`,
        }}
      />

      <motion.div
        className="glass-ios-panel-dark relative overflow-hidden shadow-2xl"
        style={{ 
          rotateY,
          opacity,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.x > 85 || velocity.x > 220) {
            handleServiceChange("prev");
          } else if (offset.x < -85 || velocity.x < -220) {
            handleServiceChange("next");
          }
          dragX.set(0);
        }}
      >
        <div className="relative space-y-5 p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-sky-300">
              Servicios de consulta
            </span>
            <span className="text-xs text-slate-400">
              {selectedIndex + 1}/{services.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPills.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedIndex(services.findIndex((candidate) => candidate.id === service.id))}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  service.id === selectedService.id
                    ? "border-sky-400/40 bg-sky-500/15 text-sky-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200"
                }`}
              >
                {service.name.replace("Consulta ", "")}
              </button>
            ))}
        </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.32 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0" style={{ background: selectedService.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-transparent" />
                  <div className="relative flex h-full w-full items-center justify-center text-white">
                    <selectedService.icon className="h-7 w-7" />
                  </div>
                    </div>
                    
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-100">{selectedService.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">{selectedService.description}</p>
                    </div>
              </div>

              <div className="space-y-2">
                {selectedService.highlights.map((highlight) => (
                  <div key={highlight} className="glass-ios-card-dark flex items-center gap-2 px-3 py-2.5">
                    <Sparkles className="h-4 w-4 text-sky-400" />
                    <span className="text-sm text-slate-200">{highlight}</span>
                    </div>
                ))}
              </div>

              <div className="glass-ios-card-dark p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Valor de la consulta</p>
                <p className="mt-1 text-3xl font-bold text-slate-100">{selectedService.price}</p>
                <p className="mt-1 text-xs text-slate-400">Sesión de 45 minutos por Google Meet</p>
                  </div>
                  
              <button
                onClick={handleAgendarClick}
                className="cta-primary w-full py-3.5 text-sm"
              >
                <Calendar className="h-4 w-4" />
                Agendar {selectedService.name.replace("Consulta ", "")}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-2 right-2 flex items-center justify-between">
          <button
            onClick={() => handleServiceChange("prev")}
            disabled={isAnimating}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-200 backdrop-blur-xl hover:bg-slate-800/70"
            aria-label="Servicio anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleServiceChange("next")}
            disabled={isAnimating}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-200 backdrop-blur-xl hover:bg-slate-800/70"
            aria-label="Siguiente servicio"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <div className="mt-4 flex justify-center">
        <div className="glass-ios-panel-dark rounded-full px-4 py-1.5 text-xs text-slate-300">
          Desliza para explorar todos los servicios
        </div>
      </div>
    </div>
  );
};

export default PremiumServiceSelector;
