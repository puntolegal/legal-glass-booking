import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllReservations, type Reservation } from "@/services/reservationService";

const ReservationsList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const allReservations = await getAllReservations();
    setReservations(allReservations);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reservas Existentes</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadReservations}
          >
            Actualizar Lista
          </Button>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay reservas registradas
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="glass rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-lg font-semibold">{reservation.nombre}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>RUT:</strong> {reservation.rut || 'No especificado'}</p>
                      <p><strong>Email:</strong> {reservation.email}</p>
                      <p><strong>Teléfono:</strong> {reservation.telefono}</p>
                    </div>
                    <div>
                      <p><strong>Fecha:</strong> {new Date(reservation.fecha).toLocaleDateString('es-CL')}</p>
                      <p><strong>Hora:</strong> {reservation.hora}</p>
                      <p><strong>Creada:</strong> {reservation.created_at ? new Date(reservation.created_at).toLocaleString('es-CL') : ''}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p><strong>Descripción:</strong></p>
                    <p className="text-muted-foreground mt-1">{reservation.descripcion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsList; 