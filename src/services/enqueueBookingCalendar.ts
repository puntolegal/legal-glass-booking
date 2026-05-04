import { supabase } from '@/integrations/supabase/client';

/**
 * Encola Google Calendar/Meet vía Zapier para reservas `pago_estado = waived_inmobiliario`.
 * Requiere Edge Function `enqueue-booking-calendar` desplegada y `ZAPIER_BOOKING_HOOK_URL` en Supabase.
 */
export async function enqueueBookingCalendarForWaived(
  bookingId: string,
): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    const { data, error } = await supabase.functions.invoke('enqueue-booking-calendar', {
      body: { booking_id: bookingId },
    });
    if (error) {
      console.warn('[enqueueBookingCalendar]', error.message);
      return { success: false, error: error.message, data };
    }
    const bag = data as { success?: boolean; message?: string } | null;
    if (bag && bag.success === false) {
      return { success: false, error: JSON.stringify(bag), data };
    }
    return { success: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }
}
