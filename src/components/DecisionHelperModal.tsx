import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Package {
  id: string;
  name: string;
  shortName: string;
  price: string;
  features: string[];
  color: string;
}

interface DecisionHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Package | null;
}

const DecisionHelperModal: React.FC<DecisionHelperModalProps> = ({ isOpen, onClose, plan }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar la posición del scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar el scroll al cerrar
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!plan) return null;

  const tabs = [
    { id: 0, label: 'Incluye', icon: CheckCircle },
    { id: 1, label: 'Perfil Ideal', icon: Users },
    { id: 2, label: 'Resultados', icon: TrendingUp },
  ];

  const getIdealProfiles = (planName: string) => {
    const profiles = {
      'Protección Familiar Integral': [
        { title: 'Divorcios de mutuo acuerdo', desc: 'Cuando ambas partes están dispuestas a colaborar' },
        { title: 'Modificaciones simples', desc: 'Ajustes menores en acuerdos existentes' },
        { title: 'Primera pensión alimenticia', desc: 'Establecimiento inicial sin conflictos mayores' },
    ],
      'Defensa Familiar Premium': [
        { title: 'Divorcios sin acuerdo', desc: 'Cuando existe desacuerdo en temas fundamentales' },
        { title: 'Disputas por compensación', desc: 'Casos con diferencias económicas significativas' },
        { title: 'Casos con VIF', desc: 'Situaciones que requieren protección especial' },
        { title: 'Custodia compartida compleja', desc: 'Negociación de régimen de visitas detallado' },
    ],
      'Blindaje Familiar Elite': [
        { title: 'Patrimonio significativo', desc: 'Cuando hay bienes e inversiones importantes' },
        { title: 'Casos internacionales', desc: 'Partes en diferentes países o hijos en el extranjero' },
        { title: 'Mediación VIP', desc: 'Necesidad de discreción y manejo confidencial' },
        { title: 'Resolución urgente', desc: 'Cuando el tiempo es factor crítico' },
      ],
    };
    return profiles[planName] || [];
  };

  const getExpectedResults = (planName: string) => {
    const results = {
      'Protección Familiar Integral': [
        { metric: '15-30 días', label: 'Tiempo promedio de resolución' },
        { metric: '85%', label: 'Satisfacción del cliente' },
        { metric: '3 reuniones', label: 'Promedio para llegar a acuerdo' },
      ],
      'Defensa Familiar Premium': [
        { metric: '30-45 días', label: 'Tiempo con casos complejos' },
        { metric: '92%', label: 'Casos resueltos favorablemente' },
        { metric: 'Completa', label: 'Protección legal integral' },
      ],
      'Blindaje Familiar Elite': [
        { metric: '24/7', label: 'Disponibilidad prioritaria' },
        { metric: '98%', label: 'Éxito en negociaciones' },
        { metric: 'Total', label: 'Tranquilidad y confidencialidad' },
      ],
    };
    return results[planName] || [];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal Container - Centrado perfecto */}
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto
                         bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 
                         shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="relative p-6 border-b border-white/10">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10 
                         transition-colors duration-200"
          >
                <X className="w-5 h-5 text-white/70" />
          </button>
          
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {plan.name}
                </h2>
                <p className="text-white/60">
                  Descubre si este es el plan perfecto para tu situación
                </p>
              </motion.div>
        </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-6">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200
                               ${activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
            >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
                );
              })}
        </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <AnimatePresence mode="wait">
                {/* Tab 1: Checklist de Inclusiones */}
                {activeTab === 0 && (
            <motion.div
                    key="tab-0"
                    initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-3"
                  >
                    {plan.features.map((feature, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 
                                 transition-all duration-200 group"
                      >
                        <div className={`p-2 rounded-full bg-gradient-to-br ${plan.color} group-hover:scale-110 transition-transform`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-white/90 flex-1">
                          {feature.includes('🎁') ? (
                            <>
                              <span className="text-amber-400">🎁 Bonus:</span> {feature.replace('🎁 ', '')}
                            </>
                          ) : (
                            feature
                          )}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Tab 2: Perfil de Caso Ideal */}
                {activeTab === 1 && (
                  <motion.div
                    key="tab-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-white/70 mb-6">
                      Este plan está especialmente diseñado para:
                    </p>
                    
                    <div className="grid gap-4">
                      {getIdealProfiles(plan.name).map((profile, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 
                                   hover:from-white/10 hover:to-white/15 transition-all duration-200"
                        >
                          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${plan.color}`} />
                            {profile.title}
                  </h4>
                          <p className="text-white/60 text-sm">{profile.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Resultados Esperados */}
                {activeTab === 2 && (
                  <motion.div
                    key="tab-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <p className="text-white/70">
                      Lo que puedes esperar con el Plan {plan.name}:
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      {getExpectedResults(plan.name).map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5"
                        >
                          <div className={`text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-2`}>
                            {result.metric}
                          </div>
                          <p className="text-white/60 text-sm">{result.label}</p>
                        </motion.div>
                      ))}
                  </div>
                  
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                                  border border-white/10">
                      <h4 className="font-semibold text-white mb-3">
                        Tu tranquilidad es nuestra prioridad
                      </h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Con el Plan {plan.name}, no solo obtienes asesoría legal de primer nivel, 
                        sino la certeza de que tu caso está en las mejores manos. Nuestro equipo 
                        se compromete a guiarte en cada paso, asegurando que tomes las mejores 
                        decisiones para tu futuro y el de tu familia.
                    </p>
                  </div>
                  </motion.div>
              )}
          </AnimatePresence>
            </div>
            
            {/* CTA Footer */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
              <Link
                to={`/agendamiento?plan=${plan.id}`}
                onClick={onClose}
                className={`group relative w-full flex items-center justify-center gap-3 py-4 px-8 
                         rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300
                         bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-${plan.color.split(' ')[1]}/20
                         hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span className="relative z-10">Agendar Plan {plan.shortName}</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DecisionHelperModal;