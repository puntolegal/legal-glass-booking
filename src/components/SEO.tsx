import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author = 'Punto Legal',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const siteName = 'Punto Legal';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

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
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_CL" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#f59e0b" />
      <meta name="msapplication-TileColor" content="#f59e0b" />
      
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
          "url": "https://puntolegal.cl",
          "logo": "https://puntolegal.cl/logo.png",
          "image": image,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Santiago",
            "addressRegion": "Región Metropolitana",
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