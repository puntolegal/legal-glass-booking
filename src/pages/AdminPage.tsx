import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Users, Calendar, Settings, Eye, Edit, Trash2, UserCheck, UserX, Mail } from "lucide-react";
import NotificationPanel from "@/components/NotificationPanel";

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

interface Reservation {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  descripcion: string;
  fecha: string;
  hora: string;
  user_id: string | null;
  created_at: string | null;
}

const AdminPage = () => {
  const { isAdmin, profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
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

      setUsers(usersData || []);
      setReservations(reservationsData || []);
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
      
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          </div>
          <p className="text-muted-foreground">
            Bienvenido, {profile?.nombre || 'Administrador'}. Aquí puedes gestionar usuarios y reservas.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                  </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Reservas</p>
                  <p className="text-2xl font-bold">{reservations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Notificaciones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Administra usuarios, roles y estados de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Reservas</CardTitle>
                <CardDescription>
                  Visualiza y administra todas las reservas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                        <TableCell>{reservation.rut}</TableCell>
                        <TableCell>{reservation.email}</TableCell>
                        <TableCell>{reservation.telefono}</TableCell>
                        <TableCell>{new Date(reservation.fecha).toLocaleDateString('es-CL')}</TableCell>
                        <TableCell>{reservation.hora}</TableCell>
                        <TableCell className="max-w-xs truncate">{reservation.descripcion}</TableCell>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationPanel />
          </TabsContent>
        </Tabs>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="px-8"
          >
            Volver al Inicio
          </Button>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage; 