import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Trophy, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogPost4 = () => {
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
                  Casos de Éxito
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>8 min lectura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Equipo Legal</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Casos de éxito: Despidos injustificados resueltos
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Revisa casos reales de trabajadores que obtuvieron compensaciones justas tras despidos injustificados con nuestra asesoría.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">Casos Reales de Éxito</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Estos son casos reales de trabajadores que confiaron en nuestra asesoría legal y obtuvieron resultados excepcionales. Cada caso demuestra cómo la defensa legal especializada puede marcar la diferencia.
                </p>
                
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 mb-8 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-bold text-foreground">🏆 Nuestros Resultados</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">95%</div>
                      <div className="text-sm text-muted-foreground">Tasa de éxito</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">$2.5M</div>
                      <div className="text-sm text-muted-foreground">Promedio obtenido</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">500+</div>
                      <div className="text-sm text-muted-foreground">Casos resueltos</div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Caso 1: María González - Despido por Embarazo</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">María González</h4>
                      <p className="text-sm text-muted-foreground">Despido por embarazo - 3 años de servicio</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Situación:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Despedida 2 meses después de anunciar su embarazo</li>
                        <li>• Empresa alegó "razones económicas"</li>
                        <li>• Sin previo aviso ni indemnización</li>
                        <li>• Sueldo: $750.000 mensual</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Estrategia Legal:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Demostramos discriminación por embarazo</li>
                        <li>• Presentamos evidencia de comentarios discriminatorios</li>
                        <li>• Demandamos tutela de derechos fundamentales</li>
                        <li>• Solicitamos nulidad del despido</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Indemnización Legal</p>
                      <p className="font-bold text-orange-400">$2.250.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Tutela de Derechos</p>
                      <p className="font-bold text-orange-400">$6.000.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$8.250.000</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Caso 2: Roberto Silva - Despido Discriminatorio por Edad</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-blue-500/10 to-green-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">R</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Roberto Silva</h4>
                      <p className="text-sm text-muted-foreground">Despido discriminatorio - 58 años, 12 años de servicio</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Situación:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Despedido tras comentarios sobre su edad</li>
                        <li>• Reemplazado por trabajador más joven</li>
                        <li>• Sin causales justificadas</li>
                        <li>• Sueldo: $1.200.000 mensual</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Estrategia Legal:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Recopilamos evidencia de comentarios discriminatorios</li>
                        <li>• Demostramos que el reemplazo era más joven</li>
                        <li>• Presentamos testigos del ambiente laboral</li>
                        <li>• Demandamos daño moral adicional</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Indemnización Legal</p>
                      <p className="font-bold text-blue-400">$4.800.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Daño Moral</p>
                      <p className="font-bold text-blue-400">$3.500.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$8.300.000</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Caso 3: Ana Martínez - Despido por Razones Económicas Injustificadas</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Ana Martínez</h4>
                      <p className="text-sm text-muted-foreground">Despido por razones económicas - 7 años de servicio</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Situación:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Despedida por "razones económicas"</li>
                        <li>• Empresa contrató reemplazo 2 semanas después</li>
                        <li>• No hubo proceso de negociación colectiva</li>
                        <li>• Sueldo: $950.000 mensual</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Estrategia Legal:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Demostramos que no había crisis económica real</li>
                        <li>• Probamos que contrataron reemplazo inmediatamente</li>
                        <li>• Demandamos nulidad del despido</li>
                        <li>• Solicitamos reintegro al trabajo</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Remuneraciones Caídas</p>
                      <p className="font-bold text-purple-400">$5.700.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Reintegro al Trabajo</p>
                      <p className="font-bold text-purple-400">✅ Aprobado</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$5.700.000 + Trabajo</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Caso 4: Carlos Mendoza - Despido por Actividad Sindical</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-red-500/10 to-orange-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Carlos Mendoza</h4>
                      <p className="text-sm text-muted-foreground">Despido por actividad sindical - 10 años de servicio</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Situación:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Despedido tras organizar sindicato</li>
                        <li>• Empresa alegó "falta de probidad"</li>
                        <li>• Sin evidencia de mala conducta</li>
                        <li>• Sueldo: $1.100.000 mensual</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Estrategia Legal:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Demostramos que el despido fue por actividad sindical</li>
                        <li>• Presentamos evidencia de la organización sindical</li>
                        <li>• Probamos que no había falta de probidad</li>
                        <li>• Demandamos tutela de libertad sindical</li>
                      </ul>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Indemnización Legal</p>
                      <p className="font-bold text-red-400">$3.300.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Tutela Sindical</p>
                      <p className="font-bold text-red-400">$8.800.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$12.100.000</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">🎯 ¿Por Qué Elegir Nuestra Asesoría?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-500">Experiencia Comprobada</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Más de 500 casos exitosos con resultados excepcionales para nuestros clientes.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold text-blue-500">Resultados Superiores</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Promedio de $2.5 millones obtenidos por cliente, muy por encima del mercado.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-orange-500" />
                      <h4 className="font-semibold text-orange-500">Acompañamiento Completo</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Te acompañamos desde la evaluación inicial hasta la obtención de resultados.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold text-purple-500">Sin Costos Ocultos</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tarifa fija y transparente. Solo pagas si obtenemos resultados positivos.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 mb-6 border border-orange-500/20">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    ¿Tu Caso es Similar?
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Si fuiste despedido injustificadamente, no estás solo. Nuestro equipo de abogados especializados puede ayudarte a obtener la compensación que mereces.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-orange-600 font-semibold">• Evaluación gratuita de tu caso</p>
                    <p className="text-orange-600 font-semibold">• Estrategia legal personalizada</p>
                    <p className="text-orange-600 font-semibold">• Acompañamiento durante todo el proceso</p>
                    <p className="text-orange-600 font-semibold">• Solo pagas si obtenemos resultados</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => window.location.href = '/payment/laboral'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                  >
                    🎯 Evaluar mi Caso - $35.000
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

export default BlogPost4; 