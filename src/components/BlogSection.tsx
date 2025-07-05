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
      image: "/ChatGPT Image 5 jul 2025, 01_04_56 a.m..png",
      title: "¿Cuándo un despido es considerado injustificado?",
      excerpt: "Conoce las principales causales que determinan si tu despido fue sin causa justa y qué derechos tienes como trabajador.",
      readTime: "5 min lectura",
      category: "Despido Injustificado"
    },
    {
      image: "/assets_task_01jzcfpd7nf559jc5004m21wze_1751692163_img_1.webp",
      title: "Cómo calcular tu indemnización por años de servicio",
      excerpt: "Guía completa para entender cómo se calcula la indemnización por despido y qué factores influyen en el monto final.",
      readTime: "7 min lectura",
      category: "Indemnizaciones"
    },
    {
      image: "/ChatGPT Image 5 jul 2025, 01_04_56 a.m..png",
      title: "Derechos fundamentales en el trabajo: Lo que debes saber",
      excerpt: "Aprende sobre tus derechos fundamentales como trabajador y qué hacer cuando estos son vulnerados en tu lugar de trabajo.",
      readTime: "6 min lectura",
      category: "Derechos Laborales"
    },
    {
      image: "/af88ce1a-f8b0-4484-b841-ada0e059c444.png",
      title: "Casos de éxito: Despidos injustificados resueltos",
      excerpt: "Revisa casos reales de trabajadores que obtuvieron compensaciones justas tras despidos injustificados con nuestra asesoría.",
      readTime: "8 min lectura",
      category: "Casos de Éxito"
    }
  ];

  const blogPostsList = posts || defaultPosts;

  return (
    <section id="blog" className="py-20 px-6 relative overflow-hidden">
      {/* 3D Statistics Wallet Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src="/lovable-uploads/0720b7af-ea4a-425a-ab11-f9d60e3d2bd1.png" 
          alt="3D Statistics Wallet" 
          className="absolute top-20 left-10 w-64 h-64 opacity-20 animate-float"
          style={{ animationDelay: '1.5s' }}
        />
      </div>
      
      <div className="container mx-auto relative z-10">
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
          {blogPostsList.map((post, index) => {
            const blogLinks = [
              "/blog/calculo-indemnizacion",
              "/blog/ley-karin", 
              "/blog/pensiones-alimentos",
              "/blog/calculo-indemnizacion"
            ];
            
            return (
              <article 
                key={index} 
                className="glass rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 group cursor-pointer"
                onClick={() => window.location.href = blogLinks[index]}
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
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button 
            className="glass-intense bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 border border-orange-400/20 backdrop-blur-xl shadow-lg"
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