import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Verificar localStorage primero
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      // Si no hay preferencia guardada, verificar la preferencia del sistema
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Aplicar tema al inicializar
  useEffect(() => {
    const applyTheme = (dark: boolean) => {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(isDark);
    
    // Guardar en localStorage solo si cambia
    const currentTheme = localStorage.getItem('theme');
    const newTheme = isDark ? 'dark' : 'light';
    if (currentTheme !== newTheme) {
      localStorage.setItem('theme', newTheme);
    }
  }, [isDark]);

  // Detectar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo aplicar si no hay preferencia guardada
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    // Aplicar inmediatamente
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar preferencia
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    // Debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🌙 Dark mode toggled:', {
        newMode: newDarkMode ? 'dark' : 'light',
        htmlHasDarkClass: document.documentElement.classList.contains('dark'),
        localStorage: localStorage.getItem('theme')
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-foreground/70 hover:text-primary transition-all duration-300 group relative overflow-hidden"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'} group-hover:scale-110`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'} group-hover:scale-110`} />
      
      {/* Efecto de hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <span className="sr-only">{isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}</span>
    </Button>
  );
};

export default DarkModeToggle;