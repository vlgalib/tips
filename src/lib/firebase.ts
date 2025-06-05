import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'tips-6545c.firebaseapp.com',
  projectId: 'tips-6545c',
  storageBucket: 'tips-6545c.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize WalletConnect Provider
const walletConnectProvider = new WalletConnectProvider({
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  rpc: {
    1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    137: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
  }
});

// Email Link Authentication
const actionCodeSettings = {
  url: `${window.location.origin}/auth/verify`,
  handleCodeInApp: true
};

export const sendSignInLink = async (email: string) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return true;
  } catch (error) {
    console.error('Error sending sign in link:', error);
    throw error;
  }
};

export const verifySignInLink = async (email: string) => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      return result;
    } catch (error) {
      console.error('Error verifying sign in link:', error);
      throw error;
    }
  }
  return null;
};

// Wallet Authentication
export const connectWallet = async (provider: 'walletconnect' | 'coinbase') => {
  try {
    let web3Provider;
    
    if (provider === 'walletconnect') {
      await walletConnectProvider.enable();
      web3Provider = new ethers.providers.Web3Provider(walletConnectProvider);
    } else {
      // Coinbase Wallet
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        throw new Error('Coinbase Wallet not found');
      }
    }

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    
    // Get custom token from your backend
    const response = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });
    
    const { token } = await response.json();
    
    // Sign in with custom token
    const userCredential = await signInWithCustomToken(auth, token);
    return userCredential;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export { app, auth, db, storage, googleProvider, walletConnectProvider }; 