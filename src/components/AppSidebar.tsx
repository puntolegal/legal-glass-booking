import { Home, Briefcase, FileText, Phone, Calendar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  onAgendarClick?: () => void;
}

const navigationItems = [
  { 
    title: "Inicio", 
    href: "/", 
    icon: Home,
    description: "Página principal"
  },
  { 
    title: "Servicios", 
    href: "#servicios", 
    icon: Briefcase,
    description: "Servicios legales"
  },
  { 
    title: "Blog", 
    href: "#blog", 
    icon: FileText,
    description: "Artículos y noticias"
  },
  { 
    title: "Contacto", 
    href: "#contacto", 
    icon: Phone,
    description: "Información de contacto"
  },
];

const contactItems = [
  {
    title: "Llamar",
    href: "tel:+56962321883",
    icon: "📞",
    text: "+569 6232 1883"
  },
  {
    title: "Email",
    href: "mailto:puntolegalelgolf@gmail.com",
    icon: "✉️",
    text: "Enviar correo"
  },
  {
    title: "WhatsApp",
    href: "https://wa.me/56962321883",
    icon: "💬",
    text: "Chat directo"
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61575610732702",
    icon: "📘",
    text: "Síguenos"
  },
];

export function AppSidebar({ onAgendarClick }: AppSidebarProps) {
  const { open, setOpen } = useSidebar();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sidebar 
      className="glass-intense backdrop-blur-xl bg-gradient-to-b from-background/95 to-background/98 border-r border-primary/20 shadow-2xl"
      collapsible="icon"
      side="left"
    >
      {/* Header Section */}
      <div className="p-6 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-lg font-medium text-foreground">Punto Legal</span>
          </div>
          
          <SidebarTrigger className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" />
        </div>
      </div>

      <SidebarContent className="px-4 py-6">
        {/* Navigation Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold text-sm mb-3">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="group h-12 px-4 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-200 text-base"
                  >
                    <a 
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center space-x-3 relative"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-primary/5 to-transparent" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* CTA Section */}
        <div className="mt-8 px-2">
          <Button
            onClick={() => {
              onAgendarClick?.();
              setOpen(false);
            }}
            className="w-full bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm border border-primary/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Consulta
          </Button>
        </div>

        {/* Contact Section */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-primary font-semibold text-sm mb-3">
            Contacto Rápido
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
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
                    <span className="text-sm">{contact.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{contact.title}</span>
                    <span className="text-xs opacity-75">{contact.text}</span>
                  </div>
                </a>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}