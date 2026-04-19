/* eslint-disable react-refresh/only-export-components -- par Provider + hook estándar */
import { createContext, useContext, type ReactNode } from 'react';
import type { ServicioThemeTokens } from './servicioThemes';

const ServicioThemeContext = createContext<ServicioThemeTokens | null>(null);

export function ServicioThemeProvider({
  tokens,
  children,
}: {
  tokens: ServicioThemeTokens;
  children: ReactNode;
}) {
  return <ServicioThemeContext.Provider value={tokens}>{children}</ServicioThemeContext.Provider>;
}

export function useServicioTheme(): ServicioThemeTokens {
  const ctx = useContext(ServicioThemeContext);
  if (!ctx) {
    throw new Error('useServicioTheme debe usarse dentro de ServicioThemeProvider (ServicioPageShell)');
  }
  return ctx;
}
