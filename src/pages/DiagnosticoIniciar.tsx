import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, Sparkles, ArrowRight, 
  Mail, DollarSign, Users, Calendar, Baby, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { toast } from 'sonner';

interface RefinementData {
  numeroHijos: number;
  gastosMensuales: string;
  situacionEspecial: string;
}

const DiagnosticoIniciar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showRefinement, setShowRefinement] = useState(false);
  const [refinementData, setRefinementData] = useState<RefinementData>({
    numeroHijos: 1,
    gastosMensuales: '',
    situacionEspecial: 'no'
  });
  const [isRefining, setIsRefining] = useState(false);
  const [refinementSent, setRefinementSent] = useState(false);

  useEffect(() => {
    // Verificar que el usuario viene del pago con todos los datos necesarios
    const savedData = sessionStorage.getItem('diagnosticoUserData');
    
    if (!savedData) {
      toast.error('Por favor, realiza el pago primero');
      navigate('/pago/diagnostico-ia');
      return;
    }

    const data = JSON.parse(savedData);
    setUserData(data);

    // Auto-enviar el diagnóstico base al cargar la página
    sendBasicDiagnostic(data);
  }, [navigate]);

  // Función para enviar el diagnóstico base
  const sendBasicDiagnostic = async (data: any) => {
    setIsEmailSending(true);
    
    try {
      // Simular envío del PDF base
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📧 Enviando diagnóstico base a:', data.email);
      console.log('📊 Datos incluidos:', {
        nombre: data.nombre,
        email: data.email,
        ingreso: data.monthlyIncome || 'No especificado'
      });
      
      setEmailSent(true);
      toast.success('¡Diagnóstico enviado a tu email!');
      
    } catch (error) {
      console.error('Error enviando diagnóstico:', error);
      toast.error('Hubo un error. Te contactaremos pronto.');
    } finally {
      setIsEmailSending(false);
    }
  };

  // Función para enviar refinamiento
  const handleRefinementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!refinementData.gastosMensuales) {
      toast.error('Por favor, ingresa los gastos mensuales estimados');
      return;
    }
    
    setIsRefining(true);
    
    try {
      // Simular envío del PDF refinado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📧 Enviando diagnóstico refinado a:', userData.email);
      console.log('📊 Datos de refinamiento:', refinementData);
      
      setRefinementSent(true);
      toast.success('¡Informe actualizado enviado! Revisa tu email.');
      
      // Ocultar el formulario después de enviar
      setTimeout(() => {
        setShowRefinement(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error enviando refinamiento:', error);
      toast.error('Error al actualizar. Tu diagnóstico base ya fue enviado.');
    } finally {
      setIsRefining(false);
    }
  };

  if (!userData) {
    return null;
  }

  // Pantalla de carga inicial
  if (isEmailSending) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
                     flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/50"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Generando tu diagnóstico personalizado
          </h2>
          <p className="text-slate-400">
            La IA está procesando tu caso...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="¡Diagnóstico Enviado! | Punto Legal Chile"
        description="Tu diagnóstico de pensión alimenticia ha sido enviado a tu correo electrónico."
      />
      
      <div className="min-h-screen bg-slate-900 text-slate-300 relative overflow-hidden">
        {/* Gradientes de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20rem] left-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial from-blue-500/10 via-slate-900/0 to-transparent blur-3xl"></div>
          <div className="absolute bottom-[-20rem] right-[-20rem] w-[50rem] h-[50rem] bg-gradient-radial from-purple-500/10 via-slate-900/0 to-transparent blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16">
          
          {/* Mensaje de Éxito Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Ícono de éxito animado */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
              className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full 
                       flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40"
            >
              <CheckCircle className="w-14 h-14 text-white" />
          </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              ¡Diagnóstico Enviado!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-lg text-slate-300 mb-4">
                Tu informe base ha sido generado usando los datos que nos proporcionaste 
                y ya está en camino a tu correo:
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-semibold">{userData.email}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Tarjeta de "Qué incluye tu diagnóstico" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              Tu diagnóstico incluye:
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: FileText, text: 'Cálculo detallado de la pensión según la ley chilena' },
                { icon: DollarSign, text: 'Análisis de diferentes escenarios económicos' },
                { icon: CheckCircle, text: 'Recomendaciones personalizadas de acción' },
                { icon: Calendar, text: 'Timeline estimado del proceso legal' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                                flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-300">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sección de Refinamiento Opcional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {/* Toggle para mostrar refinamiento */}
            {!showRefinement && !refinementSent && (
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 
                              rounded-2xl p-8">
                  <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    ¿Quieres un análisis aún más preciso?
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Responde 3 preguntas rápidas y te enviaremos una <span className="text-purple-400 font-semibold">versión V2</span> de 
                    tu informe, sin costo adicional.
                  </p>
                  <button
                    onClick={() => setShowRefinement(true)}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r 
                             from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 
                             shadow-lg shadow-purple-500/30 transition-all inline-flex items-center gap-2"
                  >
                    Sí, quiero mejorar mi informe
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-xs text-slate-500 mt-3">
                    100% gratis • Solo 60 segundos
                  </p>
                </div>
              </div>
            )}

            {/* Formulario de refinamiento (Todo en una pantalla) */}
            <AnimatePresence>
              {showRefinement && !refinementSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-xl overflow-hidden"
                >
                  <h3 className="text-xl font-bold text-white mb-6 text-center">
                    Preguntas para refinar tu diagnóstico
                  </h3>

                  <form onSubmit={handleRefinementSubmit} className="space-y-6">
                    {/* Pregunta 1: Número de hijos */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        1. ¿Cuántos hijos están involucrados en la pensión?
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((num) => (
                          <motion.button
                            key={num}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRefinementData({ ...refinementData, numeroHijos: num })}
                            className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all
                                     ${refinementData.numeroHijos === num
                                       ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                       : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-purple-500/30'
                                     }`}
                          >
                            {num >= 4 ? '4+' : num}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 2: Gastos mensuales */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        2. ¿Cuáles son los gastos mensuales estimados por hijo?
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                        <input
                          type="text"
                          value={refinementData.gastosMensuales}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const formatted = value ? parseInt(value).toLocaleString('es-CL') : '';
                            setRefinementData({ ...refinementData, gastosMensuales: formatted });
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                   text-white text-lg font-semibold focus:outline-none focus:border-purple-500/50 
                                   transition-colors placeholder:text-slate-500"
                          placeholder="300.000"
                          required
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Incluye: colegio, salud, alimentación, vestuario, recreación
                      </p>
                    </div>

                    {/* Pregunta 3: Situación especial */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        3. ¿Existe alguna situación especial?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'no', label: 'No hay situaciones especiales', icon: CheckCircle },
                          { value: 'salud', label: 'Tratamientos médicos o terapias', icon: Baby },
                          { value: 'educacion', label: 'Educación especial o colegio privado', icon: Home }
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setRefinementData({ ...refinementData, situacionEspecial: option.value })}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left
                                     ${refinementData.situacionEspecial === option.value
                                       ? 'bg-purple-500/20 border-2 border-purple-500 text-white'
                                       : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-purple-500/30'
                                     }`}
                          >
                            <option.icon className={`w-5 h-5 ${
                              refinementData.situacionEspecial === option.value ? 'text-purple-400' : 'text-slate-400'
                            }`} />
                            <span className="font-medium">{option.label}</span>
                          </motion.button>
                    ))}
                  </div>
              </div>

                    {/* Botón de envío */}
                    <motion.button
                      type="submit"
                      disabled={isRefining || !refinementData.gastosMensuales}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg
                               flex items-center justify-center gap-2
                               ${isRefining || !refinementData.gastosMensuales
                                 ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                 : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-purple-500/40'
                               }`}
                    >
                      {isRefining ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Refinando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Enviar y Actualizar Mi Informe
                        </>
                      )}
                    </motion.button>

                  <button
                      type="button"
                      onClick={() => setShowRefinement(false)}
                      className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
                  >
                      No gracias, el informe base es suficiente
                  </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensaje de refinamiento enviado */}
            {refinementSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 
                         rounded-2xl p-6 text-center mb-8"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">
                  ¡Informe actualizado enviado!
                </h3>
                <p className="text-slate-300">
                  Revisa tu email en los próximos minutos para ver tu diagnóstico refinado.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8"
          >
            <h3 className="font-semibold text-blue-300 mb-3 text-center">
              ⏰ ¿Cuándo recibiré mi diagnóstico?
            </h3>
            <p className="text-sm text-slate-300 text-center">
              Tu informe llegará en <span className="font-bold text-white">menos de 5 minutos</span>. 
              Si no lo ves, revisa tu carpeta de spam o correo no deseado.
            </p>
          </motion.div>

          {/* CTAs Finales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => navigate('/servicios/familia')}
              className="py-4 px-6 rounded-xl font-semibold text-white bg-slate-800/50 border border-slate-700/50
                       hover:bg-slate-700/50 hover:border-slate-600/50 transition-all"
            >
              Explorar Servicios de Familia
            </button>
                
                <button
              onClick={() => navigate('/agendamiento?plan=familia-integral')}
              className="py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r 
                       from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 
                       shadow-lg shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
            >
              Agendar Consulta con Abogado
              <ArrowRight className="w-5 h-5" />
                </button>
          </motion.div>

          {/* Footer con ayuda */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-slate-500">
              ¿Tienes dudas sobre tu diagnóstico?{' '}
              <a href="https://wa.me/56912345678" className="text-blue-400 hover:text-blue-300 underline">
                Contáctanos por WhatsApp
              </a>
            </p>
            </motion.div>

        </div>
      </div>
    </>
  );
};

export default DiagnosticoIniciar;