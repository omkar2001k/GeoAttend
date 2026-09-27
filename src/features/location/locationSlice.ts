import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coordinates, PermissionStatus, TrackingStatus } from '../../types';
import { LocationState } from './locationTypes';

const initialState: LocationState = {
  currentLocation: null,
  permissionStatus: 'undetermined',
  isGpsEnabled: true,
  trackingStatus: 'idle',
  isWatching: false,
  error: null,
  lastUpdated: null,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateLocation: (state, action: PayloadAction<Coordinates>) => {
      state.currentLocation = action.payload;
      state.trackingStatus = 'tracking';
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setPermissionStatus: (state, action: PayloadAction<PermissionStatus>) => {
      state.permissionStatus = action.payload;
      if (action.payload === 'denied') {
        state.trackingStatus = 'idle';
        state.isWatching = false;
      }
    },
    setGpsEnabled: (state, action: PayloadAction<boolean>) => {
      state.isGpsEnabled = action.payload;
      if (!action.payload) {
        state.trackingStatus = 'error';
        state.error = 'GPS_DISABLED';
      } else if (state.error === 'GPS_DISABLED') {
        state.error = null;
      }
    },
    setTrackingStatus: (state, action: PayloadAction<TrackingStatus>) => {
      state.trackingStatus = action.payload;
    },
    setIsWatching: (state, action: PayloadAction<boolean>) => {
      state.isWatching = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.trackingStatus = 'error';
      }
    },
    clearLocationError: (state) => {
      state.error = null;
    },
    resetLocationState: () => initialState,
  },
});

export const {
  updateLocation,
  setPermissionStatus,
  setGpsEnabled,
  setTrackingStatus,
  setIsWatching,
  setLocationError,
  clearLocationError,
  resetLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;
