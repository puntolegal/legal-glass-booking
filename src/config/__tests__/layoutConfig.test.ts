// RUTA: src/config/__tests__/layoutConfig.test.ts

import { describe, it, expect } from 'vitest';
import { getLayoutForPath, layoutConfigs } from '../layoutConfig';

describe('layoutConfig', () => {
  describe('getLayoutForPath', () => {
    it('should return focus layout for /agendamiento', () => {
      const config = getLayoutForPath('/agendamiento');
      
      expect(config.type).toBe('focus');
      expect(config.showHeader).toBe(false);
      expect(config.showFooter).toBe(false);
      expect(config.headerVariant).toBe('none');
      expect(config.footerVariant).toBe('none');
    });
    
    it('should return focus layout for /agendamiento with query params', () => {
      const config = getLayoutForPath('/agendamiento?plan=familia-premium');
      
      expect(config.type).toBe('focus');
      expect(config.showHeader).toBe(false);
    });
    
    it('should return apuntes layout for /apuntes routes', () => {
      const config = getLayoutForPath('/apuntes');
      
      expect(config.type).toBe('apuntes');
      expect(config.showHeader).toBe(true);
      expect(config.showFooter).toBe(true);
      expect(config.headerVariant).toBe('apuntes');
      expect(config.footerVariant).toBe('apuntes');
      expect(config.useMobileLayout).toBe(true);
    });
    
    it('should return special config for /servicios/familia', () => {
      const config = getLayoutForPath('/servicios/familia');
      
      expect(config.type).toBe('default');
      expect(config.showHeader).toBe(true);
      expect(config.showFooter).toBe(false); // Tiene su propio footer
    });
    
    it('should return default layout for unknown routes', () => {
      const config = getLayoutForPath('/random-route');
      
      expect(config.type).toBe('default');
      expect(config.showHeader).toBe(true);
      expect(config.showFooter).toBe(true);
      expect(config.headerVariant).toBe('default');
      expect(config.footerVariant).toBe('default');
    });
    
    it('should include SEO config for configured routes', () => {
      const config = getLayoutForPath('/agendamiento');
      
      expect(config.seoConfig).toBeDefined();
      expect(config.seoConfig?.titleSuffix).toBe('Agendamiento');
      expect(config.seoConfig?.defaultDescription).toContain('Agenda tu consulta');
    });
    
    it('should match path prefix correctly', () => {
      const paths = [
        '/agendamiento',
        '/agendamiento?plan=test',
        '/agendamiento/confirmacion',
      ];
      
      paths.forEach(path => {
        const config = getLayoutForPath(path);
        expect(config.type).toBe('focus');
      });
    });
  });
  
  describe('layoutConfigs array', () => {
    it('should have valid configuration objects', () => {
      layoutConfigs.forEach(config => {
        expect(config).toHaveProperty('config');
        expect(config.config).toHaveProperty('type');
        expect(config.config).toHaveProperty('showHeader');
        expect(config.config).toHaveProperty('showFooter');
      });
    });
    
    it('should have either path or pathPrefix', () => {
      layoutConfigs.forEach(config => {
        const hasPath = 'path' in config;
        const hasPathPrefix = 'pathPrefix' in config;
        expect(hasPath || hasPathPrefix).toBe(true);
      });
    });
  });
});








