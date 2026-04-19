// RUTA: src/components/BrandMark.tsx
// Logo unificado de Punto Legal — la "P." con el punto cyan glow es la
// firma visual de la marca. Se usa en HowItWorks, headers de pago,
// dashboards y cualquier lugar donde aparezca el branding.

import { Link } from "react-router-dom";

interface BrandMarkProps {
  /** Si es true, no envuelve en <Link/> (útil en headers que no deben navegar). */
  static?: boolean;
  /** Tamaño del tile y la tipografía. Default: "md" (52px). */
  size?: "sm" | "md" | "lg";
  /** Si es false, oculta el chip "Chile". Default: true. */
  showChip?: boolean;
  /** Clase extra para el contenedor. */
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<BrandMarkProps["size"]>, string> = {
  sm: "brand-mark--sm",
  md: "",
  lg: "brand-mark--lg",
};

const Inner = ({
  showChip = true,
  size = "md",
  className = "",
}: Omit<BrandMarkProps, "static">) => (
  <span className={`brand-mark ${SIZE_CLASS[size]} ${className}`}>
    <span className="brand-mark__tile" aria-hidden>
      <span className="brand-mark__glyph">
        <span className="brand-mark__P">P</span>
        <span className="brand-mark__period">.</span>
      </span>
      <span className="brand-mark__shine" aria-hidden />
    </span>
    <span className="brand-mark__text">
      <span className="brand-mark__name">Punto Legal</span>
      {showChip && (
        <span className="brand-mark__chip">
          <span className="brand-mark__chip-dot" aria-hidden />
          Chile
        </span>
      )}
    </span>
  </span>
);

const BrandMark = ({
  static: isStatic = false,
  size = "md",
  showChip = true,
  className = "",
}: BrandMarkProps) => {
  if (isStatic) {
    return (
      <Inner size={size} showChip={showChip} className={className} />
    );
  }
  return (
    <Link
      to="/"
      className="inline-flex"
      aria-label="Punto Legal Chile — inicio"
    >
      <Inner size={size} showChip={showChip} className={className} />
    </Link>
  );
};

export default BrandMark;
