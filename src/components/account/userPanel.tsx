import React, { useState } from 'react';
import { ArrowUpDown, Shield, Truck, CreditCard, RefreshCw } from 'lucide-react';

const UserPanel: React.FC = () => {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [redeemTokens, setRedeemTokens] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  return (


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trading Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Buy Gold Tokens */}
          <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8 animate-fade-in-up shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-100">Buy Gold Tokens</h3>
                <p className="text-sm text-gray-400">mOz - Amount (tokens owed)</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="e.g., 1000000.000 USD"
                  className="w-full bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-400 focus:border-gray-400/60 focus:outline-none focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                />
              </div>
              
              <button className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 rounded-xl py-4 font-semibold transition-all duration-300 hover:shadow-xl shadow-gray-900/30 border border-gray-600/20">         
                  <span className="text-gray-100">Buy Gold Tokens</span>
              </button>
            </div>
          </div>

          {/* Sell Gold Tokens */}
          <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8 animate-fade-in-up shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
             
              <div className='text-start'>
                <h3 className="text-2xl font-bold text-gray-100">Sell Gold Tokens</h3>
                <p className="text-sm text-gray-400">Token Amount to sell</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="e.g., 1000"
                  className="w-full bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:border-gray-400/60 focus:outline-none focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                />
              </div>         

              <p className="text-sm text-start text-gray-300 font-semibold">Fee: $0.50</p>   

              <button className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 rounded-xl py-4 font-semibold transition-all duration-300 hover:shadow-xl shadow-gray-900/30 border border-gray-600/20">         
                  <span className="text-gray-100">Sell Gold Tokens</span>
              </button>
            </div>
          </div>

          {/* Redeem Physical Gold */}
          <div className="bg-gray-800/25 text-start backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8 animate-fade-in-up shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className='text-start'>
                <h3 className="text-2xl font-bold text-gray-100">Redeem Physical Gold</h3>
                <p className="text-sm text-gray-400">Convert tokens to physical delivery</p>
              </div>
            </div>
            
            <div className="bg-gray-600/15 border border-gray-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-200 flex items-center space-x-2">
                <span>⚠️</span>
                <span>Minimum redemption: 1000 tokens (1 oOz/oz). Tokens will be burned.</span>
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <label className="text-sm text-gray-300 mb-2 block font-medium">Token Amount to Redeem</label>
                <input
                  type="text"
                  value={redeemTokens}
                  onChange={(e) => setRedeemTokens(e.target.value)}
                  placeholder="Minimum: 1000 tokens"
                  className="w-full bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:border-gray-400/60 focus:outline-none focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                />
                <p className="text-sm text-start text-gray-300 mt-2 font-medium">Available: 1,000</p>
              </div>
              
              <div className="relative group">
                <label className="text-sm text-gray-300 mb-2 block font-medium">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete delivery address..."
                  rows={4}
                  className="w-full bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:border-gray-400/60 focus:outline-none focus:ring-2 focus:ring-gray-400/20 resize-none transition-all duration-300 group-hover:border-gray-500/50"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 rounded-xl py-4 font-semibold transition-all duration-300 hover:shadow-xl shadow-gray-900/30 border border-gray-600/20">         
                  <span className="text-gray-100">Redeem Physical Gold</span>
              </button>
              
            </div>
          </div>
        </div>

        {/* Right Column - How It Works */}
        <div className="space-y-8">
          <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8 animate-fade-in-up shadow-2xl text-start transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">How It Works</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-gray-500/20">
                  <span className="text-sm font-bold text-gray-200">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-lg">Connect Wallet</h4>
                  <p className="text-sm text-gray-400 mt-1">Link your Solana wallet to get started with secure transactions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-gray-500/20">
                  <span className="text-sm font-bold text-gray-200">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-lg">Buy Tokens</h4>
                  <p className="text-sm text-gray-400 mt-1">Purchase gold-backed tokens with SOL or USD</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-gray-500/20">
                  <span className="text-sm font-bold text-gray-200">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-lg">Hold or Trade</h4>
                  <p className="text-sm text-gray-400 mt-1">Hold your tokens or trade them on decentralized exchanges</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-gray-500/20">
                  <span className="text-sm font-bold text-gray-200">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 text-lg">Sell or Redeem</h4>
                  <p className="text-sm text-gray-400 mt-1">Convert back to cash or claim physical gold delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh State Button */}
          <button className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 rounded-xl py-4 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl border border-gray-600/20">
            <RefreshCw className="w-5 h-5 text-gray-300" />
            <span className="text-gray-100"> Refresh State</span>
          </button>
        </div>
      </div>

  );
};

export default UserPanel;