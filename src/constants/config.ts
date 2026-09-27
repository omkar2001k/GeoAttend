/**
 * Application-wide configuration settings
 */

export const APP_CONFIG = {
  APP_NAME: 'GeoAttend',
  VERSION: '1.0.0',
  // Distance in meters to trigger location updates (prevents battery drain & excessive re-renders)
  LOCATION_DISTANCE_FILTER_METERS: 5,
  // Desired location update interval in milliseconds
  LOCATION_INTERVAL_MS: 5000,
  // Minimum time before fast updates in milliseconds
  LOCATION_FASTEST_INTERVAL_MS: 3000,
  // Location acquisition timeout in milliseconds
  LOCATION_TIMEOUT_MS: 15000,
  // Enable single check-in per day restriction
  PREVENT_DUPLICATE_DAILY_CHECKIN: true,
  // Storage keys for AsyncStorage
  STORAGE_KEYS: {
    ATTENDANCE_RECORDS: '@geoattend_records',
    USER_SETTINGS: '@geoattend_settings',
  },
};
