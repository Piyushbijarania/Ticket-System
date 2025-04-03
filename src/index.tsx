import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Types } from "aptos";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import 'antd/dist/reset.css';

// Initialize Petra wallet
class PetraWallet {
  readonly name = 'Petra';
  readonly url = 'https://petra.app';
  readonly icon = 'https://petra.app/logo.svg';
  readonly provider = (window as any).petra;

  async connect(): Promise<void> {
    try {
      await this.provider.connect();
    } catch (error) {
      console.error('Error connecting to Petra wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider.disconnect();
    } catch (error) {
      console.error('Error disconnecting from Petra wallet:', error);
      throw error;
    }
  }

  async signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<{ hash: string }> {
    try {
      const response = await this.provider.signAndSubmitTransaction(transaction);
      return response;
    } catch (error) {
      console.error('Error signing and submitting transaction:', error);
      throw error;
    }
  }

  async account(): Promise<string> {
    const { address } = await this.provider.account();
    return address;
  }

  async network(): Promise<{ name: string; chainId: string }> {
    return {
      name: 'devnet',
      chainId: '2'
    };
  }
}

const wallets = [new PetraWallet()];

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ConfigProvider>
      <AptosWalletAdapterProvider wallets={wallets}>
        <App />
      </AptosWalletAdapterProvider>
    </ConfigProvider>
  </React.StrictMode>
); 