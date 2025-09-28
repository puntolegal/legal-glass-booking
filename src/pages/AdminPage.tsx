import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Users, Calendar, Trash2, UserCheck, UserX, Mail } from "lucide-react";
import NotificationPanel from "@/components/NotificationPanel";
import type { Reserva } from "@/services/supabaseBooking";

interface UserProfile {
  id: string;
  user_id: string;
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  role: 'admin' | 'abogado' | 'cliente';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminPage = () => {
  const { isAdmin, profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Acceso denegado. Solo administradores pueden ver esta página.");
      window.location.href = "/";
      return;
    }

    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all reservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservas')
        .select('*')
        .order('fecha', { ascending: false });

      if (reservationsError) throw reservationsError;

      setUsers((usersData as UserProfile[]) || []);
      setReservations(reservationsData?.map(r => ({
        ...r,
        precio: String(r.precio || '0')
      })) as any[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Error al actualizar el estado del usuario');
    }
  };

  const changeUserRole = async (userId: string, newRole: 'admin' | 'abogado' | 'cliente') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Rol del usuario cambiado a ${newRole}`);
      fetchData(); // Refresh data
      } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error al cambiar el rol del usuario');
    }
  };

  const deleteReservation = async (reservationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reserva?')) return;

    try {
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      toast.success('Reserva eliminada exitosamente');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Error al eliminar la reserva');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              Solo los administradores pueden acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
  return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
            </div>
    );
  }

  return (
    <>
      {/* Navegación Flotante Móvil */}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header Premium */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/40 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Bienvenido, <span className="font-semibold text-blue-600 dark:text-blue-400">{profile?.nombre || 'Administrador'}</span>. 
                  Gestiona usuarios, reservas y configuraciones del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Usuarios */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/40 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Usuarios</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.length}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>

          {/* Total Reservas */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/40 shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Reservas</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{reservations.length}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
          </div>

          {/* Usuarios Activos */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/40 shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Usuarios Activos</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{users.filter(u => u.is_active).length}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Tabs Premium */}
        <Tabs defaultValue="users" className="space-y-6">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-2 border border-white/20 dark:border-slate-700/40 shadow-lg">
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="users" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/20 dark:data-[state=active]:border-slate-600/40 transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Usuarios</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reservations" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/20 dark:data-[state=active]:border-slate-600/40 transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Reservas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center space-x-2 py-3 px-4 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-white/20 dark:data-[state=active]:border-slate-600/40 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="font-medium">Notificaciones</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="space-y-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/40 shadow-xl">
              <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gestión de Usuarios</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Administra usuarios, roles y estados de cuenta del sistema
                </p>
              </div>
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nombre || 'Sin nombre'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telefono || 'No especificado'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'admin' ? 'destructive' :
                            user.role === 'abogado' ? 'default' : 'secondary'
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'secondary'}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('es-CL')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                            >
                              {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </Button>
                            <select
                              value={user.role}
                              onChange={(e) => changeUserRole(user.user_id, e.target.value as 'admin' | 'abogado' | 'cliente')}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="cliente">Cliente</option>
                              <option value="abogado">Abogado</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/40 shadow-xl">
              <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gestión de Reservas</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Visualiza y administra todas las reservas del sistema
                </p>
              </div>
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.nombre}</TableCell>
                        <TableCell>{reservation.rut || 'No especificado'}</TableCell>
                        <TableCell>{reservation.email}</TableCell>
                        <TableCell>{reservation.telefono}</TableCell>
                        <TableCell>{new Date(reservation.fecha).toLocaleDateString('es-CL')}</TableCell>
                        <TableCell>{reservation.hora}</TableCell>
                        <TableCell className="max-w-xs truncate">{reservation.descripcion || '—'}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteReservation(reservation.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationPanel />
          </TabsContent>
        </Tabs>

        {/* Back Button Premium */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = "/"}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-slate-500/25 hover:shadow-xl hover:shadow-slate-500/30 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage; 
