import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityState {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType {
  state: AccessibilityState;
  toggleHighContrast: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleReducedMotion: () => void;
  toggleFocusVisible: () => void;
  resetToDefaults: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      highContrast: false,
      fontSize: 'medium' as const,
      reducedMotion: false,
      focusVisible: false
    };
  });

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(state));
    
    // Aplicar estilos al documento
    const root = document.documentElement;
    
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (state.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    if (state.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    // Aplicar tamaño de fuente
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${state.fontSize}`);
    
  }, [state]);

  const toggleHighContrast = () => {
    setState(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setState(prev => ({ ...prev, fontSize: size }));
  };

  const toggleReducedMotion = () => {
    setState(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleFocusVisible = () => {
    setState(prev => ({ ...prev, focusVisible: !prev.focusVisible }));
  };

  const resetToDefaults = () => {
    setState({
      highContrast: false,
      fontSize: 'medium',
      reducedMotion: false,
      focusVisible: false
    });
  };

  return (
    <AccessibilityContext.Provider value={{
      state,
      toggleHighContrast,
      setFontSize,
      toggleReducedMotion,
      toggleFocusVisible,
      resetToDefaults
    }}>
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