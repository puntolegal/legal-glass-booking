// RUTA: src/pages/apuntes/AuditoriaPage.tsx
// 🍎 Mesa de Auditores - Estilo iPad Paper Premium

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  ArrowLeft,
  Shield,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditManager } from '@/hooks/useAuditManager';
import EnhancedApuntesCard from '@/components/EnhancedApuntesCard';
import apuntesDataFile from './data/apuntes.json';

const apuntesData = apuntesDataFile.apuntes || [];

interface ApunteData {
  id: string;
  title: string;
  content?: string;
  category: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado' | string;
  readTime?: number;
  lastModified: string;
  slug: string;
  author: string;
  concepts?: string[];
  points?: number;
  excerpt?: string;
  estimatedTime?: string;
  date?: string;
  tags?: string[];
  related?: string[];
  filePath?: string;
  links?: string[];
}

const AuditoriaPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCurator, user } = useAuth();
  const { isAudited, getAuditCount, isLoading } = useAuditManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'Todas' | 'Pendientes' | 'Auditadas'>('Pendientes');

  // Redirigir si no es curador
  React.useEffect(() => {
    if (!isCurator) {
      navigate('/apuntes');
    }
  }, [isCurator, navigate]);

  // Estado para forzar re-render
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Filtrar notas
  const filteredApuntes = useMemo(() => {
    return apuntesData.filter((apunte: any) => {
      const matchesSearch = apunte.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            apunte.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const auditStatus = isAudited(apunte.id);
      
      if (filter === 'Pendientes') return matchesSearch && !auditStatus;
      if (filter === 'Auditadas') return matchesSearch && auditStatus;
      return matchesSearch;
    });
  }, [searchQuery, filter, isAudited, refreshKey]);

  // Recargar cuando cambie el estado de auditoría
  React.useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('apuntes-audit-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('apuntes-audit-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const pendingCount = apuntesData.filter((a: any) => !isAudited(a.id)).length;
  const auditedCount = apuntesData.filter((a: any) => isAudited(a.id)).length;

  if (!isCurator) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* Header Minimalista */}
      <div className="sticky top-0 z-30 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/apuntes')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="text-sm font-medium">Volver</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section - Estilo iPad Paper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight mb-3">
                Mesa de Auditores
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-medium mb-6">
                El estándar lo defines tú{user?.name === 'Amanda G.' ? ', Amanda' : user?.name === 'Benjamin' ? ', Benjamin' : ''}.
              </p>
            </div>
          </div>

          {/* Tarjeta Personal - Estilo Paper */}
          {user?.name === 'Amanda G.' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
            >
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed italic">
                El caos no es más que un orden que aún no ha sido descifrado. Tú posees la cifra. Gracias por ser la mirada que transforma el ruido en arquitectura. Aquí no solo archivamos leyes; aquí estamos decidiendo la memoria.
              </p>
            </motion.div>
          ) : user?.name === 'Benjamin' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
            >
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                En un mar de información, la claridad es el único lujo verdadero. Gracias por aportar tu visión a esta arquitectura. Sigamos construyendo algo que perdure.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
            >
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                En un mar de información, la claridad es el único lujo verdadero. Gracias por aportar tu visión a esta arquitectura. Sigamos construyendo algo que perdure.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats - Estilo iOS Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-slate-200 rounded-2xl p-1 inline-flex gap-1">
            <button
              onClick={() => setFilter('Pendientes')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                filter === 'Pendientes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" strokeWidth={2} />
                <span>Pendientes</span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {pendingCount}
                </span>
              </div>
            </button>
            <button
              onClick={() => setFilter('Auditadas')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                filter === 'Auditadas'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" strokeWidth={2} />
                <span>Completadas</span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                  {auditedCount}
                </span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Búsqueda - Estilo iOS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Buscar notas por título o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 shadow-sm transition-all"
            />
          </div>
        </motion.div>

        {/* Lista de Notas */}
        {filteredApuntes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredApuntes.map((apunte: any) => (
              <EnhancedApuntesCard
                key={apunte.id}
                apunte={apunte}
                viewMode="grid"
                isAudited={isAudited(apunte.id)}
                showAuditStatus={true}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
                {filter === 'Pendientes' ? '¡Todo auditado!' : 'No hay notas'}
              </h3>
              <p className="text-slate-600">
                {filter === 'Pendientes' 
                  ? 'Todas las notas han sido validadas.' 
                  : 'No se encontraron notas con este filtro.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuditoriaPage;
