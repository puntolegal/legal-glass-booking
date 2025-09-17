import { useRef, useEffect } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Inicio", href: "/" },
  { name: "Derecho Laboral", href: "/servicios/laboral" },
  { name: "Derecho Corporativo", href: "/servicios/corporativo" },
  { name: "Derecho de Familia", href: "/servicios/familia" },
  { name: "Derecho Inmobiliario", href: "/servicios/inmobiliario" },
  { name: "Derecho Civil", href: "/servicios/civil" },
  { name: "Derecho Penal", href: "/servicios/penal" },
  { name: "Derecho Tributario", href: "/servicios/tributario" },
  { name: "Derecho Penal Económico", href: "/servicios/penal-economico" },
  { name: "Derecho Digital", href: "/servicios/digital" },
  { name: "Herencias", href: "/herencias" },
  { name: "Blog", href: "/blog" },
  { name: "Contacto", href: "#contacto" },
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
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-[999] ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[280px] z-[1000] flex flex-col
          bg-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-r-2xl shadow-2xl
          transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        {/* Header fijo */}
        <div className="flex-shrink-0 p-6 pt-8 border-b border-white/10">
          <div className="flex items-center justify-between">
            {/* Logo P naranja */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-white font-bold text-lg">Punto Legal</span>
            </div>
            <button
              aria-label="Cerrar menú"
              onClick={onClose}
              className="text-gray-200 text-2xl bg-transparent border-0 hover:text-accent focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido scrolleable con scrollbar móvil personalizado */}
        <div className="flex-1 overflow-y-auto scrollbar-mobile" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
        }}>
          <div className="p-6">
            {/* Navegación */}
            <nav className="mb-8">
              <ul className="flex flex-col gap-5">
                {menuItems.map((item, i) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      ref={i === 0 ? firstLinkRef : undefined}
                      className="text-gray-200 text-lg pl-4 relative focus:outline-none focus:text-accent hover:text-accent transition-colors group"
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
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contactos */}
            <div className="flex flex-col gap-3 text-gray-300 text-base">
              <a href="mailto:puntolegalelgolf@gmail.com" className="flex items-center hover:text-accent transition-colors">
                <Mail className="w-4 h-4 mr-2" /> Email
              </a>
              <a href="https://wa.me/56962321883" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 