import React from 'react';
import { Coins, DollarSign } from 'lucide-react';

interface YourBalancesProps {
  isProtocolView: boolean;
  onToggleView: (isProtocol: boolean) => void;
}

const AccountBalances: React.FC<YourBalancesProps> = ({ isProtocolView, onToggleView }) => {
  return (
    <div className="mb-8">
        <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
           GoldFi Protocol
          </span>
        </h1>
        <p className="text-gray-400">
          Tokenize physical gold on Solana. Secure, transparent and backed by real precious metals.
        </p>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-lg font-semibold"> Your Balances</span>
      </div>

      {/* Main Balance Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className='text-start'>
              <p className="text-lg text-gray-300">Gold Tokens</p>
              <p className="text-2xl font-bold">0.000</p>
            </div>
            <Coins className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className='text-start'>
              <p className="text-lg text-gray-300">USD</p>
              <p className="text-2xl font-bold">$0.000</p>
            </div>
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

        {/* Token Details - Simplified */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="bg-gray-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-6 text-center">Token Details</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-2">GOLD PERFORMANCE</p>
              <p className="text-lg font-semibold">+0.00%</p>
            </div>

            <div className="text-center p-4 bg-gray-800/40 rounded-xl border border-gray-700/5">
              <p className="text-xs text-gray-400 mb-2">GOLD TOKENS</p>
              <p className="text-lg font-semibold">0.000 mOz</p>
            </div>

            <div className="text-center p-4 bg-gray-800/40 rounded-xl border border-gray-700/5">
              <p className="text-xs text-gray-400 mb-2">RESERVES</p>
              <p className="text-lg font-semibold">0.000 mOz</p>
            </div>

            <div className="text-center p-4 bg-gray-800/40 rounded-xl border border-gray-700/5">
              <p className="text-xs text-gray-400 mb-2">REWARDS</p>
              <p className="text-lg font-semibold">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2" style={{ animation: 'glow 2s ease-in-out infinite' }}></span>
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button 
          onClick={() => onToggleView(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !isProtocolView 
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' 
              : 'bg-blue-600/50 hover:bg-blue-600/70 text-blue-200'
          }`}
        >
          👨‍💻 User Panel
        </button>
        <button 
          onClick={() => onToggleView(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isProtocolView 
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg' 
              : 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200'
          }`}
        >
          🔧 Admin Panel
        </button>
      </div>
    </div>
  );
};

export default AccountBalances;