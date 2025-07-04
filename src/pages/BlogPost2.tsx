import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogPost2 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-intense border-b border-glass-border">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="glass hover:bg-primary/20 text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-intense border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-card/40 to-orange-400/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-full blur-2xl" />
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                  Ley Karin
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>7 min lectura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Especialista Legal</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Ley Karin: Protección contra el Acoso Laboral
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Todo lo que necesitas saber sobre la Ley Karin y cómo te protege del acoso laboral, sexual y la violencia en el trabajo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="glass-intense border-glass-border mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué es la Ley Karin?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  La Ley Karin (Ley N° 21.643) es una normativa chilena que busca prevenir, investigar y sancionar el acoso laboral, acoso sexual y la violencia en el trabajo, estableciendo medidas de protección para las víctimas.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">Tipos de Situaciones que Cubre</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-primary mb-2">Acoso Laboral</h4>
                    <p className="text-sm text-muted-foreground">
                      Conductas hostiles, intimidatorias o degradantes en el trabajo.
                    </p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-5-5-5-5-1.5-1.5L5.636 5.636m12.728 12.728L21 18l-5-5-5-5-1.5-1.5L5.636 5.636" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-primary mb-2">Acoso Sexual</h4>
                    <p className="text-sm text-muted-foreground">
                      Comportamientos de naturaleza sexual no deseados.
                    </p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-primary mb-2">Violencia Laboral</h4>
                    <p className="text-sm text-muted-foreground">
                      Agresiones físicas o psicológicas en el entorno laboral.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">¿Cómo Proceder?</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Documenta los Hechos</h4>
                      <p className="text-sm text-muted-foreground">Registra fechas, testigos y evidencias de las situaciones de acoso.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Denuncia Interna</h4>
                      <p className="text-sm text-muted-foreground">Presenta la denuncia ante el comité de convivencia laboral de tu empresa.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Asesoría Legal</h4>
                      <p className="text-sm text-muted-foreground">Consulta con un abogado especializado para evaluar acciones legales.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-neon-green/10 to-green-500/5 mb-6">
                  <h4 className="font-bold text-foreground mb-2">💡 Dato Importante</h4>
                  <p className="text-muted-foreground text-sm">
                    Nuestro servicio de asesoría especializada en Ley Karin tiene un costo de <strong className="text-neon-green">$45.000</strong> 
                    y incluye evaluación completa del caso y estrategia legal personalizada.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Solicitar Asesoría
                  </Button>
                  <Button variant="outline" className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10">
                    Más Información
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost2;