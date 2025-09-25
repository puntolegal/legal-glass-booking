import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: React.ReactNode;
  badge?: string;
  href?: string;
  testimonials?: Array<{
    name: string;
    text: string;
    rating: number;
  }>;
  blogPosts?: Array<{
    title: string;
    excerpt: string;
    href: string;
  }>;
  onAgendarClick?: (service: any) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  features,
  icon,
  badge,
  testimonials,
  onAgendarClick
}) => {
  const handleAgendarClick = () => {
    if (onAgendarClick) {
      onAgendarClick({
        title,
        description,
        price,
        features,
        icon,
        badge,
        testimonials
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {badge}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="text-2xl font-bold text-primary mt-1">
            {price}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Features */}
      <div className="space-y-2 mb-6">
        {features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            <span>{feature}</span>
          </div>
        ))}
        {features.length > 3 && (
          <div className="text-sm text-gray-500">
            +{features.length - 3} características más
          </div>
        )}
      </div>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < testimonials[0].rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 italic">
            "{testimonials[0].text}"
          </p>
          <p className="text-xs text-gray-500 mt-1">
            - {testimonials[0].name}
          </p>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAgendarClick}
        className="w-full bg-gradient-to-r from-primary to-orange-500 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        <span>Agendar Consulta</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

export default ServiceCard;