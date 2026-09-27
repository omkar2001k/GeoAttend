import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/store';
import {
  startWatchingThunk,
  stopWatchingThunk,
  checkInitialStatusThunk,
} from '../features/location/locationThunks';

/**
 * Custom Hook: Manages real-time location tracking lifecycle
 * Starts tracking on mount, handles app backgrounding / foregrounding, and cleans up on unmount.
 */
export const useLocationTracking = () => {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector((state) => state.location);

  const startTracking = useCallback(() => {
    dispatch(startWatchingThunk());
  }, [dispatch]);

  const stopTracking = useCallback(() => {
    dispatch(stopWatchingThunk());
  }, [dispatch]);

  useEffect(() => {
    // 1. Initial permission and GPS check
    dispatch(checkInitialStatusThunk()).then(() => {
      // 2. Start position watcher
      startTracking();
    });

    // 3. Listen to app state transitions (pause tracking if user leaves app to conserve battery)
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          startTracking();
        } else if (nextAppState === 'background' || nextAppState === 'inactive') {
          stopTracking();
        }
      }
    );

    // 4. Cleanup when unmounting
    return () => {
      stopTracking();
      subscription.remove();
    };
  }, [dispatch, startTracking, stopTracking]);

  return {
    ...locationState,
    startTracking,
    stopTracking,
    retryTracking: startTracking,
  };
};
