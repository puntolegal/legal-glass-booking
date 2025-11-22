import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';
import DarkModeToggle from './DarkModeToggle';
import { 
  Home as HomeIcon,
  Building2,
  Briefcase,
  Heart,
  Scale,
  Shield,
  Globe,
  Calculator,
  FileText,
  MessageCircle,
  Video,
  BookOpen,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Menu as MenuIcon,
  X,
  Clock,
  Phone,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  AlertTriangle,
  Sparkles,
  Star,
  Award,
  Users,
  BarChart3,
  Settings,
  LogOut,
  HelpCircle,
  ChevronLeft,
  Calendar,
  Moon
} from 'lucide-react';
import { serviceThemes } from '../config/serviceThemes';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: MenuItem[];
  isNew?: boolean;
  isPro?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: HomeIcon,
    href: '/'
  },
  {
    id: 'services',
    label: 'Servicios Legales',
    icon: Scale,
    children: [
      {
        id: 'corporate',
        label: 'Corporativo',
        icon: Building2,
        href: '/servicios/corporativo',
        badge: 'Popular'
      },
      {
        id: 'real-estate',
        label: 'Inmobiliario',
        icon: HomeIcon,
        href: '/servicios/inmobiliario'
      },
      {
        id: 'labor',
        label: 'Laboral',
        icon: Briefcase,
        href: '/servicios/laboral',
        badge: 'Urgente'
      },
      {
        id: 'family',
        label: 'Familia',
        icon: Heart,
        href: '/servicios/familia'
      },
      {
        id: 'civil',
        label: 'Civil',
        icon: FileText,
        href: '/servicios/civil'
      },
      {
        id: 'criminal',
        label: 'Penal',
        icon: Shield,
        href: '/servicios/penal'
      },
      {
        id: 'tax',
        label: 'Tributario',
        icon: Calculator,
        href: '/servicios/tributario'
      },
      {
        id: 'digital',
        label: 'Digital',
        icon: Globe,
        href: '/servicios/digital',
        isNew: true
      }
    ]
  },
  {
    id: 'calculators',
    label: 'Calculadoras',
    icon: Calculator,
    children: [
      {
        id: 'pension',
        label: 'Pensión Alimenticia',
        icon: DollarSign,
        href: '/calculadoras/pension',
        isPro: true
      },
      {
        id: 'finiquito',
        label: 'Finiquito Laboral',
        icon: Briefcase,
        href: '/calculadoras/finiquito'
      },
      {
        id: 'honorarios',
        label: 'Honorarios Legales',
        icon: FileText,
        href: '/calculadoras/honorarios'
      }
    ]
  },
  {
    id: 'blog',
    label: 'Blog Legal',
    icon: BookOpen,
    href: '/blog'
  },
  {
    id: 'apuntes',
    label: 'Apuntes Jurídicos',
    icon: FileText,
    href: '/apuntes/home',
    isNew: true
  },
  {
    id: 'contact',
    label: 'Contacto',
    icon: Phone,
    children: [
      {
        id: 'schedule',
        label: 'Agendar Consulta',
        icon: Calendar,
        href: '/agendamiento'
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: MessageCircle,
        href: 'https://wa.me/56912345678'
      },
      {
        id: 'video-call',
        label: 'Videollamada',
        icon: Video,
        href: '/videocall'
      }
    ]
  }
];

const bottomMenuItems: MenuItem[] = [
  {
    id: 'help',
    label: 'Ayuda',
    icon: HelpCircle,
    href: '/ayuda'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    href: '/configuracion'
  }
];

const PremiumSidebar: React.FC = () => {
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['services']);
  const [activeService, setActiveService] = useState<string>('');

  useEffect(() => {
    // Detectar servicio activo basado en la ruta
    const path = location.pathname;
    if (path.includes('/servicios/')) {
      const service = path.split('/servicios/')[1];
      setActiveService(service);
    } else {
      setActiveService('');
    }
  }, [location.pathname]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const getServiceTheme = () => {
    if (activeService && serviceThemes[activeService]) {
      return serviceThemes[activeService];
    }
    return serviceThemes.general;
  };

  const currentTheme = getServiceTheme();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = item.href && isActive(item.href);

    return (
      <div key={item.id} className="mb-1">
        <motion.div
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200
            ${active 
              ? 'bg-slate-800/70 text-white shadow-lg' 
              : 'hover:bg-slate-800/30 text-slate-300 hover:text-white'
            }
            ${depth > 0 ? 'ml-4 text-sm' : ''}
          `}
          style={{
            backgroundColor: active ? `${currentTheme.primary}15` : undefined,
            borderLeft: active ? `2px solid ${currentTheme.primary}` : undefined,
            paddingLeft: active ? '14px' : '16px'
          }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              if (item.href.startsWith('http')) {
                window.open(item.href, '_blank');
              } else {
                navigate(item.href);
                if (window.innerWidth < 1024) {
                  closeSidebar();
                }
              }
            }
          }}
        >
          <div className="flex items-center gap-3">
            <item.icon 
              className="w-4 h-4 flex-shrink-0" 
              style={{ color: active ? currentTheme.primary : undefined }}
            />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span 
                className="px-2 py-0.5 text-xs font-bold rounded-full"
                style={{
                  backgroundColor: item.badge === 'Popular' ? `${currentTheme.primary}20` : '#EF444420',
                  color: item.badge === 'Popular' ? currentTheme.primary : '#EF4444'
                }}
              >
                {item.badge}
              </span>
            )}
            {item.isNew && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500/20 text-green-400">
                Nuevo
              </span>
            )}
            {item.isPro && (
              <Sparkles className="w-3 h-3 text-amber-400" />
            )}
          </div>
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-1"
            >
              {item.children!.map(child => renderMenuItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-2xl z-50
          border-r border-slate-800 shadow-2xl shadow-black/50
          ${isOpen ? 'block' : 'hidden lg:block'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}30, ${currentTheme.secondary}30)`,
                border: `1px solid ${currentTheme.primary}30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Scale className="w-5 h-5" style={{ color: currentTheme.primary }} />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-white">Punto Legal</h1>
              <p className="text-xs text-slate-400">Servicios Jurídicos</p>
            </div>
          </Link>
          
          <motion.button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-slate-400" />
          </motion.button>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Cliente Invitado</p>
              <p className="text-xs text-slate-400">Inicia sesión para más</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/30 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400">Casos exitosos</p>
            <p className="text-lg font-bold text-white">92%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/30 text-center">
            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400">Calificación</p>
            <p className="text-lg font-bold text-white">4.9</p>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* CTA Section */}
          <div className="mt-6 mx-3 p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-white">¡Oferta Cyber!</h3>
            </div>
            <p className="text-xs text-slate-300 mb-3">50% OFF en consultas legales</p>
            <button
              onClick={() => navigate('/agendamiento')}
              className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Agendar Ahora
            </button>
          </div>

          {/* Bottom Menu */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            {bottomMenuItems.map(item => renderMenuItem(item))}
            
            {/* Dark Mode Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Modo Oscuro</span>
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>© 2025 Punto Legal</span>
            <div className="flex items-center gap-2">
              <Award className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: `${currentTheme.primary}20`,
                left: `${20 + i * 15}%`,
                top: `${10 + i * 20}%`
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            />
          ))}
        </div>
      </motion.aside>

      {/* Sidebar Toggle Button (Desktop) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggleSidebar}
            className="hidden lg:flex fixed top-6 left-6 z-40 p-3 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 shadow-lg hover:shadow-xl transition-all group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MenuIcon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumSidebar;
