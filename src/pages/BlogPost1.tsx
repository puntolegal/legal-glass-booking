import React from 'react';
import { ArrowLeft, Clock, User, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import GlassLayout from '@/components/layout/GlassLayout';
import SEO from '@/components/SEO';

const BlogPost1 = () => {
  const navigate = useNavigate();

  return (
    <GlassLayout>
      <SEO 
        title="¿Cuándo un despido es considerado injustificado? - Punto Legal"
        description="Conoce las principales causales que determinan si tu despido fue sin causa justa y qué derechos tienes como trabajador en Chile."
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Article Header */}
          <header className="mb-12">
            <button
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </button>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full">
                Derecho Laboral
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">20 Diciembre 2024 • 5 min lectura</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              ¿Cuándo un despido es considerado injustificado?
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Conoce las principales causales que determinan si tu despido fue sin causa justa y qué derechos tienes como trabajador.
            </p>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
                  Un despido injustificado es aquel que no cumple con las causales legales establecidas en el Código del Trabajo chileno. Cuando un empleador despide a un trabajador sin una causa justificada, este tiene derecho a reclamar y obtener compensaciones.
            </p>
            
            <div className="p-6 my-8 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Causales de Despido Justificado</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                    Según el artículo 160 del Código del Trabajo, solo estas causales son válidas para un despido justificado:
              </p>
            </div>
            
            <h2 className="text-3xl font-bold">Causales Frecuentes de Despido Injustificado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Razones Económicas Falsas</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                      Si no hay un proceso de negociación colectiva o no se cumplen los requisitos legales.
                </p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Discriminación</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                      Por edad, género, estado civil, orientación sexual, religión o discapacidad.
                </p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Enfermedad o Licencia</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                      Durante licencias médicas o por enfermedades crónicas.
                </p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Maternidad</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                      Durante el embarazo, post natal o lactancia materna.
                </p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold">Tus Derechos en un Despido Injustificado</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Indemnización Legal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                        30 días de remuneración por cada año de servicio, con un máximo de 11 meses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Tutela de Derechos Fundamentales</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                        Entre 6 y 11 meses adicionales cuando se vulneran derechos fundamentales.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Reintegro al Trabajo</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                        Posibilidad de volver a tu puesto de trabajo con todos los beneficios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </GlassLayout>
  );
};

export default BlogPost1;