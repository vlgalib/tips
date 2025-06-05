'use client';

import React, { useState } from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';
import { connectWallet } from '@/lib/crypto';
import USDCBalance from './USDCBalance';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const { address: walletAddress } = await connectWallet();
      setAddress(walletAddress);
      onConnect(walletAddress);
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {address ? (
        <div className="flex items-center space-x-4">
          <USDCBalance address={address} />
          <div className="flex items-center space-x-2">
            <WalletIcon className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
        >
          <WalletIcon className="h-5 w-5" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
} 