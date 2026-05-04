import SEO from "@/components/SEO";
import AEOStructuredData from "@/components/AEOStructuredData";
import {
  PUNTO_LEGAL_DOMICILIO_LINE,
  PUNTO_LEGAL_FOUNDER_STATEMENT,
  PUNTO_LEGAL_PUBLIC_AUTHOR,
} from "@/constants/brandIdentity";
import { DEFAULT_OG_IMAGE } from "@/config/siteUrl";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import FAQSection from "@/components/FAQSection";
import { MobileLayout } from "@/components/MobileLayout";
import PremiumMobileHero from "@/components/PremiumMobileHero";
import { useEffect, useCallback } from "react";
import { trackMetaEvent } from "@/services/metaConversionsService";
import { useTheme } from "@/hooks/useTheme";
import { LandingThemeToggle } from "@/components/landing/LandingThemeToggle";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    trackMetaEvent({
      event_name: "ViewContent",
      custom_data: {
        content_name: "Punto Legal - Inicio",
        content_category: "Landing Page",
      },
    });
  }, []);

  const handleServiceSelect = useCallback(
    (service: {
      title: string;
      promoPrice?: string;
      price?: string;
      plan?: string;
    }) => {
      // Mapeo título → slug. La tarjeta también puede entregar `plan` directo
      // (ServicesSection lo hace), en cuyo caso lo respetamos sin hacer lookup.
      const serviceMap: { [key: string]: string } = {
        // ===== Personas =====
        "Punto Legal Tutela Laboral": "tutela-laboral",
        /** Cluster landing — CTA principal diagnóstico; usar `plan` del handler cuando exista */
        "Punto Legal Laboral": "tutela-laboral",
        "Punto Legal Laboral — Diagnóstico gratis": "tutela-laboral",
        "Punto Legal Laboral — Consulta": "laboral",
        "Punto Legal Familia": "familia",
        "Punto Legal Sucesorio": "sucesorio",
        "Punto Legal Migratorio": "migratorio",
        "Punto Legal Penal": "penal",
        "Punto Legal Penal Económico": "penal-economico",

        // ===== Empresas =====
        "Punto Legal Empresarial": "empresarial",
        "Punto Legal Tributario": "tributario",
        "Punto Legal Contratos": "contratos",
        "Punto Legal Comparendos": "comparendos",
        "Punto Legal Fiscalizaciones DT": "fiscalizaciones-dt",
        "Punto Legal Defensa Empresarial": "defensa-laboral-empresarial",
        "Punto Legal Ley Karin": "ley-karin",
        "Punto Legal Cumplimiento": "cumplimiento",
        "Punto Legal Compliance": "cumplimiento",
        "Punto Legal Marcas": "marcas",
        "Punto Legal Propiedad Intelectual": "marcas",
        // Alto ticket empresarial
        "Punto Legal Constitución Empresarial": "constitucion-empresarial",
        "Punto Legal Reestructuración": "reestructuracion",
        "Punto Legal Holding Patrimonial": "holding-patrimonial",
        "Punto Legal Gestión Patrimonial": "gestion-patrimonial",
        "Punto Legal Despido Empresas": "despido-empresa",
        // Penal económico
        "Punto Legal Delitos Económicos": "delitos-economicos",

        // ===== Patrimonio =====
        "Punto Legal Inmobiliario": "inmobiliario",
        "Punto Legal Cobranza": "cobranza",
        "Punto Legal Defensa CAE": "cae-tesoreria",

        // ===== Otros / legacy =====
        "Punto Legal Administración Pública": "administracion-publica",
        "Punto Legal Consumidor": "consumidor",
        "Punto Legal Corporativo": "corporativo",
        "Punto Legal Express": "contratos",
        "Punto Legal Sociedades": "empresarial",
        "Punto Legal Protección de Datos": "cumplimiento",
        "Punto Legal Digital": "consumidor",
      };

      const plan = service.plan || serviceMap[service.title] || "general";

      // Enviar el precio real del servicio para que Meta calcule ROAS correcto.
      // El helper (ensureValueAndCurrency) normaliza el string "$89.000" → 89000
      // y añade currency "CLP" automáticamente si no se provee.
      const rawPrice = service.promoPrice || service.price;

      void trackMetaEvent({
        event_name: "InitiateCheckout",
        custom_data: {
          content_type: "service_plan",
          content_category: "Landing Page",
          content_ids: [plan],
          content_name: service.title,
          source: "services_section",
          value: rawPrice, // coerced a number por el helper
          currency: "CLP",
        },
      });

      window.location.href = `/agendamiento?plan=${plan}`;
    },
    []
  );

  const landingSections = (
    <>
      <HowItWorksSection />
      <ServicesSection onAgendarClick={handleServiceSelect} />
      <FAQSection />
    </>
  );

  return (
    <>
      <SEO
        title="Punto Legal Chile — Consulta legal online por Google Meet"
        description="Estudio jurídico chileno en línea. El Golf, Las Condes, Santiago: consultas 100% online por Google Meet. Agenda en 60 segundos, 45 min con especialista. Familia, laboral, sucesorio, inmobiliario, empresarial, tributario, contratos. Desde $59.000 CLP."
        keywords="abogado online chile, abogado Las Condes, El Golf, consulta legal online, agendar abogado chile, puntolegal.online, abogado familia, abogado laboral, despido injustificado, posesión efectiva, constituir SpA, estudio jurídico chile"
        image={DEFAULT_OG_IMAGE}
        author={PUNTO_LEGAL_PUBLIC_AUTHOR}
        type="website"
        url="https://puntolegal.online"
      />
      <AEOStructuredData />

      {/* Bloque AI-readable invisible — los motores generativos lo leen
          y reciben información factual sin afectar el render visual. */}
      <div className="sr-only" aria-hidden="false">
        <h1>Punto Legal Chile — Estudio jurídico online en Las Condes, Santiago</h1>
        <p>
          {PUNTO_LEGAL_DOMICILIO_LINE} Punto Legal (puntolegal.online) ofrece
          consultas de 45 minutos por Google Meet con abogados titulados y
          colegiados en familia, laboral, sucesorio, inmobiliario, empresarial,
          tributario y contratos. Atención de lunes a domingo 09:00 a 22:00 hora
          de Chile.
        </p>
        <p>{PUNTO_LEGAL_FOUNDER_STATEMENT}</p>
        <p>
          Para agendar una consulta legal online en Chile, visita
          https://puntolegal.online y selecciona la especialidad que necesitas.
          El proceso completo toma menos de 60 segundos: pago seguro vía
          MercadoPago, confirmación instantánea por mail y link de Google Meet.
          Cancelación gratis hasta 1 hora antes.
        </p>
        <h2>Precios de consultas legales (CLP, sesión 45 min)</h2>
        <ul>
          <li>Defensa CAE frente a Tesorería: $109.000 (antes $169.000 — producto estrella).</li>
          <li>Laboral (trabajadores): diagnóstico inicial sin costo cuando aplica; evaluación despido y finiquito sin costo cuando aplica; defensa Ley Karin (trabajador) $79.000; comparendo RM desde $35.000 según plan (honorarios a porcentaje sólo con acuerdo escrito si asumimos el caso).</li>
          <li>Familia: $89.000 (divorcio, pensión de alimentos, cuidado personal).</li>
          <li>Sucesorio: $89.000 (posesión efectiva, herencias, testamentos).</li>
          <li>Migratorio: $129.000 (visa, residencia definitiva, nacionalización).</li>
          <li>Penal: $169.000 (defensa penal general, querellas, juicio oral).</li>
          <li>Delitos Económicos (Ley 21.595): $290.000 (fraude, lavado, administración desleal).</li>
          <li>Inmobiliario: $119.000 (estudio de títulos, compraventa, arriendos).</li>
          <li>Empresarial: $149.000 (constituir SpA o EIRL, pactos de socios).</li>
          <li>Constitución Empresarial avanzada: $229.000 (Sociedad Anónima, estructuras complejas).</li>
          <li>Reestructuración societaria: $290.000 (fusión, escisión, transformación).</li>
          <li>Holding Patrimonial familiar o empresarial: $350.000.</li>
          <li>Gestión Patrimonial mensual: $390.000/mes (abogado dedicado, 5 horas incluidas).</li>
          <li>Despido Empresas — asesoría preventiva: $149.000.</li>
          <li>Tributario: $99.000 (representación SII, planificación fiscal).</li>
          <li>Contratos: $59.000 (redacción y revisión en 24 horas).</li>
          <li>Comparendos Dirección del Trabajo: $130.000.</li>
          <li>Fiscalizaciones Dirección del Trabajo y reconsideración de multas: $110.000.</li>
          <li>Defensa Empresarial frente a juicios laborales: $189.000.</li>
          <li>Ley Karin (Ley 21.643) — empresa, protocolo y capacitación: $169.000.</li>
          <li>Defensa Ley Karin (trabajador, Ley 21.643): $79.000 (sesión y plan por escrito).</li>
          <li>Cumplimiento (Ley 20.393): $179.000.</li>
          <li>Marcas (registro INAPI): $89.000.</li>
          <li>Cobranza judicial: $109.000 (juicio ejecutivo, embargos).</li>
        </ul>
      </div>

      <div className="landing-canvas relative min-h-screen overflow-x-hidden pb-[max(5.25rem,env(safe-area-inset-bottom,0px)+4.5rem)] lg:pb-10">
        <div className="hidden lg:block">
          <HeroSection
            showForm={false}
            setShowForm={() => {}}
            servicePrice={null}
            serviceName="Asesoría profesional"
          />
          {landingSections}
        </div>

        <div className="lg:hidden relative">
          <MobileLayout>
            <PremiumMobileHero />
            {landingSections}
          </MobileLayout>
        </div>
        {/* Último en el canvas: queda por encima del contenido móvil (z-100) — claro/oscuro en todos los breakpoints */}
        <LandingThemeToggle mode={theme} onToggle={toggleTheme} />
      </div>
    </>
  );
};

export default Index;
