import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Mail, 
  MapPin, 
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Derecho Laboral', href: '/laboral' },
    { name: 'Derecho de Familia', href: '/familia' },
    { name: 'Herencias y Testamentos', href: '/herencias' },
    { name: 'Derecho Tributario', href: '/tributario' },
    { name: 'Derecho Corporativo', href: '/corporativo' },
    { name: 'Derecho Inmobiliario', href: '/inmobiliario' }
  ];

  const legal = [
    { name: 'Términos de Servicio', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
    { name: 'Aviso Legal', href: '/aviso-legal' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
  ];

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Fondo con gradiente premium */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-black/20" />
      
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 50}%`,
            }}
          />
        ))}
                </div>

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Sección superior con glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Columna 1: Logo y descripción */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-primary/20"
                  >
                    <Scale className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Punto Legal
                  </h3>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  Especialistas en derecho laboral con más de 10 años de experiencia defendiendo 
                  los derechos de los trabajadores en Chile.
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.a>
                  ))}
              </div>
              </motion.div>

              {/* Columna 2: Servicios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Servicios
                </h4>
              <ul className="space-y-3">
                  {services.map((service, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={service.href}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {service.name}
                      </Link>
                    </motion.li>
                  ))}
              </ul>
              </motion.div>

              {/* Columna 3: Contacto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Contacto
                </h4>
                <ul className="space-y-4">
                  <li>
                  <a 
                    href="mailto:puntolegalelgolf@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-start gap-3 group"
                  >
                      <Mail className="w-5 h-5 mt-0.5 text-primary/60 group-hover:text-primary transition-colors" />
                      <span>puntolegalelgolf@gmail.com</span>
                  </a>
                </li>
                  <li>
                  <a 
                      href="tel:+56912345678"
                      className="text-muted-foreground hover:text-primary transition-colors flex items-start gap-3 group"
                  >
                      <Phone className="w-5 h-5 mt-0.5 text-primary/60 group-hover:text-primary transition-colors" />
                      <span>+56 9 1234 5678</span>
                  </a>
                </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-primary/60 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Metro El Golf,<br />
                      Las Condes, Santiago, Chile
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Columna 4: Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-semibold">Newsletter Legal</h4>
                <p className="text-muted-foreground text-sm">
                  Recibe actualizaciones sobre cambios legales y consejos profesionales.
                </p>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Tu email"
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:border-primary/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    Suscribirse
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Sección inferior */}
        <div className="bg-black/20 backdrop-blur-xl border-t border-white/5">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                © {currentYear} Punto Legal. Todos los derechos reservados.
                <Heart className="w-3 h-3 text-red-500 animate-pulse" />
              </motion.div>

              {/* Links legales */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap items-center gap-4 text-sm"
              >
                {legal.map((item, index) => (
                  <React.Fragment key={index}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    {index < legal.length - 1 && (
                      <span className="text-muted-foreground/30">•</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-muted-foreground/30">•</span>
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Scale className="w-3 h-3" />
                  Admin
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de brillo superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
}