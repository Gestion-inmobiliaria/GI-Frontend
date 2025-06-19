import React, { useState, useEffect } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/config/constants';
import QRCode from 'react-qr-code';

interface StripePaymentFormProps {
  contractId: string;
  amount: number;
  paymentMethod: string;
  clientSecret?: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  contractId,
  amount,
  paymentMethod,
  clientSecret,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe no está disponible');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Para efectivo, simulamos el pago exitoso
      if (paymentMethod === 'cash') {
        setTimeout(() => {
          onPaymentSuccess({
            paymentIntent: {
              id: 'simulated_cash_payment',
              status: 'succeeded',
              amount: amount * 100
            }
          });
          setLoading(false);
        }, 2000);
        return;
      }

      // Para otros métodos de pago, usar Stripe Elements
      if (clientSecret) {
        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/contracts/payment-success`,
          },
          redirect: 'if_required'
        });

        if (stripeError) {
          setError(stripeError.message || 'Error al procesar el pago');
          onPaymentError(stripeError.message || 'Error al procesar el pago');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onPaymentSuccess({ paymentIntent });
        }
      } else {
        // Fallback para tarjeta con CardElement
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setError('Elemento de tarjeta no encontrado');
          return;
        }

        const { error: stripeError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (stripeError) {
          setError(stripeError.message || 'Error al crear método de pago');
          onPaymentError(stripeError.message || 'Error al crear método de pago');
        } else {
          // Aquí puedes enviar el paymentMethod.id al backend
          console.log('Payment method created:', stripePaymentMethod);
          onPaymentSuccess({ paymentMethod: stripePaymentMethod });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      onPaymentError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'cash':
        return 'Efectivo';
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'qr_code':
        return 'Código QR';
      case 'crypto':
        return 'Criptomonedas';
      default:
        return 'Método de Pago';
    }
  };

  const renderPaymentForm = () => {
    if (paymentMethod === 'cash') {
      return (
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-4">💵</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Pago en Efectivo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Monto: <span className="font-bold">${amount.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              El pago en efectivo será procesado de forma simulada
            </p>
          </div>
        </div>
      );
    }

    if (paymentMethod === 'qr_code') {
      return (
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Pago con Código QR
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Monto: <span className="font-bold">${amount.toLocaleString()}</span>
            </p>
            <div className="w-32 h-32 mx-auto mb-4 p-2 bg-white rounded-lg">
              <QRCode
                size={112}
                value={`payment:${contractId}:${amount}`}
                viewBox="0 0 256 256"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Escanea el código QR para completar el pago
            </p>
          </div>
        </div>
      );
    }

    if (paymentMethod === 'crypto') {
      return (
        <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-4">₿</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Pago con Criptomonedas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Monto: <span className="font-bold">${amount.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Procesar pago con Bitcoin o Ethereum
            </p>
          </div>
        </div>
      );
    }

    // Para tarjetas de crédito
    return (
      <div className="space-y-4">
        {clientSecret ? (
          <PaymentElement />
        ) : (
          <div className="p-4 border border-gray-300 dark:border-gray-600 rounded">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {getPaymentMethodDisplay()}
          </h3>
          
          {renderPaymentForm()}
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full"
        >
          {loading ? 'Procesando...' : `Pagar $${amount.toLocaleString()}`}
        </Button>
      </form>
    </div>
  );
};

export default StripePaymentForm; 