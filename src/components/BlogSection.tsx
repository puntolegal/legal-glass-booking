interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  readTime?: string;
  category?: string;
}

interface BlogSectionProps {
  title?: string;
  posts?: BlogPost[];
}

const BlogSection = ({ title = "Blog Legal", posts }: BlogSectionProps) => {
  const defaultPosts = [
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      title: "¿Cuándo un despido es considerado injustificado?",
      excerpt: "Conoce las principales causales que determinan si tu despido fue sin causa justa y qué derechos tienes como trabajador.",
      readTime: "5 min lectura",
      category: "Despido Injustificado"
    },
    {
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=250&fit=crop",
      title: "Cómo calcular tu indemnización por años de servicio",
      excerpt: "Guía completa para entender cómo se calcula la indemnización por despido y qué factores influyen en el monto final.",
      readTime: "7 min lectura",
      category: "Indemnizaciones"
    },
    {
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
      title: "Derechos fundamentales en el trabajo: Lo que debes saber",
      excerpt: "Aprende sobre tus derechos fundamentales como trabajador y qué hacer cuando estos son vulnerados en tu lugar de trabajo.",
      readTime: "6 min lectura",
      category: "Derechos Laborales"
    },
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      title: "Casos de éxito: Despidos injustificados resueltos",
      excerpt: "Revisa casos reales de trabajadores que obtuvieron compensaciones justas tras despidos injustificados con nuestra asesoría.",
      readTime: "8 min lectura",
      category: "Casos de Éxito"
    }
  ];

  const blogPostsList = posts || defaultPosts;

  return (
    <section id="blog" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mantente informado con nuestros artículos especializados en derecho laboral, 
            jurisprudencia y casos de éxito
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPostsList.map((post, index) => (
            <article 
              key={index} 
              className="glass rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {post.category && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  {post.readTime && (
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  )}
                  <button className="text-primary hover:text-accent transition-colors text-sm font-medium">
                    Leer más →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            className="btn-primary px-8 py-3 rounded-xl text-primary-foreground font-semibold hover:scale-105 transition-transform"
            onClick={() => {
              // Navigate to blog page or expand to show all articles
              window.location.href = "#blog";
            }}
          >
            Ver Todos los Artículos
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;