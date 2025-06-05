'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Tip {
  id: string;
  amount: number;
  message?: string;
  timestamp: any;
  source: 'card' | 'crypto' | 'xmtp';
  payerAddress?: string;
}

interface TipHistoryProps {
  staffId: string;
}

export default function TipHistory({ staffId }: TipHistoryProps) {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tipsRef = collection(db, 'tips');
        const q = query(
          tipsRef,
          where('staffId', '==', staffId),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const tipsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as Tip[];

        setTips(tipsData);
      } catch (err) {
        setError('Failed to fetch tip history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, [staffId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>No tips received yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tips.map((tip) => (
        <div
          key={tip.id}
          className="bg-white rounded-lg shadow p-4 flex items-start space-x-4"
        >
          <div className="flex-shrink-0">
            {tip.source === 'xmtp' ? (
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            ) : (
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                ${tip.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(tip.timestamp).toLocaleString()}
              </p>
            </div>
            {tip.message && (
              <p className="mt-1 text-sm text-gray-500">{tip.message}</p>
            )}
            {tip.payerAddress && (
              <p className="mt-1 text-xs text-gray-400">
                From: {tip.payerAddress.slice(0, 6)}...{tip.payerAddress.slice(-4)}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Via {tip.source.toUpperCase()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 