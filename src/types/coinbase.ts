export interface CoinbaseWalletProvider {
  request: (args: {
    method: string;
    params?: any[];
  }) => Promise<any>;
  
  on: (event: string, callback: (data: any) => void) => void;
  removeListener: (event: string, callback: (data: any) => void) => void;
}

export interface CoinbaseAgentKitConfig {
  cdpApiKeyName: string;
  cdpApiKeyPrivateKey: string;
  networkId: string;
}

export interface CoinbaseWallet {
  address: string;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (transaction: any) => Promise<string>;
}

declare global {
  interface Window {
    coinbaseWalletProvider?: CoinbaseWalletProvider;
  }
} 