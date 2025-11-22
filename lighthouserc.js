// RUTA: lighthouserc.js
// Configuración de Lighthouse CI para garantizar calidad continua

module.exports = {
  ci: {
    collect: {
      // URLs a auditar
      url: [
        'http://localhost:4173/', // Homepage
        'http://localhost:4173/apuntes', // Apuntes
        'http://localhost:4173/agendamiento?plan=general', // Agendamiento
        'http://localhost:4173/servicios/familia', // Servicio Familia
      ],
      numberOfRuns: 3, // Ejecutar 3 veces y promediar
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    
    assert: {
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.90 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // < 2s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // < 2.5s
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'heading-order': 'error',
        'link-name': 'error',
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'errors-in-console': 'warn',
        'no-vulnerable-libraries': 'error',
        
        // SEO
        'categories:seo': ['error', { minScore: 0.95 }],
        'meta-description': 'error',
        'document-title': 'error',
        'http-status-code': 'error',
        'robots-txt': 'off', // Puede no estar en desarrollo
        
        // PWA (opcional, pero recomendado)
        'service-worker': 'off', // Activar cuando implementes PWA
        'installable-manifest': 'off',
      },
    },
    
    upload: {
      target: 'temporary-public-storage',
      // Para producción, usar:
      // target: 'lhci',
      // serverBaseUrl: 'https://tu-servidor-lhci.com',
      // token: process.env.LHCI_TOKEN,
    },
  },
};








