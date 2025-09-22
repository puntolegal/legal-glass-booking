import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Brain, 
  Target, 
  Award,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Heart,
  Sparkles,
  Zap,
  Trophy,
  Users,
  TrendingUp
} from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  const isApuntesSection = location.pathname.startsWith('/apuntes');

  // Configuración específica para Punto Legal Apuntes
  if (isApuntesSection) {
    const apuntesServices = [
      { name: 'Derecho Civil', href: '/apuntes?category=derecho-civil' },
      { name: 'Derecho Penal', href: '/apuntes?category=derecho-penal' },
      { name: 'Derecho Constitucional', href: '/apuntes?category=derecho-constitucional' },
      { name: 'Derecho Procesal', href: '/apuntes?category=derecho-procesal' },
      { name: 'Derecho Comercial', href: '/apuntes?category=derecho-comercial' },
      { name: 'Derecho Tributario', href: '/apuntes?category=derecho-tributario' }
    ];

    const studyTools = [
      { name: 'Sistema de Gamificación', href: '/apuntes' },
      { name: 'Conceptos Interactivos', href: '/apuntes' },
      { name: 'Seguimiento de Progreso', href: '/apuntes' },
      { name: 'Estadísticas de Estudio', href: '/apuntes' }
    ];

    const legal = [
      { name: 'Términos de Uso', href: '/terms-of-service' },
      { name: 'Política de Privacidad', href: '/privacy-policy' },
      { name: 'Aviso Legal', href: '/terms-of-service' }
    ];

    const socialLinks = [
      { name: 'Instagram', href: 'https://instagram.com/puntolegalapuntes', icon: '📸' },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/puntolegalapuntes', icon: '💼' },
      { name: 'YouTube', href: 'https://youtube.com/@puntolegalapuntes', icon: '🎥' },
      { name: 'TikTok', href: 'https://tiktok.com/@puntolegalapuntes', icon: '🎵' }
    ];

    return (
      <footer className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Círculos decorativos */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full animate-pulse" />
          <div className="absolute top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full animate-pulse delay-1000" />
          <div className="absolute -bottom-16 left-1/2 w-32 h-32 bg-indigo-500/10 rounded-full animate-pulse delay-500" />
          
          {/* Partículas flotantes */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + i * 0.5,
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

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header del footer */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Punto Legal Apuntes
                </h2>
                <p className="text-blue-200 text-lg">
                  La plataforma más avanzada para estudiar Derecho en Chile
                </p>
              </div>
            </motion.div>

            {/* Estadísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-8 mb-8"
            >
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">500+</span>
                </div>
                <p className="text-blue-200 text-sm">Apuntes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">1000+</span>
                </div>
                <p className="text-purple-200 text-sm">Estudiantes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                  <span className="text-2xl font-bold text-white">50+</span>
                </div>
                <p className="text-indigo-200 text-sm">Medallas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">100%</span>
                </div>
                <p className="text-blue-200 text-sm">Satisfacción</p>
              </div>
            </motion.div>

            <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
              Sistema gamificado, contenido actualizado y seguimiento de progreso personalizado.
            </p>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Categorías de Apuntes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>Categorías de Apuntes</span>
              </h3>
              <ul className="space-y-2">
                {apuntesServices.map((service) => (
                  <li key={service.name}>
                    <Link
                      to={service.href}
                      className="text-blue-200 hover:text-white transition-colors duration-200 flex items-center space-x-2 hover:translate-x-1 transition-transform"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                      <span>{service.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Herramientas de Estudio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>Herramientas de Estudio</span>
              </h3>
              <ul className="space-y-2">
                {studyTools.map((tool) => (
                  <li key={tool.name}>
                    <Link
                      to={tool.href}
                      className="text-purple-200 hover:text-white transition-colors duration-200 flex items-center space-x-2 hover:translate-x-1 transition-transform"
                    >
                      <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                      <span>{tool.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <span>Legal</span>
              </h3>
              <ul className="space-y-2">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-indigo-200 hover:text-white transition-colors duration-200 flex items-center space-x-2 hover:translate-x-1 transition-transform"
                    >
                      <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>Contacto</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">apuntes@puntolegal.online</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+56 9 6232 1883</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Santiago, Chile</span>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2 text-white">Síguenos</h4>
                <div className="flex space-x-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-lg">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-blue-500/20">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span>¡Empieza a Estudiar Hoy!</span>
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </h3>
              <p className="text-blue-200 mb-6 max-w-lg mx-auto">
                Accede a cientos de apuntes organizados y un sistema gamificado único.
              </p>
              <Link
                to="/apuntes"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Zap className="w-5 h-5" />
                <span>Comenzar Gratis</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Footer inferior */}
          <div className="border-t border-blue-500/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-blue-200 text-sm mb-4 md:mb-0"
              >
                © 2025 Punto Legal Apuntes. Todos los derechos reservados.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-blue-200 text-sm flex items-center space-x-1"
              >
                <span>Hecho con</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>para estudiantes de Derecho en Chile</span>
              </motion.p>
            </div>
          </div>
        </div>

        {/* Efecto de brillo inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      </footer>
    );
  }

  // Footer original para el sitio principal de Punto Legal (mantener esquema naranjo)
  const services = [
    { name: 'Derecho Corporativo', href: '/servicios/corporativo' },
    { name: 'Derecho Inmobiliario', href: '/servicios/inmobiliario' },
    { name: 'Derecho Laboral', href: '/servicios/laboral' },
    { name: 'Derecho de Familia', href: '/servicios/familia' },
    { name: 'Derecho Civil', href: '/servicios/civil' },
    { name: 'Derecho Penal', href: '/servicios/penal' }
  ];

  const legalMain = [
    { name: 'Términos de Servicio', href: '/terms-of-service' },
    { name: 'Política de Privacidad', href: '/privacy-policy' },
    { name: 'Aviso Legal', href: '/terms-of-service' }
  ];

  const socialLinksMain = [
    { name: 'Instagram', href: 'https://instagram.com/puntolegal', icon: '📸' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/puntolegal', icon: '💼' },
    { name: 'WhatsApp', href: 'https://wa.me/56962321883', icon: '💬' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full animate-pulse" />
        <div className="absolute top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full animate-pulse delay-1000" />
        
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Punto Legal</h2>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Startup legal chilena que democratiza el acceso a la justicia con tecnología. 
              Creamos soluciones jurídicas modernas, accesibles y de alta calidad.
            </p>
            
            {/* Valores Auténticos - Startup Chilena */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">🇨🇱</div>
                <div className="text-xs text-gray-400">Hecho en Chile</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-emerald-400">2025</div>
                <div className="text-xs text-gray-400">Startup Legal</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">✨</div>
                <div className="text-xs text-gray-400">Innovación</div>
              </div>
            </div>
          </motion.div>

          {/* Servicios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4">Servicios Legales</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto y Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">puntolegalelgolf@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+56 9 6232 1883</span>
              </div>
            </div>

            {/* Legal */}
            <h4 className="text-lg font-medium mb-2">Legal</h4>
            <ul className="space-y-1">
              {legalMain.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Redes sociales */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">Síguenos</h4>
              <div className="flex space-x-3">
                {socialLinksMain.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-orange-500/20 rounded-lg flex items-center justify-center transition-all duration-300"
                  >
                    <span>{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer inferior */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Punto Legal. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span>Hecho con</span>
              <span className="text-red-500">❤️</span>
              <span>en Chile</span>
              <span className="text-blue-500">🇨🇱</span>
              <span>• Startup Legal</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;