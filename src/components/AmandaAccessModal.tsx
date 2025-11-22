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

    const normalizedName = name.trim().toLowerCase();
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedName === 'amanda' && normalizedCode === 'ADMIN') {
      login();
      toast.success('Modo Auditoría activado.');
      onClose();
    } else {
      setError('Credenciales inválidas. Verifica tu nombre y clave.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/15 bg-white/10 p-6 sm:p-8 text-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 h-10 w-10 rounded-full border border-white/20 backdrop-blur"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-[11px] uppercase tracking-[0.4em] text-slate-200">Panel interno</p>
            <h2 className="mt-2 text-2xl font-semibold">Acceso Mesa de Auditores</h2>
            <p className="mt-2 text-sm text-slate-200/80">
              Autentica tu identidad para habilitar la Mesa de Auditoría.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs tracking-[0.4em] uppercase text-slate-300">Identificación</label>
                <input
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-[0.4em] uppercase text-slate-300">Clave</label>
                <input
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código"
                  type="password"
                  autoComplete="off"
                />
              </div>

              {error && <div className="text-xs font-semibold text-rose-400">{error}</div>}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-xs font-semibold uppercase tracking-[0.4em]"
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
