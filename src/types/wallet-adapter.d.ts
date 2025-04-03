declare module '@aptos-labs/wallet-adapter-react' {
  import { WalletReadyState } from '@aptos-labs/wallet-adapter-core';
  
  export interface Account {
    address: string;
    publicKey: string;
  }

  export interface AccountInfo {
    address: string;
    publicKey: string;
  }

  export interface Wallet {
    name: string;
    url: string;
    icon: string;
    adapter: {
      name: string;
      url: string;
      icon: string;
      connected: boolean;
      connecting: boolean;
      readyState: WalletReadyState;
      account: Account | null;
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
    };
  }

  export interface PetraWallet {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
    signTransaction?: (payload: any) => Promise<{ hash: string }>; // Add optional method
  }

  export function useWallet(): {
    connected: boolean;
    account: Account | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
  };

  export interface AptosWalletAdapterProviderProps {
    wallets: PetraWallet[];
    children: React.ReactNode;
  }

  export const AptosWalletAdapterProvider: React.FC<AptosWalletAdapterProviderProps>;
}