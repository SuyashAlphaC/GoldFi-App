'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ClusterType = 'mainnet' | 'devnet' | 'localnet';

interface ClusterConfig {
  name: string;
  label: string;
  rpcUrl: string;
  color: string;
  description: string;
}

const CLUSTER_CONFIGS: Record<ClusterType, ClusterConfig> = {
  mainnet: {
    name: 'mainnet',
    label: 'Mainnet Beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    color: 'text-green-400',
    description: 'Production network'
  },
  devnet: {
    name: 'devnet',
    label: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    color: 'text-yellow-400',
    description: 'Development network'
  },
  localnet: {
    name: 'localnet',
    label: 'Localnet',
    rpcUrl: 'http://127.0.0.1:8899',
    color: 'text-blue-400',
    description: 'Local test network'
  }
};

interface ClusterContextType {
  cluster: ClusterType;
  clusterConfig: ClusterConfig;
  setCluster: (cluster: ClusterType) => void;
  allClusters: Record<ClusterType, ClusterConfig>;
}

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

export const ClusterProvider = ({ children }: { children: ReactNode }) => {
  const [cluster, setClusterState] = useState<ClusterType>('mainnet');

  // Load cluster from localStorage on mount
  useEffect(() => {
    const savedCluster = localStorage.getItem('goldfi-cluster');
    if (savedCluster && (savedCluster === 'mainnet' || savedCluster === 'devnet' || savedCluster === 'localnet')) {
      setClusterState(savedCluster as ClusterType);
    }
  }, []);

  // Save cluster to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('goldfi-cluster', cluster);
  }, [cluster]);

  const setCluster = (newCluster: ClusterType) => {
    setClusterState(newCluster);
  };

  const clusterConfig = CLUSTER_CONFIGS[cluster];

  return (
    <ClusterContext.Provider value={{
      cluster,
      clusterConfig,
      setCluster,
      allClusters: CLUSTER_CONFIGS
    }}>
      {children}
    </ClusterContext.Provider>
  );
};

export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (context === undefined) {
    throw new Error('useCluster must be used within a ClusterProvider');
  }
  return context;
};