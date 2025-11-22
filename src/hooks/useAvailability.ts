// RUTA: src/hooks/useAvailability.ts

import { useState, useEffect, useCallback } from 'react';
import { getReservationsByDate } from '@/services/reservationService';

interface UseAvailabilityReturn {
  occupiedTimes: string[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la disponibilidad de horarios
 * Incluye caché para evitar llamadas repetidas a Supabase
 */
export const useAvailability = (date: string): UseAvailabilityReturn => {
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Caché simple en memoria
  const cache = new Map<string, { times: string[]; timestamp: number }>();
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  const fetchAvailability = useCallback(async () => {
    if (!date) {
      setOccupiedTimes([]);
      return;
    }
    
    // Verificar caché
    const cached = cache.get(date);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setOccupiedTimes(cached.times);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const reservations = await getReservationsByDate(date);
      const occupied = reservations
        .filter(reserva => reserva.estado !== 'cancelada')
        .map(reserva => reserva.hora);
      
      setOccupiedTimes(occupied);
      
      // Guardar en caché
      cache.set(date, { times: occupied, timestamp: Date.now() });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Error al cargar disponibilidad');
      setError(err);
      setOccupiedTimes([]);
    } finally {
      setIsLoading(false);
    }
  }, [date]);
  
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);
  
  return {
    occupiedTimes,
    isLoading,
    error,
    refetch: fetchAvailability,
  };
};

