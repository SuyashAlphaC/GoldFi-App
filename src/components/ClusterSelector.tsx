'use client'

import React from 'react';
import { Check, Globe, Zap, Monitor } from 'lucide-react';
import { useCluster, ClusterType } from '@/hooks/useCluster';

interface ClusterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClusterSelector: React.FC<ClusterSelectorProps> = ({ isOpen, onClose }) => {
  const { cluster, setCluster, allClusters } = useCluster();

  const getClusterIcon = (clusterType: ClusterType) => {
    switch (clusterType) {
      case 'mainnet':
        return <Globe className="w-4 h-4" />;
      case 'devnet':
        return <Zap className="w-4 h-4" />;
      case 'localnet':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const handleClusterSelect = (selectedCluster: ClusterType) => {
    setCluster(selectedCluster);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50">
        {/* Header */}
        <div className="p-4 border-b border-gray-700/50">
          <h3 className="text-sm font-medium text-white">Select Network</h3>
          <p className="text-xs text-gray-400 mt-1">Choose your Solana cluster</p>
        </div>

        {/* Cluster Options */}
        <div className="p-2">
          {Object.entries(allClusters).map(([key, config]) => {
            const clusterKey = key as ClusterType;
            const isSelected = cluster === clusterKey;
            
            return (
              <button
                key={clusterKey}
                onClick={() => handleClusterSelect(clusterKey)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-gray-800/80 border border-gray-600/50' 
                    : 'hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${config.color}`}>
                    {getClusterIcon(clusterKey)}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">
                      {config.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {config.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Status Indicator */}
                  <div className={`w-2 h-2 rounded-full ${
                    clusterKey === 'mainnet' ? 'bg-green-400' :
                    clusterKey === 'devnet' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  
                  {/* Selected Check */}
                  {isSelected && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 pt-2 border-t border-gray-700/50">
          <div className="text-xs text-gray-400">
            Current: <span className={`font-medium ${allClusters[cluster].color}`}>
              {allClusters[cluster].label}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1 font-mono">
            {allClusters[cluster].rpcUrl}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClusterSelector;