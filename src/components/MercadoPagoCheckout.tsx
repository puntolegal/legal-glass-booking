import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { mercadoPagoService, PaymentData, formatCurrency } from '@/services/mercadopagoService';
import { Button } from '@/components/ui/button';

interface MercadoPagoCheckoutProps {
  paymentData: PaymentData;
  onPaymentSuccess: (paymentResponse: any) => void;
  onPaymentError: (error: string) => void;
  isLoading?: boolean;
}

const MercadoPagoCheckout: React.FC<MercadoPagoCheckoutProps> = ({
  paymentData,
  onPaymentSuccess,
  onPaymentError,
  isLoading = false
}) => {
  const [mpLoading, setMpLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    cardholderName: '',
    cardholderEmail: paymentData.payer.email,
    identificationType: 'RUT',
    identificationNumber: ''
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Inicializar MercadoPago
  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        await mercadoPagoService.initialize();
        const methods = await mercadoPagoService.getPaymentMethods();
        setPaymentMethods(methods.filter(method => method.status === 'active'));
        setMpLoading(false);
      } catch (error) {
        console.error('Error inicializando MercadoPago:', error);
        onPaymentError('Error inicializando sistema de pagos');
        setMpLoading(false);
      }
    };

    initMercadoPago();
  }, [onPaymentError]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setCardForm(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores cuando el usuario escribe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!cardForm.cardNumber || cardForm.cardNumber.length < 13) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }

    if (!cardForm.expirationDate || !/^\d{2}\/\d{2}$/.test(cardForm.expirationDate)) {
      newErrors.expirationDate = 'Fecha inválida (MM/AA)';
    }

    if (!cardForm.securityCode || cardForm.securityCode.length < 3) {
      newErrors.securityCode = 'Código de seguridad inválido';
    }

    if (!cardForm.cardholderName.trim()) {
      newErrors.cardholderName = 'Nombre del titular requerido';
    }

    if (!cardForm.identificationNumber.trim()) {
      newErrors.identificationNumber = 'RUT requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Procesar pago
  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Crear token de tarjeta
      const cardToken = await mercadoPagoService.createCardToken({
        cardNumber: cardForm.cardNumber.replace(/\s/g, ''),
        expirationMonth: cardForm.expirationDate.split('/')[0],
        expirationYear: `20${cardForm.expirationDate.split('/')[1]}`,
        securityCode: cardForm.securityCode,
        cardholderName: cardForm.cardholderName,
        identificationType: cardForm.identificationType,
        identificationNumber: cardForm.identificationNumber
      });

      // Procesar pago
      const paymentResponse = await mercadoPagoService.processCardPayment(paymentData, cardToken);

      if (paymentResponse.status === 'approved') {
        onPaymentSuccess(paymentResponse);
      } else {
        onPaymentError(`Pago ${paymentResponse.status}: ${paymentResponse.detail}`);
      }

    } catch (error: any) {
      console.error('Error procesando pago:', error);
      onPaymentError(error.message || 'Error procesando el pago');
    } finally {
      setProcessing(false);
    }
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // 16 dígitos + 3 espacios
  };

  // Formatear fecha de expiración
  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (mpLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Cargando sistema de pagos...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Pago Seguro</h2>
        </div>
        
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-500/30">
          <p className="text-xl font-bold text-foreground">Total a pagar: {formatCurrency(paymentData.amount)}</p>
          <p className="text-sm text-muted-foreground mt-1">{paymentData.description}</p>
        </div>
      </div>

      {/* Indicadores de seguridad */}
      <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-500" />
          <span>Pago 100% Seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-500" />
          <span>MercadoPago</span>
        </div>
      </div>

      {/* Formulario de tarjeta */}
      <div className="space-y-6">
        {/* Número de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Número de tarjeta
          </label>
          <input
            type="text"
            value={cardForm.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
              errors.cardNumber ? 'border-red-500' : 'border-white/20 focus:border-primary/50'
            }`}
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Fecha de expiración */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fecha de expiración
            </label>
            <input
              type="text"
              value={cardForm.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', formatExpirationDate(e.target.value))}
              placeholder="MM/AA"
              className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.expirationDate ? 'border-red-500' : 'border-white/20 focus:border-primary/50'
              }`}
              maxLength={5}
            />
            {errors.expirationDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>
            )}
          </div>

          {/* Código de seguridad */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Código de seguridad
            </label>
            <input
              type="text"
              value={cardForm.securityCode}
              onChange={(e) => handleInputChange('securityCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.securityCode ? 'border-red-500' : 'border-white/20 focus:border-primary/50'
              }`}
              maxLength={4}
            />
            {errors.securityCode && (
              <p className="text-red-500 text-sm mt-1">{errors.securityCode}</p>
            )}
          </div>
        </div>

        {/* Nombre del titular */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nombre del titular
          </label>
          <input
            type="text"
            value={cardForm.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="Como aparece en la tarjeta"
            className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
              errors.cardholderName ? 'border-red-500' : 'border-white/20 focus:border-primary/50'
            }`}
          />
          {errors.cardholderName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
          )}
        </div>

        {/* RUT */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            RUT del titular
          </label>
          <input
            type="text"
            value={cardForm.identificationNumber}
            onChange={(e) => handleInputChange('identificationNumber', e.target.value)}
            placeholder="12.345.678-9"
            className={`w-full px-4 py-3 rounded-xl border bg-white/5 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
              errors.identificationNumber ? 'border-red-500' : 'border-white/20 focus:border-primary/50'
            }`}
          />
          {errors.identificationNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.identificationNumber}</p>
          )}
        </div>
      </div>

      {/* Botón de pago */}
      <div className="mt-8">
        <Button
          onClick={handlePayment}
          disabled={processing || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing || isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Procesando pago...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pagar {formatCurrency(paymentData.amount)}
            </>
          )}
        </Button>
      </div>

      {/* Información adicional */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4 text-green-500" />
          <span>Tus datos están protegidos con encriptación SSL</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Procesado por MercadoPago - Líder en pagos online de América Latina
        </p>
      </div>

      {/* Métodos de pago disponibles */}
      {paymentMethods.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Métodos de pago aceptados:</h4>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.slice(0, 6).map((method) => (
              <div
                key={method.id}
                className="bg-white/10 rounded-lg px-3 py-2 text-xs text-foreground border border-white/20"
              >
                {method.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MercadoPagoCheckout;
