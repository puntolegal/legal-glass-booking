import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  Award, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Globe,
  Shield,
  Sparkles,
  TrendingUp,
  Clock,
  Download,
  Play,
  ChevronRight,
  FileText,
  Lightbulb,
  Compass,
  Map,
  GraduationCap,
  Scale
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGamification } from '@/contexts/GamificationContext';
import { Button } from '@/components/ui/button';

const ApuntesHome: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { progress } = useGamification();
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Parallax effects
  const yParallax = useTransform(scrollY, [0, 300], [0, -50]);
  const opacityParallax = useTransform(scrollY, [0, 200], [1, 0.8]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Aprendizaje Inteligente",
      description: "Sistema de estudio basado en metodología Zettelkasten con enlaces conceptuales",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Gamificación Premium",
      description: "Sistema de puntos, medallas y niveles para motivar tu progreso diario",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Compass,
      title: "Navegación Conceptual",
      description: "Explora conceptos interconectados como un mapa del conocimiento legal",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Estudios Interactivos",
      description: "Contenido dinámico con conceptos clickeables y referencias cruzadas",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Conceptos Legales", icon: FileText },
    { number: "25+", label: "Áreas del Derecho", icon: Scale },
    { number: "10K+", label: "Enlaces Conceptuales", icon: Globe },
    { number: "99%", label: "Precisión Jurídica", icon: Shield }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Estudiante de Derecho UC",
      content: "Punto Legal Apuntes revolucionó mi forma de estudiar. Los conceptos interconectados me ayudaron a entender el derecho como un sistema completo.",
      avatar: "MG",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      role: "Abogado Recién Titulado",
      content: "El sistema de gamificación me motivó a estudiar todos los días. Logré mi objetivo de repasar todo el derecho civil en 3 meses.",
      avatar: "CM",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      role: "Preparación Grado",
      content: "La navegación conceptual es increíble. Puedes empezar en 'contratos' y terminar entendiendo toda la teoría del acto jurídico.",
      avatar: "AR",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-400/8 dark:bg-indigo-500/4 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl animate-shimmer" />
        
        {/* Partículas flotantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
        style={{ y: yParallax, opacity: opacityParallax }}
      >
        <div className="max-w-7xl mx-auto text-center">


          {/* Título Principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] dark:text-white mb-6 leading-tight">
              Punto Legal
              <br />
              <span className="text-4xl md:text-6xl">Apuntes</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <Brain className="w-6 h-6 text-blue-500 animate-pulse" />
              <div className="w-16 h-px bg-indigo-500/30" />
            </div>
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Revoluciona tu estudio del derecho con nuestro sistema de apuntes interactivos, 
            gamificación inteligente y navegación conceptual avanzada.
          </motion.p>

          {/* Estadísticas del usuario actual */}
          {progress.notesRead > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 mb-12"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{progress.notesRead}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Notas Estudiadas</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{progress.totalPoints}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Puntos Ganados</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{progress.medals.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Medallas</div>
              </div>
            </motion.div>
          )}

          {/* CTAs Principales */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={() => navigate('/apuntes')}
              className="group relative overflow-hidden bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              size="lg"
            >
              <div className="relative flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                Comenzar a Estudiar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
            </Button>

            <Button
              variant="glass"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-8 py-4 text-lg rounded-2xl"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Ver Demo
            </Button>
          </motion.div>

          {/* Preview del sistema */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="glass-premium dark:glass-premium-dark rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Conceptos Interconectados</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Navega entre conceptos como en un mapa mental</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Gamificación</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gana puntos y medallas mientras estudias</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Progreso Visual</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rastrea tu avance con estadísticas detalladas</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Características Premium
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Descubre por qué miles de estudiantes y abogados eligen nuestro sistema de estudio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-premium dark:glass-premium-dark rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/30 group-hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-stone-50 dark:bg-[#1c1c1e]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Números que Hablan
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass-premium dark:glass-premium-dark rounded-2xl p-6 border border-white/20">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1d1d1f] dark:text-white">
              Lo Que Dicen Nuestros Usuarios
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass-premium dark:glass-premium-dark rounded-2xl p-6 border border-white/20 hover:border-white/30 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-[#1d1d1f] dark:bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para Revolucionar tu Estudio?
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Únete a miles de estudiantes que ya están transformando su aprendizaje legal
            </p>
            
            <div className="flex justify-center items-center">
              <Button
                onClick={() => navigate('/apuntes')}
                className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 text-blue-700 hover:from-gray-50 hover:to-white px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold border-2 border-white/20 hover:border-white/40"
                size="lg"
              >
                <div className="relative flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <GraduationCap className="w-6 h-6 text-blue-700" />
                  </motion.div>
                  <span className="text-blue-700 font-bold">
                    Comenzar Ahora Gratis
                  </span>
                  <motion.div
                    className="text-blue-700"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </div>
                
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ApuntesHome; 