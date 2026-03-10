-- Añadir 'checkout_iniciado', 'en_pago', 'pago_completado' al constraint de status de leads_quiz
-- Necesario para que handleDirectPayment y MercadoPagoPaymentPage actualicen correctamente

ALTER TABLE public.leads_quiz DROP CONSTRAINT IF EXISTS leads_quiz_status_check;

ALTER TABLE public.leads_quiz ADD CONSTRAINT leads_quiz_status_check
CHECK (
  status IS NULL OR
  status = ANY (ARRAY[
    'lead', 'processed', 'contacted', 'converted', 'nuevo',
    'calculadora_iniciada', 'calculo_completado', 'incompleto', 'iniciado',
    'checkout_iniciado', 'en_pago', 'pago_completado'
  ]::text[])
);
