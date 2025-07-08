import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'abogado' | 'cliente';
  requiredPermission?: 'viewAllReservations' | 'editAnyReservation' | 'deleteAnyReservation' | 'viewAllProfiles' | 'editAnyProfile' | 'deleteAnyProfile';
  fallback?: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback,
  redirectTo = "/"
}: ProtectedRouteProps) => {
  const { 
    user, 
    loading, 
    isAdmin, 
    isAbogado, 
    isCliente,
    canViewAllReservations,
    canEditAnyReservation,
    canDeleteAnyReservation,
    canViewAllProfiles,
    canEditAnyProfile,
    canDeleteAnyProfile
  } = useAuth();

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <CardTitle>Acceso Requerido</CardTitle>
            <CardDescription>
              Necesitas iniciar sesión para acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => window.location.href = "/auth"} 
              className="w-full"
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = redirectTo} 
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar rol requerido
  if (requiredRole) {
    const hasRequiredRole = 
      (requiredRole === 'admin' && isAdmin()) ||
      (requiredRole === 'abogado' && isAbogado()) ||
      (requiredRole === 'cliente' && isCliente());

    if (!hasRequiredRole) {
      return fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Acceso Denegado</CardTitle>
              <CardDescription>
                No tienes permisos suficientes para acceder a esta página.
                <br />
                <span className="font-medium">Rol requerido: {requiredRole}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = redirectTo} 
                className="w-full"
              >
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Verificar permiso específico
  if (requiredPermission) {
    const permissionChecks = {
      viewAllReservations: canViewAllReservations,
      editAnyReservation: canEditAnyReservation,
      deleteAnyReservation: canDeleteAnyReservation,
      viewAllProfiles: canViewAllProfiles,
      editAnyProfile: canEditAnyProfile,
      deleteAnyProfile: canDeleteAnyProfile
    };

    const hasPermission = permissionChecks[requiredPermission]();

    if (!hasPermission) {
      return fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Permiso Denegado</CardTitle>
              <CardDescription>
                No tienes el permiso necesario para realizar esta acción.
                <br />
                <span className="font-medium">Permiso requerido: {requiredPermission}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = redirectTo} 
                className="w-full"
              >
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute; 