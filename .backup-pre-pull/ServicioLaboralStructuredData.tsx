import { Helmet } from 'react-helmet-async'
import { SITE_ORIGIN } from '@/config/siteUrl'
import type { LaboralFaqItem } from '@/constants/laboralPageContent'

const LABORAL_PATH = '/servicios/laboral'
const CANONICAL = `${SITE_ORIGIN}${LABORAL_PATH}`

/**
 * JSON-LD específico de la página laboral: WebPage (speakable) + FAQPage + BreadcrumbList.
 * Debe alimentarse con el mismo array de FAQ que el DOM visible.
 */
export function ServicioLaboralStructuredData({
  faq,
  pageName,
  pageDescription,
}: {
  faq: LaboralFaqItem[]
  pageName: string
  pageDescription: string
}) {
  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: pageName,
      description: pageDescription,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: 'Punto Legal',
        url: SITE_ORIGIN,
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['#laboral-hero-title', '#laboral-hero-lead'],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${CANONICAL}#faq`,
      url: CANONICAL,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${CANONICAL}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: SITE_ORIGIN,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Servicios legales',
          item: `${SITE_ORIGIN}/#servicios`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Derecho laboral',
          item: CANONICAL,
        },
      ],
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
