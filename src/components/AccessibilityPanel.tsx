import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Move, Type, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/useTheme';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import {
  A11Y_FOCUS_RING,
  accessibilityControlChrome,
  accessibilityPanelSurface,
  accessibilityPanelRow,
} from '@/lib/accessibilityGlassClasses';
import { cn } from '@/lib/utils';

const SWITCH_TEAL =
  'data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600';

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { state, toggleEnlargedText, toggleReducedMotion, resetToDefaults } = useAccessibility();

  useEffect(() => {
    const handleAccessibilityToggle = () => setIsOpen(true);
    window.addEventListener('accessibility-toggle', handleAccessibilityToggle);
    return () => window.removeEventListener('accessibility-toggle', handleAccessibilityToggle);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const fabPosition =
    'max-lg:bottom-[calc(5.85rem+env(safe-area-inset-bottom,0px))] max-lg:left-[max(0.75rem,env(safe-area-inset-left,0px))] lg:bottom-8 lg:left-10';

  const panelPosition =
    'max-lg:left-4 max-lg:right-4 max-lg:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] lg:left-10 lg:right-auto lg:bottom-10';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[140] bg-slate-950/35 backdrop-blur-[2px] dark:bg-black/55"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {!isOpen ? (
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed z-[155] flex h-10 w-10 items-center justify-center rounded-2xl transition-all touch-manipulation',
            A11Y_FOCUS_RING,
            accessibilityControlChrome(isDark),
            fabPosition,
          )}
          whileTap={{ scale: 0.94 }}
          aria-label="Abrir preferencias de accesibilidad"
          title="Accesibilidad"
        >
          <Accessibility className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
        </motion.button>
      ) : (
        <div
          className={cn(
            'fixed z-[150] w-[min(100%,20rem)] max-h-[min(72vh,calc(100dvh-6rem))] overflow-y-auto rounded-3xl',
            panelPosition,
          )}
          data-accessibility-panel
        >
          <div className={cn('flex flex-col gap-4 p-5', accessibilityPanelSurface(isDark))}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border',
                    isDark
                      ? 'border-white/[0.1] bg-white/[0.06]'
                      : 'border-slate-200/90 bg-white/90',
                  )}
                >
                  <Accessibility className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2
                    className={cn(
                      'text-base font-semibold leading-tight',
                      isDark ? 'text-white' : 'text-slate-900',
                    )}
                  >
                    Accesibilidad
                  </h2>
                  <p
                    className={cn(
                      'mt-0.5 text-xs leading-snug',
                      isDark ? 'text-slate-400' : 'text-slate-600',
                    )}
                  >
                    Texto y movimiento. El tema claro/oscuro está en el botón sol/luna.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition touch-manipulation',
                  A11Y_FOCUS_RING,
                  isDark
                    ? 'text-slate-300 hover:bg-white/[0.08]'
                    : 'text-slate-600 hover:bg-slate-100/90',
                )}
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <div className={cn('space-y-3', accessibilityPanelRow(isDark))}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      isDark ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-500/10 text-teal-700',
                    )}
                  >
                    <Type className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor="a11y-text" className="text-sm font-medium text-inherit">
                      Texto más grande
                    </Label>
                    <p
                      className={cn(
                        'text-xs',
                        isDark ? 'text-slate-400' : 'text-slate-600',
                      )}
                    >
                      Aumenta el tamaño base de la interfaz.
                    </p>
                  </div>
                </div>
                <Switch
                  id="a11y-text"
                  checked={state.enlargedText}
                  onCheckedChange={toggleEnlargedText}
                  aria-label="Activar texto más grande"
                  className={SWITCH_TEAL}
                />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200/60 pt-3 dark:border-white/[0.08]">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      isDark ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-500/10 text-teal-700',
                    )}
                  >
                    <Move className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor="a11y-motion" className="text-sm font-medium text-inherit">
                      Menos animaciones
                    </Label>
                    <p
                      className={cn(
                        'text-xs',
                        isDark ? 'text-slate-400' : 'text-slate-600',
                      )}
                    >
                      Atenúa transiciones y efectos de movimiento.
                    </p>
                  </div>
                </div>
                <Switch
                  id="a11y-motion"
                  checked={state.reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                  aria-label="Reducir animaciones"
                  className={SWITCH_TEAL}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                resetToDefaults();
              }}
              className={cn(
                'w-full rounded-2xl border py-3 text-sm font-medium transition touch-manipulation',
                A11Y_FOCUS_RING,
                isDark
                  ? 'border-teal-400/25 text-teal-200 hover:bg-teal-400/10'
                  : 'border-teal-600/25 text-teal-800 hover:bg-teal-500/10',
              )}
            >
              Restablecer ajustes
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel;
