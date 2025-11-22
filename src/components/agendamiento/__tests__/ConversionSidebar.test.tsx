// RUTA: src/components/agendamiento/__tests__/ConversionSidebar.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConversionSidebar from '../ConversionSidebar';
import { AgendamientoProvider } from '@/contexts/AgendamientoContext';

// Mock del contexto para pruebas
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AgendamientoProvider>
        {component}
      </AgendamientoProvider>
    </BrowserRouter>
  );
};

describe('ConversionSidebar', () => {
  it('should render the sidebar with service summary', () => {
    renderWithProviders(<ConversionSidebar />);
    
    // Verificar que se muestra el título
    expect(screen.getByText('Tu Consulta Estratégica')).toBeInTheDocument();
    expect(screen.getByText('Premium Pack de Inicio')).toBeInTheDocument();
  });
  
  it('should display the guarantee section', () => {
    renderWithProviders(<ConversionSidebar />);
    
    // Verificar garantía
    expect(screen.getByText('Garantía Total')).toBeInTheDocument();
    expect(screen.getByText(/100% del dinero/i)).toBeInTheDocument();
    expect(screen.getByText(/Sin preguntas/i)).toBeInTheDocument();
  });
  
  it('should show testimonial with 5 stars', () => {
    renderWithProviders(<ConversionSidebar />);
    
    // Verificar testimonio
    expect(screen.getByText(/En 1 hora me dio más claridad/i)).toBeInTheDocument();
    expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
    
    // Verificar que hay 5 estrellas (iconos Star)
    const stars = screen.getAllByRole('img', { hidden: true });
    const starIcons = stars.filter(el => el.getAttribute('class')?.includes('lucide-star'));
    expect(starIcons.length).toBeGreaterThanOrEqual(5);
  });
  
  it('should display key benefits with checkmarks', () => {
    renderWithProviders(<ConversionSidebar />);
    
    // Verificar beneficios clave
    expect(screen.getByText(/1 hora de trabajo directo/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan de Acción Estratégico/i)).toBeInTheDocument();
    expect(screen.getByText(/100% del valor se abona/i)).toBeInTheDocument();
  });
  
  it('should show success stats', () => {
    renderWithProviders(<ConversionSidebar />);
    
    // Verificar stats
    expect(screen.getByText('24h')).toBeInTheDocument(); // Respuesta
    expect(screen.getByText('92%')).toBeInTheDocument(); // Éxito
  });
  
  it('should display specialist team info', () => {
    renderWithProviders(<ConversionSidebar />);
    
    // Verificar sección de especialista
    expect(screen.getByText('Equipo Punto Legal')).toBeInTheDocument();
    expect(screen.getByText('Abogados especialistas')).toBeInTheDocument();
  });
  
  it('should have proper semantic structure for accessibility', () => {
    const { container } = renderWithProviders(<ConversionSidebar />);
    
    // Verificar estructura semántica
    const headings = container.querySelectorAll('h3, h4');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verificar que los iconos importantes tienen labels
    const guaranteeSection = screen.getByText('Garantía Total').closest('div');
    expect(guaranteeSection).toBeInTheDocument();
  });
});








