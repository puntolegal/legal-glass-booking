/**
 * Footer móvil elegante para estudio jurídico
 * Estilo Manhattan, moderno, iOS/macOS
 * Enfoque en marketing y utilidad al cliente
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Building2,
  Scale,
  Gavel,
  ExternalLink
} from 'lucide-react';

const MobileFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Derecho Laboral', href: '/agendamiento?plan=laboral' },
    { name: 'Derecho Familia', href: '/agendamiento?plan=familia' },
    { name: 'Derecho Corporativo', href: '/agendamiento?plan=empresarial' },
    { name: 'Derecho Inmobiliario', href: '/agendamiento?plan=inmobiliario' }
  ];

  const quickLinks = [
    { name: 'Servicios', href: '/servicios' },
    { name: 'Agendar Consulta', href: '/agendamiento' },
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contacto' }
  ];

  const legal = [
    { name: 'Términos de Servicio', href: '/terms-of-service' },
    { name: 'Política de Privacidad', href: '/privacy-policy' },
    { name: 'Aviso Legal', href: '/aviso-legal' }
  ];

  const stats = [
    { number: '500+', label: 'Casos Exitosos', icon: <CheckCircle className="w-4 h-4" /> },
    { number: '10+', label: 'Años Experiencia', icon: <Award className="w-4 h-4" /> },
    { number: '98%', label: 'Satisfacción Cliente', icon: <Star className="w-4 h-4" /> },
    { number: '24/7', label: 'Atención Disponible', icon: <Clock className="w-4 h-4" /> }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Efectos de fondo elegantes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Partículas de luz sutiles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Sección principal */}
        <div className="px-6 py-12">
          {/* Header del footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Scale className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Punto Legal
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
              Estudio jurídico de excelencia con estándares internacionales
            </p>
          </motion.div>

          {/* Estadísticas de confianza */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-orange-500">
                    {stat.icon}
                  </div>
                  <span className="text-lg font-bold text-white">
                    {stat.number}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Servicios principales */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h4 className="text-lg font-semibold mb-4 text-center">Servicios Especializados</h4>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service, index) => (
                <Link
                  key={index}
                  to={service.href}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                      {service.name}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Información de contacto */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h4 className="text-lg font-semibold mb-4 text-center">Contacto Directo</h4>
            <div className="space-y-3">
              <a 
                href="tel:+56962321883"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                    +56 9 6232 1883
                  </p>
                  <p className="text-xs text-gray-400">Llamada directa</p>
                </div>
              </a>

              <a 
                href="mailto:contacto@puntolegal.online"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-orange-500/30 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                    contacto@puntolegal.online
                  </p>
                  <p className="text-xs text-gray-400">Email profesional</p>
                </div>
              </a>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Santiago, Chile
                  </p>
                  <p className="text-xs text-gray-400">Consultas online disponibles</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enlaces rápidos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h4 className="text-lg font-semibold mb-4 text-center">Enlaces Rápidos</h4>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-orange-400 transition-colors text-center py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CTA principal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-8"
          >
            <Link
              to="/agendamiento"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
            >
              <Gavel className="w-4 h-4" />
              Agendar Consulta
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-gray-400 mt-2">
              Consulta inicial • 45 minutos • $35.000
            </p>
          </motion.div>
        </div>

        {/* Footer inferior */}
        <div className="border-t border-white/10 px-6 py-6">
          <div className="text-center space-y-4">
            {/* Enlaces legales */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {legal.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500">
              <p>© {currentYear} Punto Legal. Todos los derechos reservados.</p>
              <p className="mt-1 flex items-center justify-center gap-1">
                <span>Hecho con</span>
                <span className="text-red-500">❤️</span>
                <span>en Chile</span>
                <span className="text-blue-500">🇨🇱</span>
              </p>
            </div>

            {/* Badge de confianza */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3 h-3" />
              <span>Estudio jurídico certificado</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
