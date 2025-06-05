import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  source: 'crypto' | 'card' | 'xmtp';
  timestamp: Date;
  sender: string;
  receiver: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions
}) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'crypto':
        return '💎';
      case 'card':
        return '💳';
      case 'xmtp':
        return '💬';
      default:
        return '💰';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'crypto':
        return 'text-indigo-600';
      case 'card':
        return 'text-green-600';
      case 'xmtp':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{getSourceIcon(tx.source)}</span>
              <div>
                <p className="font-medium text-gray-900">
                  ${tx.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {tx.sender.slice(0, 6)}...{tx.sender.slice(-4)} →{' '}
                  {tx.receiver.slice(0, 6)}...{tx.receiver.slice(-4)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`text-sm font-medium ${getSourceColor(tx.source)}`}>
                {tx.source.toUpperCase()}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 