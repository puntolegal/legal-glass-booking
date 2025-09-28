import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Crown,
  Eye,
  Database,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CorporateDashboardProps {
  user: any;
  onLogout: () => void;
}

interface Case {
  id: string;
  title: string;
  type: 'laboral' | 'comercial' | 'tributario' | 'dt';
  status: 'pendiente' | 'en_proceso' | 'resuelto' | 'apelacion';
  priority: 'baja' | 'media' | 'alta' | 'urgente';
  created_at: string;
  next_hearing?: string;
  projected_result?: string;
  estimated_cost?: number;
}

export default function CorporateDashboard({ user, onLogout }: CorporateDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si es administrador
  useEffect(() => {
    const checkAdminRole = async () => {
      // Por ahora, consideramos admin a cualquier usuario que se loguee
      // ya que la tabla profiles no tiene columna role
      setIsAdmin(true);
    };

    if (user) {
      checkAdminRole();
    }
  }, [user]);

  // Datos de ejemplo para el dashboard
  const mockCases: Case[] = [
    {
      id: '1',
      title: 'Causa Laboral - Despido Injustificado',
      type: 'laboral',
      status: 'en_proceso',
      priority: 'alta',
      created_at: '2025-01-10',
      next_hearing: '2025-02-15',
      projected_result: 'Favorable (85%)',
      estimated_cost: 2500000
    },
    {
      id: '2',
      title: 'Comparendo DT - Horas Extra',
      type: 'dt',
      status: 'pendiente',
      priority: 'media',
      created_at: '2025-01-12',
      next_hearing: '2025-01-25',
      projected_result: 'Favorable (70%)',
      estimated_cost: 800000
    },
    {
      id: '3',
      title: 'Contrato Comercial - Incumplimiento',
      type: 'comercial',
      status: 'resuelto',
      priority: 'baja',
      created_at: '2024-12-15',
      projected_result: 'Resuelto favorablemente',
      estimated_cost: 1500000
    },
    {
      id: '4',
      title: 'Fiscalización SII - Prescripción',
      type: 'tributario',
      status: 'apelacion',
      priority: 'urgente',
      created_at: '2024-11-20',
      next_hearing: '2025-03-10',
      projected_result: 'Favorable (90%)',
      estimated_cost: 3500000
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCases(mockCases);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || case_.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.status === 'pendiente').length,
    inProgress: cases.filter(c => c.status === 'en_proceso').length,
    resolved: cases.filter(c => c.status === 'resuelto').length,
    urgent: cases.filter(c => c.priority === 'urgente').length,
    totalCost: cases.reduce((sum, c) => sum + (c.estimated_cost || 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'text-yellow-500 bg-yellow-500/10';
      case 'en_proceso': return 'text-blue-500 bg-blue-500/10';
      case 'resuelto': return 'text-green-500 bg-green-500/10';
      case 'apelacion': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'text-red-500 bg-red-500/10';
      case 'alta': return 'text-orange-500 bg-orange-500/10';
      case 'media': return 'text-yellow-500 bg-yellow-500/10';
      case 'baja': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'laboral': return <Users className="w-4 h-4" />;
      case 'comercial': return <Building2 className="w-4 h-4" />;
      case 'tributario': return <DollarSign className="w-4 h-4" />;
      case 'dt': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white p-4 sm:p-6 shadow-2xl shadow-blue-500/20">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20">
                {isAdmin ? <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" /> : <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-200" />}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl font-bold truncate bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {isAdmin ? 'Panel Administrativo' : 'Portal Corporativo'}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base truncate mt-1">{user?.email}</p>
                {isAdmin && (
                  <div className="flex items-center gap-2 mt-2">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-amber-300 font-semibold bg-amber-500/20 px-2 py-1 rounded-full">Administrador</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Premium */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 sm:space-x-2 min-w-max">
              {[
                { id: 'overview', label: 'Resumen', icon: BarChart3, shortLabel: 'Resumen' },
                { id: 'cases', label: 'Causas', icon: FileText, shortLabel: 'Causas' },
                { id: 'hearings', label: 'Comparendos', icon: Calendar, shortLabel: 'Audiencias' },
                { id: 'projections', label: 'Proyecciones', icon: TrendingUp, shortLabel: 'Proyecciones' },
                ...(isAdmin ? [
                  { id: 'admin', label: 'Administración', icon: Crown, shortLabel: 'Admin' },
                  { id: 'analytics', label: 'Analytics', icon: Activity, shortLabel: 'Analytics' }
                ] : []),
                { id: 'settings', label: 'Configuración', icon: Settings, shortLabel: 'Config' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { label: 'Total Causas', value: stats.total, icon: FileText, color: 'blue' },
                { label: 'Pendientes', value: stats.pending, icon: Clock, color: 'yellow' },
                { label: 'En Proceso', value: stats.inProgress, icon: TrendingUp, color: 'blue' },
                { label: 'Resueltas', value: stats.resolved, icon: CheckCircle, color: 'green' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-slate-700/40 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-${stat.color}-500/30`}>
                      <stat.icon className={`w-5 h-5 sm:w-7 sm:h-7 text-white`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-slate-700/40">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-amber-700 dark:text-amber-300">Nueva Causa</span>
                </button>
                <button className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-blue-700 dark:text-blue-300">Agendar Comparendo</span>
                </button>
                <button className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-emerald-700 dark:text-emerald-300">Ver Proyecciones</span>
                </button>
              </div>
            </div>

            {/* Recent Cases */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-slate-700/40">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Causas Recientes</h3>
              <div className="space-y-3 sm:space-y-4">
                {cases.slice(0, 3).map((case_) => (
                  <div key={case_.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl gap-3 border border-white/40 dark:border-slate-600/40 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        {getTypeIcon(case_.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm sm:text-base truncate">{case_.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{case_.created_at}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {case_.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-600" />
                Panel de Administración
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                    <h4 className="font-bold text-blue-900">Gestión de Usuarios</h4>
                  </div>
                  <p className="text-blue-700 text-sm mb-4">Administra usuarios corporativos y sus permisos</p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Gestionar Usuarios
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-8 h-8 text-green-600" />
                    <h4 className="font-bold text-green-900">Base de Datos</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-4">Acceso completo a todas las tablas del sistema</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Ver Base de Datos
                  </button>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <h4 className="font-bold text-purple-900">Logs del Sistema</h4>
                  </div>
                  <p className="text-purple-700 text-sm mb-4">Revisa la actividad y logs del sistema</p>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Ver Logs
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Analytics del Sistema
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-bold mb-4">Estadísticas Generales</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total de empresas:</span>
                      <span className="font-bold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Causas activas:</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ingresos mensuales:</span>
                      <span className="font-bold">$45.2M</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <h4 className="font-bold mb-4">Actividad Reciente</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Nuevos usuarios:</span>
                      <span className="font-bold text-green-600">+12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Causas resueltas:</span>
                      <span className="font-bold text-blue-600">+8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comparendos:</span>
                      <span className="font-bold text-orange-600">+5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'cases' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar causas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="laboral">Laboral</option>
                  <option value="comercial">Comercial</option>
                  <option value="tributario">Tributario</option>
                  <option value="dt">DT</option>
                </select>
              </div>
            </div>

            {/* Cases List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold">Todas las Causas</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredCases.map((case_) => (
                  <div key={case_.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(case_.type)}
                        <div>
                          <h4 className="font-medium">{case_.title}</h4>
                          <p className="text-sm text-gray-500">Creada: {case_.created_at}</p>
                          {case_.next_hearing && (
                            <p className="text-sm text-blue-600">Próxima audiencia: {case_.next_hearing}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Proyección</p>
                          <p className="font-medium text-green-600">{case_.projected_result}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                            {case_.status.replace('_', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(case_.priority)}`}>
                            {case_.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'hearings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold mb-6">Comparendos y Audiencias</h3>
            <div className="space-y-4">
              {cases.filter(c => c.next_hearing).map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="font-medium">{case_.title}</h4>
                      <p className="text-sm text-amber-600">Audiencia: {case_.next_hearing}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'projections' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Proyecciones de Resultados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cases.map((case_) => (
                  <div key={case_.id} className="p-4 border border-gray-200 rounded-xl">
                    <h4 className="font-medium mb-2">{case_.title}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Probabilidad de éxito:</span>
                        <span className="font-medium text-green-600">{case_.projected_result}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Costo estimado:</span>
                        <span className="font-medium">${case_.estimated_cost?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                          {case_.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold mb-6">Configuración de Cuenta</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Cambiar
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium">Notificaciones</h4>
                  <p className="text-sm text-gray-500">Configurar alertas</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 