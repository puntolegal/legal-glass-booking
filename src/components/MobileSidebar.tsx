import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  X, 
  Home,
  Briefcase,
  Users,
  Building2,
  Home as HomeIcon,
  FileText,
  Shield,
  Calculator,
  Globe,
  Scroll,
  BookOpen,
  MessageSquare,
  ChevronRight
} from "lucide-react";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { 
    name: "Inicio", 
    href: "/", 
    icon: Home,
    color: "from-orange-500 to-amber-600"
  },
  { 
    name: "Derecho Laboral", 
    href: "/servicios/laboral",
    icon: Briefcase,
    color: "from-blue-500 to-blue-600"
  },
  { 
    name: "Derecho Corporativo", 
    href: "/servicios/corporativo",
    icon: Building2,
    color: "from-blue-600 to-indigo-600"
  },
  { 
    name: "Derecho de Familia", 
    href: "/servicios/familia",
    icon: Users,
    color: "from-pink-500 to-rose-600"
  },
  { 
    name: "Derecho Inmobiliario", 
    href: "/servicios/inmobiliario",
    icon: HomeIcon,
    color: "from-emerald-600 to-green-600"
  },
  { 
    name: "Derecho Civil", 
    href: "/servicios/civil",
    icon: FileText,
    color: "from-purple-500 to-purple-600"
  },
  { 
    name: "Derecho Penal", 
    href: "/servicios/penal",
    icon: Shield,
    color: "from-red-500 to-red-600"
  },
  { 
    name: "Derecho Tributario", 
    href: "/servicios/tributario",
    icon: Calculator,
    color: "from-teal-500 to-teal-600"
  },
  { 
    name: "Derecho Digital", 
    href: "/servicios/digital",
    icon: Globe,
    color: "from-indigo-500 to-indigo-600"
  },
  { 
    name: "Herencias", 
    href: "/herencias",
    icon: Scroll,
    color: "from-amber-600 to-amber-700"
  },
  { 
    name: "Blog", 
    href: "/blog",
    icon: BookOpen,
    color: "from-gray-600 to-gray-700"
  },
  { 
    name: "Contacto", 
    href: "#contacto",
    icon: MessageSquare,
    color: "from-green-500 to-green-600"
  },
];

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
            aria-hidden="true"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            id="mobile-sidebar"
            role="dialog"
            aria-modal="true"
            ref={sidebarRef}
            className="fixed top-0 left-0 h-full w-[85vw] max-w-[320px] z-[1000] flex flex-col overflow-hidden"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-gray-800/40 dark:via-gray-800/20" />
            
            {/* Glass Border Effect */}
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/60 via-white/20 to-white/60 dark:from-gray-600/60 dark:via-gray-600/20 dark:to-gray-600/60" />
            
            {/* Modern Header */}
            <div className="relative flex-shrink-0 p-6 pb-4 border-b border-white/20 dark:border-gray-700/20">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/10 dark:to-amber-950/10" />
              
              <div className="relative flex items-center justify-between">
                {/* Logo with glow */}
                <div className="flex items-center gap-3">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20" />
                      <span className="text-white font-bold text-xl relative z-10">P</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-orange-500/30 blur-xl" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Punto Legal</h2>
                    <p className="text-xs text-muted-foreground">Menú Principal</p>
                  </div>
                </div>
                
                {/* Modern close button with glass effect */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Cerrar menú"
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all border border-white/30 dark:border-gray-700/30"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Content with custom scrollbar */}
            <div 
              className="flex-1 overflow-y-auto px-4 pb-6"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 107, 53, 0.3) rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Navigation with modern cards */}
              <nav className="space-y-1.5">
                {menuItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className="group relative flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-200 border border-transparent hover:border-white/20 dark:hover:border-gray-700/20"
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          const element = document.getElementById(item.href.slice(1));
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                        onClose();
                      }}
                    >
                      {/* Icon with gradient background */}
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} p-2 shadow-sm group-hover:shadow-md transition-shadow`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>
                      
                      {/* Text */}
                      <span className="flex-1 font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                        {item.name}
                      </span>
                      
                      {/* Arrow indicator */}
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </motion.a>
                  );
                })}
              </nav>

              {/* Glass Divider */}
              <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:from-transparent dark:via-gray-600/50 dark:to-transparent" />

              {/* Contact section with modern cards */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4">
                  Contacto Directo
                </h3>
                
                {/* Contact cards */}
                <a 
                  href="mailto:puntolegalelgolf@gmail.com" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all border border-white/20 dark:border-gray-700/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Respuesta en 24h</p>
                  </div>
                </a>
                
                <a 
                  href="https://wa.me/56962321883" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all border border-white/20 dark:border-gray-700/20"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Chat instantáneo</p>
                  </div>
                </a>
              </motion.div>

              {/* Bottom branding */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 text-center"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2025 Punto Legal
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Innovación Legal Chilena 🇨🇱
                </p>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}