// RUTA: src/pages/AgendamientoPage.tsx

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AgendamientoProvider, useAgendamiento } from '@/contexts/AgendamientoContext';
import AgendamientoLayout from '@/components/agendamiento/AgendamientoLayout';
import Step1_ClientInfo from '@/components/agendamiento/steps/Step1_ClientInfo';
import Step2_Scheduling from '@/components/agendamiento/steps/Step2_Scheduling';
import Step3_Payment from '@/components/agendamiento/steps/Step3_Payment';

const AgendamientoContent: React.FC = () => {
  const { step } = useAgendamiento();

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
