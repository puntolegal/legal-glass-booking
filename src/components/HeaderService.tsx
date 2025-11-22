import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Scale, 
  Home, 
  FileText, 
  BookOpen, 
  Phone, 
  Bell, 
  Search,
  Menu,
  X,
  Calendar,
  Sun,
  Moon,
  ChevronDown,
  LucideIcon
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useTheme } from '@/hooks/useTheme';

export interface ServiceTheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  gradient: string;
  icon: LucideIcon;
  serviceName: string;
  serviceSlug: string;
}

interface HeaderServiceProps {
  theme: ServiceTheme;
  transparentOnTop?: boolean;
}

const HeaderService: React.FC<HeaderServiceProps> = ({ theme, transparentOnTop = true }) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const { theme: colorTheme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { 
      icon: Home, 
      label: 'Inicio', 
      href: '/',
      color: 'sky'
    },
    { 
      icon: Scale, 
      label: 'Servicios', 
      color: 'purple',
      hasDropdown: true
    },
    { 
      icon: FileText, 
      label: 'Blog', 
      href: '/blog',
      color: 'green'
    },
    { 
      icon: BookOpen, 
      label: 'Apuntes', 
      href: '/apuntes/home',
      color: 'indigo'
    },
    { 
      icon: Phone, 
      label: '¡Ayuda Legal Urgente!', 
      action: () => navigate('/agendamiento?plan=emergencia'),
      color: 'red',
      isUrgent: true
    }
  ];

  const services = [
    { label: 'Derecho Corporativo', href: '/servicios/corporativo', icon: '🏢', slug: 'corporativo' },
    { label: 'Derecho Laboral', href: '/servicios/laboral', icon: '💼', slug: 'laboral' },
    { label: 'Derecho de Familia', href: '/servicios/familia', icon: '❤️', slug: 'familia' },
    { label: 'Derecho Inmobiliario', href: '/servicios/inmobiliario', icon: '🏠', slug: 'inmobiliario' },
    { label: 'Derecho Civil', href: '/servicios/civil', icon: '📄', slug: 'civil' },
    { label: 'Derecho Penal', href: '/servicios/penal', icon: '⚖️', slug: 'penal' },
    { label: 'Derecho Tributario', href: '/servicios/tributario', icon: '🧮', slug: 'tributario' },
    { label: 'Derecho Digital', href: '/servicios/digital', icon: '💻', slug: 'digital' },
    { label: 'Ver todos', href: '/servicios', icon: '👁️', slug: '' }
  ];

  const notifications = [
    { id: 1, title: '50% OFF Cyber', message: `Promoción especial en ${theme.serviceName}`, time: 'Hace 2h' },
    { id: 2, title: 'Nueva calculadora', message: 'Herramientas gratuitas disponibles', time: 'Hace 1d' },
    { id: 3, title: 'Horario extendido', message: 'Atención hasta las 22:00 hrs', time: 'Hace 3d' }
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="px-4 pt-4">
          <motion.div
            className={`
              relative mx-auto max-w-6xl rounded-2xl border transition-all duration-500
              ${isScrolled 
                ? 'bg-slate-900/70 backdrop-blur-2xl border-slate-700/50 shadow-2xl shadow-black/20' 
                : transparentOnTop
                  ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/30 shadow-xl'
                  : 'bg-slate-900/70 backdrop-blur-2xl border-slate-700/50 shadow-xl'
              }
            `}
            style={{
              '--service-primary': theme.primary,
              '--service-glow': theme.glow,
            } as React.CSSProperties}
          >
            {/* Efectos de fondo con colores del servicio */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div 
                className="absolute inset-0 opacity-50" 
                style={{
                  background: `linear-gradient(to right, ${theme.primary}15, transparent, ${theme.secondary}15)`
                }}
              />
              
              {/* Partículas con color del servicio */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: `${theme.primary}30` }}
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 15 + i * 5,
                    repeat: Infinity,
                    delay: i * 3,
                  }}
                  initial={{
                    left: `${20 + i * 30}%`,
                    top: '50%',
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-center justify-between px-6 py-3">
              {/* Lado izquierdo - Logo y menú */}
              <div className="flex items-center gap-3">
                {/* Botón de menú */}
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu 
                    className="w-4 h-4 text-slate-300 transition-colors" 
                    style={{ color: isOpen ? theme.primary : undefined }}
                  />
                </motion.button>

                {/* Logo con color del servicio */}
                <Link to="/" className="flex items-center gap-2 group">
                  <motion.div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-700/50 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}20)`,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <theme.icon className="w-5 h-5" style={{ color: theme.primary }} />
                  </motion.div>
                  <span className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                    Punto Legal
                  </span>
                </Link>
              </div>

              {/* Centro - Navegación (Solo desktop) */}
              <nav className="hidden lg:flex items-center gap-2">
                {navItems.map((item, index) => (
                  <div key={index} className="relative">
                    {item.hasDropdown ? (
                      <div className="relative">
                        <motion.button
                          onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                            ${showServicesDropdown
                              ? 'bg-slate-800/70 border'
                              : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                            }
                          `}
                          style={{
                            color: showServicesDropdown ? theme.primary : undefined,
                            borderColor: showServicesDropdown ? `${theme.primary}50` : undefined
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${showServicesDropdown ? 'rotate-180' : ''}`} />
                        </motion.button>

                        {/* Dropdown de servicios */}
                        <AnimatePresence>
                          {showServicesDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full mt-2 left-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                            >
                              {services.map((service, idx) => (
                                <Link
                                  key={idx}
                                  to={service.href}
                                  onClick={() => setShowServicesDropdown(false)}
                                  className={`
                                    flex items-center gap-3 px-4 py-3 transition-all
                                    ${service.slug === theme.serviceSlug
                                      ? 'border-l-2'
                                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                                    }
                                  `}
                                  style={{
                                    backgroundColor: service.slug === theme.serviceSlug ? `${theme.primary}10` : undefined,
                                    color: service.slug === theme.serviceSlug ? theme.primary : undefined,
                                    borderColor: service.slug === theme.serviceSlug ? theme.primary : undefined
                                  }}
                                >
                                  <span className="text-lg">{service.icon}</span>
                                  <span className="text-sm font-medium">{service.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.href ? (
                          <Link
                            to={item.href}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                              ${item.isUrgent
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-500/30'
                                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                              }
                            `}
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.isUrgent && (
                              <motion.span
                                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </Link>
                        ) : (
                          <button
                            onClick={item.action}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                              ${item.isUrgent
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-500/30'
                                : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
                              }
                            `}
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Lado derecho - Acciones */}
              <div className="flex items-center gap-2">
                {/* Búsqueda */}
                <motion.button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-4 h-4 text-slate-300 transition-colors hover:text-white" />
                </motion.button>

                {/* Notificaciones */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-4 h-4 text-slate-300 transition-colors hover:text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.button>

                  {/* Dropdown de notificaciones */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50"
                      >
                        <div className="p-4 border-b border-slate-700/50">
                          <h3 className="text-sm font-bold text-slate-100">Notificaciones</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                            >
                              <h4 className="text-sm font-semibold" style={{ color: theme.primary }}>
                                {notif.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                              <span className="text-xs text-slate-500 mt-2 block">{notif.time}</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 text-center border-t border-slate-700/50">
                          <button 
                            className="text-xs font-medium hover:opacity-80 transition-opacity"
                            style={{ color: theme.primary }}
                          >
                            Ver todas las notificaciones
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dark mode toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {colorTheme === 'dark' ? (
                    <Sun className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  )}
                </motion.button>

                {/* CTA Agendar (oculto en móvil) */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block"
                >
                  <Link
                    to={`/agendamiento?plan=${theme.serviceSlug}`}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium text-sm shadow-lg transition-all border"
                    style={{
                      background: theme.gradient,
                      boxShadow: `0 10px 25px -5px ${theme.primary}40`,
                      borderColor: `${theme.primary}30`
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden lg:inline">Agendar</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Modal de búsqueda */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[70]"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar servicios, artículos, calculadoras..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: `${theme.primary}50`,
                      boxShadow: `0 0 0 3px ${theme.primary}20`
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setShowSearch(false);
                      if (e.key === 'Enter') {
                        navigate('/blog');
                        setShowSearch(false);
                      }
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Presiona Enter para buscar</span>
                  <span>Esc para cerrar</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handlers */}
      {(showServicesDropdown || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowServicesDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Mobile Floating Dock */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full blur-xl"
            style={{ backgroundColor: `${theme.primary}20` }}
          />
          
          <div 
            className="relative bg-slate-900/90 backdrop-blur-xl border rounded-full px-6 py-3 shadow-2xl shadow-black/50 flex items-center gap-4"
            style={{ borderColor: `${theme.primary}30` }}
          >
            <Link to="/" className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
              <Home className="w-5 h-5 text-slate-300" />
            </Link>
            
            <Link to="/blog" className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
              <FileText className="w-5 h-5 text-slate-300" />
            </Link>
            
            <button
              onClick={() => navigate('/agendamiento?plan=emergencia')}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5 text-red-400" />
            </button>
            
            <Link
              to={`/agendamiento?plan=${theme.serviceSlug}`}
              className="px-4 py-2 text-white rounded-xl font-medium text-sm shadow-lg"
              style={{ background: theme.gradient }}
            >
              Agendar
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HeaderService;
