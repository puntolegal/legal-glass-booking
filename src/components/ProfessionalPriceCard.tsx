import { CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PriceCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  popular?: boolean;
  planSlug: string;
}

const calcularDescuento = (precioActual: string, precioOriginal: string): number => {
  const actual = parseInt(precioActual.replace(/\D/g, ''));
  const original = parseInt(precioOriginal.replace(/\D/g, ''));
  return Math.round(((original - actual) / original) * 100);
};

export const ProfessionalPriceCard = ({
  name,
  price,
  originalPrice,
  description,
  features,
  popular,
  planSlug
}: PriceCardProps) => {
  return (
    <div className={cn(
      "relative group",
      popular && "ring-2 ring-amber-500 ring-offset-4"
    )}>
      
      {/* Badge "Más Popular" profesional */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full shadow-lg">
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              Más Elegido
            </span>
          </div>
        </div>
      )}
      
      {/* Card principal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-xl transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-navy-900 mb-2">
            {name}
          </h3>
          <p className="text-sm text-slate-600">
            {description}
          </p>
        </div>
        
        {/* Precio con anclaje profesional */}
        <div className="text-center mb-8">
          {originalPrice && (
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-sm text-slate-500 line-through">
                {originalPrice}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Ahorra {calcularDescuento(price, originalPrice)}%
              </span>
            </div>
          )}
          
          <div className="text-5xl font-bold text-navy-900 tracking-tight">
            {price}
          </div>
          
          <p className="text-sm text-slate-600 mt-2">
            Pago único, sin sorpresas
          </p>
        </div>
        
        {/* Features profesionales */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-slate-700" />
              </div>
              <span className="text-sm text-slate-700 leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        {/* CTA profesional */}
        <Link
          to={`/agendamiento?plan=${planSlug}`}
          className={cn(
            "block w-full py-3.5 px-6 rounded-xl font-semibold text-center transition-all duration-200",
            popular
              ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:shadow-lg hover:scale-[1.02]"
              : "bg-slate-100 text-navy-900 hover:bg-slate-200"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            Agendar Consulta
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        
        {/* Trust signal sutil */}
        <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Garantía de satisfacción 100%
        </p>
      </div>
    </div>
  );
};
