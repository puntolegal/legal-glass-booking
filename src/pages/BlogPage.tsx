import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ArrowRight,
  Building2,
  Home,
  Briefcase,
  Heart,
  FileText,
  Shield,
  Globe,
  Scale,
  TrendingUp,
  Eye,
  MessageSquare
} from 'lucide-react';
import SEO from '../components/SEO';
import GlassLayout from '@/components/layout/GlassLayout';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryIcon: React.ElementType;
  date: string;
  readTime: string;
  views: string;
  comments: number;
  image: string;
  href: string;
  featured?: boolean;
  urgent?: boolean;
}

const blogPosts: BlogPost[] = [
  // Corporativo
  {
    id: 'constituir-empresa-chile-2025',
    title: 'Guía Completa para Constituir una Empresa en Chile 2025',
    excerpt: 'Todo lo que necesitas saber sobre los tipos de sociedades, procesos digitales y costos actualizados para crear tu empresa en Chile.',
    category: 'Corporativo',
    categoryIcon: Building2,
    date: '15 Enero 2025',
    readTime: '12 min',
    views: '2.4K',
    comments: 23,
    image: '/lovable-uploads/0720b7af-ea4a-425a-ab11-f9d60e3d2bd1.png',
    href: '/blog/constituir-empresa-chile-2025',
    featured: true
  },
  {
    id: 'sociedades-comerciales',
    title: 'Sociedades Comerciales: Guía Completa 2025',
    excerpt: 'Análisis detallado de los tipos de sociedades comerciales en Chile, sus ventajas y el proceso de constitución.',
    category: 'Corporativo',
    categoryIcon: Building2,
    date: '10 Enero 2025',
    readTime: '8 min',
    views: '1.8K',
    comments: 15,
    image: '/lovable-uploads/7be4428e-26bd-43cc-998f-d5627977fb84.png',
    href: '/blog/sociedades-comerciales'
  },
  
  // Familia
  {
    id: 'divorcio-chile-2025',
    title: 'Divorcio en Chile: Todo lo que Necesitas Saber en 2025',
    excerpt: 'Guía completa sobre los tipos de divorcio, proceso legal, protección de los hijos y aspectos económicos del divorcio en Chile.',
    category: 'Familia',
    categoryIcon: Heart,
    date: '12 Enero 2025',
    readTime: '15 min',
    views: '3.1K',
    comments: 34,
    image: '/lovable-uploads/7898c61a-9e73-4112-97ad-5e1b16d84421.png',
    href: '/blog/divorcio-chile-2025',
    featured: true
  },
  
  // Inmobiliario
  {
    id: 'compraventa-propiedades-guia',
    title: 'Guía de Compraventa de Propiedades: Evita Problemas Legales',
    excerpt: 'Checklist completo para comprar o vender propiedades sin riesgos legales, documentos esenciales y costos involucrados.',
    category: 'Inmobiliario',
    categoryIcon: Home,
    date: '8 Enero 2025',
    readTime: '10 min',
    views: '2.7K',
    comments: 28,
    image: '/placeholder.svg',
    href: '/blog/compraventa-propiedades-guia'
  },
  
  // Digital
  {
    id: 'contratos-digitales-firma-electronica',
    title: 'Contratos Digitales y Firma Electrónica: El Futuro es Ahora',
    excerpt: 'Todo sobre la validez legal de contratos digitales, tipos de firma electrónica y mejores prácticas para empresas.',
    category: 'Digital',
    categoryIcon: Globe,
    date: '5 Enero 2025',
    readTime: '8 min',
    views: '1.9K',
    comments: 19,
    image: '/placeholder.svg',
    href: '/blog/contratos-digitales-firma-electronica',
    urgent: true
  },
  
  // Laboral
  {
    id: 'despido-injustificado',
    title: 'Despido Injustificado: Cómo Defenderte y Obtener Indemnización',
    excerpt: 'Guía completa sobre tus derechos ante un despido injustificado, cómo calcular la indemnización y pasos legales a seguir.',
    category: 'Laboral',
    categoryIcon: Briefcase,
    date: '20 Diciembre 2024',
    readTime: '12 min',
    views: '4.2K',
    comments: 45,
    image: '/placeholder.svg',
    href: '/blog/despido-injustificado',
    featured: true
  },
  {
    id: 'calculo-indemnizacion',
    title: 'Cálculo de Indemnización Laboral: Guía Práctica 2025',
    excerpt: 'Aprende a calcular correctamente tu indemnización por años de servicio, feriado proporcional y otros beneficios.',
    category: 'Laboral',
    categoryIcon: Briefcase,
    date: '18 Diciembre 2024',
    readTime: '10 min',
    views: '3.5K',
    comments: 32,
    image: '/placeholder.svg',
    href: '/blog/calculo-indemnizacion'
  },
  {
    id: 'derechos-fundamentales',
    title: 'Derechos Fundamentales del Trabajador en Chile',
    excerpt: 'Conoce tus derechos básicos como trabajador, desde el contrato hasta la protección contra discriminación.',
    category: 'Laboral',
    categoryIcon: Briefcase,
    date: '15 Diciembre 2024',
    readTime: '14 min',
    views: '2.8K',
    comments: 26,
    image: '/placeholder.svg',
    href: '/blog/derechos-fundamentales'
  },
  {
    id: 'casos-exito',
    title: 'Casos de Éxito: Recuperamos $250M en Indemnizaciones',
    excerpt: 'Historias reales de trabajadores que defendimos exitosamente y lograron recuperar sus derechos laborales.',
    category: 'Laboral',
    categoryIcon: Briefcase,
    date: '12 Diciembre 2024',
    readTime: '16 min',
    views: '5.1K',
    comments: 67,
    image: '/placeholder.svg',
    href: '/blog/casos-exito'
  },

  // Tributario
  {
    id: 'reforma-tributaria-2024',
    title: 'Reforma Tributaria 2024: Lo que necesitas saber',
    excerpt: 'Análisis completo de los cambios más importantes en la legislación tributaria chilena para el año 2024.',
    category: 'Tributario',
    categoryIcon: Scale,
    date: '15 Enero 2024',
    readTime: '8 min',
    views: '3.8K',
    comments: 42,
    image: '/placeholder.svg',
    href: '/blog/reforma-tributaria-2024',
    featured: true
  },
  {
    id: 'evasion-fiscal-chile',
    title: 'Evasión Fiscal en Chile: Consecuencias y Prevención',
    excerpt: 'Guía completa sobre las consecuencias legales de la evasión fiscal y cómo prevenir problemas con el SII.',
    category: 'Tributario',
    categoryIcon: Scale,
    date: '12 Enero 2024',
    readTime: '10 min',
    views: '2.9K',
    comments: 31,
    image: '/placeholder.svg',
    href: '/blog/evasion-fiscal-chile'
  },
  {
    id: 'planificacion-tributaria-2024',
    title: 'Planificación Tributaria 2024: Estrategias Legales',
    excerpt: 'Estrategias de planificación tributaria legal para empresas y personas naturales en el nuevo marco normativo.',
    category: 'Tributario',
    categoryIcon: Scale,
    date: '10 Enero 2024',
    readTime: '12 min',
    views: '2.6K',
    comments: 28,
    image: '/placeholder.svg',
    href: '/blog/planificacion-tributaria-2024'
  },

  // Blog Posts Existentes
  {
    id: 'blog-post-1',
    title: '¿Cuándo un despido es considerado injustificado?',
    excerpt: 'Conoce las principales causales que determinan si tu despido fue sin causa justa y qué derechos tienes como trabajador.',
    category: 'Laboral',
    categoryIcon: Briefcase,
    date: '20 Diciembre 2024',
    readTime: '5 min',
    views: '4.5K',
    comments: 52,
    image: '/placeholder.svg',
    href: '/blog-post-1'
  },
  {
    id: 'blog-post-2',
    title: 'Guía Completa de Derecho de Familia en Chile',
    excerpt: 'Todo lo que necesitas saber sobre matrimonio, divorcio, custodia y pensión alimenticia en Chile.',
    category: 'Familia',
    categoryIcon: Heart,
    date: '18 Diciembre 2024',
    readTime: '15 min',
    views: '3.2K',
    comments: 38,
    image: '/placeholder.svg',
    href: '/blog-post-2'
  },
  {
    id: 'blog-post-3',
    title: 'Contratos de Trabajo: Tipos y Obligaciones Legales',
    excerpt: 'Análisis detallado de los diferentes tipos de contratos laborales y las obligaciones que generan para empleadores.',
    category: 'Laboral',
    categoryIcon: Briefcase,
    date: '15 Diciembre 2024',
    readTime: '12 min',
    views: '3.8K',
    comments: 41,
    image: '/placeholder.svg',
    href: '/blog-post-3'
  },
  {
    id: 'blog-post-4',
    title: 'Derecho Inmobiliario: Compraventa y Arrendamiento',
    excerpt: 'Guía práctica sobre los aspectos legales de compraventa y arrendamiento de propiedades en Chile.',
    category: 'Inmobiliario',
    categoryIcon: Home,
    date: '12 Diciembre 2024',
    readTime: '14 min',
    views: '2.9K',
    comments: 33,
    image: '/placeholder.svg',
    href: '/blog-post-4'
  },
  {
    id: 'blog-post-5',
    title: 'Protección de Datos Personales en Chile',
    excerpt: 'Análisis de la Ley de Protección de Datos Personales y sus implicancias para empresas y personas.',
    category: 'Digital',
    categoryIcon: Globe,
    date: '10 Diciembre 2024',
    readTime: '10 min',
    views: '2.7K',
    comments: 29,
    image: '/placeholder.svg',
    href: '/blog-post-5'
  },
  {
    id: 'blog-post-6',
    title: 'Derecho Penal Económico: Delitos Corporativos',
    excerpt: 'Análisis de los principales delitos económicos y las consecuencias legales para empresas y ejecutivos.',
    category: 'Penal',
    categoryIcon: Shield,
    date: '8 Diciembre 2024',
    readTime: '16 min',
    views: '3.1K',
    comments: 35,
    image: '/placeholder.svg',
    href: '/blog-post-6'
  },
  {
    id: 'blog-post-7',
    title: 'Constitución de Sociedades: Guía Paso a Paso',
    excerpt: 'Proceso detallado para constituir diferentes tipos de sociedades comerciales en Chile.',
    category: 'Corporativo',
    categoryIcon: Building2,
    date: '5 Diciembre 2024',
    readTime: '18 min',
    views: '4.1K',
    comments: 47,
    image: '/placeholder.svg',
    href: '/blog-post-7'
  },
  {
    id: 'blog-post-8',
    title: 'Derecho Civil: Responsabilidad Civil y Daños',
    excerpt: 'Análisis de la responsabilidad civil extracontractual y contractual en el ordenamiento jurídico chileno.',
    category: 'Civil',
    categoryIcon: FileText,
    date: '3 Diciembre 2024',
    readTime: '13 min',
    views: '2.8K',
    comments: 31,
    image: '/placeholder.svg',
    href: '/blog-post-8'
  },
  {
    id: 'blog-post-9',
    title: 'Compliance Corporativo: Gestión de Riesgos Legales',
    excerpt: 'Implementación de programas de cumplimiento normativo para prevenir riesgos legales en empresas.',
    category: 'Corporativo',
    categoryIcon: Building2,
    date: '1 Diciembre 2024',
    readTime: '20 min',
    views: '3.5K',
    comments: 39,
    image: '/placeholder.svg',
    href: '/blog-post-9'
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: Scale, count: blogPosts.length },
  { id: 'Corporativo', name: 'Corporativo', icon: Building2, count: blogPosts.filter(p => p.category === 'Corporativo').length },
  { id: 'Laboral', name: 'Laboral', icon: Briefcase, count: blogPosts.filter(p => p.category === 'Laboral').length },
  { id: 'Familia', name: 'Familia', icon: Heart, count: blogPosts.filter(p => p.category === 'Familia').length },
  { id: 'Inmobiliario', name: 'Inmobiliario', icon: Home, count: blogPosts.filter(p => p.category === 'Inmobiliario').length },
  { id: 'Civil', name: 'Civil', icon: FileText, count: blogPosts.filter(p => p.category === 'Civil').length },
  { id: 'Penal', name: 'Penal', icon: Shield, count: blogPosts.filter(p => p.category === 'Penal').length },
  { id: 'Digital', name: 'Digital', icon: Globe, count: blogPosts.filter(p => p.category === 'Digital').length },
  { id: 'Tributario', name: 'Tributario', icon: Scale, count: blogPosts.filter(p => p.category === 'Tributario').length }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;
    
    if (selectedCategory !== 'all') {
      posts = posts.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return posts;
  }, [selectedCategory, searchTerm]);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <GlassLayout>
        <section className="py-16 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Blog Legal
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Mantente informado con artículos especializados, análisis jurídicos y guías prácticas de nuestros expertos legales
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:border-primary outline-none transition-colors"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                    ${selectedCategory === category.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white/5 hover:bg-white/10 border border-white/20'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {selectedCategory === 'all' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  Artículos Destacados
                </h2>
                <p className="text-muted-foreground">Los artículos más leídos y relevantes</p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <Link 
                      to={post.href}
                      className="relative block bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <post.categoryIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">{post.category}</span>
                        {post.urgent && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full animate-pulse">
                            URGENTE
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <span>Leer artículo</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory === 'all' ? 'Todos los Artículos' : `Artículos de ${selectedCategory}`}
              </h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCategory + searchTerm}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <Link 
                      to={post.href}
                      className="relative block bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300 h-full"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <post.categoryIcon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">{post.category}</span>
                        {post.urgent && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full animate-pulse">
                            URGENTE
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                        <span>Leer más</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron artículos</h3>
                <p className="text-muted-foreground">
                  Intenta con otros términos de búsqueda o selecciona una categoría diferente
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-bold mb-4">Mantente Informado</h3>
                <p className="text-muted-foreground mb-6">
                  Recibe los últimos artículos legales y actualizaciones normativas directamente en tu email
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-primary outline-none transition-colors"
                  />
                  <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Suscribirse
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
    </GlassLayout>
  );
} 