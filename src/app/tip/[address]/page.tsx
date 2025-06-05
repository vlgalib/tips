'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { createCharge } from '@/lib/payments';

export default function TipPage() {
  const params = useParams();
  const [staffData, setStaffData] = useState<{
    name: string;
    walletAddress: string;
  } | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'xmtp' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      if (params.address) {
        const staffQuery = await getDoc(doc(db, 'staff', params.address as string));
        if (staffQuery.exists()) {
          setStaffData(staffQuery.data() as { name: string; walletAddress: string });
        }
      }
    };

    fetchStaffData();
  }, [params.address]);

  const handleTip = async (amount: number) => {
    if (!staffData || !paymentMethod) return;

    setIsProcessing(true);
    try {
      switch (paymentMethod) {
        case 'card':
          const charge = await createCharge({
            amount,
            currency: 'USD',
            name: `Tip for ${staffData.name}`,
            description: message || `Thank you for your service!`,
            metadata: {
              staffId: params.address,
              message,
            },
          });
          window.location.href = charge.hosted_url;
          break;

        case 'crypto':
          // TODO: Implement crypto payment
          console.log('Crypto payment:', amount, staffData.walletAddress);
          break;

        case 'xmtp':
          // TODO: Implement XMTP payment
          console.log('XMTP payment:', amount, staffData.walletAddress);
          break;
      }
    } catch (error) {
      console.error('Payment error:', error);
      // TODO: Show error message to user
    } finally {
      setIsProcessing(false);
    }
  };

  if (!staffData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leave a Tip</h1>
          <p className="mt-2 text-gray-600">
            Thank you for supporting {staffData.name}!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[5, 10, 20, 50, 100, 'Custom'].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  if (amount === 'Custom') {
                    setSelectedAmount(null);
                  } else {
                    setSelectedAmount(amount as number);
                    setCustomAmount('');
                  }
                }}
                className={`p-4 text-center rounded-lg border ${
                  selectedAmount === amount
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {amount === 'Custom' ? 'Custom' : `$${amount}`}
              </button>
            ))}
          </div>

          {selectedAmount === null && (
            <div>
              <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Amount
              </label>
              <input
                type="number"
                id="custom-amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
                min="1"
              />
            </div>
          )}

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Add a message..."
            />
          </div>

          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />

          <button
            onClick={() => handleTip(selectedAmount || Number(customAmount))}
            disabled={!selectedAmount && !customAmount || !paymentMethod || isProcessing}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
          >
            {isProcessing ? 'Processing...' : 'Send Tip'}
          </button>
        </div>
      </div>
    </main>
  );
} 