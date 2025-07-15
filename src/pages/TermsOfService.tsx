import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Scale, FileText, AlertTriangle, CheckCircle, Clock, Shield, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { MobileLayout } from "@/components/MobileLayout";
import { useState, useEffect } from "react";
import SEO from "@/components/SEO";

const TermsOfService = () => {
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
          <Card className="glass-intense border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card/40 to-orange-400/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-full blur-2xl" />
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-400/30 mb-2">
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
                Términos de Servicio
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Estos términos establecen las condiciones bajo las cuales Punto Legal proporciona sus servicios legales profesionales y el uso de nuestra plataforma digital.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="pb-16 px-6">
        <div className="container mx-auto max-w-5xl space-y-8">
          
          {/* 1. Definiciones y Ámbito */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">1. Definiciones y Ámbito de Aplicación</h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-4">1.1 Definiciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-foreground">"Punto Legal" o "la Firma":</p>
                        <p className="text-sm">Se refiere al estudio jurídico Punto Legal y sus abogados asociados.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">"Cliente" o "Usuario":</p>
                        <p className="text-sm">Persona natural o jurídica que contrata nuestros servicios.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">"Plataforma":</p>
                        <p className="text-sm">El sitio web https://puntolegal.online y todas sus funcionalidades.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-foreground">"Servicios":</p>
                        <p className="text-sm">Todos los servicios legales ofrecidos por Punto Legal.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">"Contrato":</p>
                        <p className="text-sm">El acuerdo específico para la prestación de servicios legales.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">"Contenido":</p>
                        <p className="text-sm">Información, documentos y material disponible en la plataforma.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">1.2 Ámbito de Aplicación</h3>
                  <p>
                    Estos Términos de Servicio se aplican a todas las interacciones entre Punto Legal y sus clientes, incluyendo pero no limitándose a:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Uso del sitio web y plataforma digital</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Contratación de servicios legales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Consultas presenciales y remotas</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Comunicaciones por cualquier medio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Procesamiento de pagos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Servicios post-contractuales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Servicios Ofrecidos */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">2. Servicios Ofrecidos</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="glass rounded-lg p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">⚖️ Derecho Laboral</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Despidos injustificados</li>
                      <li>• Cálculo de indemnizaciones</li>
                      <li>• Tutela de derechos fundamentales</li>
                      <li>• Accidentes laborales</li>
                      <li>• Negociación colectiva</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-green-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">🏢 Derecho Corporativo</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Constitución de sociedades</li>
                      <li>• Contratos comerciales</li>
                      <li>• Fusiones y adquisiciones</li>
                      <li>• Cumplimiento normativo</li>
                      <li>• Restructuración empresarial</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">👨‍👩‍👧‍👦 Derecho de Familia</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Divorcios y separaciones</li>
                      <li>• Pensiones alimenticias</li>
                      <li>• Cuidado personal de menores</li>
                      <li>• Adopciones</li>
                      <li>• Violencia intrafamiliar</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-orange-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">🏠 Derecho Inmobiliario</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Compraventa de propiedades</li>
                      <li>• Regularización de títulos</li>
                      <li>• Contratos de arriendo</li>
                      <li>• Subdivisiones prediales</li>
                      <li>• Declaratorias de herencia</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-red-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">🛡️ Derecho Penal</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Defensa penal</li>
                      <li>• Querellas</li>
                      <li>• Medidas cautelares</li>
                      <li>• Procedimientos abreviados</li>
                      <li>• Recursos procesales</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-cyan-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">💻 Derecho Digital</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Protección de datos personales</li>
                      <li>• Comercio electrónico</li>
                      <li>• Propiedad intelectual digital</li>
                      <li>• Contratos tecnológicos</li>
                      <li>• Ciberseguridad legal</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-bold text-foreground">Garantía de Calidad</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Todos nuestros servicios son prestados por abogados titulados y habilitados para ejercer en Chile, con amplia experiencia en sus respectivas áreas de especialización.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="font-bold text-amber-400 text-lg">+10 años</p>
                      <p className="text-sm text-muted-foreground">de experiencia</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="font-bold text-amber-400 text-lg">500+</p>
                      <p className="text-sm text-muted-foreground">casos exitosos</p>
                    </div>
                    <div className="text-center p-3 glass rounded-lg">
                      <p className="font-bold text-amber-400 text-lg">98%</p>
                      <p className="text-sm text-muted-foreground">satisfacción cliente</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Responsabilidades del Cliente */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">3. Responsabilidades del Cliente</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-lg p-6 border border-green-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">📄 Información y Documentación</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Proporcionar información veraz y completa</li>
                      <li>• Entregar documentos originales o copias fidedignas</li>
                      <li>• Notificar cambios relevantes al caso</li>
                      <li>• Colaborar activamente en la investigación</li>
                      <li>• Mantener confidencialidad cuando sea requerido</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">💰 Obligaciones de Pago</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Pagar honorarios según contrato establecido</li>
                      <li>• Cubrir gastos procesales y administrativos</li>
                      <li>• Respetar plazos de pago acordados</li>
                      <li>• Informar dificultades de pago oportunamente</li>
                      <li>• Mantener información de contacto actualizada</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-bold text-foreground">Prohibiciones</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    El cliente se compromete a NO realizar las siguientes acciones:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <span className="text-sm text-muted-foreground">Proporcionar información falsa o engañosa</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <span className="text-sm text-muted-foreground">Utilizar nuestros servicios para fines ilegales</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <span className="text-sm text-muted-foreground">Interferir con otros casos o clientes</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <span className="text-sm text-muted-foreground">Contactar directamente a contrapartes sin autorización</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <span className="text-sm text-muted-foreground">Comprometer la confidencialidad de otros clientes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                        <span className="text-sm text-muted-foreground">Usar la plataforma para spam o marketing no autorizado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Limitaciones de Responsabilidad */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">4. Limitaciones de Responsabilidad</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3">⚖️ Naturaleza de los Servicios Legales</h3>
                  <p className="text-muted-foreground mb-4">
                    Los servicios legales conllevan incertidumbre inherente. Punto Legal no puede garantizar resultados específicos, ya que estos dependen de múltiples factores:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Interpretación judicial de las normas</li>
                      <li>• Cambios en la legislación</li>
                      <li>• Actuación de terceros y contrapartes</li>
                      <li>• Disponibilidad y calidad de la evidencia</li>
                    </ul>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Decisiones administrativas</li>
                      <li>• Factores externos no controlables</li>
                      <li>• Plazos y procedimientos legales</li>
                      <li>• Cooperación del cliente y terceros</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-lg p-6 border border-purple-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">🔒 Exclusiones de Responsabilidad</h3>
                    <p className="text-muted-foreground mb-3">Punto Legal no será responsable por:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Daños indirectos o consecuenciales</li>
                      <li>• Pérdida de ganancias o oportunidades</li>
                      <li>• Decisiones basadas en información incorrecta del cliente</li>
                      <li>• Resultados adversos por factores externos</li>
                      <li>• Daños por fuerza mayor o caso fortuito</li>
                    </ul>
                  </div>
                  
                  <div className="glass rounded-lg p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-3">💡 Compromisos de la Firma</h3>
                    <p className="text-muted-foreground mb-3">Punto Legal se compromete a:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Actuar con diligencia profesional</li>
                      <li>• Aplicar conocimientos técnicos actualizados</li>
                      <li>• Mantener confidencialidad absoluta</li>
                      <li>• Informar periódicamente sobre avances</li>
                      <li>• Representar sus intereses con lealtad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Legislación Aplicable */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">5. Legislación Aplicable y Jurisdicción</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl p-6 border border-red-500/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3">🇨🇱 Ley Chilena</h3>
                  <p className="text-muted-foreground mb-4">
                    Estos Términos de Servicio se rigen exclusivamente por las leyes de la República de Chile, incluyendo pero no limitándose a:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Código Civil de Chile</li>
                      <li>• Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</li>
                      <li>• Ley N° 19.628 sobre Protección de la Vida Privada</li>
                      <li>• Código de Ética Profesional del Colegio de Abogados</li>
                    </ul>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ley N° 18.120 sobre Ejercicio de la Profesión de Abogado</li>
                      <li>• Código Orgánico de Tribunales</li>
                      <li>• Código de Procedimiento Civil</li>
                      <li>• Normativas especiales según el área legal</li>
                    </ul>
                  </div>
                </div>

                <div className="glass rounded-lg p-6 border border-red-500/20">
                  <h3 className="text-lg font-semibold text-foreground mb-3">🏛️ Jurisdicción y Competencia</h3>
                  <p className="text-muted-foreground mb-4">
                    Para cualquier controversia que pudiera surgir en relación con estos términos o los servicios prestados:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Jurisdicción:</p>
                        <p className="text-sm text-muted-foreground">Tribunales Ordinarios de Justicia de Chile</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Competencia:</p>
                        <p className="text-sm text-muted-foreground">Tribunales de Santiago, Región Metropolitana</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-foreground">Mediación:</p>
                        <p className="text-sm text-muted-foreground">Se priorizará la mediación antes de recurrir a tribunales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Contacto */}
          <Card className="glass-intense border-glass-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">6. Contacto y Consultas</h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Para cualquier consulta sobre estos Términos de Servicio o nuestros servicios legales, puede contactarnos a través de:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 glass rounded-lg border border-cyan-500/20">
                  <Scale className="w-8 h-8 mx-auto mb-4 text-cyan-500" />
                  <h3 className="font-semibold text-foreground mb-2">Oficina Legal</h3>
                  <p className="text-sm text-muted-foreground">El Golf, Las Condes<br />Santiago, Chile</p>
                </div>
                <div className="text-center p-6 glass rounded-lg border border-cyan-500/20">
                  <FileText className="w-8 h-8 mx-auto mb-4 text-cyan-500" />
                  <h3 className="font-semibold text-foreground mb-2">Email Corporativo</h3>
                  <p className="text-sm text-muted-foreground">puntolegalelgolf@gmail.com</p>
                </div>

              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                <p className="text-center text-muted-foreground">
                  <strong className="text-foreground">Última actualización:</strong> {lastUpdated}<br />
                  <strong className="text-foreground">Vigencia:</strong> Estos términos entran en vigor desde el {effectiveDate}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
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
        title="Términos de Servicio - Punto Legal"
        description="Conoce los términos y condiciones bajo los cuales Punto Legal proporciona sus servicios legales profesionales en Chile."
        keywords="términos de servicio, condiciones legales, punto legal, abogados chile"
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

export default TermsOfService; 