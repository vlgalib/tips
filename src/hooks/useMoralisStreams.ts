import { useState, useEffect } from 'react';
import Moralis from 'moralis';

interface StreamConfig {
  webhookUrl: string;
  description: string;
  tag: string;
  chains: string[];
  abi: any[];
  address: string;
  topic0: string;
}

export function useMoralisStreams() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMoralis = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) {
          throw new Error('Moralis API key is not configured');
        }

        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY
        });

        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Moralis');
      }
    };

    initializeMoralis();
  }, []);

  const createStream = async (config: StreamConfig) => {
    if (!isInitialized) {
      throw new Error('Moralis is not initialized');
    }

    try {
      const stream = await Moralis.Streams.add({
        ...config,
        type: 'evm'
      });

      return stream;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create stream');
    }
  };

  const deleteStream = async (streamId: string) => {
    if (!isInitialized) {
      throw new Error('Moralis is not initialized');
    }

    try {
      await Moralis.Streams.delete({
        id: streamId
      });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete stream');
    }
  };

  const getStreams = async () => {
    if (!isInitialized) {
      throw new Error('Moralis is not initialized');
    }

    try {
      const streams = await Moralis.Streams.getAll();
      return streams;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get streams');
    }
  };

  return {
    isInitialized,
    error,
    createStream,
    deleteStream,
    getStreams
  };
} 