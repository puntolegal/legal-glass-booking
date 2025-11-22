import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AmandaAccessModalProps {
  open: boolean;
  onClose: () => void;
}

const AmandaAccessModal: React.FC<AmandaAccessModalProps> = ({ open, onClose }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setCode('');
      setError('');
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    // Normalizar: quitar espacios al inicio y final, convertir a minúsculas
    const normalizedName = name.trim().toLowerCase();
    const normalizedCode = code.trim().toLowerCase();

    // Validar Amanda
    if ((normalizedName === 'amanda' || normalizedName === 'amanda g.' || normalizedName === 'amandag.') && normalizedCode === 'admin') {
      login('amanda');
      toast.success('Bienvenida de vuelta, Amanda.');
      onClose();
      return;
    }

    // Validar Benjamin
    if (normalizedName === 'benjamin' && normalizedCode === 'admin') {
      login('benjamin');
      toast.success('Bienvenido, Benjamin.');
      onClose();
      return;
    }

    // Si llegamos aquí, las credenciales son inválidas
    setError('Credenciales inválidas. Verifica tu nombre y clave.');
  };

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 dark:bg-slate-950/90 backdrop-blur-md px-4 py-4 sm:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] border-2 border-white/40 dark:border-white/30 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 backdrop-blur-xl p-5 sm:p-6 md:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 101, position: 'relative' }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 sm:right-4 top-3 sm:top-4 h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/20 transition-all z-10"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
            <div className="pr-10 sm:pr-12">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-200 dark:text-slate-100 font-semibold">Panel interno</p>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold leading-tight text-white">Acceso Mesa de Auditores</h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-200 dark:text-slate-100 leading-relaxed">
                Autentica tu identidad para habilitar la Mesa de Auditoría.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-slate-200 dark:text-slate-100 font-semibold">Identificación</label>
                <input
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-400 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase text-slate-200 dark:text-slate-100 font-semibold">Clave</label>
                <input
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-400 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código"
                  type="password"
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="text-xs sm:text-sm font-semibold text-rose-400 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 dark:border-rose-500/20 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Activar
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AmandaAccessModal;
