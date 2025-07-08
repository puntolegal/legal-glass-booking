import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogPost1 = () => {
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
                  Despido Injustificado
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>5 min lectura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Equipo Legal</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                ¿Cuándo un despido es considerado injustificado?
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Conoce las principales causales que determinan si tu despido fue sin causa justa y qué derechos tienes como trabajador.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué es un Despido Injustificado?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Un despido injustificado es aquel que no cumple con las causales legales establecidas en el Código del Trabajo chileno. Cuando un empleador despide a un trabajador sin una causa justificada, este tiene derecho a reclamar y obtener compensaciones.
                </p>
                
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-6 mb-8 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-bold text-foreground">⚠️ Causales de Despido Justificado</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Según el artículo 160 del Código del Trabajo, solo estas causales son válidas para un despido justificado:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Falta de probidad del trabajador</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Conductas de acoso sexual</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Vías de hecho ejercidas por el trabajador</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Injurias proferidas por el trabajador</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Conducta inadecuada grave</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Negociaciones que ejecute el trabajador</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">🚫 Causales Frecuentes de Despido Injustificado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Despido por Razones Económicas</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Si no hay un proceso de negociación colectiva o no se cumplen los requisitos legales.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Despido Discriminatorio</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Por edad, género, estado civil, orientación sexual, religión o discapacidad.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Despido por Enfermedad</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Durante licencias médicas o por enfermedades crónicas.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-500">Despido por Embarazo</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Durante el embarazo, post natal o lactancia materna.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">✅ ¿Qué Derechos Tienes en un Despido Injustificado?</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-500 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Indemnización Legal</h4>
                      <p className="text-sm text-muted-foreground">
                        30 días de remuneración por cada año de servicio, con un máximo de 11 meses.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-500 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Tutela de Derechos Fundamentales</h4>
                      <p className="text-sm text-muted-foreground">
                        Entre 6 y 11 meses adicionales cuando se vulneran derechos fundamentales.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-500 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Reintegro al Trabajo</h4>
                      <p className="text-sm text-muted-foreground">
                        Posibilidad de volver a tu puesto de trabajo con todos los beneficios.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Pasos a Seguir si Fuiste Despedido Injustificadamente</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold text-foreground">No firmes nada sin asesoría legal</p>
                      <p className="text-sm text-muted-foreground">Especialmente documentos de renuncia o finiquito.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold text-foreground">Recopila toda la documentación</p>
                      <p className="text-sm text-muted-foreground">Contrato, liquidaciones, comunicaciones, testigos.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold text-foreground">Busca asesoría legal especializada</p>
                      <p className="text-sm text-muted-foreground">Un abogado laboral puede evaluar tu caso.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-semibold text-foreground">Presenta tu demanda dentro del plazo</p>
                      <p className="text-sm text-muted-foreground">Tienes 60 días hábiles desde el despido.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 mb-6 border border-orange-500/20">
                  <h4 className="font-bold text-foreground mb-3">🎯 Caso de Éxito: María González</h4>
                  <p className="text-muted-foreground mb-4">
                    María fue despedida por "razones económicas" sin previo aviso. Con nuestra asesoría, logramos demostrar que el despido era injustificado y obtuvo:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Indemnización Legal</p>
                      <p className="font-bold text-orange-400">$2.400.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Tutela de Derechos</p>
                      <p className="font-bold text-orange-400">$800.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$3.200.000</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => window.location.href = '/payment/laboral'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                  >
                    🎯 Evaluar mi Despido - $35.000
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    onClick={() => window.location.href = '/payment/laboral'}
                  >
                    💼 Consulta Gratuita
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

export default BlogPost1;