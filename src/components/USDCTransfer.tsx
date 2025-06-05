import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/useWallet';
import { USDCService } from '@/lib/usdc';

interface USDCTransferProps {
  recipientAddress: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export const USDCTransfer: React.FC<USDCTransferProps> = ({
  recipientAddress,
  onSuccess,
  onError
}) => {
  const { provider, signer, address } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!provider || !signer || !address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const usdcService = new USDCService(provider);
      
      // Check balance
      const balance = await usdcService.getBalance(address);
      if (parseFloat(balance) < parseFloat(amount)) {
        throw new Error('Insufficient USDC balance');
      }

      // Estimate gas
      const gasEstimate = await usdcService.estimateGas(
        address,
        recipientAddress,
        amount
      );

      // Execute transfer
      const tx = await usdcService.transfer(
        address,
        recipientAddress,
        amount,
        signer
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      onSuccess?.(receipt.transactionHash);
    } catch (err: any) {
      setError(err.message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Send USDC Tip</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amount (USDC)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
          min="0"
          step="0.01"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <button
        onClick={handleTransfer}
        disabled={loading || !amount}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send USDC'}
      </button>
    </div>
  );
}; 