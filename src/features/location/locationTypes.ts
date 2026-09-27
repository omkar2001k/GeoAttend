import { Coordinates, PermissionStatus, TrackingStatus } from '../../types';

export interface LocationState {
  currentLocation: Coordinates | null;
  permissionStatus: PermissionStatus;
  isGpsEnabled: boolean;
  trackingStatus: TrackingStatus;
  isWatching: boolean;
  error: string | null;
  lastUpdated: string | null;
}
