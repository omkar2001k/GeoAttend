/**
 * Shared Common Types across the GeoAttend application
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export type PermissionStatus = 'undetermined' | 'granted' | 'denied';

export type TrackingStatus = 'idle' | 'tracking' | 'error';

export interface AttendanceRecord {
  id: string;
  timestamp: string; // ISO 8601 string
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  distanceFromOfficeMeters: number;
  status: 'success' | 'failed';
  officeName: string;
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}
