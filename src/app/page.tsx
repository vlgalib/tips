"use client";

import { GmailLogin } from '@/components/auth/GmailLogin';
import { CoinbaseLogin } from '@/components/auth/CoinbaseLogin';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to TipMaster
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Gmail + Auto Wallet */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              🔥 Recommended for Restaurant Staff
            </h2>
            <p className="text-gray-600 mb-6">
              We'll create a secure crypto wallet for you automatically
            </p>
            <GmailLogin />
            <ul className="mt-4 text-sm text-gray-500">
              <li>• No crypto experience needed</li>
              <li>• Secure backup via email</li>
            </ul>
          </div>
          
          {/* Coinbase Wallet Direct */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              💼 Already have Coinbase Wallet?
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your existing Coinbase Wallet directly
            </p>
            <CoinbaseLogin />
            <ul className="mt-4 text-sm text-gray-500">
              <li>• Keep using your existing wallet</li>
              <li>• Full control</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 