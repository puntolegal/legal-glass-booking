import { useRef, useEffect } from "react";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Inicio", href: "#inicio" },
  { name: "Laboral", href: "#laboral" },
  { name: "Familia", href: "#familia" },
  { name: "Herencias", href: "#herencias" },
  { name: "Blog", href: "#blog" },
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
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[280px] z-[1000] flex flex-col p-6 pt-8
          bg-gradient-to-br from-black/85 to-neutral-900/65
          backdrop-blur-2xl border border-white/10 rounded-r-2xl shadow-2xl
          transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        {/* Botón cerrar */}
        <button
          aria-label="Cerrar menú"
          onClick={onClose}
          className="self-end text-gray-200 text-2xl bg-transparent border-0 hover:text-accent focus:outline-none mb-4"
        >
          ✕
        </button>
        {/* Navegación */}
        <nav className="mt-6">
          <ul className="flex flex-col gap-5">
            {menuItems.map((item, i) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  className="text-gray-200 text-lg pl-4 relative focus:outline-none focus:text-accent hover:text-accent transition-colors"
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Contactos */}
        <div className="mt-10 flex flex-col gap-3 text-gray-300 text-base">
          <a href="tel:+56912345678" className="flex items-center hover:text-accent transition-colors">📞 +56 9 1234 5678</a>
          <a href="mailto:contacto@puntolegal.cl" className="flex items-center hover:text-accent transition-colors">✉️ contacto@puntolegal.cl</a>
          <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent transition-colors">💬 WhatsApp</a>
        </div>
      </aside>
    </>
  );
} 