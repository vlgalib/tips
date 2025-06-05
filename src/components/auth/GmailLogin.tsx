"use client";

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CoinbaseAgentKit } from '@coinbase/coinbase-agentkit-core';
import { Client } from '@xmtp/xmtp-js';
import { saveStaffMember } from '@/lib/firebase-admin';

export function GmailLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGmailLogin = async () => {
    try {
      setIsLoading(true);
      
      // 1. Gmail OAuth
      const googleProvider = new GoogleAuthProvider();
      const googleUser = await signInWithPopup(auth, googleProvider);
      
      // 2. Generate smart wallet using CDP
      const agentKit = await CoinbaseAgentKit.configureWithWallet({
        cdpApiKeyName: process.env.NEXT_PUBLIC_CDP_API_KEY_NAME!,
        cdpApiKeyPrivateKey: process.env.NEXT_PUBLIC_CDP_API_KEY_PRIVATE_KEY!,
        networkId: 'base-mainnet'
      });
      
      const wallet = await agentKit.wallet;
      
      // 3. Initialize XMTP
      const xmtpClient = await Client.create(wallet, { 
        env: 'production',
        codecs: [new TextCodec(), new ReactionCodec()]
      });
      
      // 4. Save to Firebase
      await saveStaffMember({
        uid: googleUser.user.uid,
        email: googleUser.user.email,
        walletAddress: wallet.address,
        authMethod: 'gmail',
        xmtpEnabled: true
      });
      
      // 5. Send welcome message
      await xmtpClient.sendMessage(wallet.address, `
🎉 Welcome to TipMaster!
Your crypto wallet has been created automatically.
You can now receive tips in USDC on Base network.

Your wallet address: ${wallet.address}
      `);
      
    } catch (error) {
      console.error('Gmail login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGmailLogin}
      disabled={isLoading}
      className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Gmail
        </>
      )}
    </button>
  );
} 