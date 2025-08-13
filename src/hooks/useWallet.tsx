'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface WalletState {
  connected: boolean;
  publicKey: string | null;
  name: string | null;
  adapter: any;
}

interface WalletContextType {
  wallet: WalletState;
  connect: (walletInfo: any) => void;
  disconnect: () => void;
  connecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    name: null,
    adapter: null,
  });
  const [connecting, setConnecting] = useState(false);

  // Load wallet state from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('goldfi-wallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setWallet(walletData);
      } catch (error) {
        console.error('Error loading wallet from localStorage:', error);
        localStorage.removeItem('goldfi-wallet');
      }
    }
  }, []);

  // Save wallet state to localStorage when it changes
  useEffect(() => {
    if (wallet.connected) {
      localStorage.setItem('goldfi-wallet', JSON.stringify({
        connected: wallet.connected,
        publicKey: wallet.publicKey,
        name: wallet.name,
        adapter: null // Don't store the adapter object
      }));
    } else {
      localStorage.removeItem('goldfi-wallet');
    }
  }, [wallet]);

  const connect = async (walletInfo: any) => {
    setConnecting(true);
    try {
      setWallet({
        connected: true,
        publicKey: walletInfo.publicKey,
        name: walletInfo.name,
        adapter: walletInfo.adapter,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // Disconnect from wallet adapter if available
      if (wallet.adapter && wallet.adapter.disconnect) {
        await wallet.adapter.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
    
    setWallet({
      connected: false,
      publicKey: null,
      name: null,
      adapter: null,
    });
  };

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, connecting }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};