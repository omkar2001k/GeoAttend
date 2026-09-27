import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store';
import { evaluateGeofence } from '../features/geofence/geofenceSlice';

/**
 * Custom Hook: Continuously derives geofence proximity whenever user's location updates.
 */
export const useGeofenceStatus = () => {
  const dispatch = useAppDispatch();
  const currentLocation = useAppSelector((state) => state.location.currentLocation);
  const geofenceState = useAppSelector((state) => state.geofence);

  // Automatically recompute distance and within-radius status on each coordinate update
  useEffect(() => {
    dispatch(evaluateGeofence(currentLocation));
  }, [currentLocation, dispatch]);

  return {
    officeLocation: geofenceState.officeLocation,
    radiusMeters: geofenceState.radiusMeters,
    distanceToOffice: geofenceState.distanceToOffice,
    isInsideGeofence: geofenceState.isInsideGeofence,
  };
};
