import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Bell,
  BookOpen,
  Zap,
  Flame,
  Menu,
  X,
  Filter,
  Grid,
  List,
  UserCircle,
  Users,
  ChevronRight,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DarkModeToggle from './DarkModeToggle';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditManager } from '@/hooks/useAuditManager';
import { AmandaProfileCard } from './AmandaProfileCard';
import AmandaAccessModal from './AmandaAccessModal';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ApuntesHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onFiltersToggle?: () => void;
  showFilters?: boolean;
  breadcrumbs?: Breadcrumb[];
  showBackButton?: boolean;
}

const mutedCardClass =
  'rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/90 via-white/85 to-white/80 dark:from-slate-900/90 dark:via-slate-800/85 dark:to-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-white/15 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.2),inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)]';

// Componente para posicionar el dropdown correctamente - Mejorado
const DropdownPositioner: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [position, setPosition] = React.useState({ top: 0, right: 0 });
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Solo funcionar en desktop (>= 640px)
    if (!isOpen || window.innerWidth < 640) return;

    const updatePosition = () => {
      // Solo actualizar si estamos en desktop
      if (window.innerWidth < 640) return;
      
      const button = document.querySelector('.amanda-dropdown-container') as HTMLElement;
      if (button && dropdownRef.current) {
        const rect = button.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight || 280;
        const spacing = 8;
        const viewportHeight = window.innerHeight;
        
        // Calcular posición arriba del botón
        const topPosition = rect.top - dropdownHeight - spacing;
        
        // Si no cabe arriba, mostrar abajo
        const finalTop = topPosition < 16 
          ? rect.bottom + spacing 
          : topPosition;
        
        setPosition({
          top: Math.max(16, Math.min(finalTop, viewportHeight - dropdownHeight - 16)),
          right: Math.max(16, window.innerWidth - rect.right),
        });
      }
    };

    // Delay pequeño para asegurar que el DOM esté listo
    const timeoutId = setTimeout(updatePosition, 10);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  // No mostrar en móvil
  if (!isOpen || window.innerWidth < 640) return null;

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 35,
        mass: 0.8
      }}
      className="hidden sm:block amanda-dropdown-popup fixed z-[70] w-80 max-w-sm pointer-events-auto"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <AmandaProfileCard />
    </motion.div>
  );
};

const ApuntesHeader: React.FC<ApuntesHeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  onFiltersToggle,
  showFilters = false,
  breadcrumbs = [],
  showBackButton = false
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [isAmandaDropdownOpen, setIsAmandaDropdownOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { progress, getProgressPercentage, getNextMilestone } = useGamification();
  const { user, isAuthenticated, isCurator } = useAuth();
  const { getAuditCount, isAudited } = useAuditManager();
  
  // Contar notas pendientes
  const [pendingAudits, setPendingAudits] = React.useState(0);
  
  React.useEffect(() => {
    if (!isCurator) return;
    // Contar notas pendientes
    import('@/pages/apuntes/data/apuntes.json').then((module) => {
      const apuntes = module.default?.apuntes || [];
      const auditedCount = apuntes.filter((a: any) => isAudited(a.id)).length;
      setPendingAudits(Math.max(0, apuntes.length - auditedCount));
    }).catch(() => setPendingAudits(0));
  }, [isCurator, isAudited]);

  const safeProgress = progress || { 
    notesRead: 0,
    readNotes: new Set<string>(), 
    totalPoints: 0, 
    currentStreak: 0, 
    longestStreak: 0,
    dailyNotesRead: {}
  };
  const totalPoints = safeProgress.totalPoints || 0;
  const progressPercentage = getProgressPercentage ? getProgressPercentage() : 0;
  const nextMilestoneData = getNextMilestone ? getNextMilestone() : { milestone: 100 };
  const nextMilestone = nextMilestoneData?.milestone ?? 100;
  const currentLevel = Math.max(1, Math.floor(totalPoints / 100) + 1);
  const today = new Date().toDateString();
  const todaysReads = safeProgress.dailyNotesRead?.[today]?.length || 0;
  const pendingGoal = Math.max(0, 3 - todaysReads);
  const completed = safeProgress.readNotes ? safeProgress.readNotes.size : safeProgress.notesRead;

  useEffect(() => {
    if (isAuthenticated) {
      setShowAccessModal(false);
    }
  }, [isAuthenticated]);

  // Cerrar dropdown de Amanda al hacer click fuera - Mejorado para móvil
  useEffect(() => {
    if (!isAmandaDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const isClickInsideDropdown = target.closest('.amanda-dropdown-container') || 
                                    target.closest('.amanda-dropdown-popup');
      
      if (!isClickInsideDropdown) {
        setIsAmandaDropdownOpen(false);
      }
    };

    // Usar timeout más largo para móvil y agregar touch events
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isAmandaDropdownOpen]);

  // Ocultar header al hacer scroll hacia abajo - Animación suave estilo iPad
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY;
          
          // No ocultar en los primeros 300px (espacio para mensaje de bienvenida)
          if (currentScrollY < 300) {
            setIsHeaderVisible(true);
          } else if (scrollDelta > 15 && currentScrollY > 500) {
            // Scroll hacia abajo - ocultar solo después de 500px y con delta mayor
            setIsHeaderVisible(false);
          } else if (scrollDelta < -10) {
            // Scroll hacia arriba - mostrar inmediatamente
            setIsHeaderVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-3 md:px-4"
        initial={{ y: -40, opacity: 0 }}
        animate={{ 
          y: isHeaderVisible ? 0 : -120, 
          opacity: isHeaderVisible ? 1 : 0 
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 35,
          mass: 0.8
        }}
      >
        <div className="relative mx-auto max-w-[1100px] rounded-xl sm:rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-[#0B1121]/70 backdrop-blur-xl shadow-[0px_4px_16px_-8px_rgba(15,23,42,0.2)] dark:shadow-[0px_4px_16px_-8px_rgba(0,0,0,0.3)] overflow-visible" style={{ zIndex: 40 }}>
          <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.2),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.1),transparent_60%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/50 dark:bg-white/10" />
          </div>

          <div className="relative px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 space-y-1 sm:space-y-1.5 overflow-x-hidden">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0 w-full">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 min-w-0 flex-1 sm:flex-initial max-w-full">
                {showBackButton ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-white/40 text-slate-800 dark:text-white flex-shrink-0"
                    onClick={() => navigate('/apuntes')}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200/50 dark:border-slate-700/40 bg-gradient-to-br from-slate-50/90 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700/90 dark:text-slate-300/90" />
                  </div>
                )}
                <div className="min-w-0 flex-1 sm:flex-initial overflow-hidden">
                  <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-slate-600/80 dark:text-slate-400/80 font-medium truncate leading-none">
                    Punto Legal · Colección Magistral
                  </p>
                  <h1 className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-tight text-slate-900 dark:text-white truncate leading-tight mt-0.5">
                    Sistema de Apuntes
                  </h1>
                </div>
              </div>

              {breadcrumbs.length > 0 && (
                <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={`${crumb.label}-${index}`}>
                      {index > 0 && <ChevronRight className="w-3 h-3 opacity-60" />}
                      {crumb.href ? (
                        <Link
                          to={crumb.href}
                          className="px-2 py-1 rounded-lg border border-white/40 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/5 text-slate-700 dark:text-slate-100"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="px-2 py-1 rounded-lg bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/5 text-slate-900 dark:text-white">
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <div className="ml-auto flex items-center justify-end gap-1 sm:gap-1.5 flex-shrink-0 min-w-0 max-w-full">
                {onFiltersToggle && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl border text-slate-600 dark:text-slate-200 flex-shrink-0 ${
                      showFilters ? 'border-slate-500/60 dark:border-slate-400/60 bg-slate-100/50 dark:bg-slate-800/50' : 'border-white/30 dark:border-white/10'
                    }`}
                    onClick={onFiltersToggle}
                  >
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                )}
                {onViewModeChange && (
                  <div className="hidden sm:flex rounded-xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-950/50">
                    <button
                      onClick={() => onViewModeChange('grid')}
                      className={`w-10 h-9 rounded-xl flex items-center justify-center text-sm ${
                        viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewModeChange('list')}
                      className={`w-10 h-9 rounded-xl flex items-center justify-center text-sm ${
                        viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 dark:text-slate-300'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="hidden md:block border border-white/30 dark:border-white/10 rounded-xl flex-shrink-0">
                  <DarkModeToggle />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-white/30 dark:border-white/10 text-slate-600 dark:text-slate-200 flex-shrink-0">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Link
                  to="/auth"
                    className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/40 bg-slate-50/70 dark:bg-slate-800/50 text-[10px] tracking-[0.3em] uppercase text-slate-700/90 dark:text-slate-300/90 hover:bg-slate-100/80 dark:hover:bg-slate-700/60 hover:border-slate-300/60 dark:hover:border-slate-600/50 transition-all font-semibold flex-shrink-0"
                  >
                    Acceso
                  </Link>
                  {isAuthenticated && isCurator && (
                <Link
                      to="/apuntes/auditoria"
                      className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-dashed border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/10 text-[10px] tracking-[0.3em] uppercase text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/15 transition-all font-semibold relative flex-shrink-0"
                    >
                      Mesa de Auditores
                      {pendingAudits > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
                          {pendingAudits > 9 ? '9+' : pendingAudits}
                        </span>
                      )}
                </Link>
                  )}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="sm:hidden h-8 w-8 rounded-xl border border-white/30 dark:border-white/10 text-slate-700 dark:text-white flex-shrink-0"
                >
                  {isMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
                </button>
                {/* Botones para usuarios no autenticados */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Botón Acceso - Para usuarios nuevos */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Navegar a página de registro/login de usuarios
                        // Por ahora, mostrar modal de acceso
                        setShowAccessModal(true);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAccessModal(true);
                      }}
                      className="h-8 px-2.5 sm:px-3 rounded-full border border-indigo-500/30 dark:border-indigo-500/20 bg-indigo-500/10 dark:bg-indigo-500/10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/15 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                    >
                      <span className="hidden xs:inline">Acceso</span>
                      <UserCircle className="w-3.5 h-3.5 xs:hidden" strokeWidth={1.5} />
                    </button>
                    {/* Botón Staff - Para mesa de auditores */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAccessModal(true);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAccessModal(true);
                      }}
                      className="h-8 px-2.5 sm:px-3 rounded-full border border-white/30 dark:border-white/10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                    >
                      <span className="hidden xs:inline">Staff</span>
                      <Shield className="w-3.5 h-3.5 xs:hidden" strokeWidth={1.5} />
                    </button>
                  </div>
                )}
                {isAuthenticated ? (
                  <div className="relative amanda-dropdown-container">
                    {/* En móvil: navegar directamente a Mesa de Auditores */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // En móvil, navegar directamente
                        if (window.innerWidth < 640) {
                          navigate('/apuntes/auditoria');
                          return;
                        }
                        setIsAmandaDropdownOpen(prev => !prev);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // En móvil, navegar directamente
                        if (window.innerWidth < 640) {
                          navigate('/apuntes/auditoria');
                          return;
                        }
                        setIsAmandaDropdownOpen(prev => !prev);
                      }}
                      className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-1.5 pr-1 sm:pr-1.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/10 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/15 transition-all shadow-sm flex-shrink-0"
                    >
                      <div className="hidden sm:block text-right min-w-0 max-w-[90px] sm:max-w-[110px]">
                        <p className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 truncate">{user.name}</p>
                        <p className="text-[7px] sm:text-[8px] text-emerald-600 dark:text-emerald-400 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium truncate">Auditoría</p>
                      </div>
                      <div className="relative flex-shrink-0">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-bold shadow-md">
                          {user.name === 'Amanda G.' ? 'AG' : user.name === 'Benjamin' ? 'BS' : user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        {pendingAudits > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-red-500 text-white text-[7px] sm:text-[8px] font-bold flex items-center justify-center border-2 border-white dark:border-[#1c1c1e]">
                            {pendingAudits > 9 ? '9+' : pendingAudits}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Botón Acceso - Para usuarios nuevos */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Navegar a página de registro/login de usuarios
                        // Por ahora, mostrar modal de acceso
                        setShowAccessModal(true);
                      }}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-indigo-500/30 dark:border-indigo-500/20 bg-indigo-500/10 dark:bg-indigo-500/10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/15 active:scale-95 transition-all cursor-pointer"
                    >
                      <UserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Acceso</span>
                    </button>
                    {/* Botón Staff - Para mesa de auditores */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAccessModal(true);
                      }}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-white/30 dark:border-white/10 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                      <span className="hidden sm:inline">Staff</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {onSearchChange && (
              <div className="border-t border-white/30 dark:border-white/15 pt-2 sm:pt-3">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Buscar notas, conceptos..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-9 sm:h-10 md:h-11 pl-9 sm:pl-11 md:pl-12 pr-3 sm:pr-4 rounded-full bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-sm border border-white/20 dark:border-white/5 text-xs sm:text-sm text-[#1d1d1f] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 dark:focus:border-indigo-500/30 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-1.5">
              <div className={`${mutedCardClass} p-1.5 sm:p-2 group hover:scale-[1.01] transition-transform cursor-default`}>
                <p className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-600/70 dark:text-slate-400/70 mb-0.5 sm:mb-1 leading-tight">Notas aprobadas</p>
                <div className="flex items-end justify-between gap-1">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">{completed}</span>
                  <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" strokeWidth={1.5} />
                </div>
              </div>
              <div className={`${mutedCardClass} p-1.5 sm:p-2 group hover:scale-[1.01] transition-transform cursor-default`}>
                <p className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-600/70 dark:text-slate-400/70 mb-0.5 sm:mb-1 leading-tight">Nivel actual</p>
                <div className="flex items-end justify-between gap-1">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">{currentLevel}</span>
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" strokeWidth={1.5} />
                </div>
              </div>
              <div className={`${mutedCardClass} p-1.5 sm:p-2 group hover:scale-[1.01] transition-transform cursor-default`}>
                <p className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-600/70 dark:text-slate-400/70 mb-0.5 sm:mb-1 leading-tight">Meta diaria</p>
                <div className="flex items-end justify-between gap-1">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">{pendingGoal}<span className="text-[10px] sm:text-xs font-normal text-slate-500 dark:text-slate-400">/3</span></span>
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" strokeWidth={1.5} />
                </div>
              </div>
              <div className={`${mutedCardClass} p-1.5 sm:p-2 group hover:scale-[1.01] transition-transform cursor-default`}>
                <p className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-600/70 dark:text-slate-400/70 mb-0.5 sm:mb-1 leading-tight">Próximo hito</p>
                <div className="flex items-end justify-between gap-1">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-[#1d1d1f] dark:text-white tabular-nums leading-none">{nextMilestone - totalPoints}</span>
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="h-14 sm:h-16 md:h-20" />

      {/* Dropdown de Amanda - Portal fuera del header - Solo en desktop */}
      <AnimatePresence>
        {isAmandaDropdownOpen && window.innerWidth >= 640 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsAmandaDropdownOpen(false)}
            />
            <DropdownPositioner
              isOpen={isAmandaDropdownOpen}
              onClose={() => setIsAmandaDropdownOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            className="fixed inset-y-0 right-0 z-50 w-80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-l border-white/10 dark:border-slate-800/60 shadow-2xl"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold tracking-[0.4em] text-slate-500 dark:text-slate-400 uppercase">
                  Panel móvil
                </p>
                <button
                  className="h-10 w-10 rounded-xl border border-white/30 text-slate-600 dark:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className={`${mutedCardClass} p-4`}>
                  <p className="text-xs text-slate-500 dark:text-slate-300 uppercase tracking-[0.4em]">Buscador</p>
                  {onSearchChange && (
                    <div className="mt-3 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar conceptos"
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-white/40 dark:border-white/10"
                      />
                    </div>
                  )}
                </div>

                <div className={`${mutedCardClass} p-4`}>
                  <p className="text-xs text-slate-500 dark:text-slate-300 uppercase tracking-[0.4em] mb-3">Controles</p>
                  <div className="flex items-center gap-2">
                    {onFiltersToggle && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 rounded-xl border text-slate-600 dark:text-white ${
                          showFilters ? 'border-blue-400 text-blue-600 dark:text-blue-300' : 'border-white/30 dark:border-white/10'
                        }`}
                        onClick={onFiltersToggle}
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                    )}
                    {onViewModeChange && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl border border-white/30 dark:border-white/10 text-slate-600 dark:text-white"
                        onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
                      >
                        {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                      </Button>
                    )}
                    <DarkModeToggle />
                  </div>
                </div>

                <div className={`${mutedCardClass} p-4 space-y-2`}>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                    <span>Notas completadas</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                    <span>Racha activa</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{safeProgress.currentStreak} días</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                    <span>Meta pendiente</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{pendingGoal}</span>
                  </div>
                </div>
                <div className={`${mutedCardClass} p-4 space-y-3`}>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-300">Sesiones</p>
                  <Link
                    to="/auth"
                    className="block w-full rounded-xl border border-white/30 dark:border-white/10 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  {isAuthenticated && isCurator && (
                  <Link
                      to="/apuntes/auditoria"
                      className="block w-full rounded-xl border border-emerald-400/70 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300 text-center hover:bg-emerald-50/70 dark:hover:bg-emerald-900/30 transition-colors relative"
                    >
                      Auditoría
                      {pendingAudits > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                          {pendingAudits > 9 ? '9+' : pendingAudits}
                        </span>
                      )}
                  </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AmandaAccessModal open={!isAuthenticated && showAccessModal} onClose={() => setShowAccessModal(false)} />
    </>
  );
};

export default ApuntesHeader;
