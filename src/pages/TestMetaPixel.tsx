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
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-300 mb-1">
                <strong>Código de prueba:</strong> <span className="font-mono bg-slate-700 px-2 py-1 rounded">TEST2065</span>
              </p>
              <p className="text-xs text-slate-400">
                <strong>Pixel ID:</strong> 1824057828514723 | <strong>Dataset ID:</strong> 930048081990153
              </p>
            </div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3 mt-3">
            <p className="text-xs text-blue-200 mb-2">
              <strong>⚠️ Importante:</strong> Mantén abierta la página "Probar eventos" en Meta Events Manager mientras pruebas.
            </p>
            <p className="text-xs text-slate-400">
              Los eventos aparecerán en tiempo real en Meta Events Manager con el código TEST2065.
            </p>
          </div>
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

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📋 Instrucciones:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
              <li>Abre Meta Events Manager → Probar eventos</li>
              <li>Mantén esa página abierta</li>
              <li>Haz clic en cualquier botón de evento arriba</li>
              <li>Los eventos aparecerán en tiempo real en Meta Events Manager</li>
              <li>Verifica que aparezcan con código TEST2065</li>
            </ol>
          </div>
          
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🔗 Enlaces Útiles:</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a 
                  href="https://business.facebook.com/events_manager2/list/pixel/1824057828514723/test_events" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Meta Events Manager - Test Events
                </a>
              </li>
              <li>
                <a 
                  href="https://developers.facebook.com/tools/explorer/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Graph API Explorer
                </a>
              </li>
              <li className="text-xs text-slate-400 mt-2">
                Dataset ID: 930048081990153
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMetaPixel;
