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
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Mantente informado con nuestros artículos especializados en derecho laboral, jurisprudencia y casos de éxito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {blogPostsList.map((post, index) => {
            const blogLinks = [
              "/blog/despido-injustificado",
              "/blog/calculo-indemnizacion",
              "/blog/derechos-fundamentales",
              "/blog/casos-exito"
            ];

            return (
              <article
                key={index}
                className="glass-ios-card-dark overflow-hidden hover:-translate-y-1 transition-transform duration-300 group cursor-pointer"
                onClick={() => (window.location.href = blogLinks[index])}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-sky-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {post.category}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-base lg:text-lg font-bold text-slate-100 mb-3 group-hover:text-sky-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    {post.readTime && (
                      <span className="text-xs text-slate-400">{post.readTime}</span>
                    )}
                    <button className="text-sky-300 hover:text-cyan-300 transition-colors text-sm font-medium">
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
            className="cta-secondary px-8 py-3 text-base"
            onClick={() => {
              window.location.href = "/blog";
            }}
          >
            Ver todos los artículos
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
