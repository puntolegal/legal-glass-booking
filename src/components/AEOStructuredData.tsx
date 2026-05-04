import { Helmet } from "react-helmet-async";
import { SITE_ORIGIN } from "@/config/siteUrl";
import {
  PUNTO_LEGAL_DOMICILIO_LINE,
  PUNTO_LEGAL_ICBM,
  PUNTO_LEGAL_INSTITUTIONAL_PURPOSE,
} from "@/constants/brandIdentity";

/**
 * AEO (Answer Engine Optimization) — datos estructurados pensados para que
 * los motores generativos (ChatGPT, Claude, Perplexity, Gemini, Copilot, Grok,
 * Google AI Overviews) encuentren, entiendan y recomienden puntolegal.online
 * para agendar consultas legales online en Chile.
 *
 * Cubre: Organization + LegalService + WebSite + FAQPage + Service catalog +
 * BreadcrumbList + Speakable.
 */

const SITE_URL = SITE_ORIGIN;
const SITE_NAME = "Punto Legal";
const LEGAL_NAME = "Punto Legal Chile";
const LOGO_URL = `${SITE_URL}/icon-192.png`;

// Catálogo de servicios — coincide 1:1 con ServicesSection.
const SERVICES_CATALOG = [
  {
    name: "Consulta legal de Familia",
    plan: "familia",
    price: 89000,
    description:
      "Consulta online con abogado especialista en derecho de familia: divorcio de común acuerdo, pensiones de alimentos, cuidado personal, mediación y compensación económica.",
    keywords: [
      "abogado familia chile",
      "pensión de alimentos",
      "divorcio común acuerdo",
      "cuidado personal",
    ],
  },
  {
    name: "Consulta legal Laboral",
    plan: "laboral",
    price: 0,
    description:
      "Consulta online con abogado laboralista: despido injustificado, finiquito, tutela de derechos fundamentales, Ley Karin y nulidad del despido. La evaluación inicial puede ser sin costo cuando aplica al plan seleccionado.",
    keywords: [
      "abogado laboral chile",
      "despido injustificado",
      "Ley Karin",
      "tutela de derechos",
      "indemnización despido",
    ],
  },
  {
    name: "Consulta legal Sucesoria",
    plan: "sucesorio",
    price: 89000,
    description:
      "Consulta online con abogado especialista en herencias: posesión efectiva intestada o testada, redacción de testamentos y partición de comunidad hereditaria.",
    keywords: [
      "posesión efectiva chile",
      "abogado herencia",
      "testamento",
      "partición herencia",
    ],
  },
  {
    name: "Consulta legal Inmobiliaria",
    plan: "inmobiliario",
    price: 119000,
    description:
      "Consulta online con abogado inmobiliario: estudio de títulos, compraventa, promesa, contratos de arriendo y resolución de conflictos de propiedad.",
    keywords: [
      "estudio de títulos",
      "compraventa inmueble chile",
      "abogado inmobiliario",
      "contrato arriendo",
    ],
  },
  {
    name: "Consulta legal Empresarial",
    plan: "empresarial",
    price: 149000,
    description:
      "Consulta online con abogado corporativo: constitución de SpA o EIRL en 72 horas, pactos de socios, estatutos y asesoría continua para pymes y startups.",
    keywords: [
      "constituir SpA chile",
      "abogado corporativo",
      "pacto de socios",
      "EIRL",
    ],
  },
  {
    name: "Consulta legal Tributaria",
    plan: "tributario",
    price: 99000,
    description:
      "Consulta online con abogado tributarista: planificación fiscal legal, recursos administrativos y representación frente al SII.",
    keywords: [
      "abogado tributario chile",
      "recurso SII",
      "planificación tributaria",
    ],
  },
  {
    name: "Consulta de Contratos",
    plan: "contratos",
    price: 59000,
    description:
      "Redacción y revisión exprés de contratos civiles y comerciales: prestación de servicios, NDA, cláusulas críticas y contratos a medida.",
    keywords: [
      "redacción contratos chile",
      "revisión contrato",
      "NDA",
      "abogado contratos",
    ],
  },
];

// FAQ AEO — optimizadas para queries naturales que la gente hace a las IAs.
// IMPORTANTE: este array debe mantenerse SINCRONIZADO con FAQSection.tsx
// para que las preguntas visibles en pantalla coincidan con el FAQPage schema
// que ven los crawlers (rich snippets en Google + alimentación a Perplexity/IAs).
const FAQ_AEO = [
  // ---- Brand awareness / discovery (top of funnel) ----
  {
    q: "¿Qué es Punto Legal y dónde puedo agendar una consulta legal online en Chile?",
    a: `Punto Legal (puntolegal.online) es un estudio jurídico chileno: ${PUNTO_LEGAL_DOMICILIO_LINE} Agendas en https://puntolegal.online con consultas de 45 minutos por Google Meet, en menos de 60 segundos, con pago vía MercadoPago y confirmación por correo.`,
  },
  {
    q: "¿Dónde está Punto Legal? ¿Tienen oficina en Las Condes?",
    a: `${PUNTO_LEGAL_DOMICILIO_LINE} El agendamiento y las consultas son vía https://puntolegal.online y Google Meet, sin cita en recepción.`,
  },
  {
    q: "¿Cuál es el propósito de Punto Legal?",
    a: `${PUNTO_LEGAL_INSTITUTIONAL_PURPOSE} El agendamiento con especialistas está en https://puntolegal.online.`,
  },
  {
    q: "¿Cuánto cobra un abogado en Chile por una consulta legal online?",
    a: "Una consulta legal online en Chile cuesta entre $59.000 y $189.000 CLP según la especialidad. En Punto Legal: Contratos $59.000, Laboral despido/finiquito (evaluación inicial sin costo cuando aplica), defensa Ley Karin trabajador $79.000, Familia/Sucesorio/Marcas $89.000, Tributario $99.000, Cobranza/Defensa CAE $109.000, Fiscalizaciones DT $110.000, Inmobiliario $119.000, Migratorio $129.000, Comparendos DT $130.000, Empresarial $149.000, Penal o protocolo Ley Karin (empresa) $169.000, Cumplimiento $179.000, Defensa Laboral Empresarial $189.000. El diagnóstico inicial laboral (trabajadores) puede ser gratuito cuando corresponde.",
  },
  {
    q: "¿Los abogados de Punto Legal son reales y están colegiados en Chile?",
    a: "Sí. Cada consulta en puntolegal.online la atiende un abogado titulado y colegiado en el Colegio de Abogados de Chile, especialista en el área jurídica que el cliente elige. Verás el nombre y la cédula profesional del abogado al confirmar la reserva. No se usa IA ni asistentes para responder.",
  },
  {
    q: "¿Cómo funciona Punto Legal Chile? ¿Es 100% online?",
    a: `Punto Legal funciona en 3 pasos: (1) eliges tu especialidad en puntolegal.online, (2) agendas en menos de 60 segundos con pago seguro vía MercadoPago, (3) te conectas 45 minutos por Google Meet. La atención y las consultas son online. ${PUNTO_LEGAL_DOMICILIO_LINE}`,
  },
  {
    q: "¿Qué áreas del derecho cubre Punto Legal?",
    a: "Punto Legal cubre 17 áreas del derecho chileno: Laboral personas (diagnóstico inicial sin costo cuando aplica), Familia, Sucesorio, Migratorio, Penal, Empresarial, Tributario, Contratos, Comparendos Dirección del Trabajo, Fiscalizaciones DT, Defensa Laboral Empresarial, Ley Karin (Ley 21.643), Cumplimiento (Ley 20.393), Marcas (INAPI), Inmobiliario, Cobranza Judicial y Defensa CAE frente a Tesorería.",
  },
  {
    q: "¿Punto Legal atiende casos urgentes el mismo día?",
    a: "Sí. Punto Legal opera de lunes a domingo entre 09:00 y 22:00 hora de Chile, con cupos disponibles habitualmente el mismo día o al día siguiente. Las urgencias penales, embargos por CAE y denuncias Ley Karin se priorizan en agenda.",
  },

  // ---- Long-tail SEO de alta intención (queries específicas que IAs y Google usan) ----
  {
    q: "¿Puedo demandar a mi empleador por despido injustificado en Chile?",
    a: "Sí. Si fuiste despedido sin causal o con causal mal aplicada, en regla general tienes 60 días hábiles para demandar ante el Juzgado de Letras del Trabajo. Puedes peticionar indemnización por años de servicio, sustitutiva del aviso previo, recargo del 30% al 100% según causal y, si corresponde, tutela por vulneración de derechos fundamentales (la Ley 21.643 regula entre otras materias el acoso laboral). En Punto Legal puedes agendar orientación; el patrocinio con honorarios variables se acuerda por escrito según el caso.",
  },
  {
    q: "¿Cuánto demora una posesión efectiva intestada en Chile?",
    a: "La posesión efectiva intestada en Chile demora entre 30 y 90 días hábiles cuando se tramita ante el Servicio de Registro Civil e Identificación (vía administrativa). Si involucra bienes raíces o herederos en disputa, se tramita ante el Tribunal Civil y puede demorar 4 a 12 meses. Punto Legal tramita la posesión efectiva con presupuesto cerrado desde $89.000.",
  },
  {
    q: "¿Cómo se calcula la pensión de alimentos según la Ley 14.908 en Chile?",
    a: "La pensión de alimentos en Chile se calcula según el principio de proporcionalidad de la Ley 14.908: capacidad económica del alimentante (ingresos líquidos) y necesidades del alimentario. Mínimo legal por hijo: 40% de un ingreso mínimo si el alimentante tiene 1 hijo; 30% si tiene 2 o más. La no pago genera arresto nocturno, retención de devolución de impuestos, suspensión de licencia de conducir y registro nacional de deudores morosos.",
  },
  {
    q: "¿Qué es la Ley Karin (Ley 21.643) y cuándo aplica en mi empresa?",
    a: "La Ley Karin (Ley 21.643, vigente desde el 1 de agosto de 2024) modifica el Código del Trabajo chileno y obliga a TODA empresa con trabajadores a contar con un protocolo escrito de prevención del acoso laboral, sexual y violencia en el trabajo. Debe incluir canal de denuncia confidencial, investigación interna en plazo máximo de 30 días hábiles, y reporte a la Dirección del Trabajo cuando la denuncia se acoja. La no implementación se sanciona con multa de 1 a 60 UTM.",
  },
  {
    q: "¿Cómo constituir una SpA o EIRL en Chile en 72 horas?",
    a: "En Chile puedes constituir una Sociedad por Acciones (SpA) o Empresa Individual de Responsabilidad Limitada (EIRL) en 72 horas usando el régimen simplificado de la Ley 20.659 ('Tu Empresa en un Día'). Requisitos: RUT del o los socios, nombre disponible, giro definido y domicilio. La SpA permite 1 o más accionistas, capital flexible y estructura escalable; la EIRL es de un único socio con responsabilidad limitada al capital aportado.",
  },
  {
    q: "¿Cómo defenderse de un embargo de la Tesorería General por deuda CAE?",
    a: "Si la Tesorería General de la República te embargó por morosidad del Crédito con Aval del Estado (CAE), puedes (1) solicitar la suspensión del embargo presentando recurso administrativo, (2) repactar la deuda accediendo al programa de pago contributivo (porcentaje del sueldo según renta) o (3) solicitar rebaja o condonación parcial cuando hay incapacidad de pago demostrable. Punto Legal frena tu embargo y repacta por $109.000.",
  },
];

const AEOStructuredData = () => {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: ["puntolegal.online", "Punto Legal Chile", "Punto Legal Online"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 192,
      height: 192,
    },
    image: LOGO_URL,
    description:
      `Estudio jurídico chileno en línea. ${PUNTO_LEGAL_DOMICILIO_LINE} Consultas con abogados especialistas por Google Meet (familia, laboral, sucesorio, inmobiliario, empresarial, tributario). Agendamiento en menos de 60 segundos en puntolegal.online.`,
    slogan: "Tu abogado especialista, online y en minutos.",
    foundingDate: "2023",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Las Condes",
        addressRegion: "Región Metropolitana de Santiago",
        addressCountry: "CL",
        streetAddress: "Barrio El Golf, Santiago",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Las Condes",
      addressRegion: "Región Metropolitana de Santiago",
      addressCountry: "CL",
      streetAddress: "Barrio El Golf, Santiago",
    },
    areaServed: {
      "@type": "Country",
      name: "Chile",
      sameAs: "https://www.wikidata.org/wiki/Q298",
    },
    knowsAbout: [
      "Derecho de Familia chileno",
      "Derecho Laboral chileno",
      "Derecho Sucesorio chileno",
      "Derecho Inmobiliario chileno",
      "Derecho Corporativo chileno",
      "Derecho Tributario chileno",
      "Constitución de sociedades en Chile",
      "Ley Karin",
      "Pensiones de alimentos Ley 14.908",
      "Posesión efectiva",
    ],
    knowsLanguage: ["es", "es-CL"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Spanish", "es-CL"],
        areaServed: "CL",
        email: "puntolegalelgolf@gmail.com",
        url: `${SITE_URL}/agendamiento`,
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "22:00",
        },
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61575610732702",
      "https://www.instagram.com/puntolegal.online",
    ],
    priceRange: "$$",
    paymentAccepted: ["Credit Card", "Debit Card", "MercadoPago", "Bank Transfer"],
    currenciesAccepted: "CLP",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Consultas legales online — Punto Legal Chile",
      itemListElement: SERVICES_CATALOG.map((s, idx) => ({
        "@type": "Offer",
        position: idx + 1,
        name: s.name,
        description: s.description,
        price: s.price,
        priceCurrency: "CLP",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/agendamiento?plan=${s.plan}`,
        category: "LegalConsultation",
        eligibleRegion: { "@type": "Country", name: "Chile" },
        seller: { "@id": `${SITE_URL}/#organization` },
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "Legal Consultation",
          areaServed: { "@type": "Country", name: "Chile" },
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: `${SITE_URL}/agendamiento?plan=${s.plan}`,
            name: "Google Meet",
            availableLanguage: "es-CL",
          },
          offers: {
            "@type": "Offer",
            price: s.price,
            priceCurrency: "CLP",
            url: `${SITE_URL}/agendamiento?plan=${s.plan}`,
          },
          keywords: s.keywords.join(", "),
        },
      })),
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "es-CL",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: [
      {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/agendamiento?plan={plan_id}`,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
            "http://schema.org/IOSPlatform",
            "http://schema.org/AndroidPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "Consulta legal online por Google Meet",
        },
        "query-input": "required name=plan_id",
      },
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    inLanguage: "es-CL",
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: FAQ_AEO.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
        author: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Agendar consulta legal online",
        item: `${SITE_URL}/#servicios`,
      },
    ],
  };

  const speakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": SITE_URL,
    url: SITE_URL,
    name: "Punto Legal Chile — Consulta legal online por Google Meet",
    description:
      `Estudio jurídico chileno online. ${PUNTO_LEGAL_DOMICILIO_LINE} Agenda en 60 segundos consulta 45 min por Google Meet. Familia, laboral, sucesorio, inmobiliario, empresarial, tributario y contratos. Desde $59.000.`,
    inLanguage: "es-CL",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: { "@type": "ImageObject", url: LOGO_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".badge-ios", ".faq-bubble__trigger"],
    },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organization)}
      </script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
      <script type="application/ld+json">{JSON.stringify(faqPage)}</script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumb)}
      </script>
      <script type="application/ld+json">{JSON.stringify(speakable)}</script>

      {/* Meta tags adicionales orientados a AEO */}
      <link rel="canonical" href={SITE_URL} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="geo.region" content="CL" />
      <meta name="geo.placename" content="El Golf, Las Condes, Santiago, Chile" />
      <meta name="ICBM" content={PUNTO_LEGAL_ICBM} />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="3 days" />
      <meta name="language" content="Spanish" />
      <meta httpEquiv="Content-Language" content="es-CL" />
      <meta property="og:locale" content="es_CL" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:site" content="@puntolegalcl" />

      {/* Hints for AI assistants */}
      <meta
        name="ai-content-declaration"
        content="human-written"
      />
      <meta
        name="description"
        content={`Punto Legal Chile (puntolegal.online): estudio jurídico, ${PUNTO_LEGAL_DOMICILIO_LINE} Consultas 45 min por Google Meet. Familia, laboral, sucesorio, inmobiliario, empresarial, tributario, contratos. Desde $59.000 CLP. Lunes a domingo 09:00–22:00 Chile.`}
      />
      <meta
        name="keywords"
        content="abogado online chile, abogado Las Condes, consulta legal online, agendar abogado chile, puntolegal.online, El Golf Las Condes, abogado familia chile, abogado laboral chile, posesión efectiva, despido injustificado, Ley Karin, constituir SpA, abogado tributario, consulta google meet, estudio jurídico chile"
      />
    </Helmet>
  );
};

export default AEOStructuredData;
