import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Building, CreditCard, User, Hash, Send } from 'lucide-react';

interface BankTransferCard3DProps {
  onTransferComplete?: () => void;
}

export default function BankTransferCard3D({ onTransferComplete }: BankTransferCard3DProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const bankData = {
    banco: 'Banco Estado',
    tipoCuenta: 'Cuenta Corriente',
    numeroCuenta: '12345678',
    rut: '12.345.678-9',
    nombre: 'Punto Legal SpA',
    email: 'pagos@puntolegal.cl'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            animate={{
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Tarjeta 3D */}
      <motion.div
        className="relative transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        onHoverStart={() => setIsFlipped(true)}
        onHoverEnd={() => setIsFlipped(false)}
      >
        {/* Cara frontal */}
        <motion.div
          className="relative backface-hidden"
          style={{ transform: "rotateY(0deg)" }}
        >
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Efectos de brillo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-500/5" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
            
            {/* Patrón de textura */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
              }} />
            </div>

            {/* Contenido */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Transferencia Bancaria</h3>
                    <p className="text-amber-200/60 text-sm">Datos para transferencia</p>
                  </div>
                </div>
                <motion.div
                  className="text-amber-400 text-xs font-semibold bg-amber-400/20 px-3 py-1.5 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Seguro
                </motion.div>
              </div>

              {/* Datos bancarios */}
              <div className="space-y-4">
                {/* Banco */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-200/60 text-xs">Banco</p>
                        <p className="text-white font-semibold">{bankData.banco}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(bankData.banco, 'banco')}
                      className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors"
                    >
                      {copiedField === 'banco' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-400" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Tipo de cuenta */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-200/60 text-xs">Tipo de Cuenta</p>
                        <p className="text-white font-semibold">{bankData.tipoCuenta}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(bankData.tipoCuenta, 'tipo')}
                      className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors"
                    >
                      {copiedField === 'tipo' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-400" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Número de cuenta */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-200/60 text-xs">Número de Cuenta</p>
                        <p className="text-white font-semibold text-lg">{bankData.numeroCuenta}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(bankData.numeroCuenta, 'cuenta')}
                      className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors"
                    >
                      {copiedField === 'cuenta' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-400" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* RUT */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-200/60 text-xs">RUT</p>
                        <p className="text-white font-semibold">{bankData.rut}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(bankData.rut, 'rut')}
                      className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors"
                    >
                      {copiedField === 'rut' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-400" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Nombre */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-200/60 text-xs">Nombre</p>
                        <p className="text-white font-semibold">{bankData.nombre}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(bankData.nombre, 'nombre')}
                      className="p-2 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 transition-colors"
                    >
                      {copiedField === 'nombre' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-400" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://www.bancoestado.cl', '_blank')}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Building className="w-5 h-5" />
                  Ir al Banco
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onTransferComplete}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Comprobante
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cara trasera (opcional) */}
        <motion.div
          className="absolute inset-0 backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="h-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-3xl p-8 shadow-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Transferencia Segura</h4>
              <p className="text-amber-100/80">Todos tus datos están protegidos</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 