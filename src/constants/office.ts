/**
 * Office Location Coordinates and Geofence Boundaries
 * Configured for testing and production attendance tracking.
 */

export interface OfficeCoordinates {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
}

// Default Office: Tech Hub / Head Office (Customizable coordinate)
export const OFFICE_LOCATION: OfficeCoordinates = {
  latitude: 37.78825,
  longitude: -122.4324,
  name: 'Headquarters Campus',
  address: '100 Innovation Way, Suite 400',
};

// Geofence radius in meters as specified in technical requirements
export const GEOFENCE_RADIUS_METERS = 100;
