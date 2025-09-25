import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle } from 'lucide-react';

// Disabled component - notification system incompatible with current database schema
const NotificationPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="h-5 w-5" />
      </motion.button>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isVisible ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Notificaciones</h2>
            <button onClick={() => setIsVisible(false)}>✕</button>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium">Sistema Deshabilitado</p>
                <p>Incompatible con el esquema actual de la base de datos.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationPanel;