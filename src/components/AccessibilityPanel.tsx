import React, { useState } from 'react';
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
  Settings
} from 'lucide-react';

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-110"
        size="icon"
        aria-label="Abrir panel de accesibilidad"
      >
        <Accessibility className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
      <Card className="shadow-2xl border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Accessibility className="w-5 h-5 text-amber-500" />
              Accesibilidad
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Cerrar panel de accesibilidad"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Alto Contraste */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" />
              <Label htmlFor="high-contrast" className="text-sm font-medium">
                Alto Contraste
              </Label>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
              aria-label="Activar alto contraste"
            />
          </div>

          {/* Tamaño de Fuente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-500" />
              <Label className="text-sm font-medium">Tamaño de Fuente</Label>
            </div>
            <div className="flex gap-2">
              {fontSizeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={fontSize === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`text-xs ${
                    fontSize === option.value
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-amber-300 text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Movimiento Reducido */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-amber-500" />
              <Label htmlFor="reduced-motion" className="text-sm font-medium">
                Movimiento Reducido
              </Label>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={toggleReducedMotion}
              aria-label="Activar movimiento reducido"
            />
          </div>

          {/* Focus Visible */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-amber-500" />
              <Label htmlFor="focus-visible" className="text-sm font-medium">
                Focus Visible
              </Label>
            </div>
            <Switch
              id="focus-visible"
              checked={focusVisible}
              onCheckedChange={toggleFocusVisible}
              aria-label="Activar focus visible"
            />
          </div>

          {/* Botón de Reset */}
          <Button
            onClick={() => {
              setHighContrast(false);
              setFontSize('medium');
              setReducedMotion(false);
              setFocusVisible(false);
              const root = document.documentElement;
              root.classList.remove('high-contrast', 'reduced-motion', 'focus-visible', 'font-size-small', 'font-size-medium', 'font-size-large');
              root.classList.add('font-size-medium');
            }}
            variant="outline"
            className="w-full border-amber-300 text-amber-600 hover:bg-amber-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Restablecer Valores
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPanel; 