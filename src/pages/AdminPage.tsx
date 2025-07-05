import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ReservationsList from "@/components/ReservationsList";
import { cleanupOldReservations } from "@/services/reservationService";

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reservations' | 'stats'>('reservations');

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCleanup = () => {
    if (confirm('¿Estás seguro de que quieres limpiar las reservas antiguas (más de 30 días)?')) {
      try {
        cleanupOldReservations();
        alert('Limpieza completada exitosamente');
      } catch (error) {
        alert('Error durante la limpieza');
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Panel de Administración
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Gestiona las reservas y configuración del sistema
          </p>
        </div>

        {/* Navegación de pestañas */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-2xl p-2 border border-white/20">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'reservations' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('reservations')}
                className="px-6"
              >
                Reservas
              </Button>
              <Button
                variant={activeTab === 'stats' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('stats')}
                className="px-6"
              >
                Estadísticas
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido de las pestañas */}
        <div className="glass rounded-3xl p-8 border border-white/20">
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gestión de Reservas</h2>
                <Button
                  variant="outline"
                  onClick={handleCleanup}
                  className="text-sm"
                >
                  Limpiar Reservas Antiguas
                </Button>
              </div>
              <ReservationsList />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Estadísticas del Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6 border border-primary/30 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {localStorage.getItem('reservas') ? 
                      JSON.parse(localStorage.getItem('reservas') || '[]').length : 0}
                  </div>
                  <p className="text-muted-foreground">Total de Reservas</p>
                </div>
                
                <div className="glass rounded-2xl p-6 border border-green-500/30 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {localStorage.getItem('reservas') ? 
                      JSON.parse(localStorage.getItem('reservas') || '[]')
                        .filter((r: any) => r.status === 'confirmed').length : 0}
                  </div>
                  <p className="text-muted-foreground">Reservas Confirmadas</p>
                </div>
                
                <div className="glass rounded-2xl p-6 border border-yellow-500/30 text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {localStorage.getItem('reservas') ? 
                      JSON.parse(localStorage.getItem('reservas') || '[]')
                        .filter((r: any) => r.status === 'pending').length : 0}
                  </div>
                  <p className="text-muted-foreground">Reservas Pendientes</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Información del Sistema</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Almacenamiento:</strong> localStorage</p>
                  <p><strong>Horarios disponibles:</strong> 8 por día</p>
                  <p><strong>Duración de consulta:</strong> 45 minutos</p>
                  <p><strong>Precio:</strong> $15.000 CLP</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de regreso */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="px-8"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 