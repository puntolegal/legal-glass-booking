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

  const testearWebhook = async () => {
    try {
      setLoading(true);
      mostrarMensaje('success', '⏳ Probando conexión con Make...');
      
      // Crear datos de prueba
      const reservaPrueba = {
        id: 'test-' + Date.now(),
        nombre: 'Prueba Sistema',
        email: 'test@puntolegal.cl',
        telefono: '+56912345678',
        fecha: new Date().toISOString().split('T')[0],
        hora: '15:00',
        servicio: 'Consulta General',
        precio: '50000',
        categoria: 'general'
      };

      const exito = await notificationService.enviarConfirmacionReserva(reservaPrueba);
      
      if (exito) {
        mostrarMensaje('success', '✅ Webhook de prueba enviado exitosamente');
      } else {
        mostrarMensaje('error', '❌ Error enviando webhook de prueba');
      }
      
    } catch (error) {
      console.error('Error probando webhook:', error);
      mostrarMensaje('error', 'Error probando conexión con Make');
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
                Información sobre la configuración actual de Make
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Webhook URL</span>
                <Badge variant={NOTIFICATION_CONFIG.makeWebhookUrl.includes('YOUR_WEBHOOK_ID') ? 'destructive' : 'default'}>
                  {NOTIFICATION_CONFIG.makeWebhookUrl.includes('YOUR_WEBHOOK_ID') ? 'No configurado' : 'Configurado'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recordatorios Automáticos</span>
                <Badge variant={recordatoriosActivos ? 'default' : 'secondary'}>
                  {recordatoriosActivos ? 'Activos' : 'Pausados'}
                </Badge>
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
                <CardTitle>Probar Webhook</CardTitle>
                <CardDescription>
                  Envía una notificación de prueba a Make
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testearWebhook}
                  disabled={loading}
                  variant="secondary"
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Probar Conexión
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
              <CardTitle>Configuración de Make</CardTitle>
              <CardDescription>
                Ajustes para la integración con Make.com
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook URL</label>
                <div className="p-3 bg-muted rounded text-sm font-mono break-all">
                  {NOTIFICATION_CONFIG.makeWebhookUrl}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Empresa</label>
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
                  Para cambiar estos valores, modifica las variables de entorno en tu archivo .env
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 