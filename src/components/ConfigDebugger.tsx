// Componente para debuggear configuraciones en producción
import { useEffect, useState } from 'react';

interface ConfigStatus {
  mercadopago: {
    accessToken: boolean;
    publicKey: boolean;
    configured: boolean;
  };
  resend: {
    apiKey: boolean;
    from: boolean;
    adminEmail: boolean;
    configured: boolean;
  };
  supabase: {
    url: boolean;
    anonKey: boolean;
    configured: boolean;
  };
}

export const ConfigDebugger = () => {
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        // Verificar MercadoPago
        const { MERCADOPAGO_CONFIG } = await import('@/config/mercadopago');
        
        // Verificar Resend
        const { RESEND_CONFIG, isResendConfigured } = await import('@/config/resendConfig');
        
        // Verificar Supabase
        const { supabase } = await import('@/integrations/supabase/client');
        
        const configStatus: ConfigStatus = {
          mercadopago: {
            accessToken: !!MERCADOPAGO_CONFIG.accessToken,
            publicKey: !!MERCADOPAGO_CONFIG.publicKey,
            configured: !!(MERCADOPAGO_CONFIG.accessToken && MERCADOPAGO_CONFIG.publicKey)
          },
          resend: {
            apiKey: !!RESEND_CONFIG.apiKey,
            from: !!RESEND_CONFIG.from,
            adminEmail: !!RESEND_CONFIG.adminEmail,
            configured: isResendConfigured()
          },
          supabase: {
            url: !!import.meta.env.VITE_SUPABASE_URL,
            anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
            configured: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
          }
        };
        
        setConfig(configStatus);
        setLoading(false);
        
        // Log detallado
        console.log('🔍 CONFIG DEBUG COMPLETO:');
        console.log('MercadoPago:', configStatus.mercadopago);
        console.log('Resend:', configStatus.resend);
        console.log('Supabase:', configStatus.supabase);
        
      } catch (error) {
        console.error('❌ Error verificando configuraciones:', error);
        setLoading(false);
      }
    };
    
    checkConfig();
  }, []);

  if (loading) {
    return <div>Verificando configuraciones...</div>;
  }

  if (!config) {
    return <div>Error verificando configuraciones</div>;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <h4>🔧 Config Debug</h4>
      
      <div>
        <strong>MercadoPago:</strong> 
        <span style={{ color: config.mercadopago.configured ? 'green' : 'red' }}>
          {config.mercadopago.configured ? '✅' : '❌'}
        </span>
        <br />
        <small>
          Access Token: {config.mercadopago.accessToken ? '✅' : '❌'} | 
          Public Key: {config.mercadopago.publicKey ? '✅' : '❌'}
        </small>
      </div>
      
      <div>
        <strong>Resend:</strong> 
        <span style={{ color: config.resend.configured ? 'green' : 'red' }}>
          {config.resend.configured ? '✅' : '❌'}
        </span>
        <br />
        <small>
          API Key: {config.resend.apiKey ? '✅' : '❌'} | 
          From: {config.resend.from ? '✅' : '❌'}
        </small>
      </div>
      
      <div>
        <strong>Supabase:</strong> 
        <span style={{ color: config.supabase.configured ? 'green' : 'red' }}>
          {config.supabase.configured ? '✅' : '❌'}
        </span>
        <br />
        <small>
          URL: {config.supabase.url ? '✅' : '❌'} | 
          Anon Key: {config.supabase.anonKey ? '✅' : '❌'}
        </small>
      </div>
    </div>
  );
};

export default ConfigDebugger;
