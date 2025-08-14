'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Github, Twitter, Zap, Shield, Coins, Wallet, RefreshCw, Globe, Loader2 } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const HomePage = () => {
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [networkLabel, setNetworkLabel] = useState('Devnet');
  const [networkColor, setNetworkColor] = useState('text-yellow-400');

  const fetchSolBalance = useCallback(async () => {
    if (!publicKey) return;

    setIsLoadingBalance(true);
    setBalanceError(null);
    try {
      const balance = await connection.getBalance(publicKey, 'confirmed');
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error: any) {
      console.error("Failed to fetch balance:", error);
      setBalanceError(error.message || "Failed to fetch balance");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchSolBalance();
    } else {
      setSolBalance(null);
      setBalanceError(null);
    }

    if (connection.rpcEndpoint.includes('devnet')) {
        setNetworkLabel('Devnet');
        setNetworkColor('text-yellow-400');
    } else if (connection.rpcEndpoint.includes('mainnet')) {
        setNetworkLabel('Mainnet');
        setNetworkColor('text-green-400');
    } else {
        setNetworkLabel('Localnet');
        setNetworkColor('text-blue-400');
    }
  }, [connected, publicKey, connection, fetchSolBalance]);

  const handleRefreshBalance = () => {
    if (connected && publicKey) {
      fetchSolBalance();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getBalanceDisplay = () => {
    if (isLoadingBalance) {
      return (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      );
    }
    
    if (balanceError) {
      return <span className="text-sm text-red-400">Error</span>;
    }
    
    if (solBalance !== null) {
      return (
        <div>
          <span className="text-lg font-bold text-white">{solBalance.toFixed(4)}</span>

          <span className="text-sm text-gray-400 ml-1">SOL</span>
        </div>
      );
    }
    
    return <span className="text-sm text-gray-400">No balance</span>;
  };

  return (
    <section className="relative z-10 px-6 pt-16 pb-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <div className="space-y-6 mb-12">
          <h1 className="text-6xl md:text-8xl font-bold">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              GoldFi
            </span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 leading-tight">
            Decentralized Gold-Backed Finance
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Bridge the gap between traditional precious metals and modern DeFi on the Solana blockchain.
          </p>
        </div>

        {/* Wallet Terminal Section */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-gray-900/90 backdrop-blur-2xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-purple-500/20">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm text-purple-300 font-mono">goldfi-terminal</span>
            </div>
            <div className="space-y-3 font-mono text-left">
              {connected && publicKey ? (
                <>
                  <div className="text-green-400">$ Wallet connected</div>
                  <div className="text-cyan-400">&gt; Address: {formatAddress(publicKey.toBase58())}</div>
                  <div className="text-yellow-400">&gt; Network: {networkLabel}</div>
                  <div className="text-gray-400">&gt; Ready for gold trading...</div>
                </>
              ) : (
                <>
                  <div className="text-cyan-400">$ Connect wallet to start</div>
                  <div className="text-gray-400">&gt; Network: {networkLabel}</div>
                  <div className="text-gray-400">&gt; Initializing secure connection...</div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            {connected && publicKey ? (
              <div className="space-y-4">
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {wallet?.adapter.icon && <img src={wallet.adapter.icon} alt="wallet icon" className="w-4 h-4" />}
                      <span className="text-sm text-gray-300 font-medium">{wallet.adapter.name}</span>
                    </div>
                    <button onClick={handleRefreshBalance} disabled={isLoadingBalance} className="p-1 text-gray-400 hover:text-white disabled:opacity-50" title="Refresh balance">
                      <RefreshCw className={`w-4 h-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 font-mono mb-3">{publicKey.toBase58()}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Balance:</span>
                    <div className="text-right">{getBalanceDisplay()}</div>
                  </div>
                </div>
                
                <Link href="/basics" legacyBehavior>
                  <a className={`w-full block ${balanceError ? 'pointer-events-none' : ''}`}>
                    <button 
                      disabled={balanceError !== null}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
                    >
                      {balanceError ? 'Network Error' : 'Start Trading Gold'}
                    </button>
                  </a>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Current Network:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${networkColor.replace('text-','bg-')}`} />
                      <span className={`text-sm font-medium ${networkColor}`}>{networkLabel}</span>
                    </div>
                  </div>
                </div>
                
                <WalletModalButton className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg !justify-center">
                  Connect Wallet
                </WalletModalButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;