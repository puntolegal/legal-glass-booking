import { 
  Building2, 
  Briefcase, 
  Heart, 
  Home as HomeIcon, 
  FileText, 
  Shield, 
  Calculator,
  Globe,
  Gavel,
  DollarSign,
  Scale
} from 'lucide-react';
import { ServiceTheme } from '../components/HeaderService';

export const serviceThemes: Record<string, ServiceTheme> = {
  corporativo: {
    primary: '#3B82F6', // blue-500
    secondary: '#60A5FA', // blue-400
    accent: '#2563EB', // blue-600
    glow: '#3B82F640', // blue-500 with opacity
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    icon: Building2,
    serviceName: 'Derecho Corporativo',
    serviceSlug: 'corporativo'
  },
  laboral: {
    primary: '#F59E0B', // amber-500
    secondary: '#FBBF24', // amber-400
    accent: '#D97706', // amber-600
    glow: '#F59E0B40',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    icon: Briefcase,
    serviceName: 'Derecho Laboral',
    serviceSlug: 'laboral'
  },
  familia: {
    primary: '#EC4899', // pink-500
    secondary: '#F472B6', // pink-400
    accent: '#DB2777', // pink-600
    glow: '#EC489940',
    gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    icon: Heart,
    serviceName: 'Derecho de Familia',
    serviceSlug: 'familia'
  },
  inmobiliario: {
    primary: '#10B981', // emerald-500
    secondary: '#34D399', // emerald-400
    accent: '#059669', // emerald-600
    glow: '#10B98140',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    icon: HomeIcon,
    serviceName: 'Derecho Inmobiliario',
    serviceSlug: 'inmobiliario'
  },
  civil: {
    primary: '#8B5CF6', // violet-500
    secondary: '#A78BFA', // violet-400
    accent: '#7C3AED', // violet-600
    glow: '#8B5CF640',
    gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    icon: FileText,
    serviceName: 'Derecho Civil',
    serviceSlug: 'civil'
  },
  penal: {
    primary: '#EF4444', // red-500
    secondary: '#F87171', // red-400
    accent: '#DC2626', // red-600
    glow: '#EF444440',
    gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
    icon: Shield,
    serviceName: 'Derecho Penal',
    serviceSlug: 'penal'
  },
  'penal-economico': {
    primary: '#F97316', // orange-500
    secondary: '#FB923C', // orange-400
    accent: '#EA580C', // orange-600
    glow: '#F9731640',
    gradient: 'linear-gradient(135deg, #F97316, #EA580C)',
    icon: DollarSign,
    serviceName: 'Derecho Penal Económico',
    serviceSlug: 'penal-economico'
  },
  tributario: {
    primary: '#14B8A6', // teal-500
    secondary: '#2DD4BF', // teal-400
    accent: '#0D9488', // teal-600
    glow: '#14B8A640',
    gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    icon: Calculator,
    serviceName: 'Derecho Tributario',
    serviceSlug: 'tributario'
  },
  digital: {
    primary: '#6366F1', // indigo-500
    secondary: '#818CF8', // indigo-400
    accent: '#4F46E5', // indigo-600
    glow: '#6366F140',
    gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
    icon: Globe,
    serviceName: 'Derecho Digital',
    serviceSlug: 'digital'
  },
  general: {
    primary: '#FF6B35', // orange personalizado
    secondary: '#FF8C42', // orange claro
    accent: '#E85D2F', // orange oscuro
    glow: '#FF6B3540',
    gradient: 'linear-gradient(135deg, #FF6B35, #E85D2F)',
    icon: Scale,
    serviceName: 'Servicios Legales',
    serviceSlug: 'general'
  }
};
