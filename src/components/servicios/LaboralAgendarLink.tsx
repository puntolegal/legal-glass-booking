import { Link, type LinkProps } from 'react-router-dom';
import {
  parsePlanSlugFromAgendamientoPath,
  trackLaboralInitiateCheckout,
} from '@/utils/laboralMetaTracking';

type LaboralAgendarLinkProps = LinkProps & {
  /** Si el `to` no incluye `?plan=`, pásalo aquí. */
  planSlug?: string;
};

/**
 * Enlace a agendamiento con InitiateCheckout para Meta (Pixel + CAPI).
 * Usar en /servicios/laboral en lugar de `<Link to="/agendamiento?plan=...">`.
 */
export default function LaboralAgendarLink({
  onClick,
  planSlug,
  to,
  ...rest
}: LaboralAgendarLinkProps) {
  const handleClick: LinkProps['onClick'] = (event) => {
    const path = typeof to === 'string' ? to : '';
    const slug = planSlug ?? parsePlanSlugFromAgendamientoPath(path);
    if (slug) {
      trackLaboralInitiateCheckout(slug);
    }
    onClick?.(event);
  };

  return <Link to={to} onClick={handleClick} {...rest} />;
}
