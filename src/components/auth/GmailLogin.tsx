"use client";

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { Client } from '@xmtp/xmtp-js';
import { saveStaffMember } from '@/lib/firebase-admin';
import { ethers } from 'ethers';

export function GmailLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGmailLogin = async () => {
    try {
      setIsLoading(true);
      
      // 1. Gmail OAuth
      const googleProvider = new GoogleAuthProvider();
      const googleUser = await signInWithPopup(auth, googleProvider);
      
      // 2. Initialize Coinbase Wallet
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "TipMaster",
        appLogoUrl: "https://tipmaster.com/logo.png",
        appChainIds: [8453], // Base mainnet
      });

      const provider = coinbaseWallet.makeWeb3Provider();
      await provider.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      const address = accounts[0];
      
      // 3. Initialize XMTP
      const signer = new ethers.providers.Web3Provider(provider).getSigner();
      const xmtpClient = await Client.create(signer, { 
        env: 'production'
      });
      
      // 4. Save to Firebase
      if (googleUser.user.email) {
        await saveStaffMember({
          uid: googleUser.user.uid,
          email: googleUser.user.email,
          walletAddress: address,
          authMethod: 'gmail',
          xmtpEnabled: true
        });
        
        // 5. Send welcome message
        const conversation = await xmtpClient.conversations.newConversation(address);
        await conversation.send(`
🎉 Welcome to TipMaster!
Your crypto wallet has been created automatically.
You can now receive tips in USDC on Base network.

Your wallet address: ${address}
        `);
      }
      
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
      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
      ) : (
        <>
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
          Sign in with Gmail
        </>
      )}
    </button>
  );
} 