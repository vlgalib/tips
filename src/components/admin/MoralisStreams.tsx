"use client";

import React, { useState, useEffect } from 'react';
import { useMoralisStreams } from '@/hooks/useMoralisStreams';
import { ethers } from 'ethers';

const USDC_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  }
];

export const MoralisStreams: React.FC = () => {
  const { isInitialized, error, createStream, deleteStream, getStreams } = useMoralisStreams();
  const [streams, setStreams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      loadStreams();
    }
  }, [isInitialized]);

  const loadStreams = async () => {
    try {
      setIsLoading(true);
      const streamsList = await getStreams();
      setStreams(streamsList);
    } catch (err) {
      console.error('Error loading streams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStream = async () => {
    try {
      setIsLoading(true);
      await createStream({
        webhookUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/moralis`,
        description: 'USDC Transfer Events on Base',
        tag: 'usdc-transfers',
        chains: ['base'],
        abi: USDC_ABI,
        address: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '',
        topic0: ethers.utils.id('Transfer(address,address,uint256)')
      });
      await loadStreams();
    } catch (err) {
      console.error('Error creating stream:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStream = async (streamId: string) => {
    try {
      setIsLoading(true);
      await deleteStream(streamId);
      await loadStreams();
    } catch (err) {
      console.error('Error deleting stream:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Moralis Streams</h3>
        <button
          onClick={handleCreateStream}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Create Stream
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{stream.description}</p>
                <p className="text-sm text-gray-500">ID: {stream.id}</p>
              </div>
              <button
                onClick={() => handleDeleteStream(stream.id)}
                disabled={isLoading}
                className="px-3 py-1 text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 