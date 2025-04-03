import { WalletReadyState } from '@aptos-labs/wallet-adapter-core';
import { Types } from 'aptos';

export interface PetraWallet {
  name: string;
  url: string;
  icon: string;
  adapter: {
    name: string;
    url: string;
    icon: string;
    readyState: WalletReadyState;
    connecting: boolean;
    connected: boolean;
    wallet: any;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    account(): Promise<{ address: string }>;
  };
}

declare global {
  interface Window {
    aptos?: PetraWallet;
  }
}

declare module '@aptos-labs/wallet-adapter-react' {
  export interface WalletContextState {
    connected: boolean;
    account: Account | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSubmitTransaction: (transaction: Types.TransactionPayload) => Promise<{ hash: string }>;
  }

  export interface Account {
    address: string;
    publicKey: string;
  }

  export function useWallet(): WalletContextState;
} 