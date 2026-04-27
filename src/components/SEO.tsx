import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_ORIGIN } from '@/config/siteUrl';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Punto Legal - Soluciones Legales Premium en Chile',
  description = 'Especialistas en derecho laboral, familia, herencias y soluciones legales express. Más de 10 años defendiendo los derechos de los trabajadores en Chile.',
  keywords = 'derecho laboral, abogado chile, despido injustificado, indemnización, derecho familia, herencias, contratos express, sociedades comerciales',
  image = DEFAULT_OG_IMAGE,
  url = typeof window !== 'undefined' ? window.location.href : SITE_ORIGIN,
  type = 'website',
  author = 'Punto Legal',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteName = 'Punto Legal';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const imageAbsolute = image.startsWith('http') ? image : `${SITE_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageAbsolute} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_CL" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageAbsolute} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#041329" />
      <meta name="msapplication-TileColor" content="#041329" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          "name": "Punto Legal",
          "description": description,
          "url": SITE_ORIGIN,
          "logo": `${SITE_ORIGIN}/icon-192.png`,
          "image": imageAbsolute,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Barrio El Golf, Santiago",
            "addressLocality": "Las Condes",
            "addressRegion": "Región Metropolitana de Santiago",
            "addressCountry": "CL"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+56962321883",
            "contactType": "customer service",
            "email": "puntolegalelgolf@gmail.com"
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61575610732702"
          ],
          "serviceArea": {
            "@type": "Country",
            "name": "Chile"
          },
          "priceRange": "$$",
          "openingHours": "Mo-Fr 09:00-18:00"
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 