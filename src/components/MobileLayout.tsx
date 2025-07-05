import { Button } from "@/components/ui/button";
import { Menu, X, Home, Briefcase, FileText, Phone, Calendar, Mail, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import DarkModeToggle from "./DarkModeToggle";

interface MobileLayoutProps {
  onAgendarClick?: () => void;
  children: React.ReactNode;
}

const navigationItems = [
  { title: "Inicio", href: "/", icon: Home },
  { title: "Servicios", href: "#servicios", icon: Briefcase },
  { title: "Blog", href: "#blog", icon: FileText },
  { title: "Contacto", href: "#contacto", icon: Phone },
];

const contactItems = [
  {
    title: "Llamar",
    href: "tel:+56962321883",
    icon: Phone,
    text: "+569 6232 1883"
  },
  {
    title: "Email",
    href: "mailto:puntolegalelgolf@gmail.com",
    icon: Mail,
    text: "Enviar correo"
  },
  {
    title: "WhatsApp",
    href: "https://wa.me/56962321883",
    icon: MessageCircle,
    text: "Chat directo"
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61575610732702",
    icon: "📘",
    text: "Síguenos"
  },
];

export const MobileLayout = ({ onAgendarClick, children }: MobileLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Fixed */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl bg-background/95 border-b border-primary/10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-medium text-foreground">Punto Legal</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <DarkModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 rounded-xl glass border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 transform transition-all duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full glass-intense backdrop-blur-xl bg-gradient-to-b from-background/95 to-background/98 border-r border-primary/20 shadow-2xl flex flex-col">
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-lg font-medium text-foreground">Punto Legal</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-2 mb-8">
              <h3 className="text-primary font-semibold text-sm mb-4">Navegación</h3>
              {navigationItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-200 relative"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-primary/5 to-transparent" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mb-8">
              <Button
                onClick={() => {
                  onAgendarClick?.();
                  setSidebarOpen(false);
                }}
                className="w-full bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 text-white px-6 py-4 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm border border-primary/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
            </div>

            {/* Contact Section */}
            <div className="space-y-3">
              <h3 className="text-primary font-semibold text-sm mb-4">Contacto Rápido</h3>
              {contactItems.map((contact) => (
                <a
                  key={contact.title}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {typeof contact.icon === 'string' ? (
                      <span className="text-sm">{contact.icon}</span>
                    ) : (
                      <contact.icon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{contact.title}</span>
                    <span className="text-xs opacity-75">{contact.text}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pt-0 pt-20">
        {children}
      </main>
    </div>
  );
};