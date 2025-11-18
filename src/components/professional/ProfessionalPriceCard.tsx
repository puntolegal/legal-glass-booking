import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProfessionalPriceCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  popular?: boolean;
  planSlug: string;
}

const calcularDescuento = (price: string, originalPrice: string): number => {
  const priceNum = parseInt(price.replace(/[^0-9]/g, ''));
  const originalPriceNum = parseInt(originalPrice.replace(/[^0-9]/g, ''));
  return Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
};

export const ProfessionalPriceCard = ({
  name,
  price,
  originalPrice,
  description,
  features,
  popular = false,
  planSlug
}: ProfessionalPriceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative group h-full",
        popular && "ring-2 ring-primary ring-offset-4 dark:ring-offset-slate-950"
      )}
    >
      
      {/* Professional "Most Popular" badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg">
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              Más Elegido
            </span>
          </div>
        </div>
      )}
      
      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
        
        {/* Price with professional anchoring */}
        <div className="text-center mb-8">
          {originalPrice && (
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                {originalPrice}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
                Ahorra {calcularDescuento(price, originalPrice)}%
              </span>
            </div>
          )}
          
          <div className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {price}
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Pago único, sin sorpresas
          </p>
        </div>
        
        {/* Professional features */}
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        {/* Professional CTA */}
        <Link
          to={`/agendamiento?plan=${planSlug}`}
          className={cn(
            "block w-full py-3.5 px-6 rounded-xl font-semibold text-center transition-all duration-200",
            popular
              ? "bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-[1.02]"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            Agendar Consulta
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        
        {/* Subtle trust signal */}
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Garantía de satisfacción 100%
        </p>
      </div>
    </motion.div>
  );
};
