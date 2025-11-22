// RUTA: src/hooks/__tests__/useMobile.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobile } from '../useMobile';

describe('useMobile', () => {
  let originalInnerWidth: number;
  
  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });
  
  afterEach(() => {
    // Restaurar el tamaño original
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });
  
  it('should return true when window width is below breakpoint', () => {
    // Simular ventana móvil
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    
    const { result } = renderHook(() => useMobile(768));
    
    expect(result.current).toBe(true);
  });
  
  it('should return false when window width is above breakpoint', () => {
    // Simular ventana desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    const { result } = renderHook(() => useMobile(768));
    
    expect(result.current).toBe(false);
  });
  
  it('should update when window is resized', () => {
    // Iniciar en desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    const { result } = renderHook(() => useMobile(768));
    expect(result.current).toBe(false);
    
    // Cambiar a móvil
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      window.dispatchEvent(new Event('resize'));
    });
    
    expect(result.current).toBe(true);
  });
  
  it('should use custom breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 900,
    });
    
    const { result } = renderHook(() => useMobile(1024));
    
    expect(result.current).toBe(true); // 900 < 1024
  });
  
  it('should cleanup resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderHook(() => useMobile());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});








