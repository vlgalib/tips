import React from 'react';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CurrencyDollarIcon as CryptoIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface TipStatsProps {
  totalTips: number;
  cryptoTips: number;
  cardTips: number;
  xmtpTips: number;
  period: string;
}

export const TipStats: React.FC<TipStatsProps> = ({
  totalTips,
  cryptoTips,
  cardTips,
  xmtpTips,
  period
}) => {
  const stats = [
    {
      name: 'Total Tips',
      value: `$${totalTips.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Crypto Tips',
      value: `$${cryptoTips.toFixed(2)}`,
      icon: CryptoIcon,
      color: 'bg-indigo-500'
    },
    {
      name: 'Card Tips',
      value: `$${cardTips.toFixed(2)}`,
      icon: CreditCardIcon,
      color: 'bg-green-500'
    },
    {
      name: 'XMTP Tips',
      value: `$${xmtpTips.toFixed(2)}`,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Tip Statistics</h3>
        <span className="text-sm text-gray-500">{period}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className={`p-3 ${stat.color} rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 