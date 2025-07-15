import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Eye, Lock, FileText, Phone, Mail, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { MobileLayout } from "@/components/MobileLayout";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lastUpdated = "8 de enero de 2025";
  const effectiveDate = "1 de enero de 2025";

  const pageContent = (
    <>
      {/* Hero Section */}
      <div className="relative py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <Card className="glass-intense border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-card/40 to-blue-400/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full blur-2xl" />
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-2">
                    Documento Legal
                  </Badge>
                  <div className="flex items-center text-muted-foreground text-sm gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Actualizado: {lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Vigente desde: {effectiveDate}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Política de Privacidad
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                En Punto Legal valoramos y protegemos su privacidad. Esta política describe cómo recolectamos, utilizamos y protegemos su información personal de acuerdo con la legislación chilena vigente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="pb-16 px-6">
        <div className="container mx-auto max-w-5xl space-y-8">
          
          {/* 1. Información General */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">1. Información General</h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  <strong className="text-foreground">Punto Legal</strong> (en adelante "nosotros", "nuestro" o "la firma") es un estudio jurídico especializado en derecho laboral, corporativo, familiar y otros servicios legales, constituido bajo las leyes de la República de Chile.
                </p>
                
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 my-6 border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Datos de Contacto del Responsable:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-sm">puntolegalelgolf@gmail.com</p>
                      </div>
                    </div>

                  </div>
                </div>

                <p>
                  Esta Política de Privacidad se aplica a todos los servicios ofrecidos a través de nuestro sitio web <strong className="text-foreground">https://puntolegal.online</strong> y cualquier interacción que tenga con nuestra firma, ya sea presencial, telefónica, por correo electrónico o cualquier otro medio.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Información que Recolectamos */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">2. Información que Recolectamos</h2>
              </div>
              
              <div className="space-y-6">
                <div className="glass rounded-lg p-6 border border-orange-500/20">
                  <h3 className="text-xl font-semibold text-foreground mb-4">2.1 Información Personal Directa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Nombre completo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">RUT (Rol Único Tributario)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Dirección postal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Teléfono de contacto</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Correo electrónico</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Profesión u ocupación</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Información del caso legal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">Documentos relevantes al servicio</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-6 border border-blue-500/20">
                  <h3 className="text-xl font-semibold text-foreground mb-4">2.2 Información Técnica y de Navegación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Dirección IP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Tipo de navegador y versión</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Sistema operativo</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Páginas visitadas y tiempo de permanencia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Fecha y hora de las visitas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Resolución de pantalla y dispositivo utilizado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-lg p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-foreground mb-4">2.3 Información Sensible (Solo con Autorización Expresa)</h3>
                  <p className="text-muted-foreground mb-4">
                    Únicamente cuando sea estrictamente necesario para la prestación del servicio legal y con su consentimiento explícito:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">Datos de salud (en casos laborales)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">Información financiera detallada</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">Antecedentes penales (si corresponde)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">Información familiar sensible</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Finalidades del Tratamiento */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">3. Finalidades del Tratamiento de Datos</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-lg p-6 border border-green-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">🏛️ Servicios Legales Principales</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Asesoría y representación legal</li>
                      <li>• Elaboración de documentos jurídicos</li>
                      <li>• Gestión de procesos judiciales</li>
                      <li>• Seguimiento de casos</li>
                      <li>• Comunicación sobre el estado de su caso</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">📧 Comunicaciones y Notificaciones</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Confirmación de citas agendadas</li>
                      <li>• Recordatorios 24h antes de las reuniones</li>
                      <li>• Envío de comprobantes de pago</li>
                      <li>• Actualizaciones importantes del caso</li>
                      <li>• Comunicaciones administrativas</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-orange-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">💳 Gestión de Pagos</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Procesamiento de honorarios</li>
                      <li>• Emisión de facturas y boletas</li>
                      <li>• Control de pagos realizados</li>
                      <li>• Gestión de planes de pago</li>
                      <li>• Cumplimiento tributario</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">📊 Mejora de Servicios</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Análisis de satisfacción del cliente</li>
                      <li>• Optimización de procesos internos</li>
                      <li>• Desarrollo de nuevos servicios</li>
                      <li>• Estadísticas de uso del sitio web</li>
                      <li>• Investigación de mercado legal</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-foreground">Base Legal del Tratamiento</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    El tratamiento de sus datos personales se basa en las siguientes bases legales reconocidas por la legislación chilena:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span className="text-sm text-muted-foreground"><strong>Consentimiento expreso:</strong> Para el envío de comunicaciones y marketing</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span className="text-sm text-muted-foreground"><strong>Ejecución contractual:</strong> Para la prestación de servicios legales contratados</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span className="text-sm text-muted-foreground"><strong>Obligación legal:</strong> Para cumplir con requisitos regulatorios y tributarios</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span className="text-sm text-muted-foreground"><strong>Interés legítimo:</strong> Para la mejora de nuestros servicios y seguridad</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Derechos del Usuario */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">4. Sus Derechos como Titular de Datos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-lg p-6 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3">📋 Derechos Disponibles</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Acceso</p>
                        <p className="text-sm text-muted-foreground">Conocer qué datos tenemos sobre usted</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Rectificación</p>
                        <p className="text-sm text-muted-foreground">Corregir datos inexactos o incompletos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Cancelación</p>
                        <p className="text-sm text-muted-foreground">Solicitar la eliminación de sus datos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Oposición</p>
                        <p className="text-sm text-muted-foreground">Oponerse al tratamiento de sus datos</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass rounded-lg p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3">📞 Cómo Ejercer sus Derechos</h3>
                  <p className="text-muted-foreground mb-4">
                    Para ejercer cualquiera de estos derechos, contacte a nuestro responsable de datos:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">puntolegalelgolf@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">+56 9 6232 1883</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Plazo de respuesta:</strong> Máximo 15 días hábiles desde la recepción de su solicitud.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Contacto */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">5. Contacto</h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Para cualquier consulta, reclamo o ejercicio de derechos relacionados con esta Política de Privacidad, puede contactarnos a través de:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 glass rounded-lg border border-amber-500/20">
                  <Mail className="w-8 h-8 mx-auto mb-4 text-amber-500" />
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">puntolegalelgolf@gmail.com</p>
                </div>

                <div className="text-center p-6 glass rounded-lg border border-amber-500/20">
                  <FileText className="w-8 h-8 mx-auto mb-4 text-amber-500" />
                  <h3 className="font-semibold text-foreground mb-2">Sitio Web</h3>
                  <p className="text-sm text-muted-foreground">puntolegal.online</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <SEO 
        title="Política de Privacidad - Punto Legal"
        description="Conoce cómo Punto Legal protege y maneja tu información personal de acuerdo con la legislación chilena vigente."
        keywords="política de privacidad, protección de datos, punto legal, abogados chile"
        type="article"
      />
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:block relative z-10">
          <Header />
          <div className="pt-20">
            {pageContent}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden relative z-10">
          <MobileLayout>
            {pageContent}
          </MobileLayout>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy; 