'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Settings, RefreshCw, ArrowLeft, CheckCircle, XCircle, Loader2, Building, Info, User, Key } from 'lucide-react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { initializeProtocol, updateGoldPrice, fetchGoldState } from '../../../lib/solana/adminPrograms'; 
import { Gold } from "../../../lib/type/gold";
import IDL from "../../../lib/idl/gold.json";


const StatusIndicator = ({ status, message }: { status: 'loading' | 'success' | 'error' | 'idle', message?: string }) => {
  if (status === 'idle') return null;
  const Icon = status === 'loading' ? Loader2 : status === 'success' ? CheckCircle : XCircle;
  const color = status === 'loading' ? 'text-blue-400' : status === 'success' ? 'text-green-400' : 'text-red-400';
  const animation = status === 'loading' ? 'animate-spin' : '';
  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50 mt-2`}>
      <Icon className={`w-5 h-5 ${color} ${animation}`} />
      <span className={`text-sm ${color}`}>{message}</span>
    </div>
  );
};
const ProtocolStateDisplay = ({ state, isLoading, onRefresh }: { state: any, isLoading: boolean, onRefresh: () => void }) => {
  if (isLoading) {
    return (
        <div className="flex items-center justify-center p-6 bg-gray-800/40 border border-gray-700/30 rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="ml-3 text-gray-400">Loading Protocol State...</span>
        </div>
    );
  }

  if (!state) {
    return (
      <div className="text-center p-6 bg-gray-800/40 border border-gray-700/30 rounded-xl">
        <p className="text-yellow-400">Protocol not initialized.</p>
        <p className="text-sm text-gray-400 mt-1">Use the "Initialize Protocol" action below to set it up.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="w-5 h-5 text-purple-400" /> Protocol State</h3>
        <button onClick={onRefresh} className="p-1 text-gray-400 hover:text-white transition"><RefreshCw className="w-4 h-4" /></button>
      </div>
      <div className="space-y-2 text-sm font-mono">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2"><User className="w-4 h-4" /> Authority:</span>
          <span className="text-purple-300">{state.authority.toBase58().slice(0, 10)}...</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 flex items-center gap-2"><Key className="w-4 h-4" /> Oracle Authority:</span>
          <span className="text-purple-300">{state.oracleAuthority.toBase58().slice(0, 10)}...</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Custody Provider:</span>
          <span className="text-purple-300">{state.custodyProvider}</span>
        </div>
         <div className="flex justify-between items-center">
          <span className="text-gray-400">Gold Price (cents):</span>
          <span className="text-purple-300">${(Number(state.goldPrice) / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [protocolState, setProtocolState] = useState<any | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(true);

  const [oracleAuthority, setOracleAuthority] = useState('');
  const [custodyProvider, setCustodyProvider] = useState('');
  const [initStatus, setInitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [initMessage, setInitMessage] = useState('');
  const [priceStatus, setPriceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [priceMessage, setPriceMessage] = useState('');

  const program = useMemo(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
      return new Program<Gold>(IDL as any, provider);
    }
  }, [connection, wallet]);
  const getProtocolState = async () => {
    if (!program) return;
    setIsLoadingState(true);
    try {
      const state = await fetchGoldState(program);
      setProtocolState(state);
    } catch (error) {
      console.log("Could not fetch protocol state, likely not initialized.");
      setProtocolState(null);
    } finally {
      setIsLoadingState(false);
    }
  };
  useEffect(() => {
    getProtocolState();
  }, [program]);

  const handleInitialize = async () => {
    if (!program) {
      setInitMessage("Wallet not connected."); setInitStatus('error'); return;
    }
    if (!oracleAuthority || !custodyProvider) {
      setInitMessage("Please fill all fields."); setInitStatus('error'); return;
    }
    setInitStatus('loading');
    setInitMessage('Initializing protocol...');
    try {
      const oraclePubKey = new PublicKey(oracleAuthority);
      const txSignature = await initializeProtocol(program, oraclePubKey, custodyProvider);
      setInitStatus('success');
      setInitMessage(`Success! Tx: ${txSignature.substring(0, 10)}...`);
      await getProtocolState();
    } catch (error: any) {
      console.error("Initialization failed:", error);
      setInitStatus('error');
      setInitMessage(error.message || "An unknown error occurred.");
    }
  };

  const handleUpdatePrice = async () => {
    if (!program) {
      setPriceMessage("Wallet not connected."); setPriceStatus('error'); return;
    }
    setPriceStatus('loading');
    setPriceMessage('Updating gold price...');
    try {
      const txSignature = await updateGoldPrice(program);
      setPriceStatus('success');
      setPriceMessage(`Success! Tx: ${txSignature.substring(0, 10)}...`);
 
      await getProtocolState();
    } catch (error: any) {
      console.error("Price update failed:", error);
      setPriceStatus('error');
      setPriceMessage(error.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to selection</span>
      </button>

      <div className="mb-6 text-start">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-100">
          <Settings className="w-8 h-8 text-purple-400" />
          Protocol Settings
        </h2>
        <p className="text-gray-400">Manage core protocol variables and actions.</p>
      </div>
      
      <div className="mb-8">
        <ProtocolStateDisplay state={protocolState} isLoading={isLoadingState} onRefresh={getProtocolState} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-start">
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Initialize Protocol</h3>
          <p className="text-sm text-gray-400 mb-4">One-time setup for the protocol state.</p>
          <div className="space-y-4">
            <input type="text" value={oracleAuthority} onChange={(e) => setOracleAuthority(e.target.value)} placeholder="Oracle Authority Public Key" className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition" />
            <input type="text" value={custodyProvider} onChange={(e) => setCustodyProvider(e.target.value)} placeholder="Custody Provider Name" className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition" />
            <button onClick={handleInitialize} disabled={initStatus === 'loading' || !wallet} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl py-3 font-semibold transition-all duration-300 hover:shadow-xl shadow-purple-900/30 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              <Building className="w-5 h-5" />
              <span>Initialize</span>
            </button>
            <StatusIndicator status={initStatus} message={initMessage} />
          </div>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Update Gold Price</h3>
          <p className="text-sm text-gray-400 mb-4">Fetch and set the latest price from Pyth.</p>
          <div className="space-y-4">
            <div className="text-xs text-gray-500 p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">Note: You must be connected with the designated Oracle Authority wallet to perform this action.</div>
            <button onClick={handleUpdatePrice} disabled={priceStatus === 'loading' || !wallet} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl py-3 font-semibold transition-all duration-300 hover:shadow-xl shadow-purple-900/30 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              <RefreshCw className="w-5 h-5" />
              <span>Update Price</span>
            </button>
            <StatusIndicator status={priceStatus} message={priceMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;