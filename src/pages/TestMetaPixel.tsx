import React, { useState } from 'react';
import { trackMetaEvent } from '@/services/metaConversionsService';

/**
 * Página de prueba para Meta Conversions API
 * Usa el código de prueba: TEST2065
 */
const TestMetaPixel: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testEvent = async (eventName: string, customData?: Record<string, unknown>) => {
    setIsLoading(true);
    addResult(`Enviando evento: ${eventName}...`);
    
    try {
      await trackMetaEvent({
        event_name: eventName,
        test_event_code: 'TEST2065',
        user_data: {
          em: 'test@example.com',
          ph: '+56912345678',
          fn: 'Test User',
          ct: 'Santiago',
        },
        custom_data: customData || {
          content_name: 'Test Event',
          value: 1000,
          currency: 'CLP',
        },
      });
      
      addResult(`✅ Evento ${eventName} enviado exitosamente`);
    } catch (error) {
      addResult(`❌ Error al enviar ${eventName}: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Prueba Meta Conversions API</h1>
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-slate-300 mb-2">
            <strong>Código de prueba:</strong> TEST2065
          </p>
          <p className="text-xs text-slate-400">
            Los eventos se enviarán con el código de prueba. Ve a Meta Events Manager → Test Events para verificar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => testEvent('PageView')}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            PageView
          </button>
          
          <button
            onClick={() => testEvent('ViewContent', { content_name: 'Test Content' })}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            ViewContent
          </button>
          
          <button
            onClick={() => testEvent('CompleteRegistration', { content_name: 'Test Registration' })}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            CompleteRegistration
          </button>
          
          <button
            onClick={() => testEvent('Lead', { content_name: 'Test Lead' })}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            Lead
          </button>
          
          <button
            onClick={() => testEvent('InitiateCheckout', { value: 35000, currency: 'CLP' })}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            InitiateCheckout
          </button>
          
          <button
            onClick={() => testEvent('Schedule', { content_name: 'Test Schedule' })}
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            Schedule
          </button>
          
          <button
            onClick={() => testEvent('Purchase', { value: 35000, currency: 'CLP' })}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
          >
            Purchase
          </button>
          
          <button
            onClick={() => setTestResults([])}
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            Limpiar Logs
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados de Prueba</h2>
          <div className="bg-slate-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-slate-500">No hay eventos enviados aún. Haz clic en los botones arriba para probar.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-2">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📋 Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Haz clic en cualquier botón de evento para enviar una prueba</li>
            <li>Ve a Meta Events Manager → Test Events</li>
            <li>Busca eventos con el código TEST2065</li>
            <li>Verifica que los eventos aparezcan correctamente</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestMetaPixel;
