// RUTA: src/pages/AgendamientoPage.tsx

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { AgendamientoProvider, useAgendamiento } from '@/contexts/AgendamientoContext';
import AgendamientoLayout from '@/components/agendamiento/AgendamientoLayout';
import Step1_ClientInfo from '@/components/agendamiento/steps/Step1_ClientInfo';
import Step2_Scheduling from '@/components/agendamiento/steps/Step2_Scheduling';
import Step3_Payment from '@/components/agendamiento/steps/Step3_Payment';
import { trackMetaEvent } from '@/services/metaConversionsService';

/**
 * Disparo único de ViewContent cuando el usuario aterriza en el agendamiento.
 *
 * Crítico para Meta Ads: esta es la landing de conversión — los anuncios
 * llevan tráfico aquí, por lo que Meta necesita registrar la impresión
 * con el contenido exacto (plan + precio) para:
 *   · calcular ROAS (value + currency)
 *   · armar audiencias personalizadas (content_ids = plan slug)
 *   · optimizar la entrega del anuncio hacia conversión
 *
 * Se ejecuta sólo al montarse el contenido interno (useAgendamiento ya resuelto),
 * asegurando que `service.name` y `service.price` estén poblados al enviar.
 */
const AgendamientoContent: React.FC = () => {
  const { step, service, priceCalculation } = useAgendamiento();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || service.category?.toLowerCase() || 'general';

  useEffect(() => {
    // El helper metaConversionsService normaliza value (coerceValue) y currency.
    // Aun así enviamos los campos explícitamente para máxima claridad de tracking.
    void trackMetaEvent({
      event_name: 'ViewContent',
      custom_data: {
        content_type: 'service_plan',
        content_ids: [plan],
        content_name: service.name,
        content_category: service.category,
        value: priceCalculation?.precioFinal ?? service.price,
        currency: 'CLP',
        source: 'agendamiento_page',
      },
    });
    // Sólo disparar una vez por visita al agendamiento del plan seleccionado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  return (
    <AgendamientoLayout>
      <AnimatePresence mode="wait">
        {step === 1 && <Step1_ClientInfo key="step1" />}
        {step === 2 && <Step2_Scheduling key="step2" />}
        {step === 3 && <Step3_Payment key="step3" />}
      </AnimatePresence>
    </AgendamientoLayout>
  );
};

export default function AgendamientoPage() {
  return (
    <AgendamientoProvider>
      <AgendamientoContent />
    </AgendamientoProvider>
  );
}
