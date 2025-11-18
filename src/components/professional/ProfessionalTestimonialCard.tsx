import { motion } from 'framer-motion';
import { MapPin, TrendingUp } from 'lucide-react';

interface ProfessionalTestimonialCardProps {
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
}: ProfessionalTestimonialCardProps) => {
  const getInitials = () => {
    if (initials) return initials;
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative h-full"
    >
      {/* Subtle glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl opacity-60" />
      
      <div className="relative bg-white/94 dark:bg-slate-900/94 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-8 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-full flex flex-col">
        
        {/* Professional quote mark */}
        <div className="absolute top-6 right-6 text-slate-200 dark:text-slate-700 text-6xl font-serif leading-none select-none">
          "
        </div>
        
        {/* Header with professional avatar */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar with initials (NO photo) */}
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {getInitials()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate">
              {name}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {role}{company && `, ${company}`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>
        
        {/* Testimonial content */}
        <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 relative z-10 flex-1">
          {content}
        </blockquote>
        
        {/* Quantifiable result (trust signal) */}
        {result && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
              </div>
              <span className="font-medium text-emerald-900 dark:text-emerald-400">
                Resultado:
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {result}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
