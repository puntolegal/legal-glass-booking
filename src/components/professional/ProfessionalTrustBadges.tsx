import { motion } from 'framer-motion';
import { Shield, Star, Clock, Award, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Badge {
  icon: LucideIcon;
  metric: string;
  label: string;
  color: 'emerald' | 'primary' | 'blue' | 'slate';
}

const badges: Badge[] = [
  {
    icon: Shield,
    metric: '2.847',
    label: 'Casos Exitosos',
    color: 'emerald'
  },
  {
    icon: Star,
    metric: '4.9/5',
    label: 'Calificación Promedio',
    color: 'primary'
  },
  {
    icon: Clock,
    metric: '<24h',
    label: 'Tiempo de Respuesta',
    color: 'blue'
  },
  {
    icon: Award,
    metric: '12+',
    label: 'Años de Experiencia',
    color: 'slate'
  }
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400'
  },
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary'
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400'
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300'
  }
};

export const ProfessionalTrustBadges = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, i) => {
        const IconComponent = badge.icon;
        const colors = colorClasses[badge.color];
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <div className={cn(
              "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
              colors.bg
            )}>
              <IconComponent className={cn("w-6 h-6", colors.text)} />
            </div>
            
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {badge.metric}
            </div>
            
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {badge.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
