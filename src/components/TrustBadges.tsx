import React from 'react';
import { Shield, Lock, MessageSquare, CheckCircle } from 'lucide-react';

interface TrustBadgesProps {
  serviceCategory: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ serviceCategory }) => {
  const badges = [
    { icon: Shield, label: 'Pago Seguro', color: 'text-green-600 dark:text-green-400' },
    { icon: Lock, label: 'Datos Encriptados', color: 'text-blue-600 dark:text-blue-400' },
    { icon: MessageSquare, label: 'Soporte Directo', color: 'text-purple-600 dark:text-purple-400' },
  ];

  const testimonials: { [key: string]: { quote: string; author: string } } = {
    'Familia': {
      quote: 'En la primera consulta resolvieron dudas que llevaba meses sin aclarar. 100% recomendado.',
      author: 'María G., Las Condes'
    },
    'Corporativo': {
      quote: 'Profesionalismo de primer nivel. Nos ayudaron a estructurar contratos que nos protegieron completamente.',
      author: 'Roberto P., Providencia'
    },
    'Laboral': {
      quote: 'Lograron resolver mi caso laboral de manera eficiente. El equipo es muy profesional y empático.',
      author: 'Patricia S., Vitacura'
    },
    'Inmobiliario': {
      quote: 'Excelente asesoría en la compra de mi propiedad. Todo el proceso fue transparente y seguro.',
      author: 'Andrés L., La Reina'
    },
  };

  const testimonial = testimonials[serviceCategory] || testimonials['Familia'];

  return (
    <div className="space-y-6">
      {/* Testimonio */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-md">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
              "{testimonial.quote}"
            </p>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              - {testimonial.author}
            </p>
          </div>
        </div>
      </div>

      {/* Sellos de Garantía */}
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
            >
              <Icon className={`w-6 h-6 ${badge.color}`} />
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                {badge.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBadges;

