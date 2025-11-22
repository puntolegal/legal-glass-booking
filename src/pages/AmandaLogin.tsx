import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { Shield, Lock, User, Terminal, Code2, Database } from 'lucide-react';

const AmandaLogin: React.FC = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = (location.state as any)?.from?.pathname || '/apuntes';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    // Normalizar: quitar espacios al inicio y final, convertir a minúsculas
    const normalizedName = name.trim().toLowerCase();
    const normalizedCode = code.trim().toLowerCase();

    // Debug en consola
    console.log('🔍 Login attempt:', { 
      name: name,
      code: code,
      normalizedName, 
      normalizedCode 
    });

    // Validar Amanda
    if ((normalizedName === 'amanda' || normalizedName === 'amanda g.' || normalizedName === 'amandag.') && normalizedCode === 'admin') {
      console.log('✅ Amanda login successful');
      login('amanda');
      toast.success('Bienvenida de vuelta, Amanda.');
      const redirectPath = (location.state as any)?.from?.pathname || '/apuntes';
      navigate(redirectPath, { replace: true });
      return;
    }

    // Validar Benjamin - Comparación exacta en minúsculas
    if (normalizedName === 'benjamin' && normalizedCode === 'admin') {
      console.log('✅ Benjamin login successful');
      login('benjamin');
      toast.success('Bienvenido, Benjamin.');
      const redirectPath = (location.state as any)?.from?.pathname || '/apuntes';
      navigate(redirectPath, { replace: true });
      return;
    }

    // Si llegamos aquí, las credenciales son inválidas
    console.error('❌ Invalid credentials:', { 
      received: { name: normalizedName, code: normalizedCode },
      expected: {
        amanda: { name: 'amanda', code: 'admin' },
        benjamin: { name: 'benjamin', code: 'admin' }
      }
    });
    setError(`Credenciales inválidas. Verifica tu nombre y clave.`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#000000] flex items-center justify-center p-6 relative">
      <AmbientBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[32px] shadow-xl shadow-black/10 p-8 space-y-8">
          {/* Header Técnico */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-stone-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400 font-semibold">Mesa de Auditoría</p>
                <h1 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-white">Acceso Amanda</h1>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Autentica tu identidad para habilitar la Mesa de Auditoría. Este acceso es exclusivo para personal autorizado.
            </p>
          </div>

          {/* Indicadores Técnicos */}
          <div className="grid grid-cols-3 gap-3 pb-4 border-b border-white/20 dark:border-white/5">
            <div className="text-center">
              <Terminal className="w-4 h-4 text-slate-400 mx-auto mb-1" strokeWidth={1.5} />
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Sistema</p>
            </div>
            <div className="text-center">
              <Database className="w-4 h-4 text-slate-400 mx-auto mb-1" strokeWidth={1.5} />
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Base</p>
            </div>
            <div className="text-center">
              <Code2 className="w-4 h-4 text-slate-400 mx-auto mb-1" strokeWidth={1.5} />
              <p className="text-[9px] uppercase tracking-wider text-slate-500">API</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amanda-name" className="text-xs uppercase tracking-[0.4em] text-slate-600 dark:text-slate-400 font-semibold">
                Identificación
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <Input
                  id="amanda-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 text-[#1d1d1f] dark:text-white placeholder:text-slate-400 rounded-xl font-mono"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amanda-code" className="text-xs uppercase tracking-[0.4em] text-slate-600 dark:text-slate-400 font-semibold">
                Clave
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <Input
                  id="amanda-code"
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código"
                  className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 text-[#1d1d1f] dark:text-white placeholder:text-slate-400 rounded-xl font-mono"
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs font-medium text-rose-500 dark:text-rose-400 tracking-wide bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 rounded-xl p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-semibold tracking-[0.2em] uppercase hover:opacity-90 transition-all shadow-lg"
            >
              Activar
            </Button>
          </form>

          <div className="pt-4 border-t border-white/20 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
            <p className="tracking-[0.3em] uppercase mb-1">Seguridad activa</p>
            <p className="text-slate-400 dark:text-slate-500">
              El acceso está protegido y toda la actividad se registra para control interno.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AmandaLogin;
