import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CoinbaseCommerceProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    CoinbaseCommerce: {
      createPayment: (options: any) => Promise<any>;
    };
  }
}

export const CoinbaseCommerce: React.FC<CoinbaseCommerceProps> = ({
  amount,
  description,
  onSuccess,
  onError
}) => {
  const router = useRouter();

  useEffect(() => {
    // Load Coinbase Commerce script
    const script = document.createElement('script');
    script.src = 'https://commerce.coinbase.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { checkoutId } = await response.json();

      const result = await window.CoinbaseCommerce.createPayment({
        checkoutId,
        onSuccess: () => {
          onSuccess?.();
          router.push('/payment/success');
        },
        onError: (error: Error) => {
          onError?.(error);
          router.push('/payment/error');
        }
      });
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Payment failed'));
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Pay with Card
    </button>
  );
}; 