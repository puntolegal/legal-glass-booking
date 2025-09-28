import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSidebar } from '@/contexts/SidebarContext'
import DarkModeToggle from './DarkModeToggle'
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
  AlertTriangle
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  badge?: string
  children?: MenuItem[]
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
        label: 'Derecho Corporativo',
        icon: Building2,
        href: '/servicios/corporativo',
        badge: 'Popular'
      },
      {
        id: 'real-estate',
        label: 'Derecho Inmobiliario',
        icon: HomeIcon,
        href: '/servicios/inmobiliario'
      },
      {
        id: 'labor',
        label: 'Derecho Laboral',
        icon: Briefcase,
        href: '/servicios/laboral',
        badge: 'Urgente'
      },
      {
        id: 'family',
        label: 'Derecho de Familia',
        icon: Heart,
        href: '/servicios/familia'
      },
      {
        id: 'civil',
        label: 'Derecho Civil',
        icon: FileText,
        href: '/servicios/civil'
      },
      {
        id: 'criminal',
        label: 'Derecho Penal',
        icon: Shield,
        href: '/servicios/penal'
      },
      {
        id: 'tax',
        label: 'Derecho Tributario',
        icon: Calculator,
        href: '/servicios/tributario'
      },
      {
        id: 'economic-criminal',
        label: 'Derecho Penal Económico',
        icon: AlertTriangle,
        href: '/servicios/penal-economico',
        badge: 'Especializado'
      },
      {
        id: 'digital',
        label: 'Derecho Digital',
        icon: Globe,
        href: '/servicios/digital',
        badge: 'Nuevo'
      }
    ]
  },
  {
    id: 'calculators',
    label: 'Calculadoras Legales',
    icon: Calculator,
    children: [
      {
        id: 'severance',
        label: 'Indemnización Laboral',
        icon: Calculator,
        href: '/calculadoras/indemnizacion'
      },
      {
        id: 'alimony',
        label: 'Pensión Alimenticia',
        icon: Calculator,
        href: '/calculadoras/pension'
      },
      {
        id: 'inheritance',
        label: 'Herencia',
        icon: Calculator,
        href: '/calculadoras/herencia'
      },
      {
        id: 'fees',
        label: 'Honorarios Legales',
        icon: Calculator,
        href: '/calculadoras/honorarios'
      }
    ]
  },
  {
    id: 'tools',
    label: 'Herramientas Rápidas',
    icon: Zap,
    children: [
      {
        id: 'contract-generator',
        label: 'Generador de Contratos',
        icon: FileText,
        href: '/herramientas/contratos'
      },
      {
        id: 'company-verify',
        label: 'Verificar Empresa',
        icon: Building2,
        href: '/herramientas/verificar-empresa'
      },
      {
        id: 'case-lookup',
        label: 'Consulta de Casos',
        icon: BookOpen,
        href: '/herramientas/consulta-casos'
      }
    ]
  },
  {
    id: 'support',
    label: 'Asistencia Instantánea',
    icon: MessageCircle,
    children: [
      {
        id: 'chat',
        label: 'Chat Legal 24/7',
        icon: MessageCircle,
        href: '/asistencia/chat',
        badge: 'En línea'
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp Directo',
        icon: Phone,
        href: 'https://wa.me/56912345678',
        badge: 'Respuesta en 5min'
      },
      {
        id: 'video',
        label: 'Videollamada',
        icon: Video,
        href: '/asistencia/video'
      }
    ]
  },
  {
    id: 'resources',
    label: 'Centro de Recursos',
    icon: BookOpen,
    children: [
      {
        id: 'guides',
        label: 'Guías PDF',
        icon: FileText,
        href: '/recursos/guias'
      },
      {
        id: 'templates',
        label: 'Plantillas',
        icon: FileText,
        href: '/recursos/plantillas'
      },
      {
        id: 'blog',
        label: 'Blog Legal',
        icon: BookOpen,
        href: '/blog',
        badge: '4 nuevos'
      }
    ]
  }
]

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['services'])
  const [isMobile, setIsMobile] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar()

  // Detectar si es móvil de forma segura
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cerrar sidebar al hacer clic fuera de él (solo en desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen || isMobile) return;
      
      const sidebar = document.querySelector('[data-sidebar]');
      const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
      
      if (sidebar && !sidebar.contains(event.target as Node) && 
          sidebarToggle && !sidebarToggle.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile, closeSidebar])

  // Detectar si se puede navegar hacia atrás
  useEffect(() => {
    // Verificar si hay historial para navegar hacia atrás
    const hasHistory = window.history.length > 1
    setCanGoBack(hasHistory && location.pathname !== '/')
  }, [location.pathname])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)

    return (
      <motion.div 
        key={item.id} 
        className="relative group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.1 }}
      >
        {/* Hover background effect - más sutil en móvil */}
        <div className={`
          absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isMobile 
            ? 'bg-muted/30' 
            : 'bg-gradient-to-r from-primary/10 to-transparent blur-sm'
          }
        `} />
        
        {item.href && !hasChildren ? (
          <Link
            to={item.href}
            onClick={() => isMobile && closeSidebar()}
            className={`
              relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group
              ${active 
                ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'hover:bg-white/10 text-foreground/80 hover:text-foreground hover:scale-[1.01] hover:shadow-lg hover:shadow-white/5'
              }
              ${depth > 0 ? 'ml-8 border-l-2 border-primary/30' : ''}
            `}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'group-hover:text-primary'} transition-colors duration-300`} />
            </motion.div>
            
            <span className="font-medium flex-1 group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
            {item.badge && (
                                <motion.span 
                    className={`
                      text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm
                      ${item.badge === 'En línea' 
                        ? 'bg-slate-500/20 text-slate-400 shadow-slate-500/20' 
                        : item.badge === 'Urgente'
                        ? 'bg-orange-500/20 text-orange-400 shadow-orange-500/20 animate-pulse'
                        : item.badge === 'Popular'
                        ? 'bg-slate-600/20 text-slate-300 shadow-slate-600/20'
                        : item.badge === 'Nuevo'
                        ? 'bg-zinc-500/20 text-zinc-400 shadow-zinc-500/20'
                        : item.badge === 'Respuesta en 5min'
                        ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/20'
                        : '4 nuevos' === item.badge
                        ? 'bg-primary/20 text-primary shadow-primary/20'
                        : 'bg-muted/30 text-foreground shadow-muted/20'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                {item.badge}
              </motion.span>
            )}
          </Link>
        ) : (
          <button
            onClick={() => hasChildren && toggleExpanded(item.id)}
            className={`
              relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group
              ${active 
                ? 'bg-primary/20 text-primary scale-[1.02]' 
                : 'hover:bg-white/10 text-foreground/80 hover:text-foreground hover:scale-[1.01] hover:shadow-lg hover:shadow-white/5'
              }
              ${depth > 0 ? 'ml-8 border-l-2 border-primary/30' : ''}
            `}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'group-hover:text-primary'} transition-colors duration-300`} />
            </motion.div>
            
            <span className="font-medium flex-1 text-left group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
            {hasChildren && (
              <motion.div
                animate={{ 
                  rotate: isExpanded ? 180 : 0,
                  scale: isExpanded ? 1.1 : 1 
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.2 }}
              >
                <ChevronDown className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
              </motion.div>
            )}
          </button>
        )}

        {/* Children with stagger animation */}
        {hasChildren && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div 
                  className="mt-1 space-y-1 pl-2 border-l-2 border-primary/20 ml-6"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {item.children!.map(child => renderMenuItem(child, depth + 1))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    )
  }

  return (
    <>
      {/* Overlay para cerrar sidebar en móvil */}
      {isOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => closeSidebar()}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Botón flotante para abrir sidebar - solo web */}
      <AnimatePresence>
        {!isOpen && !isMobile && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed z-[100] rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl backdrop-blur-xl border border-white/20 hover:shadow-3xl transition-all duration-300 flex items-center justify-center bottom-6 left-6 p-4 w-14 h-14"
            onClick={() => toggleSidebar()}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            aria-label="Abrir menú lateral"
            data-sidebar-toggle
          >
            <MenuIcon className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar glassmórfico */}
      <motion.aside
        initial={{ x: isMobile ? '-100%' : 0 }}
        animate={{
          x: isMobile ? (isOpen ? 0 : '-100%') : (isOpen ? 0 : '-100%'),
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 left-0 h-full w-80 shadow-2xl flex flex-col overflow-hidden z-50 border-r
          ${isMobile 
            ? 'bg-background/95 backdrop-blur-xl border-border' 
            : 'bg-black/20 backdrop-blur-xl border-white/20'
          }
        `}
        data-sidebar
      >
        {/* Animated background particles - solo en desktop */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-primary/15 rounded-full"
                animate={{
                  x: [0, 60, 0],
                  y: [0, -60, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 12 + i * 3,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${25 + i * 20}%`,
                  top: `${40 + i * 15}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Gradient overlay - más sutil en móvil */}
        <div className={`
          absolute inset-0 pointer-events-none
          ${isMobile 
            ? 'bg-gradient-to-b from-muted/20 via-transparent to-muted/20' 
            : 'bg-gradient-to-b from-primary/5 via-transparent to-primary/10'
          }
        `} />
        
        {/* Header con botones de control */}
        <div className={`
          relative z-10 flex items-center justify-between p-4 border-b
          ${isMobile ? 'border-border' : 'border-white/10'}
        `}>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center backdrop-blur-xl shadow-lg border border-white/10"
              whileHover={{ 
                scale: 1.1, 
                rotate: 10,
                boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Scale className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <motion.h2 
                className="font-bold text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Punto Legal
              </motion.h2>
              <motion.p 
                className="text-xs text-foreground/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Soluciones jurídicas
              </motion.p>
            </div>
          </motion.div>
          
          {/* Botones de control */}
          <div className="flex gap-2">
            {/* Botón volver atrás */}
            {canGoBack && (
              <motion.div className="relative">
                <motion.button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition group relative"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title="Volver a la página anterior"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Efecto de hover dinámico */}
                  <div className={`
                    absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    ${isMobile 
                      ? 'bg-muted/30' 
                      : 'bg-gradient-to-r from-primary/10 to-transparent'
                    }
                  `} />
                  <ArrowLeftIcon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors relative z-10"/>
                  
                  {/* Indicador de movimiento */}
                  <motion.div
                    className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ x: 0 }}
                    whileHover={{ x: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </motion.button>
              </motion.div>
            )}
            
            <motion.button
              onClick={() => toggleSidebar()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition hidden lg:block group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
            >
              <X className="w-5 h-5 text-foreground group-hover:text-primary transition-colors"/>
            </motion.button>
          </div>
          
          {/* Botón cerrar (solo móvil) */}
          <motion.button
            onClick={() => closeSidebar()}
            className="p-2 rounded-lg bg-destructive text-destructive-foreground shadow-lg border border-border hover:bg-destructive/90 transition lg:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Emergency Button - Tarjeta Metálica Premium */}
        <div className={`
          p-4 border-b
          ${isMobile ? 'border-border' : 'border-white/10'}
        `}>
          <div className="relative">
            {/* Premium Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-400 via-red-500 to-red-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xl z-10 animate-pulse border border-red-300">
              ⚡ 50% OFF
            </div>
            
            <Link
              to="/agendamiento?plan=emergencia"
              onClick={() => isMobile && closeSidebar()}
              className="w-full rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 group relative overflow-hidden block transform hover:scale-[1.01]"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(239, 68, 68, 0.15) 0%,
                  rgba(220, 38, 38, 0.20) 50%,
                  rgba(239, 68, 68, 0.15) 100%
                )`,
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: `
                  0 4px 20px rgba(239, 68, 68, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
              }}
            >
              {/* Efecto de brillo suave */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 30% 50%, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    transparent 70%
                  )`
                }}
              />
              
              <div className="relative z-10">
                {/* Header de tarjeta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-500/20 rounded-lg border border-red-500/30 backdrop-blur-sm">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-foreground tracking-wide">EMERGENCIA LEGAL</p>
                      <p className="text-xs text-muted-foreground font-medium">Respuesta inmediata 24/7</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Phone className="w-5 h-5 text-red-400 animate-pulse" />
                    <p className="text-xs text-red-400/80 font-medium mt-1">URGENTE</p>
                  </div>
                </div>
                
                {/* Línea divisoria */}
                <div className="w-full h-px mb-4 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                
                {/* Pricing info */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground line-through">$200.000</p>
                  <p className="text-2xl font-bold text-foreground">$100.000</p>
                  <p className="text-xs text-red-400 font-medium uppercase tracking-wide">Consulta Urgente</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Trust Indicators - tonos más corporativos */}
        <div className={`
          px-4 py-3 border-b
          ${isMobile 
            ? 'bg-muted/20 border-border' 
            : 'bg-gradient-to-r from-primary/10 to-transparent border-white/10'
          }
        `}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={`text-lg font-bold ${isMobile ? 'text-slate-400' : 'text-primary'}`}>100%</p>
              <p className="text-xs text-foreground/60">Confidencialidad</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${isMobile ? 'text-zinc-400' : 'text-primary'}`}>+1000</p>
              <p className="text-xs text-foreground/60">Casos</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${isMobile ? 'text-stone-400' : 'text-primary'}`}>+2.6M</p>
              <p className="text-xs text-foreground/60">Recuperados</p>
            </div>
          </div>
        </div>

        {/* Menú principal */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer con disponibilidad */}
        <div className={`
          p-4 border-t space-y-3
          ${isMobile ? 'border-border' : 'border-white/10'}
        `}>
          {/* Toggle de modo oscuro - solo desktop */}
          {!isMobile && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/60">Tema</span>
              <DarkModeToggle />
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>3 abogados disponibles ahora</span>
          </div>
          <p className="text-xs text-foreground/40 mt-1">
            Tiempo promedio de respuesta: 2 min
          </p>
        </div>
      </motion.aside>
    </>
  )
} 