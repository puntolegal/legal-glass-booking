import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calculator, TrendingUp, DollarSign } from "lucide-react";
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
                  Indemnizaciones
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
                Cómo calcular tu indemnización por años de servicio
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Guía completa para entender cómo se calcula la indemnización por despido y qué factores influyen en el monto final.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué es la Indemnización por Años de Servicio?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  La indemnización por años de servicio es una compensación económica que debe recibir el trabajador cuando es despedido sin causa justificada. Esta indemnización se calcula basándose en el tiempo trabajado y la remuneración percibida.
                </p>
                
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 mb-8 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-bold text-foreground">📊 Fórmula de Cálculo</h3>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 mb-4">
                    <p className="text-lg font-mono text-primary text-center">
                      Indemnización = (Sueldo Base × 30 días × Años de Servicio) ÷ 365
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> El sueldo base incluye remuneración fija, gratificaciones legales y comisiones variables.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">🔢 Ejemplo Práctico de Cálculo</h3>
                <div className="glass rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-primary mb-4">Caso: Juan Pérez - 5 años de servicio</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 glass rounded-lg">
                      <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Sueldo Base</p>
                      <p className="font-bold text-primary text-lg">$800.000</p>
                    </div>
                    <div className="text-center p-4 glass rounded-lg">
                      <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Años de Servicio</p>
                      <p className="font-bold text-primary text-lg">5 años</p>
                    </div>
                    <div className="text-center p-4 glass rounded-lg">
                      <Calculator className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Indemnización</p>
                      <p className="font-bold text-green-500 text-lg">$3.287.671</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <p className="text-sm font-mono text-primary">
                      Cálculo: ($800.000 × 30 × 5) ÷ 365 = $3.287.671
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📋 Factores que Influyen en el Cálculo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4 border border-blue-500/20">
                    <h4 className="font-semibold text-blue-500 mb-2">💰 Remuneración Base</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sueldo fijo mensual</li>
                      <li>• Gratificaciones legales</li>
                      <li>• Comisiones variables</li>
                      <li>• Bonos de producción</li>
                    </ul>
                  </div>
                  <div className="glass rounded-lg p-4 border border-green-500/20">
                    <h4 className="font-semibold text-green-500 mb-2">⏰ Tiempo de Servicio</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Años completos trabajados</li>
                      <li>• Meses adicionales</li>
                      <li>• Días de servicio</li>
                      <li>• Máximo 11 años</li>
                    </ul>
                  </div>
                  <div className="glass rounded-lg p-4 border border-orange-500/20">
                    <h4 className="font-semibold text-orange-500 mb-2">📅 Fecha de Despido</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Última remuneración</li>
                      <li>• Promedio de 3 meses</li>
                      <li>• Incluye beneficios</li>
                      <li>• Excluye horas extras</li>
                    </ul>
                  </div>
                  <div className="glass rounded-lg p-4 border border-red-500/20">
                    <h4 className="font-semibold text-red-500 mb-2">⚖️ Tipo de Despido</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Despido injustificado</li>
                      <li>• Tutela de derechos</li>
                      <li>• Despido discriminatorio</li>
                      <li>• Nulidad del despido</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">🎯 Tipos de Indemnización</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg border border-green-500/20">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-500 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Indemnización Legal</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        30 días de remuneración por cada año de servicio, con un máximo de 11 meses.
                      </p>
                      <div className="bg-green-500/5 rounded p-2">
                        <p className="text-xs text-green-600 font-mono">
                          Ejemplo: 5 años = 150 días = $3.287.671
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg border border-orange-500/20">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-500 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Tutela de Derechos Fundamentales</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Entre 6 y 11 meses adicionales cuando se vulneran derechos fundamentales.
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
                      <span className="text-red-500 font-bold text-sm">3</span>
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
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">📊 Calculadora de Indemnización</h3>
                <div className="glass rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Sueldo Base Mensual</label>
                      <input 
                        type="number" 
                        placeholder="$800.000"
                        className="w-full p-3 rounded-lg border border-primary/20 bg-background/50 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Años de Servicio</label>
                      <input 
                        type="number" 
                        placeholder="5"
                        className="w-full p-3 rounded-lg border border-primary/20 bg-background/50 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                    <p className="text-center text-primary font-semibold">
                      Indemnización Estimada: $3.287.671
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      * Este es un cálculo estimado. Consulta con un abogado para un cálculo preciso.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">✅ Caso de Éxito: Sebastián Soto</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Sebastián Soto</h4>
                      <p className="text-sm text-muted-foreground">Despido injustificado - 8 años de servicio</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Indemnización Legal</p>
                      <p className="font-bold text-orange-400">$5.260.274</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Tutela de Derechos</p>
                      <p className="font-bold text-orange-400">$6.400.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-green-500">$11.660.274</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-6 mb-6 border border-orange-500/20">
                  <h4 className="font-bold text-foreground mb-3">⚠️ Importante:</h4>
                  <p className="text-muted-foreground mb-4">
                    Tienes <strong>60 días hábiles</strong> desde el despido para presentar tu demanda. 
                    Después de este plazo, pierdes el derecho a reclamar.
                  </p>
                  <p className="text-sm text-orange-600 font-semibold">
                    ¡No esperes! Cada día cuenta para defender tus derechos.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => window.location.href = '/payment/laboral'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                  >
                    🎯 Calcular mi Indemnización - $35.000
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

export default BlogPost2;