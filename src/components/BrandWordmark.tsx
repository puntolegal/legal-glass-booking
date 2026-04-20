// RUTA: src/components/BrandWordmark.tsx
//
// Wordmark sobrio — solo tipografía, sin tile ni iconos.
// Refleja el carácter institucional de un estudio jurídico chileno.
// Se usa como encabezado en secciones de confianza (landing, agendamiento,
// pagos) cuando se busca presencia de marca discreta y elegante.

import { Link } from "react-router-dom";

interface BrandWordmarkProps {
  /** Si es true, no envuelve en <Link/> (útil en headers sticky ya envueltos). */
  static?: boolean;
  /** Tamaño: 'sm' | 'md' | 'lg'. Default: 'md'. */
  size?: "sm" | "md" | "lg";
  /** Orientación: 'stack' (vertical, tipo letterhead) o 'inline' (horizontal con separador). */
  orientation?: "stack" | "inline";
  className?: string;
}

const SIZE_CLASS = {
  sm: "brand-wordmark--sm",
  md: "",
  lg: "brand-wordmark--lg",
} as const;

const Inner = ({
  orientation,
  size = "md",
  className = "",
}: Omit<BrandWordmarkProps, "static">) => (
  <span
    className={`brand-wordmark ${
      orientation === "inline" ? "brand-wordmark--inline" : ""
    } ${SIZE_CLASS[size]} ${className}`}
  >
    <span className="brand-wordmark__name">Punto Legal</span>
    {orientation === "inline" && (
      <span className="brand-wordmark__sep" aria-hidden />
    )}
    <span className="brand-wordmark__country">Chile</span>
  </span>
);

const BrandWordmark = ({
  static: isStatic = false,
  size = "md",
  orientation = "stack",
  className = "",
}: BrandWordmarkProps) => {
  if (isStatic) {
    return <Inner size={size} orientation={orientation} className={className} />;
  }
  return (
    <Link
      to="/"
      className="inline-flex"
      aria-label="Punto Legal Chile — inicio"
    >
      <Inner size={size} orientation={orientation} className={className} />
    </Link>
  );
};

export default BrandWordmark;
