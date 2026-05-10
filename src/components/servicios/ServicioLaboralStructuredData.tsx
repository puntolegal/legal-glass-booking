import type { LaboralFaqItem } from '@/constants/laboralPageContent'
import { siteUrl } from '@/config/siteUrl'

type Props = {
  faq: LaboralFaqItem[]
  pageName: string
  pageDescription: string
}

export function ServicioLaboralStructuredData({ faq, pageName, pageDescription }: Props) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageName,
    description: pageDescription,
    url: `${siteUrl}/servicios/laboral`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  )
}

export default ServicioLaboralStructuredData
