import { combineReducers } from '@reduxjs/toolkit';
import locationReducer from '../features/location/locationSlice';
import geofenceReducer from '../features/geofence/geofenceSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';

export const rootReducer = combineReducers({
  location: locationReducer,
  geofence: geofenceReducer,
  attendance: attendanceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
