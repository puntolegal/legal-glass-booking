const BlogSection = () => {
  const blogPosts = [
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

  return (
    <section id="blog" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Blog Legal
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mantente informado con nuestros artículos especializados en derecho laboral, 
            jurisprudencia y casos de éxito
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={index} 
              className="glass rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  <button className="text-primary hover:text-accent transition-colors text-sm font-semibold">
                    Leer más →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="glass rounded-lg px-8 py-3 hover:bg-accent/10 transition-colors border border-primary/30">
            Ver todos los artículos
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;