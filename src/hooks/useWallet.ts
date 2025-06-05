import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletConnect } from '@walletconnect/react';
import { useCoinbaseWallet } from '@coinbase/wallet-sdk-react';

export function useWallet() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const walletConnect = useWalletConnect();
  const coinbaseWallet = useCoinbaseWallet();

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        let web3Provider: ethers.providers.Web3Provider | null = null;

        if (walletConnect.connected) {
          web3Provider = new ethers.providers.Web3Provider(walletConnect.provider);
        } else if (coinbaseWallet.isConnected) {
          web3Provider = new ethers.providers.Web3Provider(coinbaseWallet.provider);
        }

        if (web3Provider) {
          const signer = web3Provider.getSigner();
          const address = await signer.getAddress();

          setProvider(web3Provider);
          setSigner(signer);
          setAddress(address);
        } else {
          setProvider(null);
          setSigner(null);
          setAddress(null);
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
        setProvider(null);
        setSigner(null);
        setAddress(null);
      } finally {
        setLoading(false);
      }
    };

    initializeProvider();
  }, [walletConnect.connected, coinbaseWallet.isConnected]);

  const connect = async () => {
    try {
      setLoading(true);
      
      if (walletConnect.connected) {
        await walletConnect.killSession();
      }
      
      await walletConnect.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setLoading(true);
      
      if (walletConnect.connected) {
        await walletConnect.killSession();
      }
      
      setProvider(null);
      setSigner(null);
      setAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    provider,
    signer,
    address,
    loading,
    connect,
    disconnect,
    isConnected: !!address
  };
} 