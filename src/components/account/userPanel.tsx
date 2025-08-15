'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ArrowUpDown, Shield, Truck, CreditCard, RefreshCw, Loader2, CheckCircle, XCircle, Info, Wallet, DollarSign, HelpCircle } from 'lucide-react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { getAccount, getAssociatedTokenAddressSync, Account } from '@solana/spl-token';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Gold } from "../../../lib/type/gold";
import IDL from "../../../lib/idl/gold.json";

// Import user and admin functions
import { buyGoldTokens, sellGoldTokens, redeemPhysicalGold, GOLD_MINT_PUBKEY, USDC_MINT_PUBKEY } from '../../../lib/solana/userPrograms';
import { fetchGoldState } from '../../../lib/solana/adminPrograms';

// --- Helper Components ---

const StatusIndicator = ({ status, message }: { status: 'loading' | 'success' | 'error' | 'idle', message?: string }) => {
  if (status === 'idle') return null;
  const Icon = status === 'loading' ? Loader2 : status === 'success' ? CheckCircle : XCircle;
  const color = status === 'loading' ? 'text-blue-400' : status === 'success' ? 'text-green-400' : 'text-red-400';
  const animation = status === 'loading' ? 'animate-spin' : '';
  return <div className={`flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50 mt-2`}><Icon className={`w-5 h-5 ${color} ${animation}`} /><span className={`text-sm ${color}`}>{message}</span></div>;
};

const StateDisplayPanel = ({ balances, goldState, isLoading, onRefresh }: any) => (
    <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-6 text-start">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2"><Info className="w-5 h-5 text-teal-400" /> On-Chain State</h3>
            <button onClick={onRefresh} disabled={isLoading} className="p-1 text-gray-400 hover:text-white transition disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
        </div>
        <div className="space-y-3 text-sm font-mono">
            <div className="flex justify-between items-center"><span className="text-gray-400">SOL Balance:</span><span className="text-teal-300">{balances.sol !== null ? `${balances.sol.toFixed(4)} SOL` : '...'}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">USDC Balance:</span><span className="text-teal-300">{balances.usdc !== null ? `${balances.usdc.toFixed(2)} USDC` : '...'}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Gold Balance:</span><span className="text-yellow-300">{balances.gold !== null ? `${balances.gold.toFixed(4)} GOLD` : '...'}</span></div>
            <div className="border-t border-gray-700/50 my-2"></div>
            <div className="flex justify-between items-center"><span className="text-gray-400">Gold Price:</span><span className="text-yellow-300">{goldState ? `$${(Number(goldState.goldPriceUsd) / 100).toFixed(2)}` : '...'}</span></div>
        </div>
    </div>
);

const GuidePanel = () => (
    <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-6 text-start">
        <h3 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-teal-400" /> How It Works</h3>
        <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-3"><div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span className="font-bold text-gray-200">1</span></div><div><h4 className="font-bold text-gray-200">Connect Wallet</h4><p className="text-gray-400">Link your Solana wallet to get started.</p></div></div>
            <div className="flex items-start space-x-3"><div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span className="font-bold text-gray-200">2</span></div><div><h4 className="font-bold text-gray-200">Buy Tokens</h4><p className="text-gray-400">Purchase gold-backed tokens using USDC.</p></div></div>
            <div className="flex items-start space-x-3"><div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"><span className="font-bold text-gray-200">3</span></div><div><h4 className="font-bold text-gray-200">Sell or Redeem</h4><p className="text-gray-400">Sell tokens back for USDC or redeem them for physical gold delivery.</p></div></div>
        </div>
    </div>
);

// --- Main User Panel Component ---
const UserPanel: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // On-chain data states
  const [balances, setBalances] = useState({ sol: null, usdc: null, gold: null });
  const [goldState, setGoldState] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Input states
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [redeemTokens, setRedeemTokens] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Transaction status states
  const [buyStatus, setBuyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [buyMessage, setBuyMessage] = useState('');
  const [sellStatus, setSellStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sellMessage, setSellMessage] = useState('');
  const [redeemStatus, setRedeemStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [redeemMessage, setRedeemMessage] = useState('');

  const program = useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      return new Program<Gold>(IDL as any, provider);
    }
  }, [connection, wallet]);

  const refreshAllState = useCallback(async () => {
    if (!program || !wallet) return;
    setIsLoading(true);
    try {
        // Fetch SOL balance
        const sol = await connection.getBalance(wallet.publicKey);

        // Fetch Token balances
        const usdcAta = getAssociatedTokenAddressSync(USDC_MINT_PUBKEY, wallet.publicKey);
        const goldAta = getAssociatedTokenAddressSync(GOLD_MINT_PUBKEY, wallet.publicKey);
        let usdcAccount: Account | null = null;
        let goldAccount: Account | null = null;
        try { usdcAccount = await getAccount(connection, usdcAta); } catch (e) { /* ignore if not found */ }
        try { goldAccount = await getAccount(connection, goldAta); } catch (e) { /* ignore if not found */ }
        
        // Fetch protocol state
        const state = await fetchGoldState(program);

        setBalances({
          // @ts-expect-error: Anchor typegen issue
            sol: sol / LAMPORTS_PER_SOL,
            // @ts-expect-error: Anchor typegen issue
            usdc: usdcAccount ? Number(usdcAccount.amount) / (10**6) : 0,
            // @ts-expect-error: Anchor typegen issue
            gold: goldAccount ? Number(goldAccount.amount) / (10**6) : 0,
        });
        setGoldState(state);
    } catch (error) {
        console.error("Failed to refresh state:", error);
    } finally {
        setIsLoading(false);
    }
  }, [program, wallet, connection]);

  useEffect(() => {
    if (program && wallet) {
        refreshAllState();
    }
  }, [program, wallet, refreshAllState]);

  const createTxHandler = (handler: Function, setStatus: Function, setMessage: Function) => async (amountStr: string, ...args: any[]) => {
    if (!program) { setMessage("Wallet not connected."); setStatus('error'); return; }
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) { setMessage("Invalid amount."); setStatus('error'); return; }
    
    setStatus('loading');
    setMessage('Processing transaction...');
    try {
        const bnAmount = new BN(amount * 10**6);
        const txSignature = await handler(program, bnAmount, ...args);
        setStatus('success');
        setMessage(`Success! Tx: ${txSignature.substring(0, 10)}...`);
        await refreshAllState(); // Refresh balances after tx
    } catch (error: any) {
        console.error("Transaction failed:", error);
        setStatus('error');
        setMessage(error.message || "An unknown error occurred.");
    }
  };

  const handleBuy = createTxHandler(buyGoldTokens, setBuyStatus, setBuyMessage);
  const handleSell = createTxHandler(sellGoldTokens, setSellStatus, setSellMessage);
  const handleRedeem = async () => {
    if (!deliveryAddress) { setRedeemMessage("Delivery address is required."); setRedeemStatus('error'); return; }
    await createTxHandler(redeemPhysicalGold, setRedeemStatus, setRedeemMessage)(redeemTokens, deliveryAddress);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Trading Actions */}
      <div className="lg:col-span-2 space-y-8">
        {/* Buy Gold Tokens */}
        <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-100">Buy Gold Tokens</h3>
          <p className="text-sm text-gray-400 mb-6">Enter USDC amount to spend</p>
          <div className="space-y-6">
            <input type="text" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} placeholder="e.g., 100.00" className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-6 py-4 text-white" />
            <button onClick={() => handleBuy(buyAmount)} disabled={buyStatus === 'loading' || !wallet} className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-xl py-4 font-semibold disabled:opacity-50">Buy Gold Tokens</button>
            <StatusIndicator status={buyStatus} message={buyMessage} />
          </div>
        </div>

        {/* Sell Gold Tokens */}
        <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-100">Sell Gold Tokens</h3>
          <p className="text-sm text-gray-400 mb-6">Enter Gold Token amount to sell</p>
          <div className="space-y-6">
            <input type="text" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} placeholder="e.g., 50.00" className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-6 py-4 text-white" />
            <button onClick={() => handleSell(sellAmount)} disabled={sellStatus === 'loading' || !wallet} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl py-4 font-semibold disabled:opacity-50">Sell Gold Tokens</button>
            <StatusIndicator status={sellStatus} message={sellMessage} />
          </div>
        </div>

        {/* Redeem Physical Gold */}
        <div className="bg-gray-800/25 backdrop-blur-xl border border-gray-500/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-100">Redeem Physical Gold</h3>
            <p className="text-sm text-gray-400 mb-4">Convert tokens to physical delivery</p>
            <div className="space-y-6">
                <input type="text" value={redeemTokens} onChange={(e) => setRedeemTokens(e.target.value)} placeholder="e.g., 1000" className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-6 py-4 text-white" />
                <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Enter your complete delivery address..." rows={3} className="w-full bg-gray-700/30 border border-gray-600/50 rounded-xl px-6 py-4 text-white resize-none" />
                <button onClick={handleRedeem} disabled={redeemStatus === 'loading' || !wallet} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl py-4 font-semibold disabled:opacity-50">Redeem Physical Gold</button>
                <StatusIndicator status={redeemStatus} message={redeemMessage} />
            </div>
        </div>
      </div>

      {/* Right Column - State & Guide */}
      <div className="space-y-8">
        <StateDisplayPanel balances={balances} goldState={goldState} isLoading={isLoading} onRefresh={refreshAllState} />
        <GuidePanel />
      </div>
    </div>
  );
};

export default UserPanel;