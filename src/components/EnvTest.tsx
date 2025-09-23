import React from 'react';

const EnvTest: React.FC = () => {
  const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN;
  const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

  console.log('🔍 EnvTest - Verificando variables de entorno:');
  console.log('VITE_MERCADOPAGO_ACCESS_TOKEN:', accessToken ? 'Configurado' : 'No configurado');
  console.log('VITE_MERCADOPAGO_PUBLIC_KEY:', publicKey ? 'Configurado' : 'No configurado');
  console.log('Access Token (primeros 20 chars):', accessToken ? accessToken.substring(0, 20) + '...' : 'No disponible');
  console.log('Public Key (primeros 20 chars):', publicKey ? publicKey.substring(0, 20) + '...' : 'No disponible');

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="font-bold text-yellow-800">🔍 Test de Variables de Entorno</h3>
      <p className="text-sm text-yellow-700">
        Access Token: {accessToken ? '✅ Configurado' : '❌ No configurado'}
      </p>
      <p className="text-sm text-yellow-700">
        Public Key: {publicKey ? '✅ Configurado' : '❌ No configurado'}
      </p>
      <p className="text-xs text-yellow-600 mt-2">
        Revisa la consola para más detalles
      </p>
    </div>
  );
};

export default EnvTest;
