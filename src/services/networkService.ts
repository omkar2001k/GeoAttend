import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import { NetworkState } from '../types';

/**
 * Network Service
 * Wraps NetInfo to provide one-time network checks and real-time network subscriptions.
 */
export const networkService = {
  /**
   * Fetch current network status snapshot
   */
  async getCurrentStatus(): Promise<NetworkState> {
    try {
      const state = await NetInfo.fetch();
      return {
        isConnected: Boolean(state.isConnected),
        isInternetReachable: state.isInternetReachable,
      };
    } catch (error) {
      console.error('[NetworkService] Failed to check network state:', error);
      // Default to optimistic connected to avoid blocking user flow unnecessarily
      return {
        isConnected: true,
        isInternetReachable: true,
      };
    }
  },

  /**
   * Subscribe to network reachability changes
   * @param listener Callback triggered whenever network state changes
   * @returns Cleanup function to unsubscribe
   */
  subscribe(listener: (state: NetworkState) => void): NetInfoSubscription {
    return NetInfo.addEventListener((netState: NetInfoState) => {
      listener({
        isConnected: Boolean(netState.isConnected),
        isInternetReachable: netState.isInternetReachable,
      });
    });
  },
};
