import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Building, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BlogPost5 = () => {
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
                  Sociedades Express
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>5 min lectura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Especialista Corporativo</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Constituir una Sociedad: Guía Completa
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Todo lo que necesitas saber para constituir tu sociedad comercial de forma rápida y segura.
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
                <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué es una Sociedad Comercial?</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Una sociedad comercial es una persona jurídica formada por dos o más personas que aportan bienes o servicios para desarrollar una actividad económica con fines de lucro.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">Tipos de Sociedades Más Comunes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Building className="w-5 h-5 text-orange-400" />
                      </div>
                      <h4 className="font-semibold text-primary">Sociedad de Responsabilidad Limitada (SpA)</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Responsabilidad limitada al capital</li>
                      <li>• Mínimo 1 socio</li>
                      <li>• Capital mínimo $1</li>
                      <li>• Ideal para startups</li>
                    </ul>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-orange-400" />
                      </div>
                      <h4 className="font-semibold text-primary">Sociedad Anónima (SA)</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Responsabilidad limitada</li>
                      <li>• Mínimo 2 socios</li>
                      <li>• Capital mínimo $50.000.000</li>
                      <li>• Ideal para empresas grandes</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">Ventajas de Constituir una Sociedad</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Responsabilidad Limitada</h4>
                      <p className="text-sm text-muted-foreground">Los socios no responden con sus bienes personales por las deudas de la empresa.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Beneficios Tributarios</h4>
                      <p className="text-sm text-muted-foreground">Acceso a créditos y beneficios fiscales específicos para empresas.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Credibilidad Comercial</h4>
                      <p className="text-sm text-muted-foreground">Mayor confianza de clientes, proveedores y bancos.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">Proceso de Constitución</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Redacción de Estatutos</h4>
                      <p className="text-sm text-muted-foreground">Documento que regula el funcionamiento de la sociedad.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Inscripción en Registro de Comercio</h4>
                      <p className="text-sm text-muted-foreground">Trámite obligatorio para dar publicidad a la sociedad.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Obtención de RUT Empresarial</h4>
                      <p className="text-sm text-muted-foreground">Identificación tributaria para operaciones comerciales.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 glass rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Apertura de Cuenta Bancaria</h4>
                      <p className="text-sm text-muted-foreground">Cuenta empresarial para operaciones comerciales.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">Caso de Éxito: TechStart Chile</h3>
                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold">T</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">TechStart Chile</h4>
                      <p className="text-sm text-muted-foreground">Sociedad SpA constituida en 3 días hábiles</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Tiempo de Constitución</p>
                      <p className="font-bold text-orange-400">3 días hábiles</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Costo del Servicio</p>
                      <p className="font-bold text-orange-400">$45.000</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="text-muted-foreground">Ahorro vs. Trámite Tradicional</p>
                      <p className="font-bold text-green-500">$200.000</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">¿Cuándo Necesitas una Sociedad?</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Quieres proteger tus bienes personales</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Planeas expandir tu negocio</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Necesitas acceder a créditos bancarios</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Quieres asociarte con otros emprendedores</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-primary/10 rounded-xl p-6 mb-6 border border-primary/20">
                  <h4 className="font-bold text-foreground mb-3">💡 ¿Listo para Emprender?</h4>
                  <p className="text-muted-foreground mb-4">
                    <strong>No esperes más.</strong> Constituir tu sociedad es el primer paso para hacer crecer tu negocio de forma segura y profesional.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-primary font-semibold">• Proceso rápido y seguro</p>
                    <p className="text-primary font-semibold">• Asesoría especializada</p>
                    <p className="text-primary font-semibold">• Documentación completa</p>
                    <p className="text-primary font-semibold">• Seguimiento del proceso</p>
                  </div>
                </div>

                <div className="glass-intense rounded-xl p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 mb-6">
                  <h4 className="font-bold text-foreground mb-2">💡 Constitución Express de Sociedades</h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    Nuestro servicio incluye redacción de estatutos, inscripción en Registro de Comercio, obtención de RUT y asesoría completa.
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-bold text-lg">$45.000 CLP</p>
                      <p className="text-xs text-muted-foreground">Constitución completa</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">✅ Estatutos personalizados</p>
                      <p className="text-sm font-semibold">✅ Inscripción registral</p>
                      <p className="text-sm font-semibold">✅ RUT empresarial</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    onClick={() => window.location.href = '/payment/sociedades-express'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                  >
                    🏢 Constituir mi Sociedad - $45.000
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    onClick={() => window.location.href = '/payment/sociedades-express'}
                  >
                    📋 Evaluar mi Proyecto
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

export default BlogPost5; 