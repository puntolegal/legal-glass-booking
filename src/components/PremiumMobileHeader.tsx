import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

interface PremiumMobileHeaderProps {
  className?: string;
}

export const PremiumMobileHeader: React.FC<PremiumMobileHeaderProps> = ({ className = "" }) => {
  // Por ahora, no renderizar nada para evitar duplicaciones
  // El dock inferior será suficiente para la navegación móvil
  return null;
};

export default PremiumMobileHeader;
