import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogPost3 = () => {
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
                  Derecho de Familia
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>6 min lectura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Especialista Familiar</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Guía Completa: Pensiones de Alimentos
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Todo lo que necesitas saber sobre pensiones alimenticias, desde la demanda hasta el cumplimiento efectivo.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué son las Pensiones de Alimentos?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Las pensiones de alimentos son una obligación legal que tiene una persona de proporcionar los recursos económicos necesarios para cubrir las necesidades básicas de sus hijos menores de edad o cónyuge que se encuentre en situación de vulnerabilidad.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">¿Quiénes pueden solicitar pensión de alimentos?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-primary">Hijos Menores</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Menores de 18 años o hasta 28 años si están estudiando una profesión u oficio.
                    </p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-primary">Cónyuge</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      En casos de divorcio o separación cuando existe necesidad económica.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">Proceso Legal</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Demanda de Alimentos</h4>
                      <p className="text-sm text-muted-foreground">Se presenta ante el Juzgado de Familia correspondiente al domicilio del demandante.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Mediación Familiar</h4>
                      <p className="text-sm text-muted-foreground">Proceso obligatorio previo para intentar llegar a un acuerdo entre las partes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Juicio de Alimentos</h4>
                      <p className="text-sm text-muted-foreground">Si no hay acuerdo en mediación, se procede al juicio donde el juez determinará el monto.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">Costos de Nuestros Servicios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 text-center">
                    <h4 className="font-bold text-primary mb-2">Demanda de Alimentos</h4>
                    <p className="text-3xl font-bold text-neon-green mb-2">$640.000</p>
                    <p className="text-sm text-muted-foreground">Incluye todo el proceso hasta sentencia</p>
                  </div>
                  <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 text-center">
                    <h4 className="font-bold text-primary mb-2">Divorcio de Común Acuerdo</h4>
                    <p className="text-3xl font-bold text-neon-green mb-2">$150.000</p>
                    <p className="text-sm text-muted-foreground">Tramitación completa sin conflicto</p>
                  </div>
                </div>

                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                  <h4 className="font-bold text-foreground mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ventajas de Nuestro Servicio
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-electric"></div>
                      Asesoría personalizada desde el primer momento
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-electric"></div>
                      Seguimiento constante del proceso
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-electric"></div>
                      Experiencia comprobada en casos familiares
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-electric"></div>
                      Gestión de cumplimiento y modificaciones
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Solicitar Consulta
                  </Button>
                  <Button variant="outline" className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10">
                    WhatsApp Directo
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

export default BlogPost3;