import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateWithTransition = useCallback((to: string) => {
    // Navegar a la nueva ruta
    navigate(to);

    // Scroll suave al top
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, [navigate]);

  const scrollToSection = useCallback((elementId: string, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, []);

  return {
    navigateWithTransition,
    scrollToSection,
    scrollToTop,
    navigate
  };
}; 