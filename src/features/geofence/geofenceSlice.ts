import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GEOFENCE_RADIUS_METERS, OFFICE_LOCATION, OfficeCoordinates } from '../../constants/office';
import { Coordinates } from '../../types';
import { calculateHaversineDistance } from './geofenceUtils';

export interface GeofenceState {
  officeLocation: OfficeCoordinates;
  radiusMeters: number;
  distanceToOffice: number | null; // Distance in meters
  isInsideGeofence: boolean;
}

const initialState: GeofenceState = {
  officeLocation: OFFICE_LOCATION,
  radiusMeters: GEOFENCE_RADIUS_METERS,
  distanceToOffice: null,
  isInsideGeofence: false,
};

export const geofenceSlice = createSlice({
  name: 'geofence',
  initialState,
  reducers: {
    /**
     * Re-evaluates geofence proximity against current user GPS coordinates
     */
    evaluateGeofence: (state, action: PayloadAction<Coordinates | null>) => {
      const coords = action.payload;
      if (!coords) {
        state.distanceToOffice = null;
        state.isInsideGeofence = false;
        return;
      }

      const distance = calculateHaversineDistance(
        { latitude: coords.latitude, longitude: coords.longitude },
        { latitude: state.officeLocation.latitude, longitude: state.officeLocation.longitude }
      );

      state.distanceToOffice = distance;
      state.isInsideGeofence = distance <= state.radiusMeters;
    },

    /**
     * Allows setting a custom office location (e.g. for testing in emulator or on device)
     */
    setCustomOfficeLocation: (state, action: PayloadAction<Partial<OfficeCoordinates>>) => {
      state.officeLocation = {
        ...state.officeLocation,
        ...action.payload,
      };
    },

    /**
     * Reset office location back to standard default
     */
    resetOfficeLocation: (state) => {
      state.officeLocation = OFFICE_LOCATION;
      state.radiusMeters = GEOFENCE_RADIUS_METERS;
    },
  },
});

export const { evaluateGeofence, setCustomOfficeLocation, resetOfficeLocation } =
  geofenceSlice.actions;

export default geofenceSlice.reducer;
