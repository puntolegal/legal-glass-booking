import React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        aria-label="Saltar al contenido principal"
      >
        Saltar al contenido principal
      </a>
      <a
        href="#navigation"
        className="skip-link"
        aria-label="Saltar a la navegación"
      >
        Saltar a la navegación
      </a>
      <a
        href="#footer"
        className="skip-link"
        aria-label="Saltar al pie de página"
      >
        Saltar al pie de página
      </a>
    </>
  );
};

export default SkipLinks; 