"use client";

import { useState } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { saveStaffMember } from '@/lib/firebase-admin';

export function CoinbaseLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCoinbaseLogin = async () => {
    try {
      setIsLoading(true);
      
      // 1. Connect Coinbase Wallet
      const { address } = await window.coinbaseWalletProvider.request({
        method: 'eth_requestAccounts'
      });
      
      // 2. Sign message for XMTP
      const message = 'Enable XMTP messaging for TipMaster';
      const signature = await window.coinbaseWalletProvider.request({
        method: 'personal_sign',
        params: [message, address]
      });
      
      // 3. Initialize XMTP
      const xmtpClient = await Client.create(address, { 
        env: 'production',
        codecs: [new TextCodec(), new ReactionCodec()]
      });
      
      // 4. Save to Firebase
      await saveStaffMember({
        walletAddress: address,
        authMethod: 'coinbase',
        xmtpEnabled: true
      });
      
      // 5. Send welcome message
      await xmtpClient.sendMessage(address, `
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
      className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <img src="/coinbase-icon.svg" alt="Coinbase" className="w-5 h-5 mr-2" />
          Connect Coinbase Wallet
        </>
      )}
    </button>
  );
} 