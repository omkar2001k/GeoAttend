import { useEffect, useState } from 'react';
import { networkService } from '../services/networkService';
import { NetworkState } from '../types';

/**
 * Custom Hook: Subscribes to real-time network connectivity changes
 */
export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    // 1. Initial snapshot check
    networkService.getCurrentStatus().then(setNetworkState);

    // 2. Subscribe to continuous connection events
    const unsubscribe = networkService.subscribe((state) => {
      setNetworkState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isOffline = !networkState.isConnected || networkState.isInternetReachable === false;

  return {
    ...networkState,
    isOffline,
  };
};
