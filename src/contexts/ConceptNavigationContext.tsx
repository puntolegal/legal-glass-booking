import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaz para un paso de navegación
interface NavigationStep {
  concept: string;
  title: string;
  timestamp: number;
  sourceNote?: string;
  source?: string; // For compatibility
}

// Interfaz del contexto
interface ConceptNavigationContextType {
  navigationHistory: NavigationStep[];
  currentConcept: string | null;
  breadcrumb: string[];
  navigateToConcept: (concept: string, title?: string, sourceNote?: string) => void;
  goBack: () => void;
  goToStep: (index: number) => void;
  clearHistory: () => void;
  getConceptPath: (concept: string) => string[];
}

// Crear el contexto
const ConceptNavigationContext = createContext<ConceptNavigationContextType | undefined>(undefined);

// Provider del contexto
export const ConceptNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState<NavigationStep[]>([]);
  const [currentConcept, setCurrentConcept] = useState<string | null>(null);

  // Cargar historial desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('concept-navigation-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setNavigationHistory(parsed);
        if (parsed.length > 0) {
          setCurrentConcept(parsed[parsed.length - 1].concept);
        }
      }
    } catch (error) {
      console.error('Error cargando historial de navegación:', error);
    }
  }, []);

  // Guardar historial en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('concept-navigation-history', JSON.stringify(navigationHistory));
    } catch (error) {
      console.error('Error guardando historial de navegación:', error);
    }
  }, [navigationHistory]);

  // Generar breadcrumb basado en el historial
  const breadcrumb = navigationHistory.map(step => step.title || step.concept);

  // Navegar a un concepto
  const navigateToConcept = (concept: string, title?: string, sourceNote?: string) => {
    const cleanConcept = concept.trim();
    const cleanTitle = (title || concept).trim();
    
    // Evitar duplicados consecutivos
    if (currentConcept === cleanConcept) {
      return;
    }

    const newStep: NavigationStep = {
      concept: cleanConcept,
      title: cleanTitle,
      timestamp: Date.now(),
      sourceNote
    };

    setNavigationHistory(prev => {
      // Limitar historial a 20 elementos para evitar crecimiento excesivo
      const newHistory = [...prev, newStep];
      if (newHistory.length > 20) {
        return newHistory.slice(-20);
      }
      return newHistory;
    });
    
    setCurrentConcept(cleanConcept);
  };

  // Ir hacia atrás en el historial
  const goBack = () => {
    if (navigationHistory.length > 1) {
      setNavigationHistory(prev => prev.slice(0, -1));
      const newCurrent = navigationHistory[navigationHistory.length - 2];
      setCurrentConcept(newCurrent?.concept || null);
    } else {
      setCurrentConcept(null);
    }
  };

  // Ir a un paso específico del historial
  const goToStep = (index: number) => {
    if (index >= 0 && index < navigationHistory.length) {
      const newHistory = navigationHistory.slice(0, index + 1);
      setNavigationHistory(newHistory);
      setCurrentConcept(newHistory[index].concept);
    }
  };

  // Limpiar todo el historial
  const clearHistory = () => {
    setNavigationHistory([]);
    setCurrentConcept(null);
    try {
      localStorage.removeItem('concept-navigation-history');
    } catch (error) {
      console.error('Error limpiando historial de navegación:', error);
    }
  };

  // Obtener la ruta completa hacia un concepto
  const getConceptPath = (concept: string): string[] => {
    const path: string[] = [];
    let found = false;
    
    for (const step of navigationHistory) {
      path.push(step.title);
      if (step.concept === concept) {
        found = true;
        break;
      }
    }
    
    return found ? path : [];
  };

  const value: ConceptNavigationContextType = {
    navigationHistory,
    currentConcept,
    breadcrumb,
    navigateToConcept,
    goBack,
    goToStep,
    clearHistory,
    getConceptPath
  };

  return (
    <ConceptNavigationContext.Provider value={value}>
      {children}
    </ConceptNavigationContext.Provider>
  );
};

// Hook para usar el contexto
export const useConceptNavigation = () => {
  const context = useContext(ConceptNavigationContext);
  if (context === undefined) {
    throw new Error('useConceptNavigation must be used within a ConceptNavigationProvider');
  }
  return context;
}; 