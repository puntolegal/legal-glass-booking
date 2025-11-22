// RUTA: src/components/layout/footers/MainFooter.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale,
  Mail,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';

const MainFooter: React.FC = () => {
  const services = [
    { name: 'Servicios Corporativos', href: '/servicios/corporativo' },
    { name: 'Servicios Familia', href: '/servicios/familia' },
    { name: 'Servicios Inmobiliarios', href: '/servicios/inmobiliario' },
    { name: 'Servicios Laborales', href: '/servicios/laboral' }
  ];

  const company = [
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Blog', href: '/blog' },
    { name: 'Apuntes', href: '/apuntes' }
  ];

  const legal = [
    { name: 'Términos de Servicio', href: '/terms-of-service' },
    { name: 'Política de Privacidad', href: '/privacy-policy' }
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Punto Legal</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Servicios legales profesionales en Chile. Conectando clientes con abogados expertos.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:contacto@puntolegal.cl" className="hover:text-blue-600 dark:hover:text-blue-400">
                  contacto@puntolegal.cl
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+56912345678" className="hover:text-blue-600 dark:hover:text-blue-400">
                  +56 9 1234 5678
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Servicios
            </h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-2">
              {company.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {legal.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} <span className="font-semibold text-gray-900 dark:text-white">Punto Legal</span>. 
              Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-1 text-xs">
              Hecho con <Heart className="w-3 h-3 text-red-500" fill="currentColor" /> en Chile
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;








