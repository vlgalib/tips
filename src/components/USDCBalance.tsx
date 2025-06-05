'use client';

import React, { useEffect, useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { getUSDCBalance } from '@/lib/crypto';

interface USDCBalanceProps {
  address: string;
}

export default function USDCBalance({ address }: USDCBalanceProps) {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const usdcBalance = await getUSDCBalance(address);
        setBalance(usdcBalance);
      } catch (err) {
        setError('Failed to fetch USDC balance');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchBalance();
      // Update balance every 30 seconds
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [address]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <CurrencyDollarIcon className="h-5 w-5" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <CurrencyDollarIcon className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
      <span className="font-medium">{Number(balance).toFixed(2)} USDC</span>
    </div>
  );
} 