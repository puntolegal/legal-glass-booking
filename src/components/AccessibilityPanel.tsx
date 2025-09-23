import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Accessibility, 
  Eye, 
  Type, 
  Move, 
  Keyboard, 
  X,
  Settings,
  Moon,
  Sun
} from 'lucide-react';

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const fontSizeOptions = [
    { value: 'small', label: 'Pequeña' },
    { value: 'medium', label: 'Mediana' },
    { value: 'large', label: 'Grande' },
  ] as const;

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    const root = document.documentElement;
    if (!highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${size}`);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    const root = document.documentElement;
    if (!reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const toggleFocusVisible = () => {
    setFocusVisible(!focusVisible);
    const root = document.documentElement;
    if (!focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Aplicar inmediatamente
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar preferencia
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  // Sincronizar con cambios externos del tema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Exponer función para abrir el panel desde el dock
  useEffect(() => {
    const handleAccessibilityToggle = () => {
      setIsOpen(true);
    };
    
    window.addEventListener('accessibility-toggle', handleAccessibilityToggle);
    return () => window.removeEventListener('accessibility-toggle', handleAccessibilityToggle);
  }, []);

  if (!isOpen) {
    return null; // Ocultar botón flotante ya que está integrado en el dock
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6" data-accessibility-panel>
      <Card className="shadow-2xl border-primary/20 dark:border-primary/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-primary">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Accessibility className="w-4 h-4" />
              </div>
              Accesibilidad
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
              aria-label="Cerrar panel de accesibilidad"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-3">
          {/* Modo Oscuro */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <Label htmlFor="dark-mode" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Modo {isDarkMode ? 'Oscuro' : 'Claro'}
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cambiar tema de la interfaz
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* Alto Contraste */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="high-contrast" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Alto Contraste
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mejorar legibilidad del texto
                </p>
              </div>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
              aria-label="Activar alto contraste"
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* Tamaño de Fuente */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">Tamaño de Fuente</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ajustar tamaño del texto</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {fontSizeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`h-11 rounded-lg font-medium transition-all duration-200 ${
                    fontSize === option.value
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-105'
                      : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Movimiento Reducido */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Move className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="reduced-motion" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Movimiento Reducido
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reducir animaciones y transiciones
                </p>
              </div>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={toggleReducedMotion}
              aria-label="Activar movimiento reducido"
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* Focus Visible */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="focus-visible" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Indicador de Foco
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrar indicadores de navegación
                </p>
              </div>
            </div>
            <Switch
              id="focus-visible"
              checked={focusVisible}
              onCheckedChange={toggleFocusVisible}
              aria-label="Activar focus visible"
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* Botón de Reset */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <Button
              onClick={() => {
                setHighContrast(false);
                setFontSize('medium');
                setReducedMotion(false);
                setFocusVisible(false);
                setIsDarkMode(false);
                const root = document.documentElement;
                root.classList.remove('high-contrast', 'reduced-motion', 'focus-visible', 'font-size-small', 'font-size-medium', 'font-size-large', 'dark');
                root.classList.add('font-size-medium');
                localStorage.setItem('theme', 'light');
              }}
              variant="outline"
              className="w-full h-14 rounded-xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 font-semibold text-base transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                Restablecer Configuración
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPanel; 