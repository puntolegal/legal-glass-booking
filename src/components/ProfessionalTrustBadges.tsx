import { Shield, Star, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Badge {
  icon: any;
  metric: string;
  label: string;
  color: 'emerald' | 'amber' | 'blue' | 'slate';
}

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700'
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-700'
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-700'
  },
  slate: {
    bg: 'bg-slate-100',
    text: 'text-slate-700'
  }
};

export const ProfessionalTrustBadges = () => {
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
      color: 'amber'
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
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, i) => {
        const IconComponent = badge.icon;
        const colors = colorClasses[badge.color];
        
        return (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:border-slate-300 transition-colors"
          >
            <div className={cn(
              "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
              colors.bg
            )}>
              <IconComponent className={cn("w-6 h-6", colors.text)} />
            </div>
            
            <div className="text-3xl font-bold text-navy-900 mb-1">
              {badge.metric}
            </div>
            
            <div className="text-xs text-slate-600 font-medium">
              {badge.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
