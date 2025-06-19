import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { API_STRIPE } from '@/config/constants';
const stripePromise = loadStripe(API_STRIPE);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  amount: number;
  paymentMethod: string;
  paymentMethodName: string;
  clientSecret?: string;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  contractId,
  amount,
  paymentMethod,
  paymentMethodName,
  clientSecret,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Detectar el tema actual de la aplicación
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    document.body.classList.contains('dark') ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkTheme();
    
    // Observar cambios en el tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: isDarkMode ? 'night' as const : 'stripe' as const,
      variables: isDarkMode ? {
        colorPrimary: '#0ea5e9', // sky-500
        colorBackground: '#1f2937', // gray-800
        colorText: '#f9fafb', // gray-50
        colorTextSecondary: '#d1d5db', // gray-300
        colorTextPlaceholder: '#9ca3af', // gray-400
        colorIconTab: '#d1d5db', // gray-300
        colorIconTabSelected: '#0ea5e9', // sky-500
        colorDanger: '#ef4444', // red-500
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '8px',
        spacingAccordionItem: '12px',
        colorInputBackground: '#374151', // gray-700
        colorInputBorder: '#4b5563', // gray-600
        colorInputText: '#f9fafb', // gray-50
        focusBoxShadow: '0 0 0 2px rgba(14, 165, 233, 0.4)', // sky-500 con opacidad
      } : {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '8px',
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-900 dark:text-white">
            Procesar Pago
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Método de pago: <span className="font-semibold">{paymentMethodName}</span>
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Total: ${amount.toLocaleString()}
            </p>
          </div>

          <Elements stripe={stripePromise} options={clientSecret ? stripeOptions : {}}>
            <StripePaymentForm
              contractId={contractId}
              amount={amount}
              paymentMethod={paymentMethod}
              clientSecret={clientSecret}
              onPaymentSuccess={(result) => {
                onPaymentSuccess(result);
                onClose();
              }}
              onPaymentError={onPaymentError}
            />
          </Elements>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal; 