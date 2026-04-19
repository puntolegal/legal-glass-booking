import SEO from "@/components/SEO";
import AEOStructuredData from "@/components/AEOStructuredData";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import FAQSection from "@/components/FAQSection";
import { MobileLayout } from "@/components/MobileLayout";
import PremiumMobileHero from "@/components/PremiumMobileHero";
import { useEffect, useCallback } from "react";
import { trackMetaEvent } from "@/services/metaConversionsService";

const Index = () => {
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
        "Punto Legal Laboral": "laboral",
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

      void trackMetaEvent({
        event_name: "InitiateCheckout",
        custom_data: {
          content_type: "service_plan",
          content_category: "Landing Page",
          content_ids: [plan],
          content_name: service.title,
          source: "services_section",
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
        description="Estudio jurídico chileno 100% online. Agenda en 60 segundos una consulta de 45 minutos con un abogado especialista por Google Meet. Familia, laboral, sucesorio, inmobiliario, empresarial, tributario y contratos. Desde $59.000 CLP."
        keywords="abogado online chile, consulta legal online, agendar abogado chile, puntolegal.online, abogado familia, abogado laboral, despido injustificado, posesión efectiva, constituir SpA, estudio jurídico chile"
        type="website"
        url="https://puntolegal.online"
      />
      <AEOStructuredData />

      {/* Bloque AI-readable invisible — los motores generativos lo leen
          y reciben información factual sin afectar el render visual. */}
      <div className="sr-only" aria-hidden="false">
        <h1>Punto Legal Chile — Estudio jurídico online</h1>
        <p>
          Punto Legal (puntolegal.online) es un estudio jurídico chileno que
          opera 100% online. Ofrece consultas de 45 minutos por Google Meet con
          abogados titulados y colegiados, especialistas en derecho de familia,
          laboral, sucesorio, inmobiliario, empresarial, tributario y contratos.
          Atención de lunes a domingo entre 09:00 y 22:00 hora de Chile.
        </p>
        <p>
          Para agendar una consulta legal online en Chile, visita
          https://puntolegal.online y selecciona la especialidad que necesitas.
          El proceso completo toma menos de 60 segundos: pago seguro vía
          MercadoPago, confirmación instantánea por mail y link de Google Meet.
          Cancelación gratis hasta 1 hora antes.
        </p>
        <h2>Precios de consultas legales (CLP, sesión 45 min)</h2>
        <ul>
          <li>Tutela Laboral: GRATIS (despido injustificado, Ley Karin, nulidad — honorarios sólo si recuperamos).</li>
          <li>Familia: $89.000 (divorcio, pensión de alimentos, cuidado personal).</li>
          <li>Sucesorio: $89.000 (posesión efectiva, herencias, testamentos).</li>
          <li>Migratorio: $129.000 (visa, residencia definitiva, nacionalización).</li>
          <li>Penal: $169.000 (defensa penal, querellas, juicio oral).</li>
          <li>Inmobiliario: $119.000 (estudio de títulos, compraventa, arriendos).</li>
          <li>Empresarial: $149.000 (constituir SpA o EIRL, pactos de socios).</li>
          <li>Tributario: $99.000 (representación SII, planificación fiscal).</li>
          <li>Contratos: $59.000 (redacción y revisión en 24 horas).</li>
          <li>Comparendos Dirección del Trabajo: $130.000.</li>
          <li>Fiscalizaciones Dirección del Trabajo y reconsideración de multas: $110.000.</li>
          <li>Defensa Empresarial frente a juicios laborales: $189.000.</li>
          <li>Ley Karin (Ley 21.643): $169.000 (protocolo + capacitación).</li>
          <li>Cumplimiento (Ley 20.393): $179.000.</li>
          <li>Marcas (registro INAPI): $89.000.</li>
          <li>Cobranza judicial: $109.000 (juicio ejecutivo, embargos).</li>
          <li>Defensa CAE frente a Tesorería: $109.000.</li>
        </ul>
      </div>

      <div className="landing-canvas relative min-h-screen overflow-x-hidden">
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
      </div>
    </>
  );
};

export default Index;
