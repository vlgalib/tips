"use client";

import { useState } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { Client } from '@xmtp/xmtp-js';
import { saveStaffMember } from '@/lib/firebase-admin';
import { ethers } from 'ethers';
import { StaffMember } from '@/types/staff';

export function CoinbaseLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCoinbaseLogin = async () => {
    try {
      setIsLoading(true);
      
      // 1. Initialize Coinbase Wallet
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "TipMaster",
        appLogoUrl: "https://tipmaster.com/logo.png",
        appChainIds: [8453], // Base mainnet
      });

      const provider = coinbaseWallet.makeWeb3Provider();
      await provider.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      const address = accounts[0];
      
      // 2. Sign message for XMTP
      const message = 'Enable XMTP messaging for TipMaster';
      const signer = new ethers.providers.Web3Provider(provider).getSigner();
      const signature = await signer.signMessage(message);
      
      // 3. Initialize XMTP
      const xmtpClient = await Client.create(signer, { 
        env: 'production'
      });
      
      // 4. Save to Firebase
      const staffMember: Omit<StaffMember, 'createdAt'> = {
        uid: address,
        email: `${address}@coinbase.wallet`,
        walletAddress: address,
        authMethod: 'coinbase',
        xmtpEnabled: true
      };
      
      await saveStaffMember(staffMember);
      
      // 5. Send welcome message
      const conversation = await xmtpClient.conversations.newConversation(address);
      await conversation.send(`
🎉 Welcome to TipMaster!
Your Coinbase Wallet is now connected.
You can now receive tips in USDC on Base network.

Your wallet address: ${address}
      `);
      
    } catch (error) {
      console.error('Coinbase login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCoinbaseLogin}
      disabled={isLoading}
      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
      ) : (
        <>
          <img src="/coinbase-icon.svg" alt="Coinbase" className="w-5 h-5 mr-2" />
          Connect Coinbase Wallet
        </>
      )}
    </button>
  );
} 