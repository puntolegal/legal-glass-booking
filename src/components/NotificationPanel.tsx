import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  RefreshCw,
  BarChart3,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { NOTIFICATION_CONFIG } from '@/config/notifications';
import type { Reserva } from '@/services/supabaseBooking';
import { runFullTestSuite } from '@/utils/testNotifications';

interface NotificationStats {
  total: number;
  enviadas: number;
  fallidas: number;
  pendientes: number;
  ultimaEjecucion?: string;
}

export default function NotificationPanel() {
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    enviadas: 0,
    fallidas: 0,
    pendientes: 0
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null);
  const [recordatoriosActivos, setRecordatoriosActivos] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const estadisticas = await notificationService.obtenerEstadisticas();
      setStats(estadisticas);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      mostrarMensaje('error', 'Error cargando estadísticas de notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 5000);
  };

  const ejecutarRecordatorios = async () => {
    try {
      setLoading(true);
      mostrarMensaje('success', '⏳ Ejecutando recordatorios automáticos...');
      
      const resultado = await notificationService.programarRecordatoriosDiarios();
      
      if (resultado.enviados > 0) {
        mostrarMensaje('success', 
          `✅ Recordatorios enviados: ${resultado.enviados}. Errores: ${resultado.errores}`
        );
      } else {
        mostrarMensaje('success', '📭 No hay citas para mañana que requieran recordatorio');
      }
      
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error ejecutando recordatorios:', error);
      mostrarMensaje('error', 'Error ejecutando recordatorios automáticos');
    } finally {
      setLoading(false);
    }
  };

  const reenviarFallidas = async () => {
    try {
      setLoading(true);
      mostrarMensaje('success', '⏳ Reenviando notificaciones fallidas...');
      
      const resultado = await notificationService.reenviarNotificacionesFallidas();
      
      mostrarMensaje('success', 
        `✅ Procesadas: ${resultado.procesadas}. Exitosas: ${resultado.exitosas}`
      );
      
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error reenviando notificaciones:', error);
      mostrarMensaje('error', 'Error reenviando notificaciones fallidas');
    } finally {
      setLoading(false);
    }
  };

  const probarConexionEmails = async () => {
    try {
      setLoading(true);
      const resultado = await notificationService.probarConexion();
      mostrarMensaje(resultado.success ? 'success' : 'error', resultado.message);
    } catch (error) {
      console.error('Error probando conexión de emails:', error);
      mostrarMensaje('error', 'Error probando conexión con Resend');
    } finally {
      setLoading(false);
    }
  };

  const enviarConfirmacionDemo = async () => {
    try {
      setLoading(true);
      const ahora = new Date();
      const reservaPrueba: Reserva = {
        id: `demo-${ahora.getTime()}`,
        nombre: 'Cliente de Prueba',
        email: NOTIFICATION_CONFIG.email.testRecipient || 'test@puntolegal.online',
        telefono: '+56912345678',
        rut: '11.111.111-1',
        servicio: 'Consulta Legal Demo',
        precio: '50000',
        categoria: 'demo',
        fecha: ahora.toISOString().split('T')[0],
        hora: '10:00',
        descripcion: 'Reserva generada para validar el flujo de notificaciones.',
        pago_metodo: 'pendiente',
        pago_estado: 'pendiente',
        pago_id: null,
        pago_monto: null,
        tipo_reunion: 'online',
        external_reference: null,
        preference_id: null,
        estado: 'pendiente',
        email_enviado: false,
        recordatorio_enviado: false,
        created_at: ahora.toISOString(),
        updated_at: ahora.toISOString()
      };

      const exito = await notificationService.enviarConfirmacionReserva(reservaPrueba);
      mostrarMensaje(
        exito ? 'success' : 'error',
        exito ? '✅ Confirmación enviada correctamente (demo)' : '❌ Error enviando confirmación de prueba'
      );
    } catch (error) {
      console.error('Error enviando confirmación de prueba:', error);
      mostrarMensaje('error', 'Error enviando confirmación de prueba');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarPruebasCompletas = async () => {
    try {
      setLoading(true);
      mostrarMensaje('success', '⏳ Ejecutando suite completa de pruebas...');
      
      const resultados = await runFullTestSuite();
      
      let mensaje = '📊 Resultados de las pruebas:\n';
      mensaje += `🔗 Conexión: ${resultados.connection.success ? '✅' : '❌'}\n`;
      mensaje += `🗄️ Tablas: ${resultados.tables.success ? '✅' : '❌'}\n`;
      mensaje += `📝 Reserva: ${resultados.reservation.success ? '✅' : '❌'}\n`;
      if (resultados.notification) {
        mensaje += `📧 Notificación: ${resultados.notification.success ? '✅' : '❌'}\n`;
      }
      mensaje += `🧹 Limpieza: ${resultados.cleanup.success ? '✅' : '❌'}`;
      
      const todosExitosos = resultados.connection.success && 
                           resultados.tables.success && 
                           resultados.reservation.success && 
                           resultados.cleanup.success;
      
      mostrarMensaje(
        todosExitosos ? 'success' : 'error', 
        todosExitosos ? '🎉 Todas las pruebas pasaron exitosamente' : '⚠️ Algunas pruebas fallaron - revisar consola'
      );
      
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error ejecutando pruebas:', error);
      mostrarMensaje('error', 'Error ejecutando suite de pruebas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sistema de Notificaciones</h2>
          <p className="text-muted-foreground">Gestiona recordatorios y comprobantes automáticos</p>
        </div>
        <Button 
          onClick={cargarEstadisticas} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <Alert variant={mensaje.tipo === 'error' ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mensaje.texto}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="acciones">
            <Send className="w-4 h-4 mr-2" />
            Acciones
          </TabsTrigger>
          <TabsTrigger value="configuracion">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enviadas</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.enviadas}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.total} notificaciones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
                <p className="text-xs text-muted-foreground">
                  en cola de envío
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fallidas</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.fallidas}</div>
                <p className="text-xs text-muted-foreground">
                  requieren atención
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total > 0 ? Math.round((stats.enviadas / stats.total) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  últimas 24h
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estado del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>
                Información sobre la configuración actual de Resend y notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remitente principal</span>
                <Badge variant={NOTIFICATION_CONFIG.email.sender ? 'default' : 'destructive'}>
                  {NOTIFICATION_CONFIG.email.sender ? 'Configurado' : 'Falta configurar'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recordatorios Automáticos</span>
                <Badge variant={recordatoriosActivos ? 'default' : 'secondary'}>
                  {recordatoriosActivos ? 'Activos' : 'Pausados'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email administrador</span>
                <span className="text-sm text-muted-foreground">
                  {NOTIFICATION_CONFIG.email.admin}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Casilla de pruebas</span>
                <span className="text-sm text-muted-foreground">
                  {NOTIFICATION_CONFIG.email.testRecipient || 'No definida'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Última Ejecución</span>
                <span className="text-sm text-muted-foreground">
                  {stats.ultimaEjecucion ? 
                    new Date(stats.ultimaEjecucion).toLocaleString('es-CL') : 
                    'Nunca'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Acciones */}
        <TabsContent value="acciones" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recordatorios Diarios</CardTitle>
                <CardDescription>
                  Envía recordatorios a clientes con citas para mañana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={ejecutarRecordatorios}
                  disabled={loading}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Ejecutar Recordatorios
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reenviar Fallidas</CardTitle>
                <CardDescription>
                  Reintenta enviar notificaciones que fallaron anteriormente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={reenviarFallidas}
                  disabled={loading || stats.fallidas === 0}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reenviar ({stats.fallidas})
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Probar Conexión de Emails</CardTitle>
                <CardDescription>
                  Envía un correo de prueba usando Resend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={probarConexionEmails}
                  disabled={loading}
                  variant="secondary"
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Enviar Email de Prueba
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confirmación Demo</CardTitle>
                <CardDescription>
                  Envía la plantilla completa de confirmación a la casilla de pruebas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={enviarConfirmacionDemo}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Confirmación Demo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control de Recordatorios</CardTitle>
                <CardDescription>
                  Pausar o activar el sistema automático
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setRecordatoriosActivos(!recordatoriosActivos)}
                  variant={recordatoriosActivos ? "destructive" : "default"}
                  className="w-full"
                >
                  {recordatoriosActivos ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar Sistema
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activar Sistema
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pruebas del Sistema</CardTitle>
                <CardDescription>
                  Ejecutar suite completa de verificación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={ejecutarPruebasCompletas}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ejecutar Todas las Pruebas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración */}
        <TabsContent value="configuracion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Emails</CardTitle>
              <CardDescription>
                Ajustes para el envío automático vía Resend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Remitente</label>
                <div className="p-3 bg-muted rounded text-sm font-mono break-all">
                  {NOTIFICATION_CONFIG.email.sender}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email administrador</label>
                <div className="p-3 bg-muted rounded text-sm font-mono break-all">
                  {NOTIFICATION_CONFIG.email.admin}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dirección de pruebas</label>
                <div className="p-3 bg-muted rounded text-sm font-mono break-all">
                  {NOTIFICATION_CONFIG.email.testRecipient || 'No definida'}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Datos de la empresa</label>
                <div className="p-3 bg-muted rounded text-sm space-y-1">
                  <div><strong>Nombre:</strong> {NOTIFICATION_CONFIG.empresa.nombre}</div>
                  <div><strong>Email:</strong> {NOTIFICATION_CONFIG.empresa.email}</div>
                  <div><strong>Teléfono:</strong> {NOTIFICATION_CONFIG.empresa.telefono}</div>
                  <div><strong>WhatsApp:</strong> {NOTIFICATION_CONFIG.empresa.whatsapp}</div>
                </div>
              </div>

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Para cambiar estos valores, actualiza las variables de entorno asociadas a Resend en tu archivo .env
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
