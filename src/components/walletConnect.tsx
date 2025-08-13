'use client'

import React, { useState, useEffect } from 'react';
import { Wallet, X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

// Define wallet interface
interface SolanaWallet {
  name: string;
  icon: string;
  adapter: any;
  readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported';
}

// Mock wallet data - replace with actual wallet adapters
const SUPPORTED_WALLETS = [
  {
    name: 'Phantom',
    icon: '👻',
    adapter: 'phantom',
    readyState: 'NotDetected' as const
  },
  {
    name: 'Solflare',
    icon: '🔥',
    adapter: 'solflare',
    readyState: 'NotDetected' as const
  },
  {
    name: 'Backpack',
    icon: '🎒',
    adapter: 'backpack',
    readyState: 'NotDetected' as const
  },
  {
    name: 'Glow',
    icon: '✨',
    adapter: 'glow',
    readyState: 'NotDetected' as const
  }
];

interface WalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: any) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ isOpen, onClose, onConnect }) => {
  const [wallets, setWallets] = useState<SolanaWallet[]>(SUPPORTED_WALLETS);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for installed wallets
  useEffect(() => {
    const detectWallets = () => {
      const updatedWallets = wallets.map(wallet => {
        let readyState: 'Installed' | 'NotDetected' = 'NotDetected';
        
        // Check if wallet is installed
        if (typeof window !== 'undefined') {
          switch (wallet.adapter) {
            case 'phantom':
              readyState = window.phantom?.solana?.isPhantom ? 'Installed' : 'NotDetected';
              break;
            case 'solflare':
              readyState = window.solflare?.isSolflare ? 'Installed' : 'NotDetected';
              break;
            case 'backpack':
              readyState = window.backpack?.isBackpack ? 'Installed' : 'NotDetected';
              break;
            case 'glow':
              readyState = window.glow ? 'Installed' : 'NotDetected';
              break;
          }
        }
        
        return { ...wallet, readyState };
      });
      
      setWallets(updatedWallets);
    };

    if (isOpen) {
      detectWallets();
    }
  }, [isOpen]);

  const handleWalletConnect = async (wallet: SolanaWallet) => {
    if (wallet.readyState !== 'Installed') {
      // Redirect to wallet installation
      const installUrl = getWalletInstallUrl(wallet.adapter);
      window.open(installUrl, '_blank');
      return;
    }

    setConnecting(wallet.adapter);
    setError(null);

    try {
      let walletAdapter;
      
      // Get the appropriate wallet adapter
      switch (wallet.adapter) {
        case 'phantom':
          walletAdapter = window.phantom?.solana;
          break;
        case 'solflare':
          walletAdapter = window.solflare;
          break;
        case 'backpack':
          walletAdapter = window.backpack;
          break;
        case 'glow':
          walletAdapter = window.glow;
          break;
        default:
          throw new Error('Wallet not supported');
      }

      if (!walletAdapter) {
        throw new Error('Wallet not found');
      }

      // Connect to wallet
      const response = await walletAdapter.connect();
      
      // Call the onConnect callback with wallet info
      onConnect({
        name: wallet.name,
        publicKey: response.publicKey?.toString() || walletAdapter.publicKey?.toString(),
        adapter: walletAdapter
      });
      
      onClose();
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(null);
    }
  };

  const getWalletInstallUrl = (adapter: string): string => {
    const urls: Record<string, string> = {
      phantom: 'https://phantom.app/',
      solflare: 'https://solflare.com/',
      backpack: 'https://backpack.app/',
      glow: 'https://glow.app/'
    };
    return urls[adapter] || '#';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg">
              <Wallet className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        {/* Wallet List */}
        <div className="p-6 space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter}
              onClick={() => handleWalletConnect(wallet)}
              disabled={connecting === wallet.adapter}
              className="w-full flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-white group-hover:text-yellow-400 transition-colors">
                    {wallet.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {wallet.readyState === 'Installed' ? 'Detected' : 'Not installed'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {connecting === wallet.adapter ? (
                  <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                ) : wallet.readyState === 'Installed' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="text-xs text-gray-400 text-center">
            New to Solana wallets?{' '}
            <a
              href="https://docs.solana.com/wallet-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;

// Type declarations for wallet objects
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean;
        connect: () => Promise<{ publicKey: any }>;
        publicKey?: any;
      };
    };
    solflare?: {
      isSolflare: boolean;
      connect: () => Promise<{ publicKey: any }>;
      publicKey?: any;
    };
    backpack?: {
      isBackpack: boolean;
      connect: () => Promise<{ publicKey: any }>;
      publicKey?: any;
    };
    glow?: {
      connect: () => Promise<{ publicKey: any }>;
      publicKey?: any;
    };
  }
}