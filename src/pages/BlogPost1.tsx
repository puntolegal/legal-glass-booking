import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User } from "lucide-react";
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
                  Derecho Laboral
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
                Cómo Calcular tu Indemnización por Despido
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Conoce tus derechos y aprende a calcular correctamente la indemnización que te corresponde según tu tiempo de servicio y salario.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué es la Indemnización por Despido?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  La indemnización por despido es una compensación económica que debe recibir el trabajador cuando es despedido sin causa justificada o cuando se vulneran sus derechos fundamentales durante el proceso de despido.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">Tipos de Indemnización</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">Indemnización Legal</h4>
                    <p className="text-sm text-muted-foreground">
                      Corresponde a 30 días de remuneración por cada año de servicio, con un máximo de 11 meses.
                    </p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">Tutela de Derechos</h4>
                    <p className="text-sm text-muted-foreground">
                      Entre 6 y 11 meses de remuneración cuando se vulneran derechos fundamentales.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">Caso de Éxito: Sebastián Soto</h3>
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
                      <p className="text-muted-foreground">Tutela de Derechos</p>
                      <p className="font-bold text-orange-400">$110.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Nulidad del Despido</p>
                      <p className="font-bold text-orange-400">$110.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Total Obtenido</p>
                      <p className="font-bold text-neon-green">$13.000.000</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Calcular mi Indemnización
                  </Button>
                  <Button variant="outline" className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10">
                    Contactar Abogado
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