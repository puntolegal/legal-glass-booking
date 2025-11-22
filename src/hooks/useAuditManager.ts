import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AuditMetadata {
  noteId: string;
  auditedBy: string;
  auditedAt: string;
  comments?: string;
}

interface UseAuditManagerReturn {
  isAudited: (noteId: string) => boolean;
  toggleAudit: (noteId: string) => Promise<void>;
  getAuditMetadata: (noteId: string) => AuditMetadata | null;
  getAllAuditedNotes: () => string[];
  getAuditCount: () => number;
  isLoading: boolean;
}

const STORAGE_PREFIX = 'apuntes_auditados';

export const useAuditManager = (): UseAuditManagerReturn => {
  const { user, isCurator } = useAuth();
  const userId = user?.id || 'anonymous';
  const storageKey = `${STORAGE_PREFIX}_${userId}`;

  // Estado local para sincronización rápida
  const [auditedNotes, setAuditedNotes] = useState<Set<string>>(new Set());
  const [auditMetadata, setAuditMetadata] = useState<Map<string, AuditMetadata>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos desde Supabase al montar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadAudits = async () => {
      setIsLoading(true);
      try {
        // Intentar cargar desde Supabase primero (solo para curadores)
        if (isCurator) {
          const { data, error } = await (supabase as any)
            .from('apuntes_audits')
            .select('note_id, auditor_name, audited_at, comments')
            .eq('status', 'audited');

          if (!error && data) {
            const notes = new Set<string>();
            const metadata = new Map<string, AuditMetadata>();

            data.forEach((audit: any) => {
              notes.add(audit.note_id);
              metadata.set(audit.note_id, {
                noteId: audit.note_id,
                auditedBy: audit.auditor_name,
                auditedAt: audit.audited_at,
                comments: audit.comments || undefined
              });
            });

            setAuditedNotes(notes);
            setAuditMetadata(metadata);

            // Guardar en localStorage como cache
            localStorage.setItem(storageKey, JSON.stringify({
              notes: Array.from(notes),
              metadata: Array.from(metadata.entries())
            }));

            setIsLoading(false);
            return;
          }
        }

        // Fallback a localStorage si Supabase falla o no es curador
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const data = JSON.parse(raw);
          const notes = new Set<string>((data.notes || []).map((n: any) => String(n)));
          const metadata = new Map<string, AuditMetadata>(
            (data.metadata || []).map(([k, v]: [any, any]) => [
              String(k),
              {
                noteId: String(v.noteId),
                auditedBy: String(v.auditedBy),
                auditedAt: String(v.auditedAt),
                comments: v.comments ? String(v.comments) : undefined
              }
            ])
          );
          
          setAuditedNotes(notes);
          setAuditMetadata(metadata);
        }
      } catch (error) {
        console.warn('Error loading audit data:', error);
        // Fallback a localStorage
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          try {
            const data = JSON.parse(raw);
            const notes = new Set<string>((data.notes || []).map((n: any) => String(n)));
            const metadata = new Map<string, AuditMetadata>(
              (data.metadata || []).map(([k, v]: [any, any]) => [
                String(k),
                {
                  noteId: String(v.noteId),
                  auditedBy: String(v.auditedBy),
                  auditedAt: String(v.auditedAt),
                  comments: v.comments ? String(v.comments) : undefined
                }
              ])
            );
            
            setAuditedNotes(notes);
            setAuditMetadata(metadata);
          } catch (e) {
            console.warn('Error parsing localStorage:', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAudits();
  }, [storageKey, isCurator]);

  // Guardar en Supabase cuando cambian (solo para curadores)
  useEffect(() => {
    if (typeof window === 'undefined' || !isCurator || isLoading) return;

    const saveToSupabase = async () => {
      try {
        // Para cada nota auditada, guardar/actualizar en Supabase
        const auditsToSave = Array.from(auditedNotes).map(noteId => {
          const meta = auditMetadata.get(noteId);
          return {
            note_id: noteId,
            auditor_name: meta?.auditedBy || user?.name || 'Unknown',
            audited_at: meta?.auditedAt || new Date().toISOString(),
            comments: meta?.comments || null,
            status: 'audited'
          };
        });

        // Upsert en batch (Supabase permite hasta 1000 registros)
        if (auditsToSave.length > 0 && user?.id) {
          const { error } = await (supabase as any)
            .from('apuntes_audits')
            .upsert(auditsToSave.map((audit: any) => ({
              ...audit,
              auditor_id: user.id
            })), {
              onConflict: 'note_id,auditor_id'
            });

          if (error) {
            console.warn('Error saving to Supabase, using localStorage:', error);
            // Guardar en localStorage como fallback
            localStorage.setItem(storageKey, JSON.stringify({
              notes: Array.from(auditedNotes),
              metadata: Array.from(auditMetadata.entries())
            }));
          }
        }

        // También guardar en localStorage como cache
        localStorage.setItem(storageKey, JSON.stringify({
          notes: Array.from(auditedNotes),
          metadata: Array.from(auditMetadata.entries())
        }));

        // Emitir evento para sincronizar pestañas
        window.dispatchEvent(
          new CustomEvent('apuntes-audit-changed', {
            detail: { 
              userId,
              count: auditedNotes.size, 
              notes: Array.from(auditedNotes) 
            }
          })
        );
      } catch (error) {
        console.warn('Error saving audit data:', error);
        // Fallback a localStorage
        localStorage.setItem(storageKey, JSON.stringify({
          notes: Array.from(auditedNotes),
          metadata: Array.from(auditMetadata.entries())
        }));
      }
    };

    saveToSupabase();
  }, [auditedNotes, auditMetadata, storageKey, userId, isCurator, isLoading, user?.id, user?.name]);

  // Escuchar cambios de otras pestañas
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const notes = new Set<string>((data.notes || []).map((n: any) => String(n)));
          const metadata = new Map<string, AuditMetadata>(
            (data.metadata || []).map(([k, v]: [any, any]) => [
              String(k),
              {
                noteId: String(v.noteId),
                auditedBy: String(v.auditedBy),
                auditedAt: String(v.auditedAt),
                comments: v.comments ? String(v.comments) : undefined
              }
            ])
          );
          
          setAuditedNotes(notes);
          setAuditMetadata(metadata);
        } catch (error) {
          console.warn('Error syncing audit data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  // Escuchar eventos personalizados (misma pestaña)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomEvent = async () => {
      // Recargar desde Supabase si es curador
      if (isCurator) {
        try {
          const { data, error } = await (supabase as any)
            .from('apuntes_audits')
            .select('note_id, auditor_name, audited_at, comments')
            .eq('status', 'audited');

          if (!error && data) {
            const notes = new Set<string>();
            const metadata = new Map<string, AuditMetadata>();

            data.forEach((audit: any) => {
              notes.add(String(audit.note_id));
              metadata.set(String(audit.note_id), {
                noteId: String(audit.note_id),
                auditedBy: String(audit.auditor_name),
                auditedAt: String(audit.audited_at),
                comments: audit.comments ? String(audit.comments) : undefined
              });
            });

            setAuditedNotes(new Set(Array.from(notes).map(n => String(n))));
            setAuditMetadata(new Map(Array.from(metadata.entries()).map(([k, v]) => [String(k), v])));
            return;
          }
        } catch (error) {
          console.warn('Error reloading from Supabase:', error);
        }
      }

      // Fallback a localStorage
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const data = JSON.parse(raw);
          const notes = new Set<string>((data.notes || []).map((n: any) => String(n)));
          const metadata = new Map<string, AuditMetadata>(
            (data.metadata || []).map(([k, v]: [any, any]) => [
              String(k),
              {
                noteId: String(v.noteId),
                auditedBy: String(v.auditedBy),
                auditedAt: String(v.auditedAt),
                comments: v.comments ? String(v.comments) : undefined
              }
            ])
          );
          
          setAuditedNotes(notes);
          setAuditMetadata(metadata);
        }
      } catch (error) {
        console.warn('Error reloading audit data:', error);
      }
    };

    window.addEventListener('apuntes-audit-changed', handleCustomEvent);
    return () => window.removeEventListener('apuntes-audit-changed', handleCustomEvent);
  }, [storageKey, isCurator]);

  const isAudited = useCallback((noteId: string): boolean => {
    return auditedNotes.has(noteId);
  }, [auditedNotes]);

  const toggleAudit = useCallback(async (noteId: string) => {
    const wasAudited = auditedNotes.has(noteId);

    if (wasAudited) {
      // Des-auditar
      setAuditedNotes(prev => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
      setAuditMetadata(prevMeta => {
        const nextMeta = new Map(prevMeta);
        nextMeta.delete(noteId);
        return nextMeta;
      });

      // Eliminar de Supabase si es curador
      if (isCurator && user?.id) {
        try {
          await (supabase as any)
            .from('apuntes_audits')
            .delete()
            .eq('note_id', noteId)
            .eq('auditor_id', user.id);
        } catch (error) {
          console.warn('Error deleting from Supabase:', error);
        }
      }
    } else {
      // Auditar
      const metadata: AuditMetadata = {
        noteId,
        auditedBy: user?.name || 'Unknown',
        auditedAt: new Date().toISOString()
      };

      setAuditedNotes(prev => {
        const next = new Set(prev);
        next.add(noteId);
        return next;
      });
      setAuditMetadata(prevMeta => {
        const nextMeta = new Map(prevMeta);
        nextMeta.set(noteId, metadata);
        return nextMeta;
      });

      // Guardar en Supabase inmediatamente si es curador
      if (isCurator && user?.id) {
        try {
          const { error } = await (supabase as any)
            .from('apuntes_audits')
            .upsert({
              note_id: noteId,
              auditor_id: user.id,
              auditor_name: user.name,
              audited_at: new Date().toISOString(),
              status: 'audited'
            }, {
              onConflict: 'note_id,auditor_id'
            });

          if (error) {
            console.warn('Error saving to Supabase:', error);
          }
        } catch (error) {
          console.warn('Error saving to Supabase:', error);
        }
      }
    }
  }, [auditedNotes, isCurator, user?.id, user?.name]);

  const getAuditMetadata = useCallback((noteId: string): AuditMetadata | null => {
    return auditMetadata.get(noteId) || null;
  }, [auditMetadata]);

  const getAllAuditedNotes = useCallback((): string[] => {
    return Array.from(auditedNotes);
  }, [auditedNotes]);

  const getAuditCount = useCallback((): number => {
    return auditedNotes.size;
  }, [auditedNotes]);

  return {
    isAudited,
    toggleAudit,
    getAuditMetadata,
    getAllAuditedNotes,
    getAuditCount,
    isLoading
  };
};
