import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import NavigationButton from "@/components/ui/navigation-button";
import DropdownMenu from "./DropdownMenu";
import { Menu, Home, FileText, Phone, Scale, Sparkles, Calendar, User, Bell, Search } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";


const Header = ({ onAgendarClick, serviceName }: { onAgendarClick?: () => void; serviceName?: string }) => {
  const { title, subtitle } = usePageTitle();
  const { isOpen, toggleSidebar } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  // Función para manejar click en Inicio
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Si ya estamos en inicio, scroll al top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Si no estamos en inicio, navegar allí
      navigate('/');
    }
  };
  
  // Efecto de scroll para glassmorfismo dinámico
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
    return unsubscribe;
  }, [scrollY]);

  const navItems = [
    { icon: Home, label: "Inicio", href: "/", color: "blue" },
    { icon: Scale, label: "Servicios", href: "/servicios", color: "purple", hasDropdown: true },
    { icon: FileText, label: "Blog", href: "/blog", color: "green" },
    { icon: Phone, label: "¡Ayuda Legal Urgente!", href: "/urgente", color: "orange" },
  ];

  return (
    <motion.header 
      className={`fixed top-0 right-0 z-40 transition-all duration-500 ${
        isOpen ? 'left-80' : 'left-0'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      {/* Dock Container */}
      <div className="flex justify-center pt-4 px-4">
        <motion.div
          className={`
            relative flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-500
            ${isScrolled 
              ? 'bg-black/30 backdrop-blur-2xl border-white/20 shadow-2xl' 
              : 'bg-black/20 backdrop-blur-xl border-white/20 shadow-xl'
            }
          `}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
                     {/* Efectos de fondo animados - estilo sidebar */}
           <div className="absolute inset-0 rounded-2xl overflow-hidden">
             {/* Partículas flotantes sutiles */}
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

           {/* Gradient overlay estilo sidebar */}
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/10 pointer-events-none rounded-2xl" />

          {/* Botón de menú + Logo compacto */}
          <div className="flex items-center gap-3 mr-4">
            {/* Botón de menú hamburguesa */}
            <motion.button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isOpen ? "Ocultar menú lateral" : "Mostrar menú lateral"}
              data-sidebar-toggle
            >
              <Menu className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-300" />
            </motion.button>

            {/* Logo compacto */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative group">
                               <motion.div 
                   className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center backdrop-blur-xl shadow-lg border border-white/10"
                   whileHover={{ 
                     scale: 1.1, 
                     rotate: 10,
                     boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)"
                   }}
                   whileTap={{ scale: 0.95 }}
                   transition={{ type: "spring", stiffness: 400, damping: 17 }}
                 >
                   <Scale className="w-4 h-4 text-primary" />
                 </motion.div>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-foreground/90">Punto Legal</span>
              </div>
            </motion.div>
          </div>

          {/* Navegación principal estilo iOS */}
          <nav className="flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {item.hasDropdown ? (
                  <div className="relative">
                    <DropdownMenu />
                  </div>
                ) : (
                  <motion.div
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      onClick={item.label === "Inicio" ? handleHomeClick : undefined}
                      className={`
                        relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
                        ${item.label === "¡Ayuda Legal Urgente!" 
                          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 border border-red-400/50 hover:border-red-300/70 shadow-lg shadow-red-500/40 hover:shadow-red-500/60 animate-pulse' 
                          : 'text-foreground/70 hover:text-foreground hover:bg-white/10 border border-transparent hover:border-white/20'
                        }
                        backdrop-blur-sm group cursor-pointer
                      `}
                    >
                      {/* Efecto de hover dinámico - estilo sidebar */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"
                        layoutId={`nav-hover-${index}`}
                      />
                     
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <item.icon className={`w-4 h-4 relative z-10 ${item.label === "¡Ayuda Legal Urgente!" ? 'text-white' : 'group-hover:text-primary'} transition-colors duration-300`} />
                      </motion.div>
                      
                      {item.label === "¡Ayuda Legal Urgente!" && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                     
                      <span className="text-xs font-medium relative z-10 hidden sm:inline">
                        {item.label}
                      </span>
                      
                      {item.label !== "Inicio" && item.label !== "¡Ayuda Legal Urgente!" && (
                        <Link to={item.href} className="absolute inset-0" />
                      )}
                      {item.label === "¡Ayuda Legal Urgente!" && (
                        <button 
                          onClick={() => navigate('/agendamiento?plan=emergencia')}
                          className="absolute inset-0"
                          aria-label="Ir a agendamiento de emergencia legal"
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Separador estilo iOS */}
          <motion.div 
            className="w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-2"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />

          {/* Acciones del dock */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              title="Búsqueda rápida"
            >
              <Search className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-300" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => {
                // Aquí puedes agregar lógica para mostrar notificaciones
                console.log('Abriendo notificaciones...');
              }}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              title="Notificaciones"
            >
              <Bell className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors duration-300" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Dark mode toggle */}
            <DarkModeToggle />

            {/* CTA Button estilo iOS */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2"
            >
              <Button 
                onClick={() => {
                  if (onAgendarClick) {
                    onAgendarClick();
                  } else {
                    // Redirigir a consulta general por $35.000
                    navigate('/agendamiento?plan=general');
                  }
                }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-4 py-2 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                {/* Efecto de brillo iOS */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Micro-interacciones */}
                <div className="relative flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Agendar</span>
                  
                  {/* Partícula flotante */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-1 h-1 bg-white/60 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                    }}
                  />
                </div>
              </Button>
            </motion.div>
          </div>

                     {/* Indicador de conexión estilo sidebar */}
           <motion.div
             className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full opacity-60"
             animate={{
               width: [32, 40, 32],
               opacity: [0.6, 0.8, 0.6],
             }}
             transition={{
               duration: 3,
               repeat: Infinity,
               ease: "easeInOut"
             }}
           />
        </motion.div>
      </div>

      {/* Búsqueda rápida */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] z-50"
        >
          <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/60" />
              <input
                type="text"
                placeholder="Buscar servicios, blog, calculadoras..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:border-primary outline-none transition-colors text-foreground placeholder:text-foreground/60"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSearch(false);
                  }
                  if (e.key === 'Enter') {
                    // Aquí puedes agregar lógica de búsqueda
                    console.log('Buscando:', e.currentTarget.value);
                    navigate('/blog'); // Por ahora redirige al blog
                    setShowSearch(false);
                  }
                }}
              />
            </div>
            <div className="mt-3 text-xs text-foreground/60 flex items-center justify-between">
              <span>Presiona Enter para buscar</span>
              <span>Esc para cerrar</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overlay para cerrar búsqueda */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSearch(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
        />
      )}

      {/* Efecto de sombra adaptativa */}
      <motion.div
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/20 to-transparent pointer-events-none"
        animate={{
          opacity: isScrolled ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.3 }}
      />


    </motion.header>
  );
};

export default Header;