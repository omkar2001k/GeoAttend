import { createAsyncThunk } from '@reduxjs/toolkit';
import { locationService } from '../../services/locationService';
import {
  checkLocationPermission,
  isGpsEnabled,
  requestLocationPermission,
} from '../../utils/permissions';
import {
  setIsWatching,
  setLocationError,
  setPermissionStatus,
  setGpsEnabled,
  setTrackingStatus,
  updateLocation,
} from './locationSlice';
import { PermissionStatus } from '../../types';

/**
 * Async Thunk: Check and request location permissions
 */
export const requestPermissionThunk = createAsyncThunk<
  PermissionStatus,
  void,
  { rejectValue: string }
>('location/requestPermission', async (_, { dispatch, rejectWithValue }) => {
  try {
    const gpsActive = await isGpsEnabled();
    dispatch(setGpsEnabled(gpsActive));

    const permission = await requestLocationPermission();
    dispatch(setPermissionStatus(permission.status));

    return permission.status;
  } catch (error: any) {
    const message = error?.message || 'Failed to request location permission';
    dispatch(setLocationError(message));
    return rejectWithValue(message);
  }
});

/**
 * Async Thunk: Check existing permission & GPS state on app start
 */
export const checkInitialStatusThunk = createAsyncThunk(
  'location/checkInitialStatus',
  async (_, { dispatch }) => {
    try {
      const gpsActive = await isGpsEnabled();
      dispatch(setGpsEnabled(gpsActive));

      const permission = await checkLocationPermission();
      dispatch(setPermissionStatus(permission.status));

      return {
        isGpsEnabled: gpsActive,
        permissionStatus: permission.status,
      };
    } catch (error) {
      console.error('[LocationThunk] Error checking initial status:', error);
      return {
        isGpsEnabled: false,
        permissionStatus: 'undetermined' as PermissionStatus,
      };
    }
  }
);

/**
 * Async Thunk: Start real-time position watching
 */
export const startWatchingThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('location/startWatching', async (_, { dispatch, rejectWithValue }) => {
  try {
    const gpsActive = await isGpsEnabled();
    dispatch(setGpsEnabled(gpsActive));
    if (!gpsActive) {
      dispatch(setLocationError('GPS_DISABLED'));
      return rejectWithValue('GPS_DISABLED');
    }

    const permission = await checkLocationPermission();
    if (permission.status !== 'granted') {
      const requested = await requestLocationPermission();
      dispatch(setPermissionStatus(requested.status));
      if (requested.status !== 'granted') {
        dispatch(setLocationError('PERMISSION_DENIED'));
        return rejectWithValue('PERMISSION_DENIED');
      }
    } else {
      dispatch(setPermissionStatus('granted'));
    }

    dispatch(setTrackingStatus('tracking'));
    dispatch(setIsWatching(true));

    await locationService.startWatching(
      (coords) => {
        dispatch(updateLocation(coords));
      },
      (error) => {
        console.error('[LocationService] Watch error:', error);
        if (error.message.includes('GPS') || error.message.includes('disabled')) {
          dispatch(setGpsEnabled(false));
          dispatch(setLocationError('GPS_DISABLED'));
        } else {
          dispatch(setLocationError(error.message));
        }
      }
    );
  } catch (error: any) {
    const message = error?.message || 'Failed to start location tracking';
    dispatch(setLocationError(message));
    dispatch(setIsWatching(false));
    return rejectWithValue(message);
  }
});

/**
 * Async Thunk: Stop watching position
 */
export const stopWatchingThunk = createAsyncThunk(
  'location/stopWatching',
  async (_, { dispatch }) => {
    try {
      await locationService.stopWatching();
      dispatch(setIsWatching(false));
      dispatch(setTrackingStatus('idle'));
    } catch (error) {
      console.error('[LocationThunk] Error stopping tracking:', error);
    }
  }
);
