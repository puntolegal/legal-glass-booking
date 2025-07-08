import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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
                  Derechos Laborales
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>6 min lectura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Especialista Laboral</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Derechos fundamentales en el trabajo: Lo que debes saber
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Aprende sobre tus derechos fundamentales como trabajador y qué hacer cuando estos son vulnerados en tu lugar de trabajo.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué son los Derechos Fundamentales en el Trabajo?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Los derechos fundamentales en el trabajo son garantías constitucionales que protegen a los trabajadores contra abusos y vulneraciones por parte del empleador. Estos derechos están consagrados en la Constitución y en tratados internacionales ratificados por Chile.
                </p>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl p-6 mb-8 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-foreground">🛡️ Principales Derechos Fundamentales</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Según la Constitución y el Código del Trabajo, estos son los derechos fundamentales que todo trabajador tiene:
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Lista de Derechos Fundamentales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Libertad de Trabajo</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derecho a elegir libremente el trabajo y a no ser discriminado por razones políticas, religiosas, económicas o sociales.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Libertad Sindical</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derecho a formar sindicatos, afiliarse a ellos y participar en actividades sindicales sin represalias.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Negociación Colectiva</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derecho a negociar colectivamente las condiciones de trabajo y a huelga en los casos que la ley establece.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Protección de la Maternidad</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derecho a no ser despedida durante el embarazo, post natal y lactancia materna.
                </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Derecho a la Vida</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derecho a trabajar en condiciones seguras y saludables, libres de riesgos laborales.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Derecho a la Dignidad</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derecho a ser tratado con respeto y dignidad, sin acoso laboral, sexual o violencia.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">🚫 Vulneraciones Más Comunes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Despido Discriminatorio</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Despido por edad, género, estado civil, orientación sexual, religión o discapacidad.
                    </p>
                      </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Acoso Laboral</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Conductas hostiles, intimidatorias o degradantes en el entorno laboral.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Despido por Embarazo</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Despido durante el embarazo, post natal o lactancia materna.
                    </p>
                      </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Represalias Sindicales</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Despido o medidas adversas por participar en actividades sindicales.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">⚖️ ¿Qué Hacer si se Vulneran tus Derechos?</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Documenta Todo</h4>
                      <p className="text-sm text-muted-foreground">
                        Registra fechas, testigos, comunicaciones y cualquier evidencia de la vulneración.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">No Firmes Nada</h4>
                      <p className="text-sm text-muted-foreground">
                        No firmes documentos de renuncia o finiquito sin asesoría legal previa.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Busca Asesoría Legal</h4>
                      <p className="text-sm text-muted-foreground">
                        Consulta con un abogado laboral especializado en derechos fundamentales.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Presenta tu Demanda</h4>
                      <p className="text-sm text-muted-foreground">
                        Tienes 60 días hábiles para presentar la demanda de tutela de derechos fundamentales.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">💰 Compensaciones por Vulneración de Derechos</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg border border-orange-500/20">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Tutela de Derechos Fundamentales</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Entre 6 y 11 meses de remuneración cuando se vulneran derechos fundamentales.
                      </p>
                      <div className="bg-orange-500/5 rounded p-2">
                        <p className="text-xs text-orange-600 font-mono">
                          Ejemplo: 8 meses adicionales = $6.400.000
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg border border-red-500/20">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Nulidad del Despido</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reintegro al trabajo con pago de remuneraciones caídas desde el despido.
                      </p>
                      <div className="bg-red-500/5 rounded p-2">
                        <p className="text-xs text-red-600 font-mono">
                          Ejemplo: 6 meses sin trabajar = $4.800.000 + reintegro
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg border border-green-500/20">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-500 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Daño Moral</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Compensación por el daño psicológico y emocional causado.
                      </p>
                      <div className="bg-green-500/5 rounded p-2">
                        <p className="text-xs text-green-600 font-mono">
                          Ejemplo: $2.000.000 por daño moral
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">✅ Caso de Éxito: Carlos Mendoza</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Carlos Mendoza</h4>
                      <p className="text-sm text-muted-foreground">Despido discriminatorio por edad - 55 años</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Tutela de Derechos</p>
                      <p className="font-bold text-orange-400">$8.800.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Daño Moral</p>
                      <p className="font-bold text-orange-400">$2.500.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$11.300.000</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-6 mb-6 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <h4 className="font-bold text-foreground">🚨 ¿Tus Derechos Fueron Vulnerados?</h4>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    <strong>No estás solo.</strong> Los derechos fundamentales están protegidos por la Constitución y tienes herramientas legales para defenderlos.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-red-600 font-semibold">• Documenta todas las vulneraciones</p>
                    <p className="text-red-600 font-semibold">• Busca testigos y evidencias</p>
                    <p className="text-red-600 font-semibold">• No firmes documentos sin asesoría</p>
                    <p className="text-red-600 font-semibold">• Actúa dentro de los 60 días hábiles</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => window.location.href = '/payment/laboral'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                  >
                    🛡️ Defender mis Derechos - $35.000
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    onClick={() => window.location.href = '/payment/laboral'}
                  >
                    💼 Evaluar mi Caso
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