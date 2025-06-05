'use client';

import React, { useState } from 'react';
import { CreditCardIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface PaymentMethodSelectorProps {
  onSelect: (method: 'card' | 'crypto' | 'xmtp') => void;
  selectedMethod: 'card' | 'crypto' | 'xmtp' | null;
}

export default function PaymentMethodSelector({
  onSelect,
  selectedMethod,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'card',
      name: 'Credit Card',
      icon: CreditCardIcon,
      description: 'Pay with any credit or debit card',
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: CurrencyDollarIcon,
      description: 'Pay with USDC on Base',
    },
    {
      id: 'xmtp',
      name: 'XMTP Chat',
      icon: ChatBubbleLeftRightIcon,
      description: 'Send tip via XMTP chat',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id as 'card' | 'crypto' | 'xmtp')}
            className={`relative flex flex-col items-center p-4 rounded-lg border ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <method.icon
              className={`h-8 w-8 ${
                selectedMethod === method.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <span
              className={`mt-2 text-sm font-medium ${
                selectedMethod === method.id ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {method.name}
            </span>
            <span className="mt-1 text-xs text-gray-500">{method.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 