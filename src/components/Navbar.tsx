'use client'

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Settings } from 'lucide-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// A small helper to determine the network name from the RPC endpoint
const getClusterName = (endpoint: string): { name: string, color: string, label: string } => {
  if (endpoint.includes('devnet')) {
    return { name: 'devnet', color: 'text-yellow-400', label: 'Devnet' };
  }
  if (endpoint.includes('mainnet')) {
    return { name: 'mainnet', color: 'text-green-400', label: 'Mainnet' };
  }
  return { name: 'localnet', color: 'text-blue-400', label: 'Localnet' };
};

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { connection } = useConnection();

  // Determine the current cluster from the connection endpoint
  const clusterConfig = useMemo(() => getClusterName(connection.rpcEndpoint), [connection.rpcEndpoint]);

  return (
    <nav className="cursor-default relative z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              GoldFi
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex text-gray-300 items-center space-x-8">
            <Link
              href="/"
              className={`hover:text-yellow-400 transition-colors font-medium ${
                pathname === '/' ? 'text-yellow-400' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/basics"
              className={`hover:text-yellow-400 transition-colors ${
                pathname === '/basics' ? 'text-yellow-400' : ''
              }`}
            >
              Basics
            </Link>

            {/* Wallet Connect Button from the official library */}
            {/* This single component handles the modal, connection, address display, and disconnection */}
            <WalletMultiButton />
          </div>

          {/* Settings & Network Indicator */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className={`w-2 h-2 rounded-full ${
                clusterConfig.name === 'mainnet' ? 'bg-green-400' :
                clusterConfig.name === 'devnet' ? 'bg-yellow-400' : 'bg-blue-400'
              }`} />
              <span className={`text-xs font-medium ${clusterConfig.color}`}>
                {clusterConfig.label}
              </span>
            </div>
            <button className="p-2 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden text-gray-300 absolute top-full left-0 right-0 bg-gray-900/10 backdrop-blur-lg border-b rounded-b-2xl border-purple-700/50">
          <div className="px-6 py-4 space-y-4">
            <Link href="/" className="block hover:text-yellow-400">Home</Link>
            <Link href="/basics" className="block hover:text-yellow-400">Basics</Link>

            <div className="border-t border-gray-700/50 pt-4">
              {/* Also use the official button in the mobile menu */}
              <WalletMultiButton />
            </div>

            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-400">Network:</span>
              <span className={`font-medium ${clusterConfig.color}`}>
                {clusterConfig.label}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;