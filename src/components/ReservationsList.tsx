import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllReservations, cancelReservation, type Reservation } from "@/services/reservationService";

const ReservationsList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const allReservations = getAllReservations();
    setReservations(allReservations);
  };

  const handleCancelReservation = (reservationId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      try {
        cancelReservation(reservationId);
        loadReservations();
        alert('Reserva cancelada exitosamente');
      } catch (error) {
        alert('Error al cancelar la reserva');
        console.error(error);
      }
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'confirmed': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reservas Existentes</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendientes
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('confirmed')}
          >
            Confirmadas
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('cancelled')}
          >
            Canceladas
          </Button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay reservas {filter !== 'all' && `con estado "${getStatusText(filter)}"`}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="glass rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold">{reservation.nombre}</h3>
                    <span className={`text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>RUT:</strong> {reservation.rut}</p>
                      <p><strong>Email:</strong> {reservation.email}</p>
                      <p><strong>Teléfono:</strong> {reservation.telefono}</p>
                    </div>
                    <div>
                      <p><strong>Fecha:</strong> {new Date(reservation.fecha).toLocaleDateString('es-CL')}</p>
                      <p><strong>Hora:</strong> {reservation.hora}</p>
                      <p><strong>Creada:</strong> {new Date(reservation.createdAt).toLocaleString('es-CL')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p><strong>Descripción:</strong></p>
                    <p className="text-muted-foreground mt-1">{reservation.descripcion}</p>
                  </div>
                </div>
                
                {reservation.status === 'pending' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="ml-4"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <Button
          variant="outline"
          onClick={loadReservations}
        >
          Actualizar Lista
        </Button>
      </div>
    </div>
  );
};

export default ReservationsList; 