// RUTA: src/components/layout/footers/ApuntesFooter.tsx
// 🍎 Footer iOS Minimalista - Solo lo esencial

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ExternalLink } from 'lucide-react';

const ApuntesFooter: React.FC = () => {
  return (
    <footer className="relative border-t border-white/20 dark:border-white/5 bg-white/40 dark:bg-[#1c1c1e]/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Contenido Minimalista - Una sola línea horizontal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1d1d1f] dark:bg-stone-700 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white">Punto Legal</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Apuntes Inteligentes</p>
            </div>
          </div>

          {/* Links Legales - Minimalistas */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <Link 
              to="/terms-of-service" 
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              Términos
            </Link>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <Link 
              to="/privacy-policy" 
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a 
              href="mailto:hola@puntolegalapuntes.cl"
              className="flex items-center gap-1.5 hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3" strokeWidth={1.5} />
              Contacto
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Punto Legal
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ApuntesFooter;
