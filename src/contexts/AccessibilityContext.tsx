import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AccessibilityState {
  enlargedText: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  state: AccessibilityState;
  toggleEnlargedText: () => void;
  toggleReducedMotion: () => void;
  resetToDefaults: () => void;
}

const DEFAULTS: AccessibilityState = {
  enlargedText: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

function migrate(raw: string | null): AccessibilityState {
  if (!raw) return DEFAULTS;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (
      typeof parsed.enlargedText === 'boolean' &&
      typeof parsed.reducedMotion === 'boolean'
    ) {
      return {
        enlargedText: parsed.enlargedText,
        reducedMotion: parsed.reducedMotion,
      };
    }
    const fontSize = parsed.fontSize;
    const enlargedText = fontSize === 'large';
    const reducedMotion = Boolean(parsed.reducedMotion);
    return { enlargedText, reducedMotion };
  } catch {
    return DEFAULTS;
  }
}

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(() =>
    migrate(typeof window !== 'undefined' ? localStorage.getItem('accessibility-settings') : null)
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(state.enlargedText ? 'font-size-large' : 'font-size-medium');
    root.classList.remove('high-contrast', 'focus-visible');
    if (state.reducedMotion) root.classList.add('reduced-motion');
    else root.classList.remove('reduced-motion');
    localStorage.setItem('accessibility-settings', JSON.stringify(state));
  }, [state]);

  const toggleEnlargedText = () =>
    setState((prev) => ({ ...prev, enlargedText: !prev.enlargedText }));

  const toggleReducedMotion = () =>
    setState((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));

  const resetToDefaults = () => setState(DEFAULTS);

  return (
    <AccessibilityContext.Provider
      value={{
        state,
        toggleEnlargedText,
        toggleReducedMotion,
        resetToDefaults,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
