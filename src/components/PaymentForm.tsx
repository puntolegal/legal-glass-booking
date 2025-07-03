import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { usePayment } from "@/services/paymentService";
import { formatCurrency } from "@/config/payment";

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  description: string;
}

const PaymentForm = ({ onClose, onSuccess, amount, description }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'webpay' | 'paypal'>('webpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment } = usePayment();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await processPayment(paymentMethod, amount, description);
      
      if (response.success) {
        // El pago se procesó correctamente
        console.log('Pago iniciado exitosamente:', response);
        // No llamamos onSuccess aquí porque el usuario será redirigido
      } else {
        // Error en el pago
        console.error('Error en el pago:', response.error);
        alert(`Error en el pago: ${response.error}`);
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-strong rounded-3xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Pago Seguro</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Resumen del pago */}
          <div className="glass rounded-2xl p-6 border border-primary/30">
            <h3 className="text-lg font-semibold mb-4">Resumen de Pago</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consulta Legal</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (19%)</span>
                <span className="font-semibold">{formatCurrency(amount * 0.19)}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(amount * 1.19)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Método de Pago</h3>
            
            {/* WebPay */}
            <div 
              className={`glass rounded-xl p-4 border-2 cursor-pointer transition-all ${
                paymentMethod === 'webpay' ? 'border-primary bg-primary/10' : 'border-white/20'
              }`}
              onClick={() => setPaymentMethod('webpay')}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'webpay' ? 'border-primary bg-primary' : 'border-white/30'
                }`}>
                  {paymentMethod === 'webpay' && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="font-semibold">WebPay</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tarjeta de crédito/débito</p>
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div 
              className={`glass rounded-xl p-4 border-2 cursor-pointer transition-all ${
                paymentMethod === 'paypal' ? 'border-primary bg-primary/10' : 'border-white/20'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'paypal' ? 'border-primary bg-primary' : 'border-white/30'
                }`}>
                  {paymentMethod === 'paypal' && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H16.5v-2.956h1.723c.681 0 1.352.163 1.844.478zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="font-semibold">PayPal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Pago con PayPal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="button" 
              variant="glass" 
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="primary" 
              className="flex-1"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                <>
                  Pagar {formatCurrency(amount * 1.19)}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </>
              )}
            </Button>
          </div>

          {/* Información de seguridad */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Pago 100% seguro y encriptado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 