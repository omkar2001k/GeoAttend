import { Coordinates } from '../../types';

// Earth mean radius in meters
const EARTH_RADIUS_METERS = 6371000;

/**
 * Converts degrees to radians
 */
const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Calculates the great-circle distance between two geographical points on Earth
 * using the Haversine formula.
 *
 * @param coord1 First coordinate point { latitude, longitude }
 * @param coord2 Second coordinate point { latitude, longitude }
 * @returns Distance in meters (rounded to 1 decimal place)
 */
export const calculateHaversineDistance = (
  coord1: Pick<Coordinates, 'latitude' | 'longitude'>,
  coord2: Pick<Coordinates, 'latitude' | 'longitude'>
): number => {
  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMeters = EARTH_RADIUS_METERS * c;

  // Round to single decimal place for cleanliness and precision
  return Math.round(distanceMeters * 10) / 10;
};

/**
 * Determines whether a coordinate falls strictly within the geofence perimeter
 *
 * @param userCoord Current user location
 * @param centerCoord Center of geofence (e.g. office)
 * @param radiusMeters Allowed radius in meters
 * @returns boolean
 */
export const isPointWithinRadius = (
  userCoord: Pick<Coordinates, 'latitude' | 'longitude'>,
  centerCoord: Pick<Coordinates, 'latitude' | 'longitude'>,
  radiusMeters: number
): boolean => {
  const distance = calculateHaversineDistance(userCoord, centerCoord);
  return distance <= radiusMeters;
};
