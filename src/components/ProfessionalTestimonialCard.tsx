import { MapPin, TrendingUp } from 'lucide-react';

interface TestimonialProps {
  name: string;
  role: string;
  company?: string;
  location: string;
  content: string;
  result?: string;
  initials?: string;
}

export const ProfessionalTestimonialCard = ({
  name,
  role,
  company,
  location,
  content,
  result,
  initials
}: TestimonialProps) => {
  const defaultInitials = initials || name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="group relative">
      {/* Glassmorphism sutil profesional */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl opacity-60" />
      
      <div className="relative bg-white/94 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 hover:border-slate-300 transition-all duration-300">
        
        {/* Quote mark profesional */}
        <div className="absolute top-6 right-6 text-slate-200 text-6xl font-serif leading-none select-none">
          "
        </div>
        
        {/* Header con avatar profesional */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar con iniciales (NO foto, más profesional) */}
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {defaultInitials}
            </span>
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-navy-900 mb-1">
              {name}
            </h4>
            <p className="text-sm text-slate-600">
              {role}{company && `, ${company}`}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {location}
            </p>
          </div>
        </div>
        
        {/* Contenido del testimonio */}
        <blockquote className="text-slate-700 leading-relaxed mb-6 relative z-10">
          {content}
        </blockquote>
        
        {/* Resultado cuantificable (trust signal) */}
        {result && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-emerald-700" />
              </div>
              <span className="font-medium text-emerald-900">
                Resultado:
              </span>
              <span className="text-slate-700">
                {result}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
